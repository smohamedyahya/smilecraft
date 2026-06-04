const https = require('https');

const token = 'figd_PgDhD7E0TqNnDJpCPgK7Z7tox69I89TLdut_B_cr';
const fileKey = 'D2m6PDGwkY9vON3RyJxCai';
const nodeIds = '1:56,1:64,1:72,1:80';

const getOptions = {
  hostname: 'api.figma.com',
  path: `/v1/images/${fileKey}?ids=${nodeIds}&format=svg`,
  method: 'GET',
  headers: {
    'X-Figma-Token': token
  }
};

const req = https.request(getOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('Failed to get SVG images from Figma. Status:', res.statusCode);
      console.error(data);
      return;
    }
    const responseJson = JSON.parse(data);
    const imageUrls = responseJson.images || {};
    console.log('SVG URLs:', JSON.stringify(imageUrls, null, 2));

    // For each icon, fetch the SVG text content
    Object.keys(imageUrls).forEach((nodeId) => {
      const url = imageUrls[nodeId];
      https.get(url, (response) => {
        let svgData = '';
        response.on('data', (chunk) => { svgData += chunk; });
        response.on('end', () => {
          console.log(`\n--- Node ID: ${nodeId} ---`);
          console.log(svgData);
        });
      }).on('error', (err) => {
        console.error(`Error downloading SVG for node ${nodeId}:`, err.message);
      });
    });
  });
});

req.on('error', (e) => {
  console.error('Error fetching SVG list:', e);
});

req.end();
