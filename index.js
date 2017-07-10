'use strict';

const encryptKey = require('./encrypt').encryptKey;
const decryptKey = require('./decrypt').decryptKey;

/**
 * Encrypt a message and write the hash in a file
 * @param {string} message The message to encrypt
 * @param {string} ouputFile The file where to write the encrypted value
 * @param {Object} options The options for Google Cloud
 * 
 * @throws {Error} If then env var `GOOGLE_APPLICATION_CREDENTIALS` doesn't exist rejects
 * @return {Promise}
 */
function encrypt(message, ouputFile, options) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return Promise.reject(new Error('The environment variable GOOGLE_APPLICATION_CREDENTIALS is required'));
  }

  const opts = {
    PROJECT_ID: options.project_id || process.env.PROJECT_ID || '',
    LOCATION: options.project_location || process.env.PROJECT_LOCATION || 'europe-west1',
    KEY_RING_NAME: options.key_ring_name || process.env.KEY_RING_NAME || '',
    CRYPTO_KEY_NAME: options.crypto_key_name || process.env.CRYPTO_KEY_NAME || '',
  };

  return encryptKey(message, outputFile, opts);
}

/**
 * Decrypt a given encrypted text in a file
 * @param {string} filepath The path to the file where the content to decrypt is
 * @param {Object} options The options for Google Cloud
 * 
 * @throws {Error} If then env var `GOOGLE_APPLICATION_CREDENTIALS` doesn't exist rejects
 * @return {Promise}
 */
function decrypt(filepath, options) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return Promise.reject(new Error('The environment variable GOOGLE_APPLICATION_CREDENTIALS is required'));
  }

  const opts = {
    PROJECT_ID: options.project_id || process.env.PROJECT_ID || '',
    LOCATION: options.project_location || process.env.PROJECT_LOCATION || 'europe-west1',
    KEY_RING_NAME: options.key_ring_name || process.env.KEY_RING_NAME || '',
    CRYPTO_KEY_NAME: options.crypto_key_name || process.env.CRYPTO_KEY_NAME || '',
  };

  return decryptKey(filepath, opts);
}

module.exports = {
  decrypt,
  encrypt,
};
