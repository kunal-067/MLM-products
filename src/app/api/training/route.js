import Training from "@/lib/models/training";
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

        const url = new URL(req.url);
        const query = new URLSearchParams(url.searchParams);
        const status = query.get('status');
        const isAdmin = query.get('isAdmin');

        const user = await User.findById(userId);
        if (isAdmin == 'true' && user.isAdmin) {
            let admTrainings;
            if (status == 'Active') {
                admTrainings = await Training.find({
                    status: 'Activated'
                });
            } else if (status == 'Declined') {
                admTrainings = await Training.find({
                    status: 'Declined'
                });
            } else {
                admTrainings = await Training.find({
                    status: 'Pending'
                });
            }

            return NextResponse.json({
                msg: "Trainings fetched successfully !",
                trainings: admTrainings
            }, {
                status: 201
            });
        }
       
        const trainings = await Training.find({user:userId});

        return NextResponse.json({
            msg: "Trainings fetched successfully !",
            trainings
        });

    } catch (error) {
        console.error('error in getting training api', err);
        return NextResponse.json({
            msg: 'internal server error ! please try later',
            error: err.message
        }, {
            status: 500
        })
    }

}


export async function POST(req) {
    try {
        const header = headers();
        const userId = header.get('userId');
        const {
            amount,
            upi
        } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                msg: "Invalid user ! try again"
            }, {
                status: 404
            });
        }
        const training = new Training({
            user: userId,
            amount,
            upi
        });

        await training.save();

        return NextResponse.json({
            msg: "Activation request submitted successfully !"
        });

    } catch (error) {
        console.error('error in posting training api', err);
        return NextResponse.json({
            msg: 'internal server error ! please try later',
            error: err.message
        }, {
            status: 500
        })
    }

}


export async function PUT(req) {
    try {
        const incRef = 800

        const header = headers();
        const userId = header.get('userId');

        const {
            trainingId,
            status
        } = await req.json();

        const adUser = await User.findById(userId);
        if (!adUser.isAdmin) {
            return NextResponse.json({
                msg: 'You are not allowed to do this !',
                error: "Error is present here"
            }, {
                status: 400
            })
        }

        const trainingCard = await Training.findById(trainingId).populate('user');
        if (!trainingCard) {
            return NextResponse.json({
                msg: 'Invalid trainingId !'
            }, {
                status: 404
            })
        }
        if (trainingCard.status != 'Pending') {
            return NextResponse.json({
                msg: 'Invalid attempt ! already updated'
            }, {
                status: 400
            })
        }

        if (status != 'Activated') {
            trainingCard.status = status;
            return NextResponse.json({
                msg: "Training declined successfully !"
            });
        }

        const user = await trainingCard.user;
        if (user.referredBy) {
            const sponsor = await User.findOne({
                referralCode: user.referredBy
            })
            sponsor.balance += incRef;
            sponsor.earnings += incRef;

            await sponsor.save();
        }

        trainingCard.status = status;
        await trainingCard.save();
        return NextResponse.json({
            msg: "Updated successfully ! new trainie added"
        });

    } catch (error) {
        console.error('error in puting training api', err);
        return NextResponse.json({
            msg: 'internal server error ! please try later',
            error: err.message
        }, {
            status: 500
        })
    }

}