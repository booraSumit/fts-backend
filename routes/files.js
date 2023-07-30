const express = require("express");
const router = express.Router();
const expressFileUpload = require("express-fileupload");
const { File, fileValidate } = require("../models/file");
const _ = require("lodash");
const { User } = require("../models/user");
const socketServer = require("../startup/socket");
const io = socketServer.getIO();
const socketIds = require("../util/socketIds");
// Define the route for file upload
router.post("/", expressFileUpload(), async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "No files were uploaded" });
  }

  //Access the uploaded file from the request object and if only single file change to it array
  let files = req.files.files;
  if (!Array.isArray(files)) files = [files];

  //  Validate file type and size
  for (let i = 0; i < files.length; i++)
    if (
      files[i].mimetype !== "application/pdf" ||
      files[i].size > 10 * 1024 * 1024
    )
      return res.status(400).send("Only PDF files less than 10MB are allowed");
  const fileNames = files.map((file) => {
    return { file_name: req.body.file_id + file.name };
  });

  const { error } = fileValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let file = await File.findOne({ file_id: req.body.file_id });
  if (file) return res.status(400).send("Duplicate File Id Not Allowed");

  let user = await User.findOne({
    department_id: req.body.recipient_department_id,
  });
  if (!user) return res.status(400).send("Invalid Request");

  // try {
  for (let i = 0; i < files.length; i++)
    // files[0].mv(`uploadedFiles/ ${req.body.file_id + files[i].name}`);
    console.log(files[i]);

  // file = new File({
  //   ..._.pick(req.body, [
  //     "file_id",
  //     "sender_id",
  //     "recipient_department_id",
  //     "subject",
  //     "description",
  //   ]),
  //   files: fileNames,
  // });
  // await file.save();

  //   await User.findByIdAndUpdate(
  //     req.body.sender_id,
  //     {
  //       $push: { files: { file_id: file?._id } },
  //     },
  //     { new: true }
  //   );

  //   res.status(200).send("File uploaded and information saved successfully");
  // } catch (error) {
  //   console.error(
  //     "Error occurred while uploading the file and saving information:",
  //     error
  //   );
  res
    .status(500)
    .send("Error occurred while uploading the file and saving information");
  // }

  //  Move the file to the desired location
  // file.mv("uploads/" + file.name, (err) => {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .json({ error: "Error occurred while uploading the file" });
  //   }

  // });
});

module.exports = router;
