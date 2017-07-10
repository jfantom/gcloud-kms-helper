'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

let sandbox;

test.beforeEach(() => sandbox = sinon.sandbox.create())

test.afterEach(() => sandbox.restore());

test('getCredentials: success case: scope already exists', (t) => {
  return new Promise((resolve, reject) => {
    const getApplicationDefaultSpy = sandbox.spy((callback) => {
      callback(null, {
        createScopedRequired: () => false,
      });
    });

    const cloudKmsSpy = sandbox.spy(() => ({ auth: true, }));

    const getCredentials = proxyquire('../getCredentials', {
      googleapis: {
        auth: {
          getApplicationDefault: getApplicationDefaultSpy,
        },
        cloudkms: cloudKmsSpy,
      },
    }).getCredentials;

    getCredentials().then((obj) => {
      t.truthy(obj.auth);

      t.truthy(getApplicationDefaultSpy.calledOnce);

      t.truthy(cloudKmsSpy.calledOnce);

      resolve();
    }).catch(reject);
  });
});

test('getCredentials: success case: scope does not exist', (t) => {
  return new Promise((resolve, reject) => {
    const createScopedSpy = sandbox.spy(() => ({ createScopedRequired: () => false }))

    const getApplicationDefaultSpy = sandbox.spy((callback) => {
      callback(null, {
        createScopedRequired: () => true,
        createScoped: createScopedSpy,
      });
    });

    const cloudKmsSpy = sandbox.spy(() => ({ auth: true, }));

    const getCredentials = proxyquire('../getCredentials', {
      googleapis: {
        auth: {
          getApplicationDefault: getApplicationDefaultSpy,
        },
        cloudkms: cloudKmsSpy,
      },
    }).getCredentials;

    getCredentials().then((obj) => {
      t.truthy(obj.auth);

      t.truthy(getApplicationDefaultSpy.calledOnce);

      t.truthy(createScopedSpy.calledOnce);

      t.truthy(cloudKmsSpy.calledOnce);

      resolve();
    }).catch(reject);
  });
});

test('getCredentials: fail case: when getApplicationDefault fails it rejects an error', (t) => {
  return new Promise((resolve, reject) => {
    const sandbox = sinon.sandbox.create();

    const getApplicationDefaultSpy = sandbox.spy((callback) => {
      callback(new Error('test error'), null);
    });

    const cloudKmsSpy = sandbox.spy(() => ({ auth: true, }));

    const getCredentials = proxyquire('../getCredentials', {
      googleapis: {
        auth: {
          getApplicationDefault: getApplicationDefaultSpy,
        },
        cloudkms: cloudKmsSpy,
      },
    }).getCredentials;

    getCredentials().then(() => {
      t.fail('The test must fail');
      reject();
    }).catch((err) => {
      t.is(err.message, 'test error');
      t.truthy(getApplicationDefaultSpy.calledOnce);
      resolve();
    });
  });
});

