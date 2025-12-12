'use client';

import { type Autocomplete, type Result } from '@/components/search/SearchInput';
import { type AutocompleteCollection } from '@algolia/autocomplete-core';
import { useId } from 'react';
import Highlighter from 'react-highlight-words';

function SearchResult({
                        result,
                        autocomplete,
                        collection,
                        query,
                      }: {
  result: Result
  autocomplete: Autocomplete
  collection: AutocompleteCollection<Result>
  query: string
}) {
  const id = useId();
  console.log(result);

  return (
    <li
      className="group block cursor-default rounded-lg px-3 py-2 bst-bg-aria-selected"
      aria-labelledby={`${id}-ticker ${id}-company`}
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        id={`${id}-ticker`}
        aria-hidden="true"
        className="text-sm bst-text bst-text-group-aria-selected"
      >
        <HighlightQuery text={result.ticker} query={query} />
      </div>
      <div
        id={`${id}-company`}
        aria-hidden="true"
        className="mt-0.5 truncate text-xs whitespace-nowrap bst-text-lighter"
      >
        <HighlightQuery text={result.company} query={query} />
      </div>
    </li>
  );
}

function HighlightQuery({ text, query }: { text: string; query: string }) {
  return (
    <Highlighter
      highlightClassName="group-aria-selected:underline bg-transparent bst-text-primary"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
}


export default function SearchResults(
  {
    autocomplete,
    query,
    collection,
  }: {
    autocomplete: Autocomplete;
    query: string;
    collection: AutocompleteCollection<Result>;
  }) {
  console.log(collection.items);
  if (collection.items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm bst-text">
        No results for &ldquo;
        <span className="wrap-break-word bst-text-primary">
          {query}
        </span>
        &rdquo;
      </p>
    );
  }

  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((result) => (
        <SearchResult
          key={result.url}
          result={result}
          autocomplete={autocomplete}
          collection={collection}
          query={query}
        />
      ))}
    </ul>
  );
}