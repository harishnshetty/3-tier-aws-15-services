const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'ap-south-1'
});

async function getDatabaseSecrets() {
  try {
    const secretName = process.env.DB_SECRET_NAME || "<secret-name>"; 
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      throw new Error('Secret binary not supported');
    }
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

module.exports = (async () => {
  try {
    const secrets = await getDatabaseSecrets();
    return Object.freeze({
      DB_HOST: secrets.host || secrets.DB_HOST,
      DB_USER: secrets.username || secrets.DB_USER,
      DB_PWD: secrets.password || secrets.DB_PWD,
      DB_DATABASE: secrets.dbname || secrets.DB_DATABASE || secrets.database
    });
  } catch (error) {
    console.error('Failed to load database configuration:', error);
    return Object.freeze({
      DB_HOST: process.env.DB_HOST || '',
      DB_USER: process.env.DB_USER || '',
      DB_PWD: process.env.DB_PWD || '',
      DB_DATABASE: process.env.DB_DATABASE || ''
    });
  }
})();


