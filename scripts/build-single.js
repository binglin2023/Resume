const fs = require('fs');
const path = require('path');

// Simple single-file builder for the resume
// Reads index.html, inlines linked CSS and JS, and replaces <img src="..."> with data URIs for local images.

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Error reading', filePath, err.message);
    return null;
  }
}

function fileToDataURI(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mimeMap = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml'
  };
  const mime = mimeMap[ext] || 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

function inlineAssets(projectRoot) {
  const indexPath = path.join(projectRoot, 'index.html');
  let html = readFileSafe(indexPath);
  if (!html) process.exit(1);

  // inline CSS <link rel="stylesheet" href="...">
  html = html.replace(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?>/gi, (m, href) => {
    const cssPath = path.join(projectRoot, href.replace(/^\.\//, ''));
    const css = readFileSafe(cssPath);
    if (css == null) return m;
    return `\n<style>/* inlined from ${href} */\n${css}\n</style>\n`;
  });

  // inline JS <script src="..."></script>
  html = html.replace(/<script\s+src=["']([^"']+)["']\s*>\s*<\/script>/gi, (m, src) => {
    const jsPath = path.join(projectRoot, src.replace(/^\.\//, ''));
    const js = readFileSafe(jsPath);
    if (js == null) return m;
    return `\n<script>/* inlined from ${src} */\n${js}\n</script>\n`;
  });

  // replace img src with data URIs for local images (only relative paths)
  html = html.replace(/<img([^>]*?)src=["'](\.\.\/|\.\/)?([^"']+)["']([^>]*)>/gi, (m, a, rel, src, b) => {
    const imgPath = path.join(projectRoot, rel ? rel + src : src);
    const normalized = path.normalize(imgPath);
    if (!fs.existsSync(normalized)) return m;
    try {
      const dataUri = fileToDataURI(normalized);
      return `<img${a}src="${dataUri}"${b}>`;
    } catch (err) {
      console.error('Failed to inline image', normalized, err.message);
      return m;
    }
  });

  return html;
}

function build() {
  const projectRoot = process.cwd();
  console.log('Building single-file resume from', projectRoot);
  const out = inlineAssets(projectRoot);
  const outPath = path.join(projectRoot, 'resume-single.html');
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Wrote', outPath);
}

if (require.main === module) build();

module.exports = { inlineAssets };
