#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common patterns for hardcoded English text
const patterns = [
  // Button text
  />\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*</g,
  // Placeholder text
  /placeholder=["']([^"']+)["']/g,
  // Title and alt text
  /(?:title|alt)=["']([^"']+)["']/g,
  // String literals in JSX
  /["']([A-Z][a-zA-Z\s,.'!?-]+)["']/g,
];

// Directories to scan
const dirsToScan = [
  'src/pages',
  'src/components',
];

// Files to exclude
const excludeFiles = [
  'LanguageContext.tsx',
  'index.css',
  '.test.',
  '.spec.',
];

function shouldExcludeFile(filePath) {
  return excludeFiles.some(exclude => filePath.includes(exclude));
}

function scanFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return [];
  }
  
  if (shouldExcludeFile(filePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = [];
    
    // Check if file already uses useLanguage hook
    const usesTranslation = content.includes('useLanguage') || content.includes('t(');
    
    patterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const text = match[1];
        
        // Skip if it's likely a variable, function, or component name
        if (text.match(/^[a-z]/)) continue;
        if (text.includes('${')) continue;
        if (text.includes('{')) continue;
        if (text.length < 3) continue;
        if (text.match(/^\d/)) continue;
        if (text.includes('http')) continue;
        if (text.includes('.')) continue;
        
        // Skip common non-translatable text
        const skipPatterns = [
          /^(px|rem|em|\d+)$/,
          /^(true|false|null|undefined)$/,
          /^[A-Z_]+$/,
          /^(React|Component|Props|State)$/,
        ];
        
        if (skipPatterns.some(skip => text.match(skip))) continue;
        
        findings.push({
          file: filePath,
          text: text,
          line: content.substring(0, match.index).split('\n').length,
          usesTranslation
        });
      }
    });
    
    return findings;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const findings = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        findings.push(...scanDirectory(itemPath));
      } else if (stat.isFile()) {
        findings.push(...scanFile(itemPath));
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return findings;
}

function main() {
  console.log('🔍 Scanning for hardcoded text...\n');
  
  const allFindings = [];
  
  for (const dir of dirsToScan) {
    if (fs.existsSync(dir)) {
      console.log(`Scanning ${dir}...`);
      allFindings.push(...scanDirectory(dir));
    }
  }
  
  // Group findings by file
  const byFile = {};
  allFindings.forEach(finding => {
    if (!byFile[finding.file]) {
      byFile[finding.file] = [];
    }
    byFile[finding.file].push(finding);
  });
  
  console.log('\n📊 Results:\n');
  
  Object.keys(byFile).forEach(file => {
    const findings = byFile[file];
    const usesTranslation = findings[0].usesTranslation;
    
    console.log(`\n📄 ${file} ${usesTranslation ? '✅' : '❌'}`);
    
    findings.forEach(finding => {
      console.log(`  Line ${finding.line}: "${finding.text}"`);
    });
  });
  
  console.log(`\n\n📈 Summary:`);
  console.log(`Total files with hardcoded text: ${Object.keys(byFile).length}`);
  console.log(`Total hardcoded strings found: ${allFindings.length}`);
  
  const filesWithoutTranslation = Object.keys(byFile).filter(file => 
    !byFile[file][0].usesTranslation
  );
  
  console.log(`Files not using translation: ${filesWithoutTranslation.length}`);
  
  if (filesWithoutTranslation.length > 0) {
    console.log('\n🚨 Priority files to update:');
    filesWithoutTranslation.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
}

if (require.main === module) {
  main();
}
