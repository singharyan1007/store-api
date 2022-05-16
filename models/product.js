const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
        values: ["ikea", "liddy", "caressa", "marcos"],
        message:'{VALUE} is not supported '
    },
    // enum:['ikea','Liddy','caressa','marcos']
    //to limit the number of options for this property we basically use enum
  },
});
module.exports = mongoose.model('Product', productSchema);