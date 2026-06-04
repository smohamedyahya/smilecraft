const fs = require('fs');
const https = require('https');

const token = 'figd_PgDhD7E0TqNnDJpCPgK7Z7tox69I89TLdut_B_cr';
const fileKey = 'D2m6PDGwkY9vON3RyJxCai';
const nodeId = '1:2';

const options = {
  hostname: 'api.figma.com',
  path: `/v1/files/${fileKey}/nodes?ids=${nodeId}`,
  method: 'GET',
  headers: {
    'X-Figma-Token': token
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('figma_design.json', data);
    console.log('Design data saved successfully. Response status:', res.statusCode);
  });
});

req.on('error', (e) => {
  console.error('Error fetching from Figma:', e);
});

req.end();
