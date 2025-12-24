import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function GET() {
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
