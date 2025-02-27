const express = require("express");
const router = express.Router();
const User  = require("../models/user");

router.post("/login", async (req, res, next) => {
   try {
      const user = await User.login(req.body);
      res.status(200).json({user});
   } catch(error) {
      next(error);
   }
});

router.post("/register", async (req, res, next) => {
   try {
      const user = await User.register(req.body);
      res.status(201).json({user});
   } catch(error) {
      next(error);
   }
});

module.exports = router;