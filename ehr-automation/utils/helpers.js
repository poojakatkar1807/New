const fs   = require('fs');
const path = require('path');

function generateRandomEmail() {
  return `testuser_${Date.now()}@example.com`;
}

function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomPhone() {
  return '9' + Math.floor(Math.random() * 900000000 + 100000000).toString();
}

function generatePatientName() {
  const firstNames = ['Amit', 'Sneha', 'Vikram', 'Pooja', 'Arjun', 'Neha', 'Karan', 'Divya'];
  const lastNames  = ['Sharma', 'Verma', 'Singh', 'Gupta', 'Patel', 'Reddy', 'Mehta', 'Joshi'];
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName:  lastNames[Math.floor(Math.random() * lastNames.length)]
  };
}

function getFutureDate(daysFromNow = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

function getTodaysDate() {
  return new Date().toISOString().split('T')[0];
}

function readTestData(fileName) {
  const filePath = path.join(__dirname, '..', 'test-data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  generateRandomEmail,
  generateRandomString,
  generateRandomPhone,
  generatePatientName,
  getFutureDate,
  getTodaysDate,
  readTestData,
  sleep
};
