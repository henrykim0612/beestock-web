import { Navigation } from '@/components/layouts/Navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/toggles/ThemeToggle';
import Logo from '@/components/layouts/Logo';


export default function Header() {
  return (
    <header>
      <nav className={'relative z-50 flex justify-between py-8'}>
        <div className="relative z-10 flex items-center gap-6">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <div className="hidden lg:flex lg:gap-10">
            <Navigation />
          </div>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}