import { Navigation } from '@/components/layouts/Navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/toggles/ThemeToggle';
import Image from 'next/image';


export default function Header() {
  return (
    <header>
      <nav className={'relative z-50 flex justify-between py-8'}>
        <div className="relative z-10 flex items-center gap-16">
          <Link href="/" aria-label="Home">
            <Image src={'/logos/logo-horizontal.png'} alt={'logo'} width={150} height={100} />
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