const fs = require('fs');
const path = require('path');
const root = process.cwd();
const srcRoot = path.join(root, 'src');
const exts = ['.js', '.jsx'];
const files = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (exts.includes(path.extname(full))) {
      files.push(full);
    }
  }
}

walk(srcRoot);
let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(/(^\s*import\s+[\s\S]+?\s+from\s+)(['"])(\.\.?\/(?:[^'"\n]+)+)(['"])/gm, (match, prefix, quote, relPath, quoteEnd) => {
    if (!relPath.startsWith('./') && !relPath.startsWith('../')) return match;
    const absolute = path.resolve(path.dirname(file), relPath);
    if (!absolute.startsWith(srcRoot)) return match;
    const alias = '@/' + path.relative(srcRoot, absolute).replace(/\\/g, '/');
    return `${prefix}${quote}${alias}${quoteEnd}`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed += 1;
    console.log('Updated', path.relative(root, file));
  }
}

console.log('Total files updated:', changed);
