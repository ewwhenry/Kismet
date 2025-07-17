import { Bell } from 'lucide-react';

export function Navbar() {
  return (
    <div className="fixed bg-gradient-to-b text-foreground from-zinc-100 dark:from-zinc-900 from-0% via-zinc-100/70 dark:via-zinc-900/70 via-50% to-transparent to-100% w-full h-16 px-4 flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="flex flex-row gap-4 items-center font-semibold">
          <div>Siguiendo</div>
          <div>Para ti</div>
          <div>Recientes</div>
        </div>
      </div>
      <div>
        <Bell />
      </div>
    </div>
  );
}
