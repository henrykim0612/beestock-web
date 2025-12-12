'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import LoadingIcon from '@/components/search/LoadingIcon';
import { type AutocompleteApi, type AutocompleteState } from '@algolia/autocomplete-core';
import { ForwardedRef, forwardRef } from 'react';

export type EmptyObject = Record<string, never>
export type Result = {
  ticker: string
  company: string
  url: string
}
export type Autocomplete = AutocompleteApi<
  Result,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>

interface Props {
  autocomplete: Autocomplete;
  autocompleteState: AutocompleteState<Result> | EmptyObject;
  onClose: () => void;
}

function SearchInput({ autocomplete, autocompleteState, onClose }: Props, inputRef: ForwardedRef<HTMLInputElement>) {
  const inputProps = autocomplete.getInputProps({ inputElement: null });

  return (
    <div className="group relative flex h-12">
      <MagnifyingGlassIcon className="pointer-events-none absolute top-0 left-4 bst-icon" />
      <input
        ref={inputRef}
        data-autofocus
        className={clsx(
          'flex-auto appearance-none bg-transparent pl-12 bst-text bst-text-placeholder outline-hidden focus:w-full focus:flex-none sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
          autocompleteState.status === 'stalled' ? 'pr-11' : 'pr-4',
        )}
        {...inputProps}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !autocompleteState.isOpen && autocompleteState.query === '') {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            onClose();
          } else {
            inputProps.onKeyDown(event);
          }
        }}
      />
      {autocompleteState.status === 'stalled' && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon
            className="h-6 w-6 animate-spin stroke-slate-200 text-slate-400 dark:stroke-zinc-700 dark:text-zinc-400" />
        </div>
      )}
    </div>
  );
}

export default forwardRef(SearchInput);
