import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current directory and root directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(__dirname, 'out');
const targetDir = path.resolve(__dirname, '../../docs');

async function postbuild() {
  try {
    // 1. Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Error: Source directory not found at ${sourceDir}`);
      process.exit(1);
    }

    // 2. Create .nojekyll file (Required for GitHub Pages to skip Jekyll processing)
    console.log('📄 Creating .nojekyll file...');
    fs.writeFileSync(path.join(sourceDir, '.nojekyll'), '');

    console.log('🚀 Starting to move out folder...');

    // 3. If target directory already exists, remove it
    if (fs.existsSync(targetDir)) {
      console.log(`🧹 Removing existing target directory: ${targetDir}`);
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // 4. Move the directory
    // Using renameSync for efficient directory moving
    fs.renameSync(sourceDir, targetDir);

    console.log(`✅ Successfully moved 'out' (with .nojekyll) to: ${targetDir}`);
  } catch (error) {
    console.error('❌ Error occurred during postbuild:', error);
    process.exit(1);
  }
}

postbuild();