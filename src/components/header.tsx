import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="flex w-full items-center justify-center bg-background/50 border-b">
      <div className="flex w-full max-w-[1120px] items-center justify-between p-4">
        <Logo />
        <ModeToggle />
      </div>
    </header>
  );
}
