require('dotenv').config();

const config = {
  server: {
    hostname: '0.0.0.0',
    port: '3000',
  },
  database: {
    url: 'mongodb://127.0.0.1/nodeauth',
  },
};

module.exports = config;
