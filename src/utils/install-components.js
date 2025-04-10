import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const components = parse(readFileSync(path.join(__dirname, '../components/ui_components.yml'), 'utf-8'));

console.log(`Installing ${components.length} components`);

async function main() {
  for (const component of components) {
    console.log(`Installing ${component}...`);
    await execa`npx shadcn@latest add ${component} --overwrite`;
    console.log(`Done!`);
  }
}

main();
