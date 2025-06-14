"use client";

import Link from "next/link";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  button: React.ReactNode;
  navLink: string;
}

export function PageTitle({
  title,
  subtitle,
  button,
  navLink,
}: PageTitleProps) {
  return (
    <section className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
      </div>

      <Link href={navLink}>{button}</Link>
    </section>
  );
}
