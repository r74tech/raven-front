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

      // Send the height to the parent window
      window.parent.postMessage({ pageHeight: newHeight }, '*');
    };

    // Use ResizeObserver to track changes in height
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(updateIframeHeight);
      if (iframeRef.current) {
        observer.observe(iframeRef.current);
      }

      // Cleanup observer on component unmount
      return () => observer.disconnect();
    }

    // Fallback: use setInterval if ResizeObserver is not supported
    const interval = setInterval(updateIframeHeight, 250);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 shadow-lg rounded-lg p-6" ref={iframeRef}>
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
              input: 'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
              submit: 'absolute inset-y-0 left-0 pl-3 flex items-center',
              submitIcon: 'h-5 w-5 text-gray-400',
              reset: 'absolute inset-y-0 right-0 pr-3 flex items-center',
              resetIcon: 'h-5 w-5 text-gray-400',
            }}
            submitIconComponent={() => (
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            )}
          />
        </div>
        
        <SearchResults indexName={indexName} />
        
      </InstantSearch>
    </div>
  )
}

function SearchResults({ indexName }) {
  const { results, indexUiState } = useInstantSearch()

  // 初期状態（検索クエリが空で、かつ検索が実行されていない）
  if (!indexUiState.query && results.__isArtificial) {
    return null
  }

  // 検索クエリが空で、結果がある場合（全件表示状態）
  if (!indexUiState.query && results.nbHits > 0) {
    return null
  }

  // 検索クエリがあるが結果がない場合
  if (indexUiState.query && results.nbHits === 0) {
    return <p className="text-center text-gray-500 my-4">検索結果が見つかりませんでした。</p>
  }

  // 検索結果がある場合
  return (
    <>
      <Stats
        classNames={{
          root: 'text-sm text-gray-500 mb-4',
        }}
        translations={{
          stats(nbHits, processingTimeMS) {
            return `${nbHits} 件の結果が見つかりました (${processingTimeMS} ms)`
          },
        }}
      />

      <Hits         hitComponent={(props) => <Hit {...props} indexName={indexName} />}
        classNames={{
          list: 'space-y-4',
        }}
      />
      
      {results.nbHits > 0 && (
        <div className="mt-6">
          <Pagination
            classNames={{
              list: 'flex justify-center space-x-2',
              item: 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50',
              selectedItem: 'bg-blue-100 text-blue-700',
            }}
            padding = {2}
          />
        </div>
      )}
    </>
  )
}



function Hit({ hit, indexName }) {
  // indexName から "site_" を削除したクリーンなバージョンを取得
  const cleanIndexName = indexName.replace(/^site_/, '');

  // インデックス名を考慮したリンクを生成
  const pageUrl = `http://${cleanIndexName}.wikidot.com/${hit.fullname}`;

  return (
    <a href={pageUrl} className="block border-b border-gray-200 p-4 hover:bg-gray-300 rounded-lg transition" target="_blank" rel="noopener noreferrer">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <Highlight attribute="title" hit={hit} />
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          <Snippet attribute="fullname" hit={hit} />
        </p>
        <div className="text-xs text-gray-500">
          <Snippet attribute="source" hit={hit} />
        </div>
      </div>
    </a>
  );
}

