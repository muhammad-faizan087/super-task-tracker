import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import Activity from "@/models/ActivityModel";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      { message: "Activities fetched successfully", activities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
