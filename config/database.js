const mongoose = require("mongoose");
require('dotenv/config')
const dbNames = {
  production: 'sceats',
  test: 'test-sceats',
  development: 'dev-sceats'
}
const connect = () => {
  const mongoConnectionString = process.env.DB_CONNECTION
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(mongoConnectionString, opts);
  console.log({mongoConnectionString});
};

module.exports = { connect };