const Sequelize = require("sequelize");
const sequelize = new Sequelize("JWT", "root", "Vaneet5509@", {
  host: "localhost",
  dialect: "mysql",
  port: "3307",
  logging: false,
});

const connect = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected with database");
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

const syn = () => {
  sequelize.sync({ alter: true }).then(() => {
    console.log("Sync");
  });
};



module.exports = { sequelize: sequelize, connect: connect, syn: syn };
