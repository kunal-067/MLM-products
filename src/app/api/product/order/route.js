import {
    destributeCv
} from "@/lib/backendFunctions/income";
import Order from "@/lib/models/orders";
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
// import { messageTypes } from "node-telegram-bot-api/src/telegram";

export async function GET(req) {
    const header = headers();
    const userId = header.get('userId');
    try {
        const orders = await Order.find({
            user: userId
        });
        return NextResponse.json({
            message: 'Orders fetched successfully',
            orders
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: 'Error while fetching the order',
            error: error.message
        }, {
            status: 500
        });
    }
}

export async function POST(req) {
    const header = headers();
    const userId = header.get('userId');
    const payload = await req.json();
    const {
        productId,
        quantity,
        size,
        shippingAddress,
        getCvDiscount,
        paymentMode,
        upi
    } = payload
    try {
        const [product, user] = Promise.all([Product.findById(productId), User.findById(userId)]);
        if (!product || !user) {
            return NextResponse.json({
                message: "Something went wrong while fetching ! try again",
                data: []
            }, {
                status: 404
            })
        }
        //cv increment
        user.cv += product.cv;
        if (user.referredBy) {
            const sponsor = await User.findOne({
                referralCode: user.referredBy
            });
         destributeCv(sponsor, product.cv, userId)
        }

        let discount = 0;
        if (getCvDiscount) {
            discount += product.sp * product.cvDiscount / 100;
        };
        const newOrder = new Order({
            product: searchParams._id,
            user: userId,
            quantity,
            size,
            shippingAddress,
            discount,
            payableAmount: product.sp - discount
        })
        if (paymentMode == 'Online') {
            if (!upi) return NextResponse.json({
                message: 'Upi id is missing ! try again',
                error: 'upi is required'
            }, {
                status: 400
            })
            newOrder.upi = upi;
        }

        product.quantity -= 1
        await Promise.all([newOrder.save(), user.save(), product.save()]);

        return NextResponse.json({
            message: "Successfully created order !",
            order: newOrder
        }, {
            status: 201
        })
    } catch (error) {
        console.error('error in create order', error);
        return NextResponse.json({
            message: 'Internal server error try later',
            error: error.message
        }, {
            status: 500
        })
    }
}

export async function PATCH(req) {
    const header = headers();
    const userId = header.get('userId');
    const payload = await req.json();
    const {
        orderId
    } = payload;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({
                message: "Invalid order-id ! try again",
                error: 'order not found'
            }, {
                status: 404
            });
        }
        if (!order.equals(userId)) {
            return NextResponse.json({
                message: "Invalid attempt this order doesn't belongs from you",
                error: 'invalid attempt'
            }, {
                status: 400
            })
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Internal server error ! try later",
            error: error.message
        }, {
            status: 500
        })
    }
}