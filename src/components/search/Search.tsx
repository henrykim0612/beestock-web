'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchDialog from '@/components/search/SearchDialog';


function getSnapshot() {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl';
}

function getServerSnapshot() {
  // 서버에서는 무조건 이 값 사용
  return 'Ctrl';
}

// 외부 시스템 변경을 구독하는 함수인데,
// 여기서는 navigator 값이 바뀔 일이 없으니까 no-op 으로
function subscribe() {
  return () => {
  };
}

function useSearchProps() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen: useCallback((open: boolean) => {
        const { width = 0, height = 0 } = buttonRef.current?.getBoundingClientRect() ?? {};
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      }, []),
    },
  };
}


export default function Search() {
  const modifierKey = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const { buttonProps, dialogProps } = useSearchProps();


  return (
    <>
      <button
        type="button"
        className="group p-2 rounded-lg flex items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pr-3.5 md:pl-4 md:text-sm md:bst-button-ring lg:w-96 bst-button-bg-hover-mobile"
        {...buttonProps}
      >
        <MagnifyingGlassIcon
          className="bst-icon flex-none" />
        <span className="sr-only md:not-sr-only md:ml-2 md:bst-text-subtle">
          Search for gru, tickers or companies
        </span>
        {modifierKey && (
          <>
            <kbd className="ml-auto hidden text-xs md:block md:bst-text-subtle space-x-1">
              <kbd className={'md:p-1 md:bst-box'}>{modifierKey}</kbd>
              <kbd className={'md:p-1 md:bst-box'}>K</kbd>
            </kbd>
          </>
        )}
      </button>
      <SearchDialog {...dialogProps} />
    </>
  );
}