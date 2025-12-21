import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import TaskModel from "@/models/TaskModel";
import Activity from "@/models/ActivityModel";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const id = req.nextUrl.pathname.split("/").pop();
  console.log("TaskId", id);
  const body = await req.json();
  const { status } = body;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    await Activity.create({
      userId: session.user.id,
      action: "updated task status",
      taskId: task._id,
      taskTitle: task.title,
      details: `Status changed to ${status}`,
    });

    return NextResponse.json(
      { message: "Task updated successfully", task },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
