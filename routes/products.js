var express = require('express');
var router = express.Router();
var productModel = require("../models/product");
var cateModel = require("../models/category");
var sendMail = require("../others/upload")
var upload = require("../others/upload");
//san-pham
router.post('/add', async function (req, res, next) {
    try {
        const { name, price, quantity, image, category } = req.body;
        const newItemProduct = { name, price, quantity, image, category };
        await productModel.create(newItemProduct);
        res.json(newItemProduct);
    } catch (e) {
        console.log({ "status": false, message: "Thất bại", e });
    }
});

// LẤY THÔNG TIN TẤT CẢ SẢN PHẨM
router.get('/list', async function (req, res, next) {
    try {
        var allList = await productModel.find({}, "id name price quantity image category");
        res.status(200).json(allList);
    } catch (e) {
        res.status(400).json({ "status": false, "message": "Thất Bại" });
    }
});

// lẤY THÔNG TIN SẢN PHẨM THEO ID 
router.get('/productById', async function (req, res, next) {
    try {
        const { id } = req.query;
        const product = await productModel.findById(id).select("name price quantity category");
        if (!product) {
            return res.status(400).json({ "status": false, "message": "Thất bại" });
        }
        res.status(200).json(product);
    } catch (e) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }

});

//Lấy tên và giá của tất cả các sản phẩm
router.get('/nameAndprice', async function (req, res, next) {
    try {
        var nameAndprice = await productModel.find({}, ('name price'))
        res.status(200).json(nameAndprice);
    } catch (e) {
        res.status(400).json({ "status": false, "message": "Thất Bại" })
    }
});

//Lấy thông tin các sản phẩm có giá trên 1000
router.get('/productGT', async function (req, res, next) {
    try {
        var productGT = await productModel.find({ price: { $gt: 1000 } }, 'name price quantity');
        res.status(200).json(productGT);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất Bại" }, error);
    }
});

//Lấy thông tin các sản phẩm thuộc loại 'Bánh'
router.get('/typeOf', async function (req, res, next) {
    try {
        const name = req.query.name;
        const idCate = await cateModel.findOne({ name: name })
        const list = await productModel.find({ category: idCate._id }).populate('category', 'name');
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ error: "lỗi" });
    }
});

//Đếm số lượng sản phẩm trong mỗi loại (countDocuments)

//

//Lấy thông tin sản phẩm có số lượng ít hơn 10

router.get('/productLT', async function (req, res, next) {
    try {
        const productLT = await productModel.findOne({ quantity: { $lt: 10 } }, 'name price quantity')
        res.status(200).json(productLT);
    } catch (error) {
        res.status(400).json({ error: "Lỗi" });
    }
});
//Cập nhật giá của sản phẩm theo ID, với giá người dùng truyền vào

router.post('/editPrice', async function (req, res, next) {
    try {
        const { id, price } = req.body;
        const priceEdit = await productModel.findById(id);
        if (priceEdit) {
            priceEdit.price = price ? price : priceEdit.price;
            await priceEdit.save();
            res.status(200).json({ "status": true, "message": "thành công" });
        } else {
            res.status(400).json({ "status": false, "message": "Thất bại" });
        }
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

//Xóa sản phẩm theo ID
router.get('/deleteById', async (req, res, next) => {
    try {
        const { id } = req.query;
        await productModel.findByIdAndDelete(id);
        res.status(200).json({ "status": true, "message": "Thành công" })
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

//Lấy các sản phẩm có giá trong khoảng từ 500 đến 1500

router.get('/productInRange', async (req, res, next) => {
    try {
        const productInRange = await productModel.find({ price: { $gte: 500, $lte: 1500 } }, 'name price quantity');
        res.status(200).json(productInRange);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

//Lấy tên và số lượng của các sản phẩm có số lượng lớn hơn 20
router.get('/nameAndquantityGT', async (req, res, next) => {
    try {
        const nameAndquantityGT = await productModel.find({ quantity: { $gt: 20 } }, 'name quantity')
        res.status(200).json(nameAndquantityGT);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }

});

// name: { $regex: keyword, $options: 'i' }
//Lấy các sản phẩm có tên chứa từ khóa 'phone'
router.get('/productKeyword', async (req, res, next) => {
    try {
        const productKeyword = await productModel.find({ name: { $regex: 'phone', $options: 'i' } }, 'name price quantity ');
        res.status(200).json(productKeyword);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

//Lấy thông tin sản phẩm đắt nhất
router.get('/mostExpensive', async (req, res, next) => {
    try {
        const mostExpensive = await productModel.find({}, 'name price quantity').sort({ price: -1 }).limit(1);
        res.status(200).json(mostExpensive);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
})

//Lấy thông tin sản phẩm rẻ nhất nhất
router.get('/mostCheap', async (req, res, next) => {
    try {
        const mostCheap = await productModel.find({}, 'name price quantity').sort({ price: 1 }).limit(1);
        res.status(200).json(mostCheap);
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

//Lấy giá trung bình của các sản phẩm
router.get('/giaTrungBinh', async (req, res, next) => {
    try {
        const products = await productModel.find({}, 'price');
        const tong = products.reduce((acc, product) => acc + product.price, 0);
        const trungBinh = tong / products.length;
        res.status(200).json({ "giaTrungBinh": trungBinh });
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
})

//(*)Tính tổng giá trị của tất cả các sản phẩm (số lượng * giá)

router.get('/tongGiaTri', async (req, res, next) => {
    try {
        const products = await productModel.find({}, 'price quantity');
        const tongGiaTri = products.reduce((acc, product) => acc + (product.price * product.quantity), 0)
        res.status(200).json({ "Tong Gia Tri": tongGiaTri });
    } catch (error) {
        res.status(400).json({ "status": false, "message": "Thất bại" });
    }
});

// send mail 
var fs = require('fs');
const  path  = require('path');
router.post("/send-mail", async function (req, res, next) {
    try {
        const { to, subject } = req.body;

        const mailHtml = fs.readFileSync(path.join(__dirname, '../html/content.html'), 'utf-8');

        const mailOptions = {
            from: "TienNe<tonystarkmarkell@gmail.com>",
            to: to,
            subject: subject,
            html: mailHtml
        };
        await sendMail.transporter.sendMail(mailOptions);
        res.json({ status: 1, message: "Gửi mail thành công" });
    } catch (err) {
        res.json({ status: 0, message: "Gửi mail thất bại" });
    }
});

router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
               return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://192.168.1.6:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });





module.exports = router;