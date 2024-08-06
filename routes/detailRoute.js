var express = require('express');
var router = express.Router();
var detailModel = require('../models/detail');
var products_reactModel = require('../models/product_react');




/**
 * @swagger
 * /detail/add:
 *   post:
 *     summary: Thêm danh sách sản phẩm chi tiết
 *     responses:
 *        200:
 *         description: Thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             properties:
 *                name:
 *                 type: string
 *                ready:
 *                 type: string
 *                descriptions:
 *                 type: string
 *                start:
 *                 type: string
 *                implement:
 *                 type: string
 *                finish:
 *                 type: string
 *                image:
 *                 type: string  
 *                note:
 *                  type: string 
 *        400:
 *          description: Thất bại
 *       
 */
router.post('/add', async function (req, res, next) {
    try {
        const { name, image, descriptions, ready, start, implement, finish, note, product_react } = req.body;
        const newItem = { name, image, descriptions, ready, start, implement, finish, note, product_react };
        await detailModel.create(newItem);
        res.json(newItem);
    } catch (e) {
        console.log({ "status": false, message: "Thất bại", e });
    }
});

/**
 * @swagger
 * /detail/list:
 *   get:
 *     summary: Thêm danh sách sản phẩm chi tiết
 *     responses:
 *        200:
 *         description: Thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             properties:
 *                name:
 *                 type: string
 *                ready:
 *                 type: string
 *                descriptions:
 *                 type: string
 *                start:
 *                 type: string
 *                implement:
 *                 type: string
 *                finish:
 *                 type: string
 *                image:
 *                 type: string  
 *                note:
 *                  type: string 
 *        400:
 *          description: Thất bại
 *       
 */
router.get('/list', async function (req, res, next) {
    try {
        const allList = await detailModel.find();
        res.status(200).json(allList);
    } catch (error) {
        res.status(404).json({ "status": false, "message": "Lỗi" })
    }
});



router.post('/edit', async function (req, res, next) {
    try {
        const { id, name, image, descriptions, ready, start, implement, finish, note, product_react } = req.body;

        const itemEdit = await detailModel.findById(id);
        if (itemEdit) {
            itemEdit.name = name ? name : itemEdit.name;
            itemEdit.image = image ? image : itemEdit.image;
            itemEdit.descriptions = descriptions ? descriptions : itemEdit.descriptions;
            itemEdit.ready = ready ? ready : itemEdit.ready;
            itemEdit.start = start ? start : itemEdit.start;
            itemEdit.implement = implement ? implement : itemEdit.implement;
            itemEdit.finish = finish ? finish : itemEdit.finish;
            itemEdit.note = note ? note : itemEdit.note;
            itemEdit.product_react = product_react ? product_react : itemEdit.product_react;
            await itemEdit.save();
            res.status(200).json({ "status": true, "message": "Thành Công" });
        } else {
            res.status(400).json({ "status": false, "message": "Thất Bại" })
        }
    } catch (e) {
        res.status(400).json({ "status": false, "message": "Thất Bại" })
    }
});

// xóa theo id 
router.get('/delete', async (req, res, next) => {
    try {
        const { id } = req.query;
        await detailModel.findByIdAndDelete(id);
        res.status(200).json({ "status": true, "message": "Thành công" })
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

router.get('/detailByProductID', async function (req, res, next) {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: "ID danh mục không được để trống" });
        }
        const detail = await detailModel.find({ product_react: id }).populate('product_react', 'id name');
        if (detail.length === 0) {
            return res.status(404).json({ error: "Không có sản phẩm nào trong danh mục này" });
        }

        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ error: "Lỗi khi lấy sản phẩm theo danh mục", details: error.message });
    }
});




module.exports = router