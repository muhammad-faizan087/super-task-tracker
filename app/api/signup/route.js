import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/models/UserModel";
import { connectDB } from "@/lib/mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, role, email, password } = body;

    if (!name || !role || !email || !password) {
      return NextResponse.json(
        {
          message: "Required fields must not be empty",
        },
        {
          status: 400,
        }
      );
    }

    const alreadyExisted = await UserModel.findOne({ email });

    if (alreadyExisted) {
      return NextResponse.json(
        {
          Existed: true,
          Created: false,
          User: alreadyExisted,
          message: "User with this email already existed",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      role,
      email,
      password: hashedPass,
    });

    return NextResponse.json(
      {
        Existed: false,
        Created: true,
        User: user,
        message: "UserData saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Signup Error:", error);

    return NextResponse.json(
      {
        message: "Error posting user data",
      },
      {
        status: 500,
      }
    );
  }
}
