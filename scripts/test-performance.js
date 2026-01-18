#!/usr/bin/env node

/**
 * Performance Test - Measures page load time and performance metrics
 * Requires the dev server to be running
 */

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;
const PAGES_TO_TEST = ['/', '/healthcare', '/project-example'];

// ANSI colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║  Performance Test Suite               ║${colors.reset}`);
console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

console.log(`${colors.yellow}Note: This test requires the dev server to be running.${colors.reset}`);
console.log(`${colors.yellow}Run 'npm run dev' in another terminal first.${colors.reset}\n`);

async function testPageLoad(url) {
  const startTime = Date.now();

  try {
    const response = await fetch(url);
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const htmlSize = new TextEncoder().encode(html).length;

    // Count resources
    const cssCount = (html.match(/<link[^>]*rel="stylesheet"/g) || []).length;
    const jsCount = (html.match(/<script[^>]*src=/g) || []).length;
    const imgCount = (html.match(/<img[^>]*src=/g) || []).length;

    return {
      success: true,
      loadTime,
      htmlSize,
      resources: { css: cssCount, js: jsCount, images: imgCount }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getPerformanceRating(loadTime) {
  if (loadTime < 100) return { color: colors.green, rating: 'Excellent' };
  if (loadTime < 300) return { color: colors.green, rating: 'Good' };
  if (loadTime < 1000) return { color: colors.yellow, rating: 'Fair' };
  return { color: colors.red, rating: 'Needs Improvement' };
}

async function runTests() {
  const results = [];

  for (const page of PAGES_TO_TEST) {
    const url = BASE_URL + page;
    console.log(`${colors.blue}Testing: ${url}${colors.reset}`);

    // Run test 3 times and take average
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const result = await testPageLoad(url);
      if (result.success) {
        runs.push(result);
      } else {
        console.log(`${colors.red}✗ Failed: ${result.error}${colors.reset}`);
        console.log(`${colors.yellow}Make sure dev server is running: npm run dev${colors.reset}\n`);
        return;
      }

      // Small delay between runs
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate averages
    const avgLoadTime = runs.reduce((sum, r) => sum + r.loadTime, 0) / runs.length;
    const minLoadTime = Math.min(...runs.map(r => r.loadTime));
    const maxLoadTime = Math.max(...runs.map(r => r.loadTime));
    const htmlSize = runs[0].htmlSize;
    const resources = runs[0].resources;

    const rating = getPerformanceRating(avgLoadTime);

    console.log(`  ${rating.color}Load Time: ${avgLoadTime.toFixed(0)}ms (${rating.rating})${colors.reset}`);
    console.log(`  ${colors.blue}Range: ${minLoadTime}ms - ${maxLoadTime}ms${colors.reset}`);
    console.log(`  ${colors.blue}HTML Size: ${formatBytes(htmlSize)}${colors.reset}`);
    console.log(`  ${colors.blue}Resources: ${resources.css} CSS, ${resources.js} JS, ${resources.images} images${colors.reset}\n`);

    results.push({
      page,
      avgLoadTime,
      minLoadTime,
      maxLoadTime,
      htmlSize,
      resources,
      rating: rating.rating
    });
  }

  // Summary
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Performance Summary:${colors.reset}\n`);

  const avgOverall = results.reduce((sum, r) => sum + r.avgLoadTime, 0) / results.length;
  const totalHtml = results.reduce((sum, r) => sum + r.htmlSize, 0);

  console.log(`  Average Load Time: ${avgOverall.toFixed(0)}ms`);
  console.log(`  Total HTML Size: ${formatBytes(totalHtml)}`);
  console.log(`  Pages Tested: ${results.length}`);

  const allFast = results.every(r => r.avgLoadTime < 1000);
  if (allFast) {
    console.log(`\n  ${colors.green}✓ All pages load in under 1 second! 🚀${colors.reset}`);
  } else {
    console.log(`\n  ${colors.yellow}⚠ Some pages could be optimized${colors.reset}`);
  }

  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch (e) {
    return false;
  }
}

// Main
(async () => {
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log(`${colors.red}✗ Dev server not running at ${BASE_URL}${colors.reset}`);
    console.log(`${colors.yellow}Start it with: npm run dev${colors.reset}\n`);
    process.exit(1);
  }

  await runTests();
})();
