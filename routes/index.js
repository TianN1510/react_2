var express = require('express');
var router = express.Router();
var modelCate = require('../models/category_react');
var modelProd = require('../models/product_react');
var modelDetail = require('../models/detail');

/* GET home page. */
router.get('/', async function (req, res, next) {
  var _list = await modelProd.find()
  res.render('index', { title: "Quản lý sản phẩm", list: _list });
});


/* GET home page. */
//http://localhost:3000/
//thêm
//localhost:3000/add
//hiển thị trang thêm
router.get('/add', async function (req, res, next) {

  var listCate = await modelCate.find();

  res.render('add', { listCate: listCate });
});

//xử lý form trang thêm
router.post('/add-product', async function (req, res, next) {
  const { name, price, image, category_react } = req.body;

  const newItem = { name, price, image, category_react };
  await modelCate.create(newItem);

  res.redirect("/");

});

router.post('/edit/:id', async function (req, res, next) {
  const { id } = req.params;
  const { name, price, quantity, image } = req.body;
  await modelProd.findByIdAndUpdate(id, { name, price, quantity,image });
  res.redirect("/");
});

//localhost:3000/delete/12233
router.get("/delete/:id", async function (req, res, next) {
  const { id } = req.params;
  await modelProd.findByIdAndDelete(id);
  res.redirect("/");
});

module.exports = router;


