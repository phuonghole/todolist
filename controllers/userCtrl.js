const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCtrl = {
  register: async (req, res) => {
    try {
      // res.json(req.body)
      const { username, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The email already exists" });
      if (password.length < 6)
        return res.status(400).json({ msg: "password is at the 6 char" });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await Users({ username, email, password: passwordHash });
      //   res.json({ newUser });
      await newUser.save();
      const accesstoken = createAccessToken({ id: newUser._id });
      // res.json({ accesstoken });
      const refreshtoken = createRefreshToken({ id: newUser._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/users/refresh_token",
      });
      res.json({ refreshtoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      //   chưa đăng nhập hoặc đăng kí
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });
      jwt.verify(rf_token, process.env.REFRESH, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exists" });
      const isWatch = await bcrypt.compare(password, user.password);
      if (!isWatch) return res.status(400).json({ msg: "incorrect password" });
      const accesstoken = createAccessToken({ id: user._id });
      // res.json({ accesstoken });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/users/refresh_token",
      });
      res.json({ refreshtoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/users/refresh_token" });
      return res.status(400).json({ msg: "Logout" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS, { expiresIn: "1d" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH, { expiresIn: "7d" });
};
module.exports = userCtrl;
