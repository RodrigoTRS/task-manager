import { BookCheck } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center gap-1 hover:opacity-75 hover:cursor-pointer"
    >
      <BookCheck size={24} className="text-primary" />
      <span>Task Manager</span>
    </Link>
  );
}
