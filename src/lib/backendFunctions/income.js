import {
    Coupon
} from "../models/coupon";
import {
    User
} from "../models/user";

export const destributeCv = async(sponsorId, cv, direct)=>{
    try{
    const sponsor = await User.findById(sponsorId);
    if(!sponsor) return;
    if(sponsor.lefftChild.equals(direct)){
        sponsor.leftCv += cv;
    }else if(sponsor.rightChild.equals(direct)){
        sponsor.rightCv += cv;
    }
    if(sponsor.referredBy){
        await destributeCv(sponsor.referredBy, cv, sponsor._id);
    }
}catch(err){
    throw new Error('error in destributingCv '+err.message)
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

            let royality = 0.5 * couponCount * 2500;

            user.royalCoin += royality;
            if (royality >= 0) {
                user.history.push({
                    msg: `You earned ₹${royality} as royality`,
                    hisType: 'royality',
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

export const refIncome = async (sponsorId, amount, quantity, userName) => {
    try{
        const sponsor = await User.findById(sponsorId);
        if(!sponsor) throw 'invalid sponsor id ! sponsor not found.'
        if(!sponsor.status != 'Active') return;
        const refs = await User.find({referredBy:sponsor.referralCode, status:'Active'},{_id:1}).limit(6).lean();
        if(refs.length >= 6 && !sponsor.royalUnlocked){
            sponsor.royalUnlocked = true;
        }

        sponsor.balance += 500*quantity;
        sponsor.earnings += 500*quantity;
        sponsor.history.push({
            msg:`You get referral income of ₹500 from ${userName}`,
            hisType:'ref-income'
        })

        await sponsor.save();
    }catch(error){
        console.error('Error in ref income' + error.message)
        throw new Error('Error in ref income' + error.message)
    }
}