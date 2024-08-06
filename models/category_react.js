var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const category_react = new Schema({
  id: { type: ObjectId },// khóa chính
  name: { type: String },
  price: { type: Number },
  image: { type: String },
});
module.exports = mongoose.models.category_react || mongoose.model('category_react', category_react);