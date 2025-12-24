import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const conn = await connectDB();

  try {
    const users = await UserModel.find();
    // console.log("Users:", users);
    if (users.length === 0) {
      return NextResponse.json(
        {
          message: "No users found",
          users,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "users Found",
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
