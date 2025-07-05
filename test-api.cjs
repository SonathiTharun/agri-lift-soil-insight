const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'executive@agrilift.com',
        password: 'Executive123!'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('Response body (raw):', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Login successful:', data);
        return data.data?.token;
      } catch (e) {
        console.log('❌ Response is not valid JSON');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

async function testProductCreation(token) {
  if (!token) {
    console.log('❌ No token available for product creation test');
    return;
  }

  try {
    console.log('\nTesting product creation API...');
    
    const response = await fetch('http://localhost:8081/api/executive/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'This is a test product for debugging',
        price: 100,
        category: '507f1f77bcf86cd799439011', // dummy ObjectId
        stock: 50,
        unit: 'kg'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('Response body (raw):', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Product creation successful:', data);
      } catch (e) {
        console.log('❌ Response is not valid JSON');
      }
    } else {
      console.log('❌ Product creation failed');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

async function main() {
  const token = await testLogin();
  await testProductCreation(token);
}

main();
