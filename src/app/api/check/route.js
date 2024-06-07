import { User } from "@/lib/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const header = headers();
    const id = header.get("userId");
    const user = await User.findById(id);

    const refs = await User.find({
        referredBy: user.referralCode,
        status: 'Active'
    }, {
        _id: 1
    }).limit(6).lean();

    return NextResponse.json({data: refs})
}