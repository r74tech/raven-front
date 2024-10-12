import React, { useState, useEffect, useRef } from 'react'
import {
  InstantSearch,
  SearchBox,
  Hits,
  Snippet,
  Configure,
  Pagination,
  Highlight,
  Stats,
  useInstantSearch,
} from 'react-instantsearch'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const { searchClient } = instantMeiliSearch(
  import.meta.env.VITE_MEILISEARCH_API_URL,
  import.meta.env.VITE_MEILISEARCH_API_KEY
)

export default function Component() {
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const indexName = 'site_scp-jp'
  const iframeRef = useRef(null);

  useEffect(() => {
    const updateIframeHeight = () => {
      const newHeight = iframeRef.current.scrollHeight;
      window.parent.postMessage({ pageHeight: newHeight }, '*');
    };

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(updateIframeHeight);
      if (iframeRef.current) {
        observer.observe(iframeRef.current);
      }
      return () => observer.disconnect();
    }

    const interval = setInterval(updateIframeHeight, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 shadow-lg rounded-lg p-6" ref={iframeRef}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-700">サイト内を検索する</h1>
      </header>

      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure
          hitsPerPage={hitsPerPage}
          attributesToSnippet={['source:5']}
          snippetEllipsisText={'...'}
          attributesToHighlight={['*']}
        />
        
        <div className="mb-6 flex items-center justify-between">
          <SearchBox
            placeholder="Search..."
            classNames={{
              root: 'flex-grow',
              form: 'relative',
              input: 'w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              submit: 'absolute inset-y-0 left-0 pl-3 flex items-center',
              submitIcon: 'h-5 w-5 text-slate-400',
              reset: 'absolute inset-y-0 right-0 pr-3 flex items-center',
              resetIcon: 'h-5 w-5 text-slate-400',
            }}
            submitIconComponent={() => (
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            )}
          />
        </div>
        
        <SearchResults indexName={indexName} />
        
      </InstantSearch>

      <footer className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
        <svg width="20" height="20" viewBox="0 0 368.96 344.46" xmlns="http://www.w3.org/2000/svg">
          <metadata>
            <creator>R74</creator>
            <description>Umbrella Icon</description>
            <license>CC BY 4.0</license>
          </metadata>
          <g id="_umbrella_2-2" data-name="umbrella 2">
            <g>
              <path style={{ fill: "#fff", stroke: "#231815", strokeMiterlimit: 10,strokeWidth: "8px"}} d="M319.3,336.25c-11.53,14.07-6.66-11.03-7.35-18.93-3.81-43.83-40.73-57.79-79.73-53.89,14.55-33.36-2.18-63.63-37.86-69.48-26.44,23.58-119.99,123.75-136.29,136.29-30.7,23.62-80.94-20.31-36.52-55.23q8.24,7.57,16.48,15.14c.29,5.08-8.52,10.34-7.13,15.14,1.13,3.9,6.12,5.56,9.35,3.56,8.11-5.03,115.81-118.17,134.95-134.95-4.96-34.15-39.36-53.14-69.48-34.3,2.6-34.96-3.35-69.03-41.87-80.17-22.91-6.63-57.14,6.99-27.17-13.36C63.91,27.6,110.32,9.84,143.15,5.55c55.69-7.29,122.02,11.41,162.57,50.78,9.88-2.27,6.4,6.94,6.68,7.57.62,1.38,52.47,60.52,52.56,130.95.09,80.45-37.66,131.65-45.65,141.41Z"/>
              <g>
                <path style={{fill: "#231815",strokeWidth: 0}} d="M336.9,116c32.23,63.53,20.93,141.6-16.03,200.43-1.04-18.9-11.76-36.79-26.28-48.55-4.38-3.54-12.52-5.92-12.92-8.91,23.29-45.57,42.97-93.2,55.23-142.97Z"/>
                <path style={{fill: "#231815",strokeWidth: 0}} d="M252.72,33.16s1.03-.7,0,0c-51.12,6.08-98.5,29.2-142.97,53.89-2.44.09-7.15-10.61-9.8-13.81-12.49-15.07-30.03-23.98-49.74-24.59C96.42,20.91,151.31,6.39,205.06,16.24c7.61,1.39,43.62,13.27,47.66,16.93Z"/>
                <path style={{fill: "#231815",strokeWidth: 0}} d="M289.68,53.65c.66.59,2.76,2.44,2.67,3.12-61.04,2.8-127.25,32.8-176.82,67.7.63-9.85-1.87-19.35-3.56-28.95,35.31-20.11,101.18-50.44,140.74-54.34,13.44-1.32,26.78,3.24,36.97,12.47Z"/>
                <path style={{fill: "#231815",strokeWidth: 0}} d="M327.99,103.53c4.17,22.53-40.71,127.99-54.34,152.77-1.81,1.65-21.76-3.76-26.28-2.67,33.44-53.82,62.6-113.62,64.64-178.08,4.36,5.78,14.43,19.64,15.97,27.98Z"/>
                <g>
                  <path style={{fill: "#231815",strokeWidth: 0}} d="M303.49,71.91c-1.73,45.56-16.68,91.91-37.41,132.28-2.09,4.07-16.55,30.74-17.82,32.07-3.74,3.95-1.09-8.88-8.02-20.93-10.73-18.68-29.36-29.15-50.68-30.84l113.93-112.58Z"/>
                  <path style={{fill: "#231815",strokeWidth: 0}} d="M297.26,64.78l-113.07,114.42c-1.06-28.57-21.78-53.7-50.84-55.63-.29-2.2,29.44-18.42,33.4-20.49,37.7-19.65,87.73-37.06,130.5-38.3Z"/>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span className="text-sm text-slate-600">Powered by Drizzles</span>
      </footer>
    </div>
  )
}

function SearchResults({ indexName }) {
  const { results, indexUiState } = useInstantSearch()

  if (!indexUiState.query && results.__isArtificial) {
    return null
  }

  if (!indexUiState.query && results.nbHits > 0) {
    return null
  }

  if (indexUiState.query && results.nbHits === 0) {
    return <p className="text-center text-slate-500 my-4">検索結果が見つかりませんでした。</p>
  }

  return (
    <>
      <Stats
        classNames={{
          root: 'text-sm text-slate-500 mb-4',
        }}
        translations={{
          stats(nbHits, processingTimeMS) {
            return `${nbHits} 件の結果が見つかりました (${processingTimeMS} ms)`
          },
        }}
      />

      <Hits
        hitComponent={(props) => <Hit {...props} indexName={indexName} />}
        classNames={{
          list: 'space-y-4',
        }}
      />
      
      {results.nbHits > 0 && (
        <div className="mt-6">
          <Pagination
            classNames={{
              list: 'flex justify-center space-x-2',
              item: 'px-3 py-2 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50',
              selectedItem: 'bg-blue-100 text-blue-700',
            }}
            padding={2}
          />
        </div>
      )}
    </>
  )
}

function Hit({ hit, indexName }) {
  const cleanIndexName = indexName.replace(/^site_/, '');
  const pageUrl = `http://${cleanIndexName}.wikidot.com/${hit.fullname}`;

  return (
    <a href={pageUrl} className="block border-b border-slate-200 p-4 hover:bg-slate-200 rounded-lg transition" target="_blank" rel="noopener noreferrer">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          <Highlight attribute="title" hit={hit} />
        </h3>
        <p className="text-sm text-slate-600 mb-2">
          <Snippet attribute="fullname" hit={hit} />
        </p>
        <div className="text-xs text-slate-500">
          <Snippet attribute="source" hit={hit} />
        </div>
      </div>
    </a>
  );
}