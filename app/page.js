// "use client";

// import { useSession, signIn, signOut } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();
//   if (session) {
//     return (
//       <>
//         Signed in as {session.user.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     );
//   }
//   return (
//     <>
//       Not signed in <br />
//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   );
// }

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { features } from "@/data/features";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="box-border min-h-screen min-w-screen overflow-x-hidden">
      <Navbar />
      <main className=" min-h-[80%] py-16 px-4 w-full flex flex-col gap-20 ">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Manage Tasks With Your Team
          </h1>
          <p className="text-sm sm:text-xl text-balance text-muted-foreground font-medium">
            A simple and powerful task board for teams. Track progress,
            collaborate effectively, and get things done.
          </p>

          <div className="flex justify-center items-center gap-2">
            <Link href={"/signup"}>
              <Button className="bg-blue-500 hover:bg-blue-400 text-white">
                Get Started
              </Button>
            </Link>
            <Link href={"/login"}>
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row sm:items-baseline space-y-8 md:space-x-8">
          {features.map((feature, index) => {
            return (
              <div
                className="flex flex-col justify-center items-center text-center space-y-4 sm:space-x-4"
                key={index}
              >
                <span className="w-10 h-10 flex justify-center items-center bg-blue-100 rounded-xl">
                  <feature.logo className="w-5 h-5 text-blue-500" />
                </span>
                <h2 className="text-xl font-bold">{feature.title}</h2>
                <p className="text-muted-foreground font-medium text-sm">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>
      <footer className="h-[10vh] w-full border-t flex items-center justify-center">
        Smart Task Board - Team Collaboration Made Simple
      </footer>
    </div>
  );
}
