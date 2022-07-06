const Model = require("../model");

exports.getUser = (data) => {
  return Model.Registration.findOne({
    where: { email: data.email },
  });
};

exports.getUsers = (data) => {
  return Model.Registration.findOne({
    where: { email: data },
  });
};

exports.addUser = (data) => {
  return Model.Registration.create(data);
};

exports.logUseremail = (data) => {
  return Model.Registration.findOne({
    where: { email: data.email },
  });
};

exports.getdata = (userId) => {
  return Model.Registration.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
};

exports.getdatas = (userId) => {
  return Model.Registration.findByPk(userId, {});
};

exports.updatepassword = (userId, hash) => {
  return Model.Registration.update(
    { password: hash },
    { where: { userId: userId } }
  );
};
