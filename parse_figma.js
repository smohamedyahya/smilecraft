const fs = require('fs');

const fileData = JSON.parse(fs.readFileSync('figma_design.json', 'utf8'));

if (!fileData.nodes || !fileData.nodes['1:2']) {
  console.log('Could not find node 1:2 in the response structure.');
  console.log('Keys in nodes:', Object.keys(fileData.nodes || {}));
  process.exit(0);
}

const rootNode = fileData.nodes['1:2'].document;

console.log(`Root Node: ${rootNode.name} (${rootNode.type})`);

function getCSSColor(color) {
  if (!color) return 'transparent';
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a !== undefined ? color.a.toFixed(2) : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function traverse(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const info = [];
  
  if (node.type === 'TEXT') {
    info.push(`"${node.characters.replace(/\n/g, ' ')}"`);
    if (node.style) {
      info.push(`font:${node.style.fontSize}px ${node.style.fontFamily} w${node.style.fontWeight}`);
    }
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        info.push(`color:${getCSSColor(fill.color)}`);
      }
    }
  } else if (node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
    if (node.backgroundColor) {
      info.push(`bg:${getCSSColor(node.backgroundColor)}`);
    }
    if (node.layoutMode) {
      info.push(`layout:${node.layoutMode}`);
      if (node.paddingTop) info.push(`p:${node.paddingTop}/${node.paddingRight}/${node.paddingBottom}/${node.paddingLeft}`);
      if (node.itemSpacing) info.push(`gap:${node.itemSpacing}`);
    }
    if (node.absoluteBoundingBox) {
      info.push(`size:${Math.round(node.absoluteBoundingBox.width)}x${Math.round(node.absoluteBoundingBox.height)}`);
    }
  } else if (node.type === 'RECTANGLE' || node.type === 'VECTOR') {
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        info.push(`fill:${getCSSColor(fill.color)}`);
      } else {
        info.push(`fill:${fill.type}`);
      }
    }
    if (node.absoluteBoundingBox) {
      info.push(`size:${Math.round(node.absoluteBoundingBox.width)}x${Math.round(node.absoluteBoundingBox.height)}`);
    }
  }

  console.log(`${indent}- [${node.type}] ${node.name} ${info.length ? `(${info.join(', ')})` : ''}`);

  if (node.children) {
    node.children.forEach(child => traverse(child, depth + 1));
  }
}

traverse(rootNode);
