/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

type fetchDataType = (object: {
  pageNumber?: number
  searchQuery?: string
}) => Promise<Array<string>>

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))

const fetchDataAndUpdateUrl: fetchDataType = async object => {
  console.log('handleSubmit:')
  // used passed values if they exist, otherwise use state
  const { pageNumber = 1, searchQuery = null } = object
  let queryString = '?'

  if (pageNumber) queryString += `pageNumber=${pageNumber}&`
  if (searchQuery) queryString += `searchQuery=${searchQuery}&`

  await fetch(`api/whatever${queryString}`) // random api call with query string
  router.push(`${router.pathname}/${queryString}`, undefined, { shallow: true }) // update router

  const dummyData = [
    ...(searchQuery !== undefined ? [`pageNumber: ${pageNumber}`] : []),
    ...(pageNumber !== undefined ? [`query: ${searchQuery}`] : []),
  ]
  console.log('22')
  await delay(1000)
  return dummyData
}

const Index = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<any[]>([]) // results after fetching (for the sake of this demo) are just request paramters in fetchDataAndUpdateUrl

  const handlePageChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    console.log('handlePageChange: ')
    setIsSubmitting(true)
    const pageVal = Number(e.target.value)
    setPageNumber(pageVal)
    const dummyData = await fetchDataAndUpdateUrl({ pageNumber: pageVal, searchQuery })
    setResults(dummyData)
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setSearchQuery('')
    setPageNumber(1)
    setResults([])
    router.push({
      pathname: router.pathname,
      query: {},
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (isSubmitting) return
    e && e.preventDefault()
    setIsSubmitting(true)
    const dummyData = await fetchDataAndUpdateUrl({ pageNumber, searchQuery })
    setResults(dummyData)
    setIsSubmitting(false)
  }

  const { isReady } = router

  useEffect(() => {
    if (!isReady) return // wait for router query params to be available

    // 🔥 Implement solution here
    // extract query params and set in local state:
    // const pageNumberParam = router.query.pageNumber
    // const searchQueryParam router.query.searchQuery
    // setPageNumber(pageNumberParam)
    // setSearchQuery(searchQueryParam)
    // fire off fetch - fetchDataAndUpdateUrl({ pageNumber, searchQuery })
  }, [isReady])

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <Link href="/v4-fetch-in-useeffect">
        <a>/v4-fetch-in-useeffect</a>
      </Link>

      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          fetch data
        </button>
        <button type="button" onClick={handleReset} disabled={isSubmitting}>
          reset
        </button>
      </form>

      <label>
        Page
        <select value={pageNumber} onChange={handlePageChange} disabled={isSubmitting}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>

      {results && (
        <div>
          <b>Submitted request parameters:</b>
          {results.map((result, i) => (
            <div key={i}>
              <p style={{ marginBottom: '2px' }}>{result}</p>
            </div>
          ))}
        </div>
      )}

      <Explanation />
    </div>
  )
}
export default Index

const Explanation = () => {
  return (
    <div style={{ marginTop: '40px' }}>
      <hr />

      <h4>🗣️ Explanation</h4>

      <h5>
        TLDR: On mount AND route change - extract query parameters, update local app state, and
        fetch some data - with only one 1 fetch request.{' '}
        <sup>(no multiple fetches due to multiple re-renders)</sup>
      </h5>

      <p>⚠️ NOTE: the local state need to remains as is, I cannot use the url as the app state.</p>

      <p>
        This example app has a form with a couple of inputs. When the form is submitted the app
        fetches data. The value of those inputs are added to the query string of the fetch request
        like <code>api/whatever?pageNumber=1&searchQuery=foo</code>.
      </p>

      <p>
        On fetching / submission of the form the input values are be added to the url as query
        params. The page input automatically submits the form on change (intended behavior).
      </p>

      <p>
        This means the url is sharable - so on mount and when going forward and backward the app
        needs to extarct those query params, update local state, and fetch the data.
      </p>
    </div>
  )
}
