const Joi = require("joi");
const { Admin } = require("../models/admin");

module.exports = async function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (!req.body?.isAdmin) return res.status(403).send("Access denied.");
  const { error, value } = Joi.object({
    isAdmin: Joi.boolean().required(),
    user_id: Joi.string().hex().length(24).required(),
  })
    .options({ allowUnknown: true })
    .validate(req.body);
  if (error) return res.status(403).send(error.details[0].message);
  let admin = await Admin.findById(req.body.user_id);
  if (admin && admin.isAdmin == false)
    return res.status(403).send("Access denied");

  next();
};
