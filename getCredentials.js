'use strict';

const google = require('googleapis');

/**
 * Retrieve the secret for Gocd from the KMS API
 * @return {Promise}
 */
function getCredentials() {
  return new Promise((resolve, reject) => (
    google.auth.getApplicationDefault((err, authClient) => {
      if (err) return reject(err);

      if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        authClient = authClient.createScoped([
          'https://www.googleapis.com/auth/cloud-platform',
        ]);
      }

      const cloudkms = google.cloudkms({
        version: 'v1',
        auth: authClient,
      });

      resolve(cloudkms);
    })
  ));
}

module.exports = {
  getCredentials,
};
