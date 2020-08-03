const fs = require('fs');
const path = require('path');

const test = require('ava');

const { dkimVerify } = require('..');

const fail = '';
const pass = fs.readFileSync(path.join(__dirname, 'fixtures', 'gmail-raw.txt'));

test('throws error', async t => {
  await t.throwsAsync(dkimVerify());
  t.pass();
});

test('returns fail', async t => {
  const result = await dkimVerify(fail);
  t.is(result, false);
});

test('returns pass', async t => {
  const result = await dkimVerify(pass);
  t.is(result, true);
});

test('returns pass with 0 index', async t => {
  const result = await dkimVerify(pass, 0);
  t.is(result, true);
});

test('returns fail with 1 index', async t => {
  const result = await dkimVerify(pass, 1);
  t.is(result, false);
});
