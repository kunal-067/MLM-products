import Investment from "@/lib/models/investment";
import {
    User
} from "@/lib/models/user";
import {
    headers
} from "next/headers";
import {
    NextResponse
} from "next/server";

export async function GET(req) {
    try {
        const header = headers();
        const userId = header.get('userId');
        const user = await User.findById(userId);
        const url = new URL(req.url);
        const query = new URLSearchParams(url.searchParams);
        const status = query.get('status')?.toString();
        const withUser = query.get('withUser');

        const userToGet = query.get('user')

        let investments;
        if (!user) {
            return NextResponse.json({
                msg: 'Invalid user Id ! Please try later'
            })
        } else if (user.isAdmin) {
            if (userToGet) {
                investments = await Investment.find({
                    user: userToGet
                }).populate('user')
            } else {
                console.log(withUser, 'hola koma tale tale u')
                investments = withUser==('True'||'true') ? await Investment.find({status}).populate('user') : await Investment.find({status});
            }
        } else {
            investments = await Investment.find({
                user: userId, status : 'Approved'
            })

            console.log('hola tola tola pola')
        }

        return NextResponse.json({
            msg: 'Successfully fetched investments',
            investments
        })
    } catch (err) {
        console.log('investment api error', err.message)
        return NextResponse.json({
            msg: 'Internal server error'
        }, {
            status: 500
        })
    }
}

export async function POST(req) {
    try {
        const header = headers();
        const userId = header.get('userId');
        const {amount, upi, msg} = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                msg: 'Invalid user Id ! Please try later'
            })
        }

        const investment = new Investment({
            amount: 2000,
            upi,
            msg,
            user: userId
        })
        await Promise.all([user.save(), investment.save()]);

        return NextResponse.json({
            msg: 'Successfully invested',
            investment
        })
    } catch (err) {
        console.log('investment api error', err.message)
        return NextResponse.json({
            msg: 'Internal server error'
        }, {
            status: 500
        })
    }
}


export async function PATCH(req) {
    try {
        const header = headers();
        const userId = header.get('userId');
        const {status, investmentId} = await req.json();

        // const user = await User.findById(userId);
        const [user, investment] = await Promise.all([User.findById(userId), Investment.findById(investmentId)]);
        if (!user && !user.isAdmin && !investment) {
            return NextResponse.json({
                msg: 'Invalid Attempt ! Please try later'
            })
        }

        if(status != 'Approved'){
            await investment.deleteOne();
        }else{
            investment.status = 'Approved';
            await investment.save();
        }


        return NextResponse.json({
            msg: 'Successfully updated'
        })
    } catch (err) {
        console.log('investment api error', err.message)
        return NextResponse.json({
            msg: 'Internal server error'
        }, {
            status: 500
        })
    }
}