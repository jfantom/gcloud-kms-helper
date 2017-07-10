'use strict';

const fs = require('fs');
const getCredentials = require('./getCredentials').getCredentials;

/**
 * Encrypt a given message
 * @param {string} filePath The file where the message to decrypt is
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
function decryptKey(filePath, opts) {
  return new Promise((resolve, reject) => (
    getCredentials()
      .then((cloudkms) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) return reject(err);

          const request = {
            name: `projects/${opts.PROJECT_ID}/locations/${opts.LOCATION}/keyRings/${opts.KEY_RING_NAME}/cryptoKeys/${opts.CRYPTO_KEY_NAME}`,
            resource: {
              ciphertext: data,
            },
          };

          cloudkms.projects.locations.keyRings.cryptoKeys.decrypt(request, (err, result) => {
            if (err) return reject(err);

            return resolve(Buffer.from(result.plaintext, 'base64'));
          });
        });
      })
      .catch(reject)
  ));
}

module.exports = {
  decryptKey,
};
