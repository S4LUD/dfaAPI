const Joi = require("joi");

const regScheme = (data) => {
  const schemaReg = Joi.object({
    name: Joi.string().required(),
    mobile_number: Joi.string().max(11).min(11).required(),
    area_located: Joi.string().required(),
    address: Joi.string().required(),
    password: Joi.string().min(6).max(16).required(),
  });
  return schemaReg.validate(data);
};

const logScheme = (data) => {
  const schemaLog = Joi.object({
    mobile_number: Joi.string().max(11).min(11).required(),
    password: Joi.string().min(6).max(16).required(),
    //confirm_password: Joi.string().min(6).max(16).required(),
  });
  return schemaLog.validate(data);
};

const adminScheme = (data) => {
  const schemaAdm = Joi.object({
    type: Joi.string().required(),
    password: Joi.string().min(6).max(16).required(),
    name: Joi.string().required(),
    mobile_number: Joi.string().max(11).min(11).required(),
    area_located: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string().required(),
  });
  return schemaAdm.validate(data);
};

module.exports.regScheme = regScheme;

module.exports.logScheme = logScheme;

module.exports.adminScheme = adminScheme;
