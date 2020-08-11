# dkimpy

[![build status](https://img.shields.io/travis/com/forwardemail/dkimpy.svg)](https://travis-ci.com/forwardemail/dkimpy)
[![code coverage](https://img.shields.io/codecov/c/github/forwardemail/dkimpy.svg)](https://codecov.io/gh/forwardemail/dkimpy)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/forwardemail/dkimpy.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/dkimpy.svg)](https://npm.im/dkimpy)

> Node.js wrapper around the Python pip package dkimpy exposing DKIM and ARC signing and verification functions


## Table of Contents

* [Requirements](#requirements)
* [Install](#install)
* [Usage](#usage)
  * [dkimVerify](#dkimverify)
  * [arcVerify](#arcverify)
  * [arcSign](#arcsign)
* [Contributors](#contributors)
* [License](#license)


## Requirements

1. Ensure that you have a Python version of >= 3.5 installed per [dkimpy][] requirements (note that Python v3 is required because of a bug with DNS recursive CNAME lookups on v2.7):

   ```sh
   python3 --version
   ```

2. Install the package [dkimpy][] and [authres][] (`authres` is optional and used for ARC):

   ```sh
   pip3 install dkimpy authres
   ```


## Install

[npm][]:

```sh
npm install dkimpy
```

[yarn][]:

```sh
yarn add dkimpy
```


## Usage

### dkimVerify

```js
const fs = require('fs');

const { dkimVerify } = require('dkimpy');

const message = fs.readFileSync('/path/to/example.eml');

// then/catch usage
dkimVerify(message)
  .then(console.log)
  .catch(console.error);

// async/await usage
(async () => {
  try {
    const result = await dkimVerify(message)
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();
```

The value of `result` is a Boolean which indicates if DKIM verification was successful for the first `DKIM-Signature` header found on the email.

You can pass a second argument of `index` (defaults to `0`, which means it looks for the first DKIM-Signature found).

### arcVerify

```js
const fs = require('fs');

const { arcVerify } = require('dkimpy');

const message = fs.readFileSync('/path/to/example.eml');

// then/catch usage
arcVerify(message)
  .then(console.log)
  .catch(console.error);

// async/await usage
(async () => {
  try {
    const result = await arcVerify(message)
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();
```

The value of `result` is an enumerable String which is one of:

* `"none"` indicates it does not have an ARC signature
* `"pass"` indicates its ARC signature was verified successfully
* `"fail"` indicates it had an ARC signature and it failed verification

### arcSign

```js
const fs = require('fs');

const { arcSign } = require('dkimpy');

const message = fs.readFileSync('/path/to/example.eml');
const selector = 'default'; // default._domainkey
const domain = 'example.com';
const srvId = 'mx.example.com';
const privateKeyFile = '/path/to/private.key';

// then/catch usage
arcSign(message, selector, domain, privateKeyFile, srvId)
  .then(console.log)
  .catch(console.error);

// async/await usage
(async () => {
  try {
    const result = await arcSign(message, selector, domain, privateKeyFile, srvId)
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();
```

The value of `result` is a String with the new ARC headers to add to the top of the message (if any).


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[dkimpy]: https://pypi.org/project/dkimpy/

[authres]: https://pypi.org/project/authres/
