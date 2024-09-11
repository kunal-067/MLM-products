import { User } from "@/lib/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const header = headers();
        const userId = header.get('userId');
        const {
            phone,
            incr
        } = await req.json();
       
        if (isNaN(incr)) {
            return NextResponse.json({
                msg: 'Invalid increment value'
            }, {
                status: 400
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return NextResponse.json({
                msg: 'Invalid Attempt! Please try later'
            }, {
                status: 403
            });
        }

        const investor = await User.findOne({phone});
        if(!investor){
            return NextResponse.json({
                msg: 'Invalid phone no. ! Please try later'
            }, {
                status: 404
            });
        }
        investor.invIncome += parseInt(incr);
        await investor.save();
    
        return NextResponse.json({
            msg: 'Successfully updated income',
        })
    } catch (err) {
        console.log('investment personal income api error', err.message)
        return NextResponse.json({
            msg: 'Internal server error'
        }, {
            status: 500
        })
    }
}
