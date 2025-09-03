// DbConfig.js
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secretName = "rds-mysql-secret";  
const region = "ap-south-1";            

const client = new SecretsManagerClient({ region });

let DB_HOST = "";
let DB_USER = "";
let DB_PWD = "";
let DB_DATABASE = "";

// Immediately fetch the secret on startup
(async () => {
  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );
    const secret = JSON.parse(response.SecretString);

    DB_HOST = secret.DB_HOST || secret.host;
    DB_USER = secret.DB_USER || secret.username;
    DB_PWD = secret.DB_PWD || secret.password;
    DB_DATABASE = secret.DB_DATABASE || secret.dbname;

    console.log("✅ Secrets loaded from AWS Secrets Manager");
  } catch (err) {
    console.error("❌ Error loading secrets:", err);
  }
})();

module.exports = Object.freeze({
  get DB_HOST() { return DB_HOST; },
  get DB_USER() { return DB_USER; },
  get DB_PWD() { return DB_PWD; },
  get DB_DATABASE() { return DB_DATABASE; }
});
