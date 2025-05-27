const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pics', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pics',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pics_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
