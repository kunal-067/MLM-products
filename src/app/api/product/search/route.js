import Product from "@/lib/models/products";
import {
    NextResponse
} from "next/server";

export async function GET(req) {
    const url = new URL(req.url);
    const query = new URLSearchParams(url.searchParams);
    const key = query.get("key");
    const page = query.get("page");
    const size = query.get("size");
    try {
        const products = await Product.find({
                $text: {
                    $search: key
                }
            }, {
                score: {
                    $meta: 'textScore'
                }
            })
            .sort({
                score: {
                    $meta: 'textScore'
                }
            }).skip((page || 0) * (size || 20)).limit(size || 20); // Sort by relevance score

            return NextResponse.json({message:'Products fetched successfully !', products});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:'Internal server error ! try later', error:error.message}, {status:500})
    }
}