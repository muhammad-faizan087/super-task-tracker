"use client";

import StatusCard from "@/components/StatusCard";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [Pending, setPending] = useState(false);
  const [CreatingTask, setCreatingTask] = useState(false);
  const [Error, setError] = useState("");
  const [users, setusers] = useState([]);
  const [members, setmembers] = useState([]);
  const [tasks, settasks] = useState([]);
  const [Alltasks, setAlltasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [priority, setpriority] = useState("All Priorities");

  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    try {
      const res = await fetch("/api/activities/getActivities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok) {
        console.log(result.message);
        return;
      }
      if (user.role === "ADMIN") {
        setActivities(result.activities.filter((a) => a.userId === user._id));
      } else if (user.role === "MEMBER") {
        setActivities(
          result.activities.filter((a) => {
            return a.userId === user._id || a.targetUserId === user._id;
          })
        );
      }
      // setActivities(result.activities);
      // console.log("Activities:", result.activities);
    } catch (error) {
      console.log("Error finding activities", error);
    }
  };

  const formatDateDMY = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-GB");

  const getUsers = async () => {
    try {
      const res = await fetch("/api/users/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok) {
        console.log(result.message);
        return;
      }
      setusers(result.users);
      // console.log("Users:", result.users);
    } catch (error) {
      console.log("Error finding users", error);
    }
  };

  const getTasks = async () => {
    try {
      const res = await fetch("/api/tasks/getTasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok) {
        console.log(result.message);
        return;
      }
      if (user.role === "ADMIN") {
        setAlltasks(result.tasks.filter((t) => t.createdBy === user._id));
      } else if (user.role === "MEMBER") {
        setAlltasks(result.tasks.filter((t) => t.assignedTo === user._id));
      }

      settasks(result.tasks);
      // console.log("Tasks:", result.tasks);
    } catch (error) {
      console.log("Error finding tasks", error);
    }
  };

  useEffect(() => {
    getUsers();
    getTasks();
    getActivities();
  }, []);

  useEffect(() => {
    if (priority === "High") {
      settasks(Alltasks.filter((t) => t.priority === "High"));
    } else if (priority === "Medium") {
      settasks(Alltasks.filter((t) => t.priority === "Medium"));
    } else if (priority === "Low") {
      settasks(Alltasks.filter((t) => t.priority === "Low"));
    } else if (priority === "All Priorities") {
      settasks(Alltasks);
    }
  }, [priority, Alltasks]);

  useEffect(() => {
    if (users.length > 0) {
      const onlyMembers = users.filter((user) => user.role === "MEMBER");
      setmembers(onlyMembers);
    }
  }, [users]);

  const usersMap = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      map[u._id] = u.name;
    });
    return map;
  }, [users]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  const handleLogout = async () => {
    setPending(true);
    await signOut();
  };

  const onSubmit = async (data) => {
    setCreatingTask(true);
    setError("");
    try {
      const res = await fetch("/api/tasks/CreateTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          priority: data.priority,
          assignedTo: data.assignedTo,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.log(result.message);
        setError(result.message);
        return;
      }
      getTasks();
      getActivities();
      toast.success(result.message);
      setOpen(false);
    } catch (error) {
      console.log("Error saving userdata.", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setCreatingTask(false);
    }
  };

  const deleteTaskById = async (id) => {
    try {
      const res = await fetch(`/api/tasks/deleteTaskById/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.log(result.message);
        toast.error(result.message);
        return;
      }
      getTasks();
      getActivities();
      toast.success(result.message);
    } catch (error) {
      console.log("Error deleting task", error);
      toast.error("Something went wrong while deleting");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center bg-gray-600">
        <Loader2 className="animate-spin " />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen box-border">
      <nav className="py-3 flex justify-between items-center px-4 border-b">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-2xl font-bold">Smart Task Board</h1>
          <p className="text-muted-foreground text-sm">
            Manage your tasks efficiently
          </p>
        </div>
        <div className="space-x-2 flex items-center">
          {user?.role === "ADMIN" && (
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-400 text-white cursor-pointer">
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-107">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                      <DialogDescription>
                        Add a new task to the board. Fill in the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter Task Title"
                          {...register("title", {
                            required: "Title is required",
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Enter Task Description"
                          {...register("description", {
                            required: "Description is required",
                          })}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <Label htmlFor="description">Priority</Label>
                          <Controller
                            name="priority"
                            control={control}
                            rules={{ required: "Priority is required" }}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Assigned To</Label>
                          <Controller
                            name="assignedTo"
                            control={control}
                            rules={{ required: "Field is required" }}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select User" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {members &&
                                      members.map((m, index) => {
                                        return (
                                          <SelectItem
                                            value={`${m._id}`}
                                            key={index}
                                          >
                                            {m.name}
                                          </SelectItem>
                                        );
                                      })}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className={"cursor-pointer"}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className={
                          "bg-blue-500 hover:bg-blue-400 text-white cursor-pointer"
                        }
                      >
                        {CreatingTask ? "..." : "Create Task"}
                      </Button>
                      {Error && <p className="text-sm text-red-500">{Error}</p>}
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  className={"rounded-full cursor-pointer"}
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                >
                  {user?.name
                    ?.trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0].toUpperCase())
                    .join("")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="cursor-default">
                    {user?.name || "UserX"}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="cursor-default text-xs text-muted-foreground">
                    {user?.email || "example@gmail.com"}
                  </DropdownMenuLabel>
                  {user?.role && (
                    <DropdownMenuLabel className="cursor-default text-xs">
                      {user?.role}
                    </DropdownMenuLabel>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={Pending}>
                  {Pending ? (
                    "..."
                  ) : (
                    <div
                      className={"flex space-x-1 items-center cursor-pointer"}
                    >
                      <LogOut />
                      <span className="text-red-600 focus:text-red-600">
                        Log out
                      </span>
                    </div>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <Tabs defaultValue="Task Board">
        <main className="py-6 px-4 space-y-6">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <TabsList>
              <TabsTrigger value="Task Board">Task Board</TabsTrigger>
              <TabsTrigger value="Activity Log">Activity Log</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="Task Board" className="space-y-4">
            <div className="flex items-center gap-1">
              <Label htmlFor="description" className={"font-medium "}>
                Priority:
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-40 flex items-center justify-between text-muted-foreground text-sm"
                  >
                    <span>{priority}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={priority}
                    onValueChange={setpriority}
                  >
                    <DropdownMenuRadioItem value="All Priorities">
                      All Priorities
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="High">
                      High
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Medium">
                      Medium
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Low">
                      Low
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <StatusCard
                color={"#f1f5f9"}
                status={"Todo"}
                number={tasks.filter((t) => t.status === "Todo").length}
              />
              <StatusCard
                color={"#dbeafe"}
                status={"In Progress"}
                number={tasks.filter((t) => t.status === "In Progress").length}
              />
              <StatusCard
                color={"#dbfce7"}
                status={"Done"}
                number={tasks.filter((t) => t.status === "Done").length}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {tasks &&
                tasks.map((t, index) => {
                  const assignedToUserName =
                    usersMap[t.assignedTo] || "Unassigned";
                  const assignedByUserName =
                    usersMap[t.createdBy] || "Unassigned";
                  return (
                    <TaskCard
                      key={index}
                      priority={t.priority}
                      status={t.status}
                      description={t.description}
                      createdAt={formatDateDMY(t.createdAt)}
                      assignedTo={assignedToUserName}
                      assignedBy={assignedByUserName}
                      title={t.title}
                      role={user.role}
                      taskId={t._id}
                      deleteTaskById={deleteTaskById}
                      getTasks={getTasks}
                      getActivities={getActivities}
                    />
                  );
                })}
            </div>
          </TabsContent>
          <TabsContent value="Activity Log" className="space-y-4">
            <div className="w-full">
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Recent Activities</h2>
                  <p className="text-sm text-muted-foreground">
                    Track all actions performed on tasks
                  </p>
                </div>
                <div className="divide-y max-h-150 overflow-y-auto">
                  {activities.length > 0 ? (
                    activities.map((activity, index) => {
                      const actorName =
                        usersMap[activity.userId] || "Unknown User";
                      const targetName = activity.targetUserId
                        ? usersMap[activity.targetUserId]
                        : null;

                      return (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 mt-1">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                                {actorName
                                  ?.trim()
                                  .split(/\s+/)
                                  .slice(0, 2)
                                  .map((word) => word[0].toUpperCase())
                                  .join("")}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm">
                                  <span className="font-medium text-gray-900">
                                    {actorName}
                                  </span>
                                  <span className="text-gray-600">
                                    {" "}
                                    {activity.action}{" "}
                                  </span>
                                  {activity.taskTitle && (
                                    <span className="font-medium text-gray-900">
                                      "{activity.taskTitle}"
                                    </span>
                                  )}
                                  {targetName && (
                                    <span className="text-gray-600">
                                      {" "}
                                      to{" "}
                                      <span className="font-medium text-gray-900">
                                        {targetName}
                                      </span>
                                    </span>
                                  )}
                                  {activity.details && (
                                    <span className="text-gray-600">
                                      {" "}
                                      - {activity.details}
                                    </span>
                                  )}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDateDMY(activity.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No activities yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
};

export default Dashboard;
