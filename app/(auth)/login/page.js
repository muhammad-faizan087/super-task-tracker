"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [Pending, setPending] = useState(false);
  const [Error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setPending(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res?.ok) {
        setError(res?.error || "Invalid credentials");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      setError("Something Went Wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="box-border min-h-screen min-w-screen overflow-x-hidden flex justify-center items-center">
      <div className="min-h-[80%] m-8 rounded-xl border w-113 p-4 space-y-5 text-center shadow-lg">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your Smart Task Board account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter Your Email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                className="pr-10"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={Pending}
            className="bg-blue-500 hover:bg-blue-400 text-white w-full"
          >
            {Pending ? "..." : "Sign In"}
          </Button>
          {Error && <p className="text-sm text-red-500">{Error}</p>}

          <p className="text-sm text-center">
            Don't have an account?
            <Link href="/signup" className="ml-1 text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
