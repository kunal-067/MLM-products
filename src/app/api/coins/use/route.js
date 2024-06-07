import { User } from "@/lib/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const header = headers();
        const userId = header.get('userId');
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({message:"Invalid user ! try later."}, {status:404});
        }  
        if(!user.royalUnlocked){
            return NextResponse.json({message:"You don't have completed 6 referrals"}, {status:400})
        }

        user.balance += user.royalCoin;
        user.earnings += user.royalCoin;

        user.royalCoin = 0;
        await user.save();
        return NextResponse.json({message:"You have successfully converted your royal coin"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message:"Internal server error ! try later", error:error.message}, {status:500})
    }
}