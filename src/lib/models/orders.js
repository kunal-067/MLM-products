const {
    Schema,
    model,
    models
} = require("mongoose");

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    shippingAddress: {
        address: String,
        nearPoint: String,
        city: String,
        state: String,
        countary: String
    },
    shippingCharge: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },
    payableAmount: {
        type: Number,
        required: true
    },
    paymentMode:{
        type:String,
        default:'Online'
    },
    upi:String,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },

    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Dellivered', 'Returning', 'Returned'],
        default: 'Pending'
    },
    shippedAt: Date,
    deliveredAt: Date,
    returnedAt: Date,
}, {
    timestamps: true
})

const Order = models.Order || model('Order',  orderSchema);
module.exports = Order;