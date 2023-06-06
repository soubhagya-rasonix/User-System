'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.STRING,
    otp: DataTypes.STRING,
    otp_exp_time: DataTypes.STRING,
    phone_verified_at: DataTypes.STRING,
    email_verified_at: DataTypes.STRING,
    profile_pic: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    blocked: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};