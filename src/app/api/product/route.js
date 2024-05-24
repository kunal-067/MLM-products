import {
    findByIdAndDelete
} from "@/lib/models/orders";
import Product from "@/lib/models/products";
import {
    User
} from "@/lib/models/user";
import {
    headers
} from "next/headers";
import {
    NextResponse
} from "next/server";
import {
    v2 as cloudinary
} from 'cloudinary';

cloudinary.config({
    cloud_name: 'dj3cuvcul',
    api_key: '732658812763723',
    api_secret: process.env.CLOUDINARY_SECRET || '1_uEyTactU7jySG5Ye0r5TOpGeA'
});

export async function GET(req) {
    const url = new URL(req.url);
    const query = new URLSearchParams(url.searchParams);
    const size = parseInt(query.get('size'));
    try {
        const products = await Product.aggregate([{
                $sample: {
                    size: size || 20
                }
            },
            {
                $addFields: {
                    image: { $first: '$images' } 
                }
            }
        ]);

        return NextResponse.json({
            message: 'Products fetched successfully !',
            products
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: 'Internal server error ! try later',
            error: error.message
        })
    }
}

export async function POST(req, res) {
    try {
        const formData = await req.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const mrp = formData.get('mrp');
        const sp = formData.get('sp');
        const cv = formData.get('cv');
        const cvDiscount = formData.get('cvDiscount');
        const quantity = formData.get('quantity'); 

        const files = formData.getAll('images');

        const header = headers();
        const userId = header.get('userId');
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return NextResponse.json({
                message: 'Unauthorized access you are not an admin !'
            }, {
                status: 401
            })
        }

        const filesLinks = await Promise.all(files.map(async file => {
            const buffer = await file.arrayBuffer();
            const byte = Buffer.from(buffer);

            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        reject(error);
                    } else {
                        console.log("File uploaded to Cloudinary:", result.url);
                        resolve(result.url);
                    }
                }).end(byte);
            });
        }));

        const newProduct = new Product({
            name,
            description,
            mrp,
            sp,
            cv,
            cvDiscount,
            quantity,
            images:filesLinks
        });

        await newProduct.save();
        return NextResponse.json({
            message: 'Product created successfully !',
            product: newProduct
        })

    } catch (error) {
        console.error('Error in adding product to database : ', error);
        return NextResponse.json({
            message: 'Internal server error !',
            error: error.message
        }, {
            status: 500
        })
    }
}

export async function PUT(req) {
    const header = headers();
    const userId = header.get('userId');
    const payload = await req.json();
    const {
        productId,
        updatedData
    } = payload;
    try {
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return NextResponse.json({
                message: "Unauthorized access you are not an admin !"
            }, {
                status: 400
            })
        }
        const product = await Product.findByIdAndUpdate(productId, updatedData, {
            new: true
        });

        return NextResponse.json({
            message: "Product updated successfully !",
            product
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Internal server error !',
            error: error.message
        }, {
            status: 500
        });
    }
}

export async function DELETE(req) {
    const header = headers();
    const userId = header.get('userId');
    const {
        productId
    } = await req.json();
    try {
        const user = await User.findById(userId);
        if (!user || user.role != 'Admin') {
            return NextResponse.json({
                message: "Unauthorised access ! you are not allowed to do this."
            }, {
                status: 405
            })
        }
        const product = await findByIdAndDelete(productId);
        if (!product) {
            return NextResponse.json({
                message: "Invalid product-id"
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            message: "Product deleted successfully !",
            product
        })
    } catch (error) {
        console.error('eror in delt product', error);
        return NextResponse.json({
            message: 'Internal server error !',
            error: error.message
        }, {
            status: 500
        });
    }
}