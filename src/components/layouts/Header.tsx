'use client';

import { MENU_ITEMS, Navigation } from '@/components/layouts/Navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/toggles/ThemeToggle';
import Logo from '@/components/layouts/Logo';
import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import MobileThemeToggle from '@/components/toggles/MobileThemeToggle';

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverButton<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <PopoverButton
      as={Link}
      className="block text-base/7 tracking-tight"
      {...props}
    />
  );
}

export default function Header() {
  return (
    <header>
      <nav className={'relative z-50 flex justify-between py-8 px-4'}>
        <div className="z-10 flex items-center gap-6">
          <Popover className="lg:hidden flex items-center">
            {({ open }) => (
              <>
                <PopoverButton
                  className="relative z-10 -m-2 inline-flex items-center rounded-lg bst-stroke bst-button-hover bst-stroke-hover p-2 focus:not-data-focus:outline-hidden bst-stroke-active"
                  aria-label="Toggle site navigation"
                >
                  {({ open }) =>
                    open ? (
                      <ChevronUpIcon className="h-6 w-6" />
                    ) : (
                      <MenuIcon className="h-6 w-6" />
                    )
                  }
                </PopoverButton>
                <AnimatePresence initial={false}>
                  {open && (
                    <>
                      <PopoverBackdrop
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-0 bst-backdrop"
                      />
                      <PopoverPanel
                        static
                        as={motion.div}
                        initial={{ opacity: 0, y: -32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: -32,
                          transition: { duration: 0.2 },
                        }}
                        className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bst-bg px-6 pt-32 pb-6 shadow-2xl shadow-gray-900/20"
                      >
                        <div className="space-y-4">
                          <MobileNavLink href={MENU_ITEMS[0][1]}>
                            {MENU_ITEMS[0][0]}
                          </MobileNavLink>
                          <MobileNavLink href={MENU_ITEMS[1][1]}>
                            {MENU_ITEMS[1][0]}
                          </MobileNavLink>
                          <MobileNavLink href={MENU_ITEMS[2][1]}>
                            {MENU_ITEMS[2][0]}
                          </MobileNavLink>
                          <MobileNavLink href={MENU_ITEMS[3][1]}>
                            {MENU_ITEMS[3][0]}
                          </MobileNavLink>
                        </div>
                        <div className="mt-8 flex flex-col gap-4">
                          {/*  <Button href="/login" variant="outline">*/}
                          {/*    Log in*/}
                          {/*  </Button>*/}
                          {/*  <Button href="#">Download the app</Button>*/}
                        </div>
                      </PopoverPanel>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </Popover>
          <Link href="/" aria-label="Home" className={'z-100'}>
            <Logo />
          </Link>
          <div className="hidden lg:flex lg:gap-10">
            <Navigation />
          </div>
        </div>
        <div className="flex items-center gap-4 z-100">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}