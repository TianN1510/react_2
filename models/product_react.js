const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const product_react = new Schema({
    id: { type: ObjectId }, //khóa chính
    name: { type: String },
    image: { type: String },
    category_react: { type: ObjectId, ref: 'category_react' } //khóa ngoại
});
module.exports = mongoose.models.product_react || mongoose.model('product_react', product_react);
