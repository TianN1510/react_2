const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const detail = new Schema({
    id: { type: ObjectId }, //khóa chính
    name: { type: String },
    image: { type: String },
    descriptions: { type: String },  
    ready: { type: String},
    start: { type: String},
    implement: { type: String},
    finish: { type: String},
    note:{type: String},
    product_react: { type: ObjectId, ref: 'product_react' } //khóa ngoại
});
module.exports = mongoose.models.detail || mongoose.model('detail', detail);
