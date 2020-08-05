const fs = require('fs');
const path = require('path');

const test = require('ava');

const { arcVerify } = require('..');

const none = fs.readFileSync(path.join(__dirname, 'fixtures', 'arc-none.txt'));
const pass = fs.readFileSync(path.join(__dirname, 'fixtures', 'arc-pass.txt'));

test('throws error', async (t) => {
  await t.throwsAsync(arcVerify());
  t.pass();
});

test('returns none', async (t) => {
  const result = await arcVerify(none);
  t.is(result, 'none');
});

test('returns pass', async (t) => {
  const result = await arcVerify(pass);
  t.is(result, 'pass');
});
