#!/usr/bin/env node

/**
 * SEO & Performance Test Suite
 * Checks built HTML for SEO best practices and basic accessibility
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIST_DIR = './dist';
const MAX_HTML_SIZE = 50000; // 50KB warning threshold
const MAX_ASSET_SIZE = 500000; // 500KB warning threshold

// ANSI colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(status, message, details = '') {
  const icons = {
    pass: '✓',
    fail: '✗',
    warn: '⚠',
    info: 'ℹ'
  };
  const color = {
    pass: colors.green,
    fail: colors.red,
    warn: colors.yellow,
    info: colors.blue
  }[status];

  console.log(`${color}${icons[status]} ${message}${colors.reset}${details ? ` ${details}` : ''}`);
}

function getFileSize(filePath) {
  const stats = statSync(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function checkHTML(filePath, fileName) {
  console.log(`\n${colors.blue}Checking: ${fileName}${colors.reset}`);

  const html = readFileSync(filePath, 'utf-8');
  const fileSize = getFileSize(filePath);

  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  // File size check
  if (fileSize > MAX_HTML_SIZE) {
    log('warn', 'HTML file size', `(${formatBytes(fileSize)} > ${formatBytes(MAX_HTML_SIZE)})`);
    warnCount++;
  } else {
    log('pass', 'HTML file size', `(${formatBytes(fileSize)})`);
    passCount++;
  }

  // Title tag
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (titleMatch && titleMatch[1].length > 0 && titleMatch[1].length <= 60) {
    log('pass', 'Title tag present and optimal length', `(${titleMatch[1].length} chars)`);
    passCount++;
  } else if (titleMatch) {
    log('warn', 'Title tag too long', `(${titleMatch[1].length} chars, recommended < 60)`);
    warnCount++;
  } else {
    log('fail', 'Missing title tag');
    failCount++;
  }

  // Meta description
  const descMatch = html.match(/<meta name="description" content="(.*?)"/);
  if (descMatch && descMatch[1].length > 0 && descMatch[1].length <= 160) {
    log('pass', 'Meta description present and optimal', `(${descMatch[1].length} chars)`);
    passCount++;
  } else if (descMatch && descMatch[1].length > 160) {
    log('warn', 'Meta description too long', `(${descMatch[1].length} chars, recommended < 160)`);
    warnCount++;
  } else {
    log('fail', 'Missing meta description');
    failCount++;
  }

  // Viewport meta tag
  if (html.includes('<meta name="viewport"')) {
    log('pass', 'Viewport meta tag present');
    passCount++;
  } else {
    log('fail', 'Missing viewport meta tag');
    failCount++;
  }

  // Language attribute
  if (html.match(/<html[^>]*lang=/)) {
    log('pass', 'HTML lang attribute present');
    passCount++;
  } else {
    log('fail', 'Missing HTML lang attribute');
    failCount++;
  }

  // H1 tag (should have exactly one)
  const h1Count = (html.match(/<h1[^>]*>/g) || []).length;
  if (h1Count === 1) {
    log('pass', 'Single H1 tag found');
    passCount++;
  } else if (h1Count === 0) {
    log('fail', 'No H1 tag found');
    failCount++;
  } else {
    log('warn', `Multiple H1 tags found (${h1Count})`);
    warnCount++;
  }

  // Images without alt attributes
  const imgTags = html.match(/<img[^>]*>/g) || [];
  const imgsWithoutAlt = imgTags.filter(tag => !tag.includes('alt='));
  if (imgTags.length > 0) {
    if (imgsWithoutAlt.length === 0) {
      log('pass', `All ${imgTags.length} images have alt attributes`);
      passCount++;
    } else {
      log('fail', `${imgsWithoutAlt.length}/${imgTags.length} images missing alt attributes`);
      failCount++;
    }
  }

  // Check for heading hierarchy
  const headings = [];
  for (let i = 1; i <= 6; i++) {
    const matches = html.match(new RegExp(`<h${i}[^>]*>`, 'g')) || [];
    if (matches.length > 0) headings.push({ level: i, count: matches.length });
  }

  if (headings.length > 0) {
    const hasProperHierarchy = headings[0].level === 1;
    if (hasProperHierarchy) {
      log('pass', 'Heading hierarchy starts with H1');
      passCount++;
    } else {
      log('warn', `Heading hierarchy starts with H${headings[0].level}`);
      warnCount++;
    }
  }

  // Check for semantic HTML
  const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'footer'];
  const foundSemantic = semanticTags.filter(tag => html.includes(`<${tag}`));
  if (foundSemantic.length >= 3) {
    log('pass', `Using semantic HTML`, `(${foundSemantic.join(', ')})`);
    passCount++;
  } else if (foundSemantic.length > 0) {
    log('warn', 'Limited semantic HTML usage', `(${foundSemantic.join(', ')})`);
    warnCount++;
  }

  // Check for inline styles (generally bad for SEO/performance)
  const inlineStyles = (html.match(/style="/g) || []).length;
  if (inlineStyles === 0) {
    log('pass', 'No inline styles found');
    passCount++;
  } else if (inlineStyles < 5) {
    log('warn', `${inlineStyles} inline style(s) found`);
    warnCount++;
  } else {
    log('fail', `Excessive inline styles (${inlineStyles})`);
    failCount++;
  }

  return { passCount, failCount, warnCount };
}

function checkAssets() {
  console.log(`\n${colors.blue}=== Asset Size Analysis ===${colors.reset}`);

  const assets = [];

  function scanDir(dir) {
    const items = readdirSync(dir);
    items.forEach(item => {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else {
        const ext = extname(item).toLowerCase();
        if (['.js', '.css', '.jpg', '.png', '.svg', '.webp', '.woff', '.woff2'].includes(ext)) {
          assets.push({
            path: fullPath.replace(DIST_DIR + '/', ''),
            size: stat.size,
            type: ext.substring(1)
          });
        }
      }
    });
  }

  scanDir(DIST_DIR);

  // Sort by size
  assets.sort((a, b) => b.size - a.size);

  let totalSize = 0;
  let warnCount = 0;

  console.log('\nLargest assets:');
  assets.slice(0, 10).forEach(asset => {
    totalSize += asset.size;
    const sizeStr = formatBytes(asset.size);

    if (asset.size > MAX_ASSET_SIZE) {
      log('warn', `${asset.path}`, `(${sizeStr})`);
      warnCount++;
    } else {
      log('info', `${asset.path}`, `(${sizeStr})`);
    }
  });

  console.log(`\n${colors.blue}Total assets analyzed: ${assets.length}${colors.reset}`);
  console.log(`${colors.blue}Combined size: ${formatBytes(totalSize)}${colors.reset}`);

  return warnCount;
}

// Main execution
console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║  SEO & Performance Test Suite         ║${colors.reset}`);
console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

try {
  // Check if dist exists
  try {
    statSync(DIST_DIR);
  } catch (e) {
    console.log(`${colors.red}Error: dist/ folder not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  // Find all HTML files
  const htmlFiles = readdirSync(DIST_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => ({ name: file, path: join(DIST_DIR, file) }));

  // Check protected.html if it exists
  try {
    const protectedPath = join(DIST_DIR, 'protected', 'index.html');
    statSync(protectedPath);
    htmlFiles.push({ name: 'protected/index.html', path: protectedPath });
  } catch (e) {
    // protected page doesn't exist, that's fine
  }

  if (htmlFiles.length === 0) {
    console.log(`${colors.red}No HTML files found in dist/${colors.reset}`);
    process.exit(1);
  }

  let totalPass = 0;
  let totalFail = 0;
  let totalWarn = 0;

  htmlFiles.forEach(file => {
    const results = checkHTML(file.path, file.name);
    totalPass += results.passCount;
    totalFail += results.failCount;
    totalWarn += results.warnCount;
  });

  // Check assets
  const assetWarns = checkAssets();
  totalWarn += assetWarns;

  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`${colors.green}✓ Passed: ${totalPass}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Warnings: ${totalWarn}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${totalFail}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  // Exit code
  if (totalFail > 0) {
    console.log(`${colors.red}Tests failed. Please fix the issues above.${colors.reset}\n`);
    process.exit(1);
  } else if (totalWarn > 0) {
    console.log(`${colors.yellow}Tests passed with warnings. Consider addressing them.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.green}All tests passed! 🎉${colors.reset}\n`);
    process.exit(0);
  }

} catch (error) {
  console.error(`${colors.red}Error running tests:${colors.reset}`, error.message);
  process.exit(1);
}
