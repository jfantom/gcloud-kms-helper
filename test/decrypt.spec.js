'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

let sandbox;

test.beforeEach(() => sandbox = sinon.sandbox.create())

test.afterEach(() => sandbox.restore());

test('decriptKey: success case', (t) => {
  return new Promise((resolve, reject) => {
    const decryptSpy = sandbox.spy((request, cb) => {
      cb(null, {
        plaintext: Buffer.from('theEncryptedKey').toString('base64'),
      });
    });

    const readFileSpy = sandbox.spy((filePath, encoding, cb) => {
      cb(null, 'theEncryptedKey');
    });

    const decryptKey = proxyquire('../decrypt', {
      './getCredentials': {
        getCredentials: () => Promise.resolve({
          projects: {
            locations: {
              keyRings: {
                cryptoKeys: {
                  decrypt: decryptSpy,
                },
              },
            },
          },
        }),
      },
      fs: {
        readFile: readFileSpy,
      },
    }).decryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    decryptKey('test', './therightone.key', opts)
      .then((res) => {
        t.is(res.toString(), 'theEncryptedKey');
        t.truthy(readFileSpy.calledOnce);
        t.truthy(decryptSpy.calledOnce);
        resolve();
      })
      .catch(reject);
  });
});

test('decriptKey: fail case: if getCredentials fails it should reject', (t) => {
  return new Promise((resolve, reject) => {
    const decryptKey = proxyquire('../decrypt', {
      './getCredentials': {
        getCredentials: () => Promise.reject(new Error('no')),
      },
    }).decryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    decryptKey('./therightone.key', opts)
      .then(reject)
      .catch((err) => {
        t.is(err.message, 'no');
        resolve();
      });
  });
});

test('decryptKey: fail case: if decrypt fails it should reject', (t) => {
  return new Promise((resolve, reject) => {
    const decryptSpy = sandbox.spy((request, cb) => {
      cb(new Error('no decryption'), null);
    });

    const decryptKey = proxyquire('../decrypt', {
      './getCredentials': {
        getCredentials: () => Promise.resolve({
          projects: {
            locations: {
              keyRings: {
                cryptoKeys: {
                  decrypt: decryptSpy,
                },
              },
            },
          },
        }),
      },
      fs: {
        readFile: (filePath, encoding, cb) => cb(null, 'theEncryptedKey'),
      },
    }).decryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    decryptKey('./therightone.key', opts)
      .then(reject)
      .catch((err) => {
        t.is(err.message, 'no decryption');
        resolve();
      });
  });
});

test('decryptKey: fail case: if fs fails it should reject', (t) => {
  return new Promise((resolve, reject) => {
    const decryptSpy = sandbox.spy((request, cb) => {
      cb(null, {
        plainText: Buffer.from('theEncryptedKey').toString('base64'),
      });
    });

    const readFileSpy = sandbox.spy((filePath, encoding, cb) => {
      cb(new Error('no way'), null);
    });

    const decryptKey = proxyquire('../decrypt', {
      './getCredentials': {
        getCredentials: () => Promise.resolve({
          projects: {
            locations: {
              keyRings: {
                cryptoKeys: {
                  decrypt: decryptSpy,
                },
              },
            },
          },
        }),
      },
      fs: {
        readFile: readFileSpy,
      },
    }).decryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    decryptKey('./therightone.key', opts)
      .then(reject)
      .catch((err) => {
        t.is(err.message, 'no way');
        t.truthy(readFileSpy.calledOnce);
        resolve();
      });
  });
});

