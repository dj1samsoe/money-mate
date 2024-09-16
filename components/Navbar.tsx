"use client";

import { cn } from "@/lib/utils";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import {
  ArrowRightLeft,
  LayoutDashboard,
  Menu,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import CreateTransactionDialog from "@/app/(dashboard)/_components/CreateTransactionDialog";
import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";

const iconSize = 20;

const items = [
  { icon: <LayoutDashboard size={iconSize} />, label: "dashboard", link: "/" },
  {
    icon: <ArrowRightLeft size={iconSize} />,
    label: "transactions",
    link: "/transactions",
  },
  {
    icon: <SlidersHorizontal size={iconSize} />,
    label: "manage",
    link: "/manage",
  },
];

interface Props {
  name: string;
  imageUrl: string;
}

export default function Navbar({ name, imageUrl }: Props) {
  return (
    <>
      <DesktopNavbar name={name} imageUrl={imageUrl} />
      <MobileNavbar />
    </>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <div className="block border-separate border-b bg-white dark:bg-[#2E2B4A] md:hidden">
      <div className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"toggle"} size={"icon"}>
              <Menu className="w-8 h-8 shrink-0" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] dark:bg-[#2E2B4A]"
            side={"left"}
          >
            <div className="flex flex-col justify-between h-full w-full">
              <div className="flex flex-col gap-y-5 w-full">
                <Logo />
                <LocaleSwitcher />

                <div className="flex flex-col gap-3 pt-8">
                  {items.map((item) => (
                    <NavbarItem
                      key={item.label}
                      link={item.link}
                      label={t(item.label)}
                      icon={item.icon}
                      clickCallback={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-5 items-center text-center text-xs text-muted-foreground/90">
                <div className="flex flex-col space-y-2 items-center text-center">
                  <p>Personal Finance Tracker Dashboard</p>
                  <p>@{new Date().getFullYear()} All Rights Reserved</p>
                </div>
                <p>Made with ❤️ Dhany Hidayat</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 40,
                  height: 40,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DesktopNavbar({ name, imageUrl }: Props) {
  const t = useTranslations("Navbar");

  return (
    <div className="hidden bg-white dark:bg-[#2E2B4A] md:block static z-50 max-w-[250px] w-full rounded-lg">
      <div className="w-full flex flex-col items-center justify-between gap-y-4 h-full pt-8 pb-3 px-5">
        <Logo />
        <div className="flex flex-col gap-y-3 items-center justify-center">
          <div className="relative container">
            <Avatar className="z-50 relative left-1/2 -translate-x-1/2 w-14 h-14">
              <AvatarImage
                src={imageUrl}
                alt={name}
                loading="lazy"
                className="object-cover object-center hover:scale-110 transition-all duration-200"
              />
            </Avatar>
            <div className="flex items-center absolute z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full">
              <span className="h-[1px] w-[50%] bg-gradient-to-r from-transparent dark:to-white to-neutral-600"></span>
              <span className="h-[1px] w-[50%] bg-gradient-to-r dark:from-white from-neutral-600 to-transparent"></span>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 items-center">
            <h1 className="font-medium text-lg capitalize">{name}</h1>
            <p className="text-sm text-muted-foreground text-center">
              Personal Finance Dashboard
            </p>
          </div>
          <LocaleSwitcher />
        </div>

        <div className="flex h-full w-full flex-col gap-y-3 pt-10">
          {items.map((item) => (
            <NavbarItem
              key={item.label}
              link={item.link}
              label={t(item.label)}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="flex flex-col space-y-5 items-center text-center text-xs text-muted-foreground/90">
          <div className="flex flex-col space-y-2 items-center text-center">
            <p>Personal Finance Tracker Dashboard</p>
            <p>@{new Date().getFullYear()} All Rights Reserved</p>
          </div>
          <p>Made with ❤️ Dhany Hidayat</p>
        </div>
      </div>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  icon,
  clickCallback,
}: {
  link: string;
  label: string;
  icon: React.ReactNode;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <nav className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          "w-full justify-start text-lg text-muted-foreground px-4 py-2 rounded-md flex items-center gap-3 transition-all duration-200",
          isActive
            ? "dark:text-primary-dark dark:bg-primary-light bg-blue-income text-white dark:hover:bg-primary-light/90"
            : "hover:bg-muted-foreground/10 hover:text-foreground"
        )}
        onClick={() => {
          if (clickCallback) {
            clickCallback();
          }
        }}
      >
        {icon}
        {label}
      </Link>
      {isActive && (
        <div className="absolute h-[70%] w-1.5 rounded-xl dark:bg-primary-dark bg-blue-income block mr-2" />
      )}
    </nav>
  );
}

export function Header() {
  const t = useTranslations("DashboardPage");
  return (
    <header className="w-full bg-transparent flex justify-end items-center gap-3 px-8 py-2">
      <div className="flex items-center gap-3 overflow-x-auto">
        <CreateTransactionDialog
          type="income"
          trigger={
            <Button variant={"default"}>
              <Plus className="shrink-0 mr-2 h-4 w-4" />
              {t("addIncome")}
            </Button>
          }
        />
        <CreateTransactionDialog
          type="expense"
          trigger={
            <Button variant={"secondary"}>
              <Plus className="shrink-0 mr-2 h-4 w-4" />
              {t("addExpense")}
            </Button>
          }
        />
      </div>
      <ThemeToggle />
      <UserButton
        appearance={{
          elements: {
            avatarBox: {
              width: 40,
              height: 40,
            },
          },
        }}
      />
    </header>
  );
}
