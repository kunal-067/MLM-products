import Offer from "@/lib/models/offers";
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
        const offers = await Offer.find({
            status: 'Running'
        });

        return NextResponse.json({
            message: "Offers found",
            offers
        })
    } catch (error) {
        console.error('error in getting offers', error)
        return NextResponse.json({
            message: "Internal error ! try later",
            error: error.message
        }, {
            status: 500
        })
    }
}

export async function POST(req) {
    const header = headers();
    const userId = header.get('userId');
    const {
        name,
        refCount,
        winAmount,
        closeDate
    } = await req.json();
    try {
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return NextResponse.json({
                message: "Invalid attempt ! You are not admin"
            }, {
                status: 401
            })
        }
        const newOffer = new Offer({
            name,
            refCount,
            winAmount,
            closeDate
        })

        await newOffer.save();
    } catch (error) {
        console.error('error in adding offer', error);
        return NextResponse.json({
            message: "Internal server error ! try later",
            error: error.message
        }, {
            status: 500
        })
    }
}

export async function PATCH(req) {
    const header = headers();
    const userId = header.get('userId');
    const {
        offerId
    } = await req.json();
    try {
        const [user, offer] = await Promise.all([User.findById(userId), Offer.findById(offerId)]);
        if (!user || !user.isAdmin || offer) {
            return NextResponse.json({
                message: 'Inavlid attempt ! You are not admin or offer not found'
            }, {
                status: 401
            })
        }
        const users = await User.find({});
        offer.status = 'Closed'
        await Promise.all([users.map((user) => {
            if(user.refCount >=  offer.refCount){
                user.balance += offer.winAmount;
                user.earnings += offer.winAmount;
                user.history.push({
                    msg:`You get ₹${offer.winAmount} from ${offer.name}`
                })
            }

            user.refCount = 0;
            user.save();
        }), offer.save()])

        return NextResponse.json({message:"Offer closed successfully !"})
    } catch (error) {
        console.error('error in offer clossing', error);
        return NextResponse.json({message: "Internal server error ! try later", error: error.message},{status: 500})
    }
}