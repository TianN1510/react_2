var express = require('express');
var router = express.Router();
var products_reactModel = require('../models/product_react');
var upload = require("../others/upload");
var cate_reactModel = require('../models/category_react');
const JWT = require('jsonwebtoken');
const config = require('../config');
const checkToken = require('./checkToken');
// localhost:3000/course/add
router.post('/add', async function (req, res, next) {
    try {
        const { name, price, image, category_react } = req.body;
        const newItemProduct = { name, price, image, category_react };
        await products_reactModel.create(newItemProduct);
        res.json(newItemProduct);
    } catch (e) {
        console.log({ "status": false, message: "Thất bại", e });
    }
});


/**
 * @swagger
 * /course/list:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     requestbody:
 *     required: true
 *     responses:
 *        200:
 *         description: Trả về danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *        400:
 *          description: Error
 *       
 */


/**
 * @swagger
 * /course/add:
 *   post:
 *     summary: Thêm danh sách sản phẩm
 *     requestbody:
 *     required: true
 *     responses:
 *        200:
 *         description: Trả về danh sách sản phẩm đã thêm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *        400:
 *          description: Error
 *       
 */
router.get('/list',checkToken, async function (req, res, next) {
    try {
        const allList = await products_reactModel.find({}, 'name price image category_react');
        res.status(200).json(allList);
    } catch (error) {
        res.status(404).json({ "status": false, "message": "Lỗi" })
    }

});

router.get('/delete', async (req, res, next) => {
    try {
        const { id } = req.query;
        await products_reactModel.findByIdAndDelete(id);
        res.status(200).json({ "status": true, "message": "Thành công" })
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});



router.get('/courseByCategory', async function (req, res, next) {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: "ID danh mục không được để trống" });
        }
        const course = await products_reactModel.find({ category_react: id }).populate('category_react', 'name');
        if (course.length === 0) {
            return res.status(404).json({ error: "Không có sản phẩm nào trong danh mục này" });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ error: "Lỗi khi lấy sản phẩm theo danh mục", details: error.message });
    }
});


//upload image ---- ko up len server ---ko du mb ---
// router.post('/uploads', [upload.array('image', 9)],
//     async (req, res, next) => {
//         try {
//             const { files } = req;
//             if (!files) {
//                 return res.json({ status: 0, link: [] });
//             } else {
//                 const url = [];
//                 for (const singleFile of files) {
//                     url.push(`http://192.168.1.11:3000/images/${singleFile.filename}`);
//                 }
//                 return res.json({ status: 1, url: url });
//             }
//         } catch (error) {
//             console.log('Upload image error: ', error);
//             return res.json({ status: 0, link: [] });
//         }
//     });


module.exports = router;