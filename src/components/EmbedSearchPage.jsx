import React, { useState } from 'react'
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  SortBy,
  Configure,
  Pagination,
  Highlight,
  Stats,
  useInstantSearch,
} from 'react-instantsearch'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'

const { searchClient } = instantMeiliSearch(
  import.meta.env.VITE_MEILISEARCH_API_URL,
  import.meta.env.VITE_MEILISEARCH_API_KEY
)

export default function Component() {
  const [hitsPerPage, setHitsPerPage] = useState(10)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sortBy, setSortBy] = useState('site_scp-jp')

  return (
    <div className="min-h-screen bg-gray-100 shadow-lg rounded-lg p-6">
      <InstantSearch searchClient={searchClient} indexName="site_scp-jp">
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
          
          <Menu as="div" className="relative ml-4">
            {({ open }) => (
              <>
                <Menu.Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  設定
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                {isMenuOpen && (
                  <Menu.Items static className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2">
                        <h3 className="font-semibold text-gray-900 mb-2">表示件数</h3>
                        <select
                          value={hitsPerPage}
                          onChange={(e) => setHitsPerPage(Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="10">10件</option>
                          <option value="20">20件</option>
                          <option value="50">50件</option>
                        </select>
                      </div>
                      <div className="px-4 py-2">
                        <h3 className="font-semibold text-gray-900 mb-2">並び替え</h3>
                        <SortBy
                          items={[
                            { value: 'site_scp-jp', label: '関連度順' },
                            { value: 'site_scp-jp:created_at:desc', label: '新しい順' },
                            { value: 'site_scp-jp:created_at:asc', label: '古い順' },
                            { value: 'site_scp-jp:title:asc', label: 'タイトル昇順' },
                            { value: 'site_scp-jp:title:desc', label: 'タイトル降順' },
                          ]}
                          classNames={{
                            root: 'relative inline-block text-left w-full',
                            select: 'block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline',
                          }}
                          onChange={(value) => setSortBy(value)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </Menu.Items>
                )}
              </>
            )}
          </Menu>
        </div>
        
        <SearchResults />
        
      </InstantSearch>
    </div>
  )
}

function SearchResults() {
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

      <Hits hitComponent={Hit} />
      
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

function Hit({ hit }) {
  const linkText = hit.title || hit.fullname
  return (
    <div className="border-b border-gray-200 py-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        <a href={hit.url} className="hover:underline">
          {linkText}
        </a>
      </h2>
      <p className="text-gray-600 mb-2">{hit.description}</p>
      <p className="text-sm text-gray-500 mb-2">カテゴリ: {hit.category}</p>
      <Highlight attribute="source" hit={hit} classNames={{
        highlighted: 'bg-yellow-200',
      }} />
    </div>
  )
}