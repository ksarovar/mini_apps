"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/about",
    name: "About",
  },
  {
    path: "/portfolio",
    name: "Portfolio",
  },
  {
    path: "/youtube",
    name: "YouTube",
  },
  {
    path: "/contact",
    name: "Contact",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Blockchain Dev
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.path ? "text-foreground" : "text-foreground/60"
                )}
              >
                <motion.span
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </nav>
    </div>
  );
}