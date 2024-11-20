let { DataTypes, sequelize } = require("../lib/");

let department = sequelize.define("department", {
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = { department };
