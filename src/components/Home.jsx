import { useState, useEffect } from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  Configure,
  Snippet,
  RefinementList,
  Stats,
  useInstantSearch,
} from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { Oval } from 'react-loader-spinner';

export default function Home() {
  const [indexName, setIndexName] = useState('site_scp-jp');
  const [showMore, setShowMore] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [searchClient, setSearchClient] = useState(null);
  const [availableIndexes, setAvailableIndexes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey') || import.meta.env.VITE_MEILISEARCH_API_KEY;
    const storedIndexName = localStorage.getItem('indexName') || 'site_scp-jp';
    if (storedApiKey) {
      setApiKey(storedApiKey);
      const client = instantMeiliSearch(import.meta.env.VITE_MEILISEARCH_API_URL, storedApiKey);
      setSearchClient(client.searchClient);
    }
    setIndexName(storedIndexName);
  }, []);

  const fetchIndexes = async () => {
    if (apiKey) {
      const client = instantMeiliSearch(import.meta.env.VITE_MEILISEARCH_API_URL, apiKey);
      setSearchClient(client.searchClient);
      try {
        const response = await fetch(`${import.meta.env.VITE_MEILISEARCH_API_URL}/indexes`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const indexes = await response.json();
        setAvailableIndexes(indexes.results.map((index) => index.uid));
      } catch (error) {
        console.error('インデックスの取得に失敗しました:', error);
      }
    }
  };

  const saveSettings = () => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('indexName', indexName);
    const client = instantMeiliSearch(import.meta.env.VITE_MEILISEARCH_API_URL, apiKey);
    setSearchClient(client.searchClient);
    setShowModal(false);
  };

  if (!searchClient) {
    return <div className="text-center py-10">ロード中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SCP-JP 全文検索</h1>

        <InstantSearch
          indexName={indexName}
          searchClient={searchClient}
        >
          <Configure
            hitsPerPage={10}
            attributesToSnippet={['source:5', 'fullname:5']}
            snippetEllipsisText={'...'}
            attributesToHighlight={['*']}
          />

          <div className="mb-6">
            <SearchBox
              classNames={{
                root: 'relative',
                form: 'relative',
                input: 'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                submit: 'absolute inset-y-0 left-0 pl-3 flex items-center',
                submitIcon: 'h-5 w-5 text-gray-400',
                reset: 'absolute inset-y-0 right-0 pr-3 flex items-center',
                resetIcon: 'h-5 w-5 text-gray-400',
              }}
              placeholder="検索..."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">カテゴリで絞り込む</h2>
                <RefinementList
                  attribute="category"
                  limit={showMore ? 1000 : 10}
                  showMore={true}
                  showMoreLimit={1000}
                  classNames={{
                    list: 'space-y-2',
                    label: 'flex items-center',
                    checkbox: 'mr-2 rounded',
                    labelText: 'text-sm text-gray-700',
                    count: 'ml-1 text-xs text-gray-500',
                    showMore: 'mt-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer',
                  }}
                  translations={{
                    showMore(expanded) {
                      return expanded ? '一部のカテゴリを表示' : 'すべてのカテゴリを表示';
                    },
                  }}
                  transformItems={(items) =>
                    items.map((item) => ({
                      ...item,
                      label: `${item.label}`,
                      count: `(${item.count}件)`,
                    }))
                  }
                />
                <div className="mt-4">
                  <ClearRefinements
                    classNames={{
                      button: 'px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    }}
                    translations={{
                      resetButtonText: 'クリア',
                    }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                onClick={() => setShowModal(true)}
                className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                設定
                </button>
              </div>
            </div>


            <div className="w-full md:w-2/3">
              <div className="bg-white p-4 rounded-lg shadow">
                <SearchResults />
              </div>
            </div>
          </div>
        </InstantSearch>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">APIキーとインデックス設定</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">APIキー</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">インデックスを選択</label>
                <button
                  onClick={fetchIndexes}
                  className="mb-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  インデックスを取得
                </button>

                <select
                  value={indexName}
                  onChange={(e) => setIndexName(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {availableIndexes.map((index) => (
                    <option key={index} value={index}>{index}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={saveSettings}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SearchResults() {
  const { results, isSearching } = useInstantSearch()

  if (isSearching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Oval
          height={40}
          width={40}
          color="#3b82f6"
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#93c5fd"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />
      </div>
    )
  }

  if (results.nbHits === 0) {
    return <div className="text-center text-gray-500">検索結果が見つかりませんでした</div>
  }

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
      <Hits
        hitComponent={Hit}
        classNames={{
          list: 'space-y-4',
        }}
      />
      <div className="mt-4">
        <Pagination
          classNames={{
            list: 'flex justify-center space-x-2',
            item: 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50',
            selectedItem: 'bg-blue-100 text-blue-700',
          }}
          padding={2}
        />
      </div>
    </>
  )
}

function Hit({ hit }) {
  return (
    <div className="border-b border-gray-200 pb-4">
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
  )
}