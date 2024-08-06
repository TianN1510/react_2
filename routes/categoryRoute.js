var express = require('express');
var router = express.Router();
var cateModel = require("../models/category");
const { route } = require('.');
// /danh-muc/add
router.post('/add', async function (req, res, next) {
    const { name } = req.body;
    const newItem = { name };
    await cateModel.create(newItem);
    res.json(newItem);
});


router.get('/list', async function (req, res, next) {
    try {
        var list = await cateModel.find({}, 'name');
        res.status(200).json(list);
    } catch (e) {

    }
});



router.post('/edit', async function (req, res, next) {
    try {
        const { id, name } = req.body;

        const itemEdit = await cateModel.findById(id);
        if (itemEdit) {
            itemEdit.name = name ? name : itemEdit.name;

            await itemEdit.save();

            res.status(200).json({ "status": true, "message": "Thành Công" });
        } else {
            res.status(400).json({ "status": false, "message": "Thất Bại" })
        }
    } catch (e) {
        res.status(400).json({ "status": false, "message": "Thất Bại" })
    }
})

router.get('/delete', async function (req, res, next) {
    try {
        const { id } = req.query;
        await cateModel.findByIdAndDelete(id);
        res.status(200).json({ "status": true, "message": "Thành Công" });
        
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất Bại" })
    }
});




module.exports = router;