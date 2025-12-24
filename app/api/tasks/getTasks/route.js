import { connectDB } from "@/lib/mongoose";
import TaskModel from "@/models/TaskModel";
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
    const tasks = await TaskModel.find({});
    // console.log("Tasks:", tasks);
    if (tasks.length === 0) {
      return NextResponse.json(
        {
          message: "No tasks found",
          tasks,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Tasks Found",
        tasks,
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
