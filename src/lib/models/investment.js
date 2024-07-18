const {
    Schema,
    models,
    model
} = require("mongoose");

const investmentSchema = new Schema({

    name: String,
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upi:{
        type:String,
        required:true
    },
    msg:String,
    status:{
        type: String,
        enum:['Pending','Approved'],
        default:'Pending'
    }

}, {
    timestamps: true
})

const Investment = models.Investment || model("Investment",  investmentSchema);
module.exports=Investment;