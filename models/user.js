const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 50,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: {
    type: Date,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

const userValidate = (user) => {
  const schema = Joi.object({
    isAdmin: Joi.boolean().required(),
    user_id: Joi.string().hex().length(24).required(),

    new_user: Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().min(8).max(50).required(),
      department_id: Joi.string().hex().length(24).required(),
    })
      .options({ presence: "required" })
      .required(),
  });

  return schema.validate(user);
};

exports.validate = userValidate;
exports.User = User;
