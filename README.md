# gcloud-kms-helper

[![npm](https://img.shields.io/npm/v/gcloud-kms-helper.svg)](https://www.npmjs.com/package/gcloud-kms-helper)  [![Build Status](https://travis-ci.org/jackTheRipper/gcloud-kms-helper.svg?branch=master)](https://travis-ci.org/jackTheRipper/gcloud-kms-helper)

A simple NPM module for managing the encryption - decryption using [Google Cloud KMS](https://cloud.google.com/kms/docs/).

## What is it?

The `gcloud-kms-helper` provides a CLI tool for encrypting - decrypting your secrets.

It can be also used directly in your code.

The motivation for creating this NPM module is to be able to have a re-usable solution for dealing with secrets when using [Google Cloud Functions](https://cloud.google.com/functions/docs/)

## How does it work?

Before using the module be sure that you setup the `gcloud` binary on your laptop and that you are authenticated.

The module needs the following environment variable: `GOOGLE_APPLICATION_CREDENTIALS`.

When your environment is ready, move to your project directory and run the following command:

```bash
$> npm install --save gcloud-kms-helper
```

The module supports the following environment variables:

* `PROJECT_ID`: your Google Cloud project ID
* `PROJECT_LOCATION`: your Google Cloud project location (default: europe-west1)
* `KEY_RING_NAME`: your Google Cloud KMS key ring name
* `CRYPTO_KEY_NAME`: your Google Cloud KMS crypto key name

### Using the CLI

The CLI tool supports two commands: `encrypt` and `decrypt`.

##### encrypt

Encrypt and write a message in to a file.

Usage:

```bash
$> kms-helper encrypt [options] <message to encrypt> <output file>
```

If you aren't using the environment variables or if you wanna override the value set in your environment you can use the following options:

* `-p, --project_id`: your Google Cloud project ID
* `-l, --project_location`: your Google Cloud project location (default: europe-west1)
* `-r, --key_ring_name`: your Google Cloud KMS key ring name
* `-c, --crypto_key_name`: your Google Cloud KMS crypto key name

##### decrypt

Decrypt a message in a file.

Usage:

```bash
$> kms-helper decrypt [options] <input file>
```

If you aren't using the environment variables or if you wanna override the value set in your environment you can use the following options:

* `-p, --project_id`: your Google Cloud project ID
* `-l, --project_location`: your Google Cloud project location (default: europe-west1)
* `-r, --key_ring_name`: your Google Cloud KMS key ring name
* `-c, --crypto_key_name`: your Google Cloud KMS crypto key name

### Using the API

You can import the encrypt / decrypt methods in your script:

```javascript
encrypt(message, outputFile, options)
```

#### argurments

* `message`: string. Required. The message to encrypt
* `outputFile`: string. Required. The path of the file where to output the encrypted message.
* `options`: object. Required. The options mentionned before.

#### returned value

* Promise

```javascript
'use strict';

/**
 * If you are using the module in a Google Cloud Function you will need the following *ugly* hack
 */

process.env.GOOGLE_APPLICATION_CREDENTIALS = '~/path/to/my/cred';

const options = {
  project_id: process.env.PROJECT_ID || 'my-project',
  location: process.env.PROJECT_LOCATION || 'europe-west1',
  key_ring_name: process.env.KEY_RING_NAME || 'key-ring-name',
  crypto_key_name: process.env.CRYPTO_KEY_NAME || 'crypto-key-name',
};

const encrypt = require('gcloud-kms-helper').encrypt;

encrypt('my message to encrypt', './output.key', options)
  .then(() => console.log('done.'))
  .catch((err) => console.error(`Something went wrong: ${err.message}`));
```

```javascript
encrypt(message, outputFile, options)
```

#### argurments

* `inputFile`: string. Required. The path of the file where we can find the message to decrypt.
* `options`: object. Required. The options mentionned before.

#### returned value

* Promise

```javascript
'use strict';

/**
 * If you are using the module in a Google Cloud Function you will need the following *ugly* hack
 */

process.env.GOOGLE_APPLICATION_CREDENTIALS = '~/path/to/my/cred';

const options = {
  project_id: process.env.PROJECT_ID || 'my-project',
  location: process.env.PROJECT_LOCATION || 'europe-west1',
  key_ring_name: process.env.KEY_RING_NAME || 'key-ring-name',
  crypto_key_name: process.env.CRYPTO_KEY_NAME || 'crypto-key-name',
};

const decrypt = require('gcloud-kms-helper').decrypt;

decrypt('./output.key', options)
  .then((myDecryptedValue) => console.log(`The secret is: ${myDecryptedValue}`))
  .catch((err) => console.error(`Something went wrong: ${err.message}`));
```

Most of the possible scenario are described in the test directory of the module.

For running the test simply run `npm run test`

## Contributing - Complaining

If you found a bug or think that something is missing, do not hesitate to open an issue or a pull-request
