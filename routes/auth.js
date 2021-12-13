const router = require("express").Router();
const userScheme = require("../models/userScheme");
const saleScheme = require("../models/saleScheme");
const transactionScheme = require("../models/transactionScheme");
const bcrypt = require("bcryptjs");
const { regScheme, logScheme, adminScheme } = require("../models/validation");
const timeScheme = require("../models/timeScheme");

router.post("/meeting", async (req, res) => {
  const data = new timeScheme({
    content: req.body.content,
    data_time: req.body.data_time,
  });

  try {
    const UReg = await data.save();
    res.send(UReg);
  } catch (err) {
    res.status(400).send({ message: err["message"] });
  }
});

//Get all meetings
router.get("/meeting", async (req, res) => {
  const data = await timeScheme.find();
  try {
    res.send(data);
  } catch (err) {
    res.status(400).send({ message: err["message"] });
  }
});

//Register the user
router.post("/register", async (req, res) => {
  const { error } = regScheme(req.body);
  if (error)
    return res.status(400).send({ message: error["details"][0]["message"] });

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
      load_balance: 0,
      simcard_balance: 0,
      pocketwifi_balance: 0,
      load_overall: 0,
      load_distributed: 0,
      pocketwifi_overall: 0,
      pocketwifi_distributed: 0,
      simcard_overall: 0,
      simcard_distributed: 0,
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
    if (error)
      return res.status(400).send({ message: error["details"][0]["message"] });

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

    if (setStat) return res.send({ message: "OK", _id: user._id });
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
router.get("/data/:type", async (req, res) => {
  try {
    const data = await userScheme.find({
      type: { $in: req.params.type },
    });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get admin data
router.get("/admin/:adminID", async (req, res) => {
  try {
    const data = await userScheme.find({
      _id: { $in: req.params.adminID },
    });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Update admin
router.patch(
  "/updateadmin/:id/:name/:mobile_number/:area_located/:address",
  async (req, res) => {
    try {
      const data = await userScheme.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            name: req.params.name,
            mobile_number: req.params.mobile_number,
            area_located: req.params.area_located,
            address: req.params.address,
            image: req.body.image,
          },
        }
      );
      res.send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

//Update DSP password
router.patch("/updateuserpassword", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const HashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const data = await userScheme.updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: {
          password: HashedPassword,
        },
      }
    );
    if (data) return res.send({ message: "OK" });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Update DSP photo
router.patch("/updpateuserphoto", async (req, res) => {
  try {
    const data = await userScheme.updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: {
          image: req.body.image,
        },
      }
    );
    if (data) return res.send({ message: "OK" });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Patch balance admin
router.patch("/sale/:id/:type/:balance", async (req, res) => {
  try {
    if (req.params.type === "load") {
      const data = await saleScheme.updateOne(
        {
          uid: req.params.id,
        },
        {
          $inc: { load_balance: req.params.balance },
        }
      );
      res.send(data);
    } else if (req.params.type === "simcard") {
      const data = await saleScheme.updateOne(
        {
          uid: req.params.id,
        },
        {
          $inc: { simcard_balance: req.params.balance },
        }
      );
      res.send(data);
    } else if (req.params.type === "pocketwifi") {
      const data = await saleScheme.updateOne(
        {
          uid: req.params.id,
        },
        {
          $inc: { pocketwifi_balance: req.params.balance },
        }
      );
      res.send(data);
    } else {
      res.send("Type wrong");
    }
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

//Patch DSP Sales
router.patch("/loadsale", async (req, res) => {
  try {
    const data = await saleScheme.updateOne(
      {
        uid: req.body.id,
      },
      {
        $inc: {
          load_balance: req.body.load_balance,
          load_distributed: req.body.load_distributed,
          load_overall: req.body.load_overall,
        },
      }
    );
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

//Add customer load trans
router.post("/customerload", async (req, res) => {
  try {
    const data = new transactionScheme({
      uid: req.body.uid,
      type: req.body.type,
      name: req.body.name,
      amount: req.body.amount,
      mobile_number: req.body.mobile_number,
    });

    const URegs = await data.save();
    if (URegs) return res.send(URegs);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Add customer pocketwif simcard detail
router.post("/customerpocsim", async (req, res) => {
  try {
    const data = new transactionScheme({
      uid: req.body.uid,
      type: req.body.type,
      name: req.body.name,
      amount: req.body.amount,
      mobile_number: req.body.mobile_number,
      price: req.body.price,
    });

    const URegs = await data.save();
    if (URegs) return res.send(URegs);
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

module.exports = router;
