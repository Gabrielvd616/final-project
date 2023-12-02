module.exports = {
  // host, user, password, and db need to be updated
  HOST: "sql9.freemysqlhosting.net",
  USER: "sql9653425",
  PASSWORD: "tPYq5qCiUH",
  DB: "sql9653425",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
