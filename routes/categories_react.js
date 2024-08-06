var express = require('express');
var router = express.Router();
var cate_reactModel = require('../models/category_react');
const checkToken = require('../routes/checkToken');






/**
 * @swagger
 * /type-course/add:
 *   post:
 *     summary: Thêm danh sách Khóa học
 *     responses:
 *        200:
 *         description: Thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *        400:
 *          description: Thất bại
 *       
 */
router.post('/add', async (req, res, next) => {

    const { name, price, image } = req.body;
    const newItem = { name, price, image };
    await cate_reactModel.create(newItem);
    res.json(newItem);
});

/**
 * @swagger
 * /type-course/list:
 *   get:
 *     summary: Lấy danh sách khóa học
 *     responses:
 *        200:
 *         description: Lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *        400:
 *          description: Thất bại
 *       
 */

router.get('/list', async (req, res, next) => {
    var list = await cate_reactModel.find({}, 'name price image');
    res.status(200).json(list);
});

router.post('/edit', async function (req, res, next) {
    try {
        const { id, name, price, image } = req.body;

        const itemEdit = await cate_reactModel.findById(id);
        if (itemEdit) {
            itemEdit.name = name ? name : itemEdit.name;
            itemEdit.price = price ? price : itemEdit.price;
            itemEdit.image = image ? image : itemEdit.image;
            await itemEdit.save();

            res.status(200).json({ "status": true, "message": "Thành Công" });
        } else {
            res.status(400).json({ "status": false, "message": "Thất Bại" });
        }
    } catch (e) {
        res.status(400).json({ "status": false, "message": "Thất Bại" })
    }
});

router.get('/delete', async function (req, res, next) {
    try {
        const { id } = req.query;
        await cate_reactModel.findByIdAndDelete(id);
        res.status(200).json({ "status": true, "message": "Thành Công" });

    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất Bại" })
    }
});
module.exports = router;