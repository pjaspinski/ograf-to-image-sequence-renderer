/* eslint-env node */
import fs from 'fs';
import path from 'path';

/**
 * Move compiled overlay files from build/overlays to overlays/[overlay]/build directories
 */
function moveOverlays() {
  const buildOverlaysPath = 'build/overlays';

  if (!fs.existsSync(buildOverlaysPath)) {
    console.log('No overlay build files found to move.');
    return;
  }

  const overlays = fs.readdirSync(buildOverlaysPath);

  overlays.forEach((overlay) => {
    const srcPath = path.join(buildOverlaysPath, overlay);
    const destPath = path.join('overlays', overlay, 'build');

    // Create destination directory if it doesn't exist
    fs.mkdirSync(destPath, { recursive: true });

    // Copy all files from source to destination
    const files = fs.readdirSync(srcPath);
    files.forEach((file) => {
      const srcFile = path.join(srcPath, file);
      const destFile = path.join(destPath, file);
      fs.copyFileSync(srcFile, destFile);
    });

    console.log(`Moved ${overlay} build files to overlays/${overlay}/build/`);
  });

  // Remove temporary build/overlays directory
  fs.rmSync(buildOverlaysPath, { recursive: true });
  console.log('Cleaned up temporary build/overlays directory');
}

// Run the function
moveOverlays();
