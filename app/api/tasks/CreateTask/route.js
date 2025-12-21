import { connectDB } from "@/lib/mongoose";
import TaskModel from "@/models/TaskModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Activity from "@/models/ActivityModel";

export async function POST(request) {
  const conn = await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, priority, assignedTo } = body;
    if (!title || !description || !priority || !assignedTo) {
      return NextResponse.json(
        {
          message: "Required fields are mandatory.",
        },
        {
          status: 400,
        }
      );
    }
    const createdByUser = session.user;

    const task = await TaskModel.create({
      title,
      description,
      priority,
      createdBy: createdByUser._id,
      assignedTo: assignedTo,
    });

    await Activity.create({
      userId: session.user._id,
      action: "created task",
      taskId: task._id,
      taskTitle: task.title,
      targetUserId: task.assignedTo,
      details: `Priority: ${task.priority}`,
    });
    return NextResponse.json(
      {
        message: "Task created successfully",
        task,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
