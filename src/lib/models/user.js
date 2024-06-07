import {
    connectDb
} from "@/utils/api/dbconnect"
import mongoose from "mongoose"

await connectDb();
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['left', 'right'],
    },
    referralCode: {
        type: String,
        required: true
    },
    refCount:{
        type:Number,
        default:0
    },
    rank:{
        type:Number,
        default:0
    },

    referredBy: {
        type: String,
        default: null,
    },
    leftChild: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rightChild: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    rank: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    },
    balance2: {
        type: Number,
        default: 0
    },
    royalCoin:{
        type:Number,
        default:0
    },
    royalUnlocked:{
        type:Boolean,
        default:false
    }, 

    rightCv: {
        type: Number,
        default: 0
    },
    leftCv: {
        type: Number,
        default: 0
    },
    cvCycle: {
        type: Number,
        default: 0
    },
    currentCycle: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'InActive'
    },

    isAdmin: {
        type: Boolean,
        default: false
    },
    registeredAt: {
        type: Date,
        default: Date.now()
    },

    history: [{
        msg: String,
        hisType: String,
        status: {
            type: String,
            enum: ['seen', 'unSeen'],
            default: 'unSeen'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }]
})

export const User = mongoose.models?.User || mongoose.model('User', userSchema)