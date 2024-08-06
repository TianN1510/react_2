const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // Sửa kiểu dữ liệu thành String
});

module.exports = mongoose.models.User || mongoose.model('user', user);
