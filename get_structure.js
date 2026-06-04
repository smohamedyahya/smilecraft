const fs = require('fs');

const fileData = JSON.parse(fs.readFileSync('figma_design.json', 'utf8'));
const rootNode = fileData.nodes['1:2'].document;

let output = '';

function getCSSColor(color) {
  if (!color) return 'transparent';
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a !== undefined ? color.a.toFixed(2) : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function dumpNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  let line = `${indent}- [${node.type}] name: "${node.name}" (id: ${node.id})`;
  
  const details = [];
  if (node.layoutMode) details.push(`layoutMode: ${node.layoutMode}`);
  if (node.itemSpacing) details.push(`gap: ${node.itemSpacing}`);
  if (node.paddingTop !== undefined) details.push(`p: ${node.paddingTop}/${node.paddingRight}/${node.paddingBottom}/${node.paddingLeft}`);
  if (node.backgroundColor) details.push(`bg: ${getCSSColor(node.backgroundColor)}`);
  
  if (node.type === 'TEXT') {
    details.push(`text: "${node.characters.replace(/\n/g, '\\n')}"`);
    if (node.style) {
      details.push(`font: ${node.style.fontSize}px ${node.style.fontFamily} w${node.style.fontWeight}`);
    }
    if (node.fills && node.fills.length > 0 && node.fills[0].color) {
      details.push(`color: ${getCSSColor(node.fills[0].color)}`);
    }
  }
  
  if (node.absoluteBoundingBox) {
    const box = node.absoluteBoundingBox;
    details.push(`rect: ${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}`);
  }
  
  if (details.length > 0) {
    line += ` [${details.join(' | ')}]`;
  }
  
  output += line + '\n';
  
  if (node.children) {
    node.children.forEach(child => dumpNode(child, depth + 1));
  }
}

dumpNode(rootNode);
fs.writeFileSync('figma_structure.txt', output);
console.log('Figma structure written to figma_structure.txt');
