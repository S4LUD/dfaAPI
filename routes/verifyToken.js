const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ message: "Access-Denied" });

  try {
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
};
