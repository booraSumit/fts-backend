const mongoose = require("mongoose");
const Joi = require("joi");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: {
    type: Date,
  },
});

const Department = mongoose.model("Department", departmentSchema);

const departmentValidate = (depart) => {
  const schema = Joi.object({
    name: Joi.string().max(50).min(3).required(),
    description: Joi.string().max(200).min(10).optional(),
  }).min(2);

  return schema.validate(depart);
};

exports.validate = departmentValidate;
exports.Department = Department;
