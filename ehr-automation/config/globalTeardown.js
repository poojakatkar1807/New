async function globalTeardown() {
  console.log('\n--- EHR Test Suite: Global Teardown ---\n');
  console.log(`  All tests completed`);
  console.log(`  Finished at: ${new Date().toLocaleString()}`);
  console.log(`  Report: reports/html-report/index.html\n`);
}

module.exports = globalTeardown;
