const router = require("express").Router();
const userScheme = require("../models/userScheme");
const saleScheme = require("../models/saleScheme");
const transactionScheme = require("../models/transactionScheme");
const bcrypt = require("bcryptjs");
const { regScheme, logScheme, adminScheme } = require("../models/validation");
//const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//dotenv.config();

//Register the user
router.post("/register", async (req, res) => {
  const { error } = regScheme(req.body);
  if (error) return res.status(400).send(error["details"][0]["message"]);

  const numberExist = await userScheme.findOne({
    mobile_number: req.body.mobile_number,
  });
  if (numberExist)
    return res.status(400).send({ message: "Number already exist!" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const data = new userScheme({
    name: req.body.name,
    mobile_number: req.body.mobile_number,
    address: req.body.address,
    area_located: req.body.area_located,
    password: hashedPassword,
  });

  try {
    const sale = new saleScheme({
      uid: data._id,
      sales: {
        load: { overall: "0", distributed: "0", balance: "0" },
        pocketwifi: { overall: "0", distributed: "0", balance: "0" },
        simcard: { overall: "0", distributed: "0", balance: "0" },
      },
    });

    const UReg = await data.save();
    const URegs = await sale.save();

    res.send({ message: "OK" });
  } catch (err) {
    res.status(400).send({ message: err["message"] });
  }
});

//Check user if exist
router.post("/login", async (req, res) => {
  try {
    const { error } = logScheme(req.body);
    if (error) return res.status(400).send(error["details"][0]["message"]);

    const user = await userScheme.findOne({
      mobile_number: req.body.mobile_number,
    });
    if (!user) return res.status(400).send({ message: "Number not found!" });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(400).send({ message: "Email or Password is wrong!" });

    const setStat = await userScheme.updateOne(
      {
        mobile_number: req.body.mobile_number,
      },
      { $set: { ustat: true } }
    );

    res.send({ message: "OK" });

    //const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    //res.header("auth-token", token).send(token);
  } catch (err) {
    res.status(400).send({ message: err["message"] });
  }
});

//Check admin if exist
router.post("/admin/:user/:pass", async (req, res) => {
  try {
    const user = await userScheme.findOne({
      type: req.params.user,
    });
    if (!user) return res.status(400).send({ message: "Invalid Credentials" });

    const validPass = await bcrypt.compare(req.params.pass, user.password);
    if (!validPass)
      return res.status(400).send({ message: "Invalid Credentials" });

    const setStat = await userScheme.updateOne(
      {
        type: req.body.type,
      },
      { $set: { ustat: true } }
    );

    res.send({ _id: user._id });
  } catch (err) {
    res.status(400).send({ message: err["message"] });
  }
});

//Logout user
router.patch("/logout", async (req, res) => {
  try {
    const data = await userScheme.updateOne(
      {
        mobile_number: req.body.mobile_number,
      },
      { $set: { ustat: false } }
    );
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Check user number if existed
router.get("/find", async (req, res) => {
  try {
    const data = await userScheme.findOne({
      mobile_number: req.body.mobile_number,
    });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get all users
router.get("/data", async (req, res) => {
  try {
    const data = await userScheme.find();
    console.log("All Data Fetched.");
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get DSP Sales
router.get("/sale/:userID", async (req, res) => {
  try {
    const data = await saleScheme.find({
      uid: { $in: req.params.userID },
    });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get customer detail
router.get("/customer/:detailID", async (req, res) => {
  try {
    const data = await transactionScheme.find({
      uid: { $in: req.params.detailID },
    });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

// router.delete("/delete/:dataID", async (req, res) => {
//   try {
//     const data = await User.deleteOne({ _id: req.params.dataID });
//     res.send(data);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// router.patch("/update/:dataID", async (req, res) => {
//   try {
//     const data = await User.updateOne(
//       { _id: req.params.dataID },
//       { $set: { move: req.body.move, csteps: req.body.csteps } }
//     );
//     res.send(data);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

module.exports = router;
