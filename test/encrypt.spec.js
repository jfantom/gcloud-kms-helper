'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

let sandbox;

test.beforeEach(() => sandbox = sinon.sandbox.create())

test.afterEach(() => sandbox.restore());

test('encryptKey: success case', (t) => {
  return new Promise((resolve, reject) => {
    const encryptSpy = sandbox.spy((request, cb) => {
      cb(null, {
        ciphertext: 'theEncryptedKey',
      });
    });

    const writeFileSpy = sandbox.spy((filePath, data, cb) => {
      cb(null);
    });

    const encryptKey = proxyquire('../encrypt', {
      './getCredentials': {
        getCredentials: () => Promise.resolve({
          projects: {
            locations: {
              keyRings: {
                cryptoKeys: {
                  encrypt: encryptSpy,
                },
              },
            },
          },
        }),
      },
      fs: {
        writeFile: writeFileSpy,
      },
    }).encryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    encryptKey('test', './therightone.key', opts)
      .then((res) => {
        t.is(res, 'ready to push');
        t.truthy(writeFileSpy.calledOnce);
        t.truthy(encryptSpy.calledOnce);
        resolve();
      })
      .catch(reject);
  });
});

test('encryptKey: fail case: if getCredentials fails it should reject', (t) => {
  return new Promise((resolve, reject) => {
    const encryptKey = proxyquire('../encrypt', {
      './getCredentials': {
        getCredentials: () => Promise.reject('no'),
      },
    }).encryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    encryptKey('test', './therightone.key', opts)
      .then(reject)
      .catch((err) => {
        t.is(err, 'no');
        resolve();
      });
  });
});

test('encryptKey: fail case: if encrypt fails it should reject', (t) => {
  return new Promise((resolve, reject) => {
    const encryptSpy = sandbox.spy((request, cb) => {
      cb(new Error('no encryption'), null);
    });

    const encryptKey = proxyquire('../encrypt', {
      './getCredentials': {
        getCredentials: () => Promise.resolve({
          projects: {
            locations: {
              keyRings: {
                cryptoKeys: {
                  encrypt: encryptSpy,
                },
              },
            },
          },
        }),
      },
    }).encryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    encryptKey('test', './therightone.key', opts)
      .then(reject)
      .catch((err) => {
        t.is(err.message, 'no encryption');
        resolve();
      });
  });
});

test('encryptKey: fail case: if fs fails it should reject', (t) => {
  return new Promise((resolve, reject) => {
    const encryptSpy = sandbox.spy((request, cb) => {
      cb(null, {
        ciphertext: 'theEncryptedKey',
      });
    });

    const writeFileSpy = sandbox.spy((filePath, data, cb) => {
      cb(new Error('no way'));
    });

    const encryptKey = proxyquire('../encrypt', {
      './getCredentials': {
        getCredentials: () => Promise.resolve({
          projects: {
            locations: {
              keyRings: {
                cryptoKeys: {
                  encrypt: encryptSpy,
                },
              },
            },
          },
        }),
      },
      fs: {
        writeFile: writeFileSpy,
      },
    }).encryptKey;

    const opts = {
      PROJECT_ID: 'project_id',
      LOCATION: 'location',
      KEY_RING_NAME: 'key_ring_name',
      CRYPTO_KEY_NAME: 'crypto_key_name',
    };

    encryptKey('test', './therightone.key', opts)
      .then(reject)
      .catch((err) => {
        t.is(err.message, 'no way');
        t.truthy(writeFileSpy.calledOnce);
        t.truthy(encryptSpy.calledOnce);
        resolve();
      });
  });
});

