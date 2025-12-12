'use client';

import { Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import SearchInput, { type Autocomplete, type EmptyObject, type Result } from '@/components/search/SearchInput';
import { useRouter } from 'next/navigation';
import { type AutocompleteState, createAutocomplete } from '@algolia/autocomplete-core';
import { Dialog, DialogPanel } from '@headlessui/react';
import clsx from 'clsx';
import CloseOnNavigation from '@/components/search/CloseOnNavigation';
import SearchResults from '@/components/search/SearchResults';

const TICKERS = [
  { ticker: 'AAPL', company: 'Apple Inc.', url: '/tickers/aapl' },
  { ticker: 'MSFT', company: 'Microsoft Corporation', url: '/tickers/msft' },
  { ticker: 'AMZN', company: 'Amazon.com, Inc.', url: '/tickers/amzn' },
  { ticker: 'GOOGL', company: 'Alphabet Inc. (Class A)', url: '/tickers/googl' },
  { ticker: 'GOOG', company: 'Alphabet Inc. (Class C)', url: '/tickers/goog' },
  { ticker: 'META', company: 'Meta Platforms, Inc.', url: '/tickers/meta' },
  { ticker: 'NVDA', company: 'NVIDIA Corporation', url: '/tickers/nvda' },
  { ticker: 'TSLA', company: 'Tesla, Inc.', url: '/tickers/tsla' },
  { ticker: 'BRK.B', company: 'Berkshire Hathaway Inc.', url: '/tickers/brk-b' },
  { ticker: 'JPM', company: 'JPMorgan Chase & Co.', url: '/tickers/jpm' },
  { ticker: 'V', company: 'Visa Inc.', url: '/tickers/v' },
  { ticker: 'MA', company: 'Mastercard Incorporated', url: '/tickers/ma' },
  { ticker: 'UNH', company: 'UnitedHealth Group Incorporated', url: '/tickers/unh' },
  { ticker: 'HD', company: 'The Home Depot, Inc.', url: '/tickers/hd' },
  { ticker: 'PG', company: 'Procter & Gamble Company', url: '/tickers/pg' },
  { ticker: 'XOM', company: 'Exxon Mobil Corporation', url: '/tickers/xom' },
  { ticker: 'LLY', company: 'Eli Lilly and Company', url: '/tickers/lly' },
  { ticker: 'JNJ', company: 'Johnson & Johnson', url: '/tickers/jnj' },
  { ticker: 'AVGO', company: 'Broadcom Inc.', url: '/tickers/avgo' },
  { ticker: 'COST', company: 'Costco Wholesale Corporation', url: '/tickers/cost' },
  { ticker: 'PEP', company: 'PepsiCo, Inc.', url: '/tickers/pep' },
  { ticker: 'KO', company: 'The Coca-Cola Company', url: '/tickers/ko' },
  { ticker: 'MRK', company: 'Merck & Co., Inc.', url: '/tickers/mrk' },
  { ticker: 'ABBV', company: 'AbbVie Inc.', url: '/tickers/abbv' },
  { ticker: 'CRM', company: 'Salesforce, Inc.', url: '/tickers/crm' },
  { ticker: 'NFLX', company: 'Netflix, Inc.', url: '/tickers/nflx' },
  { ticker: 'ADBE', company: 'Adobe Inc.', url: '/tickers/adbe' },
  { ticker: 'ORCL', company: 'Oracle Corporation', url: '/tickers/orcl' },
  { ticker: 'AMD', company: 'Advanced Micro Devices, Inc.', url: '/tickers/amd' },
  { ticker: 'INTC', company: 'Intel Corporation', url: '/tickers/intc' },
  { ticker: 'CSCO', company: 'Cisco Systems, Inc.', url: '/tickers/csco' },
  { ticker: 'QCOM', company: 'QUALCOMM Incorporated', url: '/tickers/qcom' },
  { ticker: 'TXN', company: 'Texas Instruments Incorporated', url: '/tickers/txn' },
  { ticker: 'AMAT', company: 'Applied Materials, Inc.', url: '/tickers/amat' },
  { ticker: 'NOW', company: 'ServiceNow, Inc.', url: '/tickers/now' },
  { ticker: 'IBM', company: 'International Business Machines Corporation', url: '/tickers/ibm' },
  { ticker: 'GE', company: 'General Electric Company', url: '/tickers/ge' },
  { ticker: 'CAT', company: 'Caterpillar Inc.', url: '/tickers/cat' },
  { ticker: 'BA', company: 'The Boeing Company', url: '/tickers/ba' },
  { ticker: 'MMM', company: '3M Company', url: '/tickers/mmm' },
  { ticker: 'WMT', company: 'Walmart Inc.', url: '/tickers/wmt' },
  { ticker: 'TGT', company: 'Target Corporation', url: '/tickers/tgt' },
  { ticker: 'LOW', company: 'Lowe’s Companies, Inc.', url: '/tickers/low' },
  { ticker: 'MCD', company: 'McDonald’s Corporation', url: '/tickers/mcd' },
  { ticker: 'SBUX', company: 'Starbucks Corporation', url: '/tickers/sbux' },
  { ticker: 'DIS', company: 'The Walt Disney Company', url: '/tickers/dis' },
  { ticker: 'NKE', company: 'NIKE, Inc.', url: '/tickers/nke' },
  { ticker: 'PFE', company: 'Pfizer Inc.', url: '/tickers/pfe' },
  { ticker: 'CVX', company: 'Chevron Corporation', url: '/tickers/cvx' },
  { ticker: 'BAC', company: 'Bank of America Corporation', url: '/tickers/bac' },
  { ticker: 'WFC', company: 'Wells Fargo & Company', url: '/tickers/wfc' },
  { ticker: 'GS', company: 'The Goldman Sachs Group, Inc.', url: '/tickers/gs' },
  { ticker: 'MS', company: 'Morgan Stanley', url: '/tickers/ms' },
  { ticker: 'BLK', company: 'BlackRock, Inc.', url: '/tickers/blk' },
  { ticker: 'SPGI', company: 'S&P Global Inc.', url: '/tickers/spgi' },
  { ticker: 'RTX', company: 'RTX Corporation', url: '/tickers/rtx' },
  { ticker: 'LMT', company: 'Lockheed Martin Corporation', url: '/tickers/lmt' },
  { ticker: 'DE', company: 'Deere & Company', url: '/tickers/de' },
  { ticker: 'UPS', company: 'United Parcel Service, Inc.', url: '/tickers/ups' },
  { ticker: 'FDX', company: 'FedEx Corporation', url: '/tickers/fdx' },
  { ticker: 'PLTR', company: 'Palantir Technologies Inc.', url: '/tickers/pltr' },
  { ticker: 'SNOW', company: 'Snowflake Inc.', url: '/tickers/snow' },
  { ticker: 'UBER', company: 'Uber Technologies, Inc.', url: '/tickers/uber' },
  { ticker: 'ABNB', company: 'Airbnb, Inc.', url: '/tickers/abnb' },
  { ticker: 'COIN', company: 'Coinbase Global, Inc.', url: '/tickers/coin' },
  { ticker: 'PYPL', company: 'PayPal Holdings, Inc.', url: '/tickers/pypl' },
  { ticker: 'SHOP', company: 'Shopify Inc.', url: '/tickers/shop' },
  { ticker: 'SQ', company: 'Block, Inc.', url: '/tickers/sq' },
  { ticker: 'TWLO', company: 'Twilio Inc.', url: '/tickers/twlo' },
  { ticker: 'ZM', company: 'Zoom Video Communications, Inc.', url: '/tickers/zm' },
];

function useAutocomplete({ close }: { close: (autocomplete: Autocomplete) => void }) {
  const id = useId();
  const router = useRouter();
  const [autocompleteState, setAutocompleteState] = useState<AutocompleteState<Result> | EmptyObject>({});

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (!itemUrl) {
      return;
    }

    router.push(itemUrl);

    if (itemUrl === window.location.pathname + window.location.search + window.location.hash) {
      // eslint-disable-next-line react-hooks/immutability
      close(autocomplete);
    }
  }

  const [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: 'Search for gru, tickers or companies',
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== '';
      },
      navigator: {
        navigate,
      },
      getSources({ query }) {
        // return import('@/markdoc/search.mjs').then(({ search }) => {
        //   return [
        //     {
        //       sourceId: 'documentation',
        //       getItems() {
        //         return search(query, { limit: 5 });
        //       },
        //       getItemUrl({ item }) {
        //         return item.url;
        //       },
        //       onSelect: navigate,
        //     },
        //   ];
        // });
        return [
          {
            sourceId: 'links',
            getItems() {
              return TICKERS.filter(
                (item) =>
                  item.ticker.toLowerCase().includes(query.toLowerCase()) || item.company.toLowerCase().includes(query.toLowerCase()),
              );
            },
            getItemUrl({ item }) {
              return item.url;
            },
            onSelect: navigate,
          },
        ];
      },
    }),
  );

  return { autocomplete, autocompleteState };
}

export default function SearchDialog(
  {
    open,
    setOpen,
    className,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    className?: string;
  }) {
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
  const handleInputRef = useCallback((node: HTMLInputElement | null) => {
    setInputElement(node);       // form용으로는 state 사용
  }, []);

  const close = useCallback(
    (autocomplete: Autocomplete) => {
      setOpen(false);
      autocomplete.setQuery('');
    },
    [setOpen],
  );

  const { autocomplete, autocompleteState } = useAutocomplete({
    close() {
      close(autocomplete);
    },
  });

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <>
      <Suspense fallback={null}>
        <CloseOnNavigation close={close} autocomplete={autocomplete} />
      </Suspense>
      <Dialog
        open={open}
        onClose={() => close(autocomplete)}
        className={clsx('fixed inset-0 z-50', className)}
      >
        <div className="fixed inset-0 bst-backdrop" />
        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <DialogPanel
            className="mx-auto transform-gpu overflow-hidden rounded-md bst-bg shadow-xl sm:max-w-xl bst-ring-dark">
            <div {...autocomplete.getRootProps({})}>
              <form
                ref={formRef}
                {...autocomplete.getFormProps({
                  inputElement: inputElement ?? null,
                })}
              >
                <SearchInput
                  ref={handleInputRef}
                  autocomplete={autocomplete}
                  autocompleteState={autocompleteState}
                  onClose={() => setOpen(false)}
                />
                <div
                  ref={panelRef}
                  className="border-t bst-border-color bst-bg px-2 py-3 empty:hidden"
                  {...autocomplete.getPanelProps({})}
                >
                  {autocompleteState.isOpen && (
                    <SearchResults
                      autocomplete={autocomplete}
                      query={autocompleteState.query}
                      collection={autocompleteState.collections[0]}
                    />
                  )}
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}