import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;
  console.log("id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User Found", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
