import { model, models, Schema } from "mongoose";

const trainingSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{ type:Number, required: true }, // in cents
    description: { type:String },
    status:{
        type:String,
        enum:['Dactivated', 'Activated', 'Pending'],
        default:'Pending'
    },

    upi:{type: String, unique:true}
},{
    timestamps:true
})

const Training = models.Training || model('Training', trainingSchema);
export default Training;

