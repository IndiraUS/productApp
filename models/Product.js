import mongoose, { model } from "mongoose";

// creating a schema for product details
const productSchema = new mongoose.Schema({
    p_url: { type: String, required: true, unique: true },
    p_name: { type: String, required: true },
    p_desc: { type: String, required: true },
    p_price: { type: String, required: true },
    p_rating: { type: String }
}, { timestamp: true });

// creating a model from schema
const Product = mongoose.model('Product', productSchema);

export default  Product;
