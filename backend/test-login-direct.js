const http = require('http');

function testLogin() {
  const postData = JSON.stringify({
    email: 'farmer@test.com',
    password: 'Farmer123!',
    userType: 'farmer'
  });

  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🧪 Testing login API directly...');
  console.log('📧 Email: farmer@test.com');
  console.log('🔑 Password: Farmer123!');
  console.log('👤 User Type: farmer');
  console.log('🌐 URL: http://localhost:8081/api/auth/login');
  console.log('📤 Request Body:', postData);

  const req = http.request(options, (res) => {
    console.log(`\n📊 Response Status: ${res.statusCode} ${res.statusMessage}`);
    console.log('📋 Response Headers:', JSON.stringify(res.headers, null, 2));

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\n📄 Raw Response Body:');
      console.log(data);
      
      try {
        const response = JSON.parse(data);
        console.log('\n📄 Parsed Response Body:');
        console.log(JSON.stringify(response, null, 2));

        if (res.statusCode === 200) {
          console.log('\n✅ LOGIN SUCCESSFUL!');
          console.log(`👤 User: ${response.data?.user?.name} (${response.data?.user?.role})`);
          console.log(`🎫 Token: ${response.data?.token ? 'Generated' : 'Missing'}`);
        } else {
          console.log('\n❌ LOGIN FAILED!');
          console.log(`💬 Error: ${response.message || response.error}`);
        }
      } catch (error) {
        console.log('\n❌ Failed to parse response as JSON:');
        console.log('Raw data:', data);
        console.log('Parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Request failed:', error.message);
  });

  req.write(postData);
  req.end();
}

// Run the test
testLogin();
