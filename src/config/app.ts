import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const ENV_PATH = '../../.env';

const envPath = path.join(__dirname, ENV_PATH);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log('any .env file not found, skip dotenv configuration');
}

// we have to use TEST_DATABASE_URL to access the test db.
// remove the initial DATABASE_URL to ensure that we won't access the real db.
if (process.env.NODE_ENV === 'test') {
  delete process.env.DATABASE_URL;

  if (process.env.TEST_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  }
}

export default {
  database: {
    url: process.env.DATABASE_URL,
    poolMax: Number.parseInt(process.env.DATABASE_POOL_MAX!, 10) || 5,
    sslOff: process.env.DATABASE_SSL_OFF === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
  },
  server: {
    port: Number.parseInt((process.env.PORT || '4000'), 10),
  },
};
