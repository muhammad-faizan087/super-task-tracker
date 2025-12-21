import { ChevronDown, Trash2, UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

const TaskCard = ({
  title,
  description,
  assignedTo,
  createdAt,
  priority,
  status,
  role,
  assignedBy,
  taskId,
  deleteTaskById,
  getTasks,
  getActivities,
}) => {
  const [Status, setStatus] = useState(status);

  useEffect(() => {
    setStatus(status);
  }, [status]);

  const handleDelete = (id) => {
    const decision = confirm("Are you sure you want to delete this task?");
    if (decision) {
      deleteTaskById(id);
    } else {
      return;
    }
  };

  const handleStatusChange = async (newStatus, id) => {
    const decision = confirm("Are you sure?");
    if (!decision) return;

    try {
      const res = await fetch(`/api/tasks/changeStatus/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!res.ok) return toast.error(result.message);

      setStatus(newStatus);
      getTasks();
      getActivities();
      toast.success(result.message);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 rounded-lg space-y-6 border">
      <div className="flex justify-between items-center">
        <h1 className=" text-xl font-semibold">{title}</h1>
        <span
          className={`rounded-sm p-2 text-xs font-medium
    ${
      priority === "High"
        ? "bg-[#ffe2e2] text-[#b91c1c]"
        : priority === "Medium"
        ? "bg-[#fef9c2] text-[#a16207]"
        : "bg-[#dbfce7] text-[#166534]"
    }
  `}
        >
          {priority}
        </span>
      </div>
      <div className="space-y-3">
        <p>{description}</p>
        <div className="space-y-1.5">
          <div className="text-xs flex justify-start items-center gap-1.5">
            <UserRound className="w-4 h-4" />
            <span>{role === "ADMIN" ? "Assigned to:" : "Assigned by"}</span>
            <span>{role === "ADMIN" ? assignedTo : assignedBy}</span>
          </div>
          <div className="text-xs flex justify-start items-center gap-1.5">
            <span>Created:</span>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[85%] flex items-center justify-between text-muted-foreground text-sm"
            >
              <span>{Status}</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={Status}
              onValueChange={(newStatus) => {
                handleStatusChange(newStatus, taskId);
              }}
            >
              <DropdownMenuRadioItem
                value="Todo"
                disabled={
                  Status === "In Progress" ||
                  Status === "Done" ||
                  Status === "Todo"
                }
              >
                Todo
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="In Progress"
                disabled={Status === "In Progress" || Status === "Done"}
              >
                In Progress
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Done" disabled={Status === "Done"}>
                Done
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className={
            "bg-[#df202e] hover:bg-red-500 text-white cursor-pointer disabled:cursor-not-allowed"
          }
          size="icon"
          onClick={() => {
            handleDelete(taskId);
          }}
          disabled={role === "MEMBER"}
        >
          {<Trash2 />}
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
