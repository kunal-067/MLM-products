import { User } from "@/lib/models/user";
import {
    headers
} from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {phone,amount} = await req.json();
        const header = headers();
        const userId = header.get("userId");
        const user = User.findById(userId);
        if(!user && !user.isAdmin){
            return NextResponse.json({msg:"Invalid attempt try later"}, {status:404});
        }

        const receiver = await User.findOne({phone});
        if(!receiver){
            return NextResponse.json({msg:"No User found with this phone no."}, {status:404});
        }
        receiver.balance += parseInt(amount);
        receiver.earnings += parseInt(amount);
        receiver.save();

        return NextResponse.json({msg:"successfully sent"}, {status:201});

    } catch (err) {
        console.log('error in income incr api', err);

        return NextResponse.json({msg:"Internal server error."}, {status:500});
        
    }

}