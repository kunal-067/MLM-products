import {
    Coupon
} from "../models/coupon";
import {
    User
} from "../models/user";

export const destributeCv = async (userId, cv, direct) => {
    try {
        const sponsor = await User.findOne({
            $or: [{
                leftChild: userId
            }, {
                rightChild: userId
            }]
        });

        if (!sponsor) return;
        if (sponsor.leftChild?.equals(direct)) {
            sponsor.leftCv += cv;
        } else if (sponsor.rightChild?.equals(direct)) {
            sponsor.rightCv += cv;
        }

        await sponsor.save();
      
        await destributeCv(sponsor._id, cv, sponsor._id);

    } catch (err) {
        throw new Error('error in destributingCv ' + err.message)
    }
}
export const couponClosing = async () => {
    try {
        const users = await User.find({});

        // Use Promise.all with map to ensure all async operations complete
        await Promise.all(users.map(async user => {
            const userCoupons = await Coupon.find({
                user: user._id,
                status: 'approved'
            });

            const couponCount = userCoupons.reduce((acrr, curr) => {
                return acrr + curr.quantity;
            }, 0);

            let royality = 60 * couponCount;

            user.royalCoin += royality;
            if (royality >= 0) {
                user.history.push({
                    msg: `You earned ₹${royality} as royality`,
                    hisType: 'royality',
                    history: Date.now()
                });
            }

            const leftCv = user.leftCv;
            const rightCv = user.rightCv;
            let cvCount = 0;

            //condition based cv checking : -------------
            if (leftCv > rightCv) {
                if (rightCv > 700) {
                    user.leftCv -= 700;
                    user.rightCv = 0
                    cvCount = 700
                } else {
                    user.leftCv -= rightCv;
                    user.rightCv = 0;
                    cvCount = rightCv;
                }

            } else if (rightCv == leftCv) {
                user.leftCv = 0;
                user.rightCv = 0
                if (leftCv > 700) {
                    cvCount = 700
                } else {
                    cvCount = leftCv
                }

            } else {
                if (leftCv > 700) {
                    user.leftCv = 0;
                    user.rightCv -= 700;
                    cvCount = 700
                } else {
                    user.leftCv = 0;
                    user.rightCv -= leftCv;
                    cvCount = leftCv
                }
            }

            user.balance += cvCount * 10;
            user.earnings += cvCount * 10;
            if (cvCount > 0) {
                user.history.push({
                    msg: `You earned ₹${cvCount * 10} as CV Matching Income`,
                    hisType: 'cv-income',
                    history: Date.now()
                });
            }

            await user.save();
        }));

        console.log('All users processed successfully.');
    } catch (error) {
        throw new Error("Error in couponClosing function: " + error.message);
    }
}

export const refIncome = async (sponsor, amount, quantity, userName) => {
    try {
        // const sponsor = await User.findById(sponsorId);
        if (!sponsor) throw 'invalid sponsor id ! sponsor not found.'
        if (sponsor.status != 'Active') return;
        const refs = await User.find({
            referredBy: sponsor.referralCode,
            status: 'Active'
        }, {
            _id: 1
        }).limit(6).lean();
        if (refs.length >= 6 && !sponsor.royalUnlocked) {
            sponsor.royalUnlocked = true;
        }

        let incr;
        if(amount == 2500){
            incr = 500;
        }else{
            incr = 50;
        }
        sponsor.balance += (incr * quantity);
        sponsor.earnings += (incr * quantity);
        sponsor.history.push({
            msg: `You get referral income of ₹${incr} from ${userName}`,
            hisType: 'ref-income'
        })

        await sponsor.save();
    } catch (error) {
        console.error('Error in ref income' + error.message)
        throw new Error('Error in ref income' + error.message)
    }
}