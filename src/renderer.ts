import puppeteer from 'puppeteer';
import { GraphicsManifest } from 'ograf';
import { Resolution, RenderSettings } from './types.js';
import fs from 'fs/promises';

const getJsPath = (manifest: GraphicsManifest, manifestPath: string) => {
  const manifestDir = manifestPath.split('/').slice(0, -1).join('/');
  return `${manifestDir}/${manifest.main}`;
};

const getHTML = (manifest: GraphicsManifest, manifestPath: string) => {
  return `
    <html>
      <head>
        <script src="${getJsPath(manifest, manifestPath)}"></script>
      </head>
      <body>
      </body>
    </html>
  `;
};

const setupBrowser = async (
  resolution: Resolution,
  manifest: GraphicsManifest,
  manifestPath: string,
) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: resolution.width,
    height: resolution.height,
  });
  await page.setContent(getHTML(manifest, manifestPath));
  return { browser, page };
};

const readManifest = async (manifestPath: string) => {
  try {
    const manifest = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(manifest) as GraphicsManifest;
  } catch (error) {
    console.error(`Error reading manifest: ${error}`);
    throw error;
  }
};

const render = async (settings: RenderSettings) => {
  const { resolution, manifestPath } = settings;

  const manifest = await readManifest(manifestPath);

  const { browser, page } = await setupBrowser(
    resolution,
    manifest,
    manifestPath,
  );

  await page.screenshot({ path: 'screenshot.png', omitBackground: true });

  await browser.close();
};

export default render;
