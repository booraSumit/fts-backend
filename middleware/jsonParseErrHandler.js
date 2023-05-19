module.exports = async function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
};
