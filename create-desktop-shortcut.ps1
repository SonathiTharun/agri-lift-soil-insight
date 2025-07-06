# PowerShell script to create a desktop shortcut for the Agri-Lift project

$projectPath = $PSScriptRoot
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Agri-Lift Soil Insight.lnk"

# Create WScript Shell object
$WScriptShell = New-Object -ComObject WScript.Shell

# Create shortcut
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $projectPath "start-project.bat"
$shortcut.WorkingDirectory = $projectPath
$shortcut.Description = "Start Agri-Lift Soil Insight Application"
$shortcut.IconLocation = "shell32.dll,21"  # Green folder icon

# Save the shortcut
$shortcut.Save()

Write-Host "Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "Shortcut location: $shortcutPath" -ForegroundColor Cyan
Write-Host "You can now double-click the shortcut on your desktop to start the application." -ForegroundColor Yellow
