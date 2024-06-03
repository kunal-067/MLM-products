// const { User } = require("lucide-react");

import {User} from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function GET(req){
    let u = await User.findOne({phone:9122874046});
    u.isAdmin = true;
    await u.save();
    return NextResponse.json({message:"ok", u})
}