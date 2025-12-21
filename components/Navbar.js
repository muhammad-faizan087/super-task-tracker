import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="max-h-[10vh] w-full py-3 border-b">
      <div className="flex items-center justify-between px-4">
        <div>
          <Link href={"/"} className="flex justify-center items-center gap-2">
            <CircleCheckBig className="text-blue-500" />
            <p className="text-[#0a0a0a] font-semibold text-sm sm:text-xl">
              Smart Task Board
            </p>
          </Link>
        </div>
        <div className="flex justify-center items-center gap-1 sm:gap-2">
          <Link href={"/login"}>
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href={"/signup"}>
            <Button className="bg-blue-500 hover:bg-blue-400 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
