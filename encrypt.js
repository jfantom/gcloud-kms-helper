'use strict';

const fs = require('fs');
const getCredentials = require('./getCredentials').getCredentials;

/**
 * Encrypt a given message
 * @param {string} messageToEncrypt
 * @param {string} outputFile The file where to output the secret
 * @param {Object} opts The options for the decryption.
 * @example
 *  opts object
 *  {
 *    PROJECT_ID: 'PROJECT_ID',
 *    LOCATION: 'LOCATION',
 *    KEY_RING_NAME: 'KEY_RING_NAME',
 *    CRYPTO_KEY_NAME: 'CRYPTO_KEY_NAME',
 *  }
 * @return {Promise}
 */
function encryptKey(messageToEncrypt, outputFile, opts) {
  return new Promise((resolve, reject) => (
    getCredentials()
      .then((cloudkms) => {
        const request = {
          name: `projects/${opts.PROJECT_ID}/locations/${opts.LOCATION}/keyRings/${opts.KEY_RING_NAME}/cryptoKeys/${opts.CRYPTO_KEY_NAME}`,
          resource: {
            plaintext: Buffer.from(messageToEncrypt).toString('base64'),
          },
        };

        cloudkms.projects.locations.keyRings.cryptoKeys.encrypt(request, (err, result) => {
          if (err) return reject(err);

          fs.writeFile(outputFile, Buffer.from(result.ciphertext), (err) => {
            if (err) return reject(err);

            return resolve('ready to push');
          });
        });
      })
      .catch(reject)
  ));
}

module.exports = {
  encryptKey,
};
