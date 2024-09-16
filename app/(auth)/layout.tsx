import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-screen">
      <div
        className="hidden lg:block h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4386421/pexels-photo-4386421.jpeg')",
        }}
      >
        <div className="w-full h-full bg-neutral-900/90 backdrop-blur-sm flex justify-center items-center p-10">
          <div className="container mx-auto flex flex-col items-center justify-center h-full p-8">
            <div className="flex flex-col space-y-4 items-center">
              <h1 className="text-6xl font-bold text-white tracking-tighter text-center">
                Welcome to{" "}
                <span className="bg-gradient-to-b from-blue-expense to-blue-income bg-clip-text leading-tight text-transparent">
                  MoneyMate
                </span>
              </h1>
              <h2 className="text-xl font-medium text-muted-foreground">
                Managing Money, Made Easy
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">{children}</div>
      </div>
    </div>
  );
}
