import Product from "@/lib/models/products";
import {
    NextResponse
} from "next/server";

//get particular product ---
export async function GET(req, {
    params
}) {
    try {
        const product = await Product.findById(params._id);
        if (!product) {
            return NextResponse.json({
                message: "Product not found ! invalid _id",
                data: []
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            product,
            message: "Successfully fetched product !"
        })
    } catch (error) {
        console.log('error in get prod by id', error.message);
        return NextResponse.json({
            message: "Something went wrong while getting product !",
            data: [],
            error:error.message
        }, {
            status: 500
        })
    }
}
