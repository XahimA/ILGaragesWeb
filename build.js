const fs = require('fs');
const path = require('path');

require('dotenv').config();

const template = fs.readFileSync('index.html', 'utf8');

let output = template;

const replacements = {
  '${AZURE_STORAGE_ACCOUNT}': process.env.AZURE_STORAGE_ACCOUNT,
  '${AZURE_STORAGE_KEY}': process.env.AZURE_STORAGE_KEY,
  '${AZURE_CONTAINER_NAME}': process.env.AZURE_CONTAINER_NAME,
  '${COSMOS_ENDPOINT}': process.env.COSMOS_ENDPOINT,
  '${COSMOS_KEY}': process.env.COSMOS_KEY,
  '${DATABASE_NAME}': process.env.DATABASE_NAME,
  '${COSMOS_CONTAINER}': process.env.COSMOS_CONTAINER,
  '${SAS_TOKEN}': process.env.SAS_TOKEN
};

for (const [placeholder, value] of Object.entries(replacements)) {
  if (!value) {
    console.error(`Missing environment variable for ${placeholder}`);
    process.exit(1);
  }
  output = output.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
}

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync('dist/index.html', output);
// Copy styles.css to dist
fs.copyFileSync('styles.css', path.join('dist', 'styles.css'));
console.log('✅ Copied styles.css to dist/');

console.log('✅ Build completed successfully!');