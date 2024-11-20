let { DataTypes, sequelize } = require("../lib/");

let role = sequelize.define("role", {
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = { role };
