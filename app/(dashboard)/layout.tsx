import Navbar, { Header } from "@/components/Navbar";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="relative flex flex-col md:flex-row h-screen w-full bg-[#F6F8FD] dark:bg-[#221F3A] p-2">
      <Navbar name={user.fullName || "Unknown"} imageUrl={user.imageUrl} />
      <div className="w-full overflow-y-auto md:flex md:flex-col relative">
        <div className="hidden md:block">
          <Header />
        </div>
        {children}
      </div>
    </main>
  );
}
