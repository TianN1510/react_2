var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
const JWT = require('jsonwebtoken');
const config = require('../config');
const checkToken = require('./checkToken');


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Đăng ký người dùng
 *     responses:
 *        200:
 *         description: Đăng Ký Thành Công
 *        400:
 *          description: Error
 *       
 */


router.post('/register', async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const currentUser = await userModel.findOne({ email });
    if (currentUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }
    const newUser = new userModel({ name, email, password });
    await newUser.save();
    res.status(200).json({ message: "Đăng Ký Thành Công" });
  } catch (error) {
    res.status(400).json({ message: "Lỗi xảy ra" });
  }
});



/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Đăng nhập
 *     responses:
 *        200:
 *         description: Đăng nhập thành công
 *        400:
 *          description: Email hoặc mật khẩu không đúng
 *       
 */

router.post('/login', async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }
    const token = JWT.sign({ email: email, data: "ahhhihi" }, config.SECRETKEY, { expiresIn: '1d' });
    const refreshToken = JWT.sign({ email: email, data: "ahhhihi" }, config.SECRETKEY, { expiresIn: '10d' });

    res.status(200).json({ token, refreshToken, user });
  } catch (error) {
    res.status(400).json({ message: "Lỗi" });
  }
})

router.post("/refreshToken", async (req, res, next) => {
  const { refreshToken } = req.body;
  JWT.verify(refreshToken, config.SECRETKEY, async (err) => {
    if (err) {
      res.status(403).json({ err: err })
    } else {
      var newToken = JWT.sign({ "data": "ahhiihi" }, config.SECRETKEY, { expiresIn: '30s' });
      res.status(200).json({ token: newToken })
    }
  })
})

module.exports = router;
