'use client';

import { type Autocomplete } from '@/components/search/SearchInput';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  close: (autocomplete: Autocomplete) => void;
  autocomplete: Autocomplete;
}

export default function CloseOnNavigation({
                                            close,
                                            autocomplete,
                                          }: Props) {

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    close(autocomplete);
  }, [pathname, searchParams, close, autocomplete]);

  return null;
}