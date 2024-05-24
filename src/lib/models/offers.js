const { Schema, models, model } = require("mongoose");

const offerSchema = new Schema({
    name: {type:String, required:true},
    refCount:{type:Number, required:true},
    winAmount:{type:Number, required:true},
    closeDate:{type:Date, default:new Date()},
    status:{
        type:String,
        enum:['Running','Closed'],
        default:'Running'
    }
},{timestamps: true})
const Offer = models.Offer || model("Offer", offerSchema);
export default Offer;

