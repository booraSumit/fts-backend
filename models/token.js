const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  device_id: { type: String, required: true },
  token: { type: String, required: true },
});

const Token = mongoose.model("Token", tokenSchema);

exports.Token = Token;
