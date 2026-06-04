const fs = require('fs');
const https = require('https');
const path = require('path');

const token = 'asdf_AgDhD7E0TqNnDJpCPgK7Z7tox69I89TLdut_C_br';
const fileKey = 'D2m6PDGwkY9vON3RyJxCai';

const nodes = [
  { id: '1:44', name: 'hero_patient.png' },
  { id: '1:210', name: 'before_treatment.png' },
  { id: '1:214', name: 'after_treatment.png' },
  { id: '1:241', name: 'dr_arjun_mehta.png' },
  { id: '1:281', name: 'avatar_1.png' },
  { id: '1:283', name: 'avatar_2.png' },
  { id: '1:285', name: 'avatar_3.png' }
];

const nodeIds = nodes.map(n => n.id).join(',');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

const getOptions = {
  hostname: 'api.figma.com',
  path: `/v1/images/${fileKey}?ids=${nodeIds}&format=png`,
  method: 'GET',
  headers: {
    'X-Figma-Token': token
  }
};

function downloadFile(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading ${url}:`, err.message);
  });
}

const req = https.request(getOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('Failed to get images list from Figma API. Status:', res.statusCode);
      console.error(data);
      return;
    }
    
    const responseJson = JSON.parse(data);
    const imageUrls = responseJson.images || {};
    
    let downloadedCount = 0;
    const targets = nodes.filter(n => imageUrls[n.id]);
    
    if (targets.length === 0) {
      console.log('No image URLs returned from Figma API.');
      console.log('API response:', responseJson);
      return;
    }
    
    targets.forEach((node) => {
      const url = imageUrls[node.id];
      const destPath = path.join(assetsDir, node.name);
      console.log(`Downloading ${node.name} from ${url}...`);
      downloadFile(url, destPath, () => {
        downloadedCount++;
        console.log(`Successfully downloaded ${node.name} (${downloadedCount}/${targets.length})`);
      });
    });
  });
});

req.on('error', (e) => {
  console.error('Error fetching image list:', e);
});

req.end();
