import { connectDb } from "@/utils/api/dbconnect";
import mongoose from "mongoose"

await connectDb();
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: "text",
    },
    description: {
        type: String
    },
    images: [String],

    cv: {
        type: Number,
        required: true
    },
    cvDiscount:{
        type:Number,
        default:0,
        min:0,
        max:100
    },

    mrp:{
        type:Number,
        required:true
    },
    sp: {
        type: Number,
        required: true
    },

    quantity:{
        type:Number,
        required:true
    }
}, {
    timestamps: true
});


const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;

