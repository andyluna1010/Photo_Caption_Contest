var DataTypes = require("sequelize").DataTypes;
var _captions = require("./captions");
var _pics = require("./pics");
var _users = require("./users");

function initModels(sequelize) {
  var captions = _captions(sequelize, DataTypes);
  var pics = _pics(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  captions.belongsTo(pics, { as: "pic", foreignKey: "pics_id"});
  pics.hasMany(captions, { as: "captions", foreignKey: "pics_id"});
  captions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(captions, { as: "captions", foreignKey: "user_id"});

  return {
    captions,
    pics,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
