const fs = require('fs');

async function globalSetup() {
  console.log('\n--- EHR Test Suite: Global Setup ---\n');

  const dirs = [
    'reports/html-report',
    'reports/screenshots',
    'reports/test-artifacts'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created directory: ${dir}`);
    }
  });

  console.log(`\n  Base URL    : ${process.env.BASE_URL || 'http://localhost:3000'}`);
  console.log(`  Environment : ${process.env.NODE_ENV || 'test'}`);
  console.log(`  Started at  : ${new Date().toLocaleString()}\n`);
}

module.exports = globalSetup;
