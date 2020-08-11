const fs = require('fs');
const path = require('path');

const splitLines = require('split-lines');
const test = require('ava');

const { arcSign } = require('..');

const none = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'arc-none.txt'),
  'utf8'
);
const pass = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'arc-pass.txt'),
  'utf8'
);
const missingFrom = pass
  .split('\n')
  .filter((line) => !line.startsWith('From:'))
  .join('\n');

// <https://lxadm.com/Generating_DKIM_key_with_openssl>
const key = path.join(__dirname, 'fixtures', 'private.key');

test('arc sign throws error', async (t) => {
  await t.throwsAsync(arcSign());
  t.pass();
});

test('arc sign returns none', async (t) => {
  const result = await arcSign(
    none,
    'default',
    'lists.example.org',
    key,
    'lists.example.org'
  );
  const lines = splitLines(result).filter((line) => !line.startsWith(' '));
  t.true(lines[0].startsWith('ARC-Seal'));
  t.true(lines[1].startsWith('ARC-Message-Signature'));
  t.true(lines[2].startsWith('ARC-Authentication-Results'));
});

test('arc sign returns pass', async (t) => {
  const result = await arcSign(
    pass,
    'default',
    'example.com',
    key,
    'mx.google.com'
  );
  t.is(result, '');
});

test('arc sign throws error with missing From header', async (t) => {
  await t.throwsAsync(
    arcSign(missingFrom, 'default', 'example.com', key, 'mx.google.com'),
    { message: 'The From header field MUST be signed' }
  );
  t.pass();
});
