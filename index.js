const path = require('path');
const { exec, execSync } = require('child_process');

const debug = require('debug')('dkimpy');
const ms = require('ms');
const semver = require('semver');

const scripts = {
  dkimVerify: path.join(__dirname, 'scripts', 'dkimverify.py'),
  arcSign: path.join(__dirname, 'scripts', 'arcsign.py'),
  arcVerify: path.join(__dirname, 'scripts', 'arcverify.py')
};

// ensure python installed
try {
  execSync('which python3', {
    stdio: 'ignore',
    encoding: 'utf8',
    timeout: ms('5s')
  });
} catch (err) {
  debug(err);
  throw new Error(`Python v3.5+ is required`);
}

// ensure python v3.5+
const version = semver.coerce(
  execSync('python3 --version', { encoding: 'utf8', timeout: ms('5s') })
    .split(' ')[1]
    .trim()
);

if (!semver.satisfies(version, '>= 3.5'))
  throw new Error(
    `Python v3.5+ is required, you currently have v${version} installed`
  );

function dkimVerify(message, index = 0) {
  return new Promise((resolve, reject) => {
    const child = exec(`python3 ${scripts.dkimVerify} --index ${index}`, {
      encoding: 'utf8',
      timeout: ms('10s')
    });
    const stdout = [];
    const stderr = [];
    child.stderr.on('data', (data) => {
      stderr.push(data);
    });
    child.stdout.on('data', (data) => {
      stdout.push(data);
    });
    child.stdin.write(message);
    child.stdin.end();
    child.on('close', (code) => {
      // exits with code 1 if failed
      if (code === 1) return resolve(false);
      if (stderr.length > 0) return reject(new Error(stderr.join('')));
      const output = stdout.join('');
      if (output && output === 'signature ok') return resolve(true);
      reject(new Error(output));
    });
  });
}

// eslint-disable-next-line max-params
async function arcSign(message, selector, domain, privateKeyFile, srvId) {
  return new Promise((resolve, reject) => {
    const child = exec(
      `python3 ${scripts.arcSign} ${selector} ${domain} ${privateKeyFile} ${srvId}`,
      {
        encoding: 'utf8',
        timeout: ms('10s')
      }
    );
    const stdout = [];
    const stderr = [];
    child.stderr.on('data', (data) => {
      stderr.push(data);
    });
    child.stdout.on('data', (data) => {
      stdout.push(data);
    });
    child.stdin.write(message);
    child.stdin.end();
    child.on('close', () => {
      if (stderr.length > 0) return reject(new Error(stderr.join('')));
      resolve(stdout.join(''));
    });
  });
}

async function arcVerify(message) {
  return new Promise((resolve, reject) => {
    const child = exec(`python3 ${scripts.arcVerify}`, {
      encoding: 'utf8',
      timeout: ms('10s')
    });
    const stdout = [];
    const stderr = [];
    child.stderr.on('data', (data) => {
      stderr.push(data);
    });
    child.stdout.on('data', (data) => {
      stdout.push(data);
    });
    child.stdin.write(message);
    child.stdin.end();
    child.on('close', () => {
      if (stderr.length > 0) return reject(new Error(stderr.join('')));
      resolve(stdout.join(''));
    });
  });
}

module.exports = { dkimVerify, arcSign, arcVerify };
