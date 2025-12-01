import { Navigation } from '@/components/layouts/Navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Header() {
  return (
    <header>
      <nav className={'relative z-50 flex justify-between py-8'}>
        <div className="relative z-10 flex items-center gap-16">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="hidden lg:flex lg:gap-10">
            <Navigation />
          </div>

        </div>
        <div>

        </div>
      </nav>
    </header>
  );
}