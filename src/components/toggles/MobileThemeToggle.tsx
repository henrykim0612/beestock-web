'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@/components/toggles/ThemeToggle';

export default function MobileThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="bst-button bst-button-ring-inset bst-button-hover inline-flex justify-center"
      onClick={() => setTheme(otherTheme)}
    >
      <SunIcon
        className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden" />
      <MoonIcon
        className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:stroke-yellow-500 dark:block" />
    </button>
  );
}



