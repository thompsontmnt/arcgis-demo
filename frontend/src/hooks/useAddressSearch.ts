import * as locator from '@arcgis/core/rest/locator'
import { useCallback, useEffect, useRef, useState } from 'react'

const GEOCODER_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'

interface Suggestion {
  text: string
  magicKey: string
}

export function useAddressSearch(
  onResult: (result: __esri.AddressCandidate) => Promise<void>,
) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Array<Suggestion>>([])
  const [loading, setLoading] = useState(false)
  const [suppressSuggestions, setSuppressSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const onQueryChange = (val: string) => {
    setQuery(val)
    setSuppressSuggestions(false)
  }

  useEffect(() => {
    if (suppressSuggestions) {
      setSuggestions([])
      setHighlightedIndex(-1)
      return
    }
    if (!query.trim()) {
      setSuggestions([])
      setHighlightedIndex(-1)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      // cancel prior fetch
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      const savedQuery = query

      try {
        const results = await locator.suggestLocations(GEOCODER_URL, {
          text: savedQuery,
          maxSuggestions: 5,
          signal: abortRef.current.signal,
        } as any)

        // avoid race conditions
        if (savedQuery !== query) return

        const filtered = results
          .filter((s: any) => typeof s.text === 'string' && !!s.text)
          .map((s: any) => ({
            text: s.text,
            magicKey: s.magicKey,
          }))
        setSuggestions(filtered)
        setHighlightedIndex(filtered.length > 0 ? 0 : -1)
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('suggest error:', err)
        }
      }
    }, 200)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      abortRef.current?.abort()
    }
  }, [query, suppressSuggestions])

  const selectSuggestion = useCallback(
    async (sug: Suggestion) => {
      abortRef.current?.abort()

      setQuery(sug.text)
      setSuppressSuggestions(true)
      setSuggestions([])
      setLoading(true)
      setHighlightedIndex(-1)

      try {
        const results = await locator.addressToLocations(GEOCODER_URL, {
          magicKey: sug.magicKey,
          maxLocations: 1,
          address: undefined,
        })

        if (results.length) {
          await onResult(results[0])
        }
      } catch (err) {
        console.error('selectSuggestion error:', err)
      } finally {
        setLoading(false)
      }
    },
    [onResult],
  )

  const submit = useCallback(async () => {
    if (!query.trim()) return

    abortRef.current?.abort()

    setLoading(true)
    setSuggestions([])
    setSuppressSuggestions(true)
    setHighlightedIndex(-1)

    try {
      const results = await locator.addressToLocations(GEOCODER_URL, {
        address: { SingleLine: query },
        maxLocations: 1,
      })

      if (results.length) {
        await onResult(results[0])
      }
    } finally {
      setLoading(false)
    }
  }, [query, onResult])
  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (suggestions.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        )
      } else if (e.key === 'Enter') {
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectSuggestion(suggestions[highlightedIndex])
        } else {
          submit()
        }
      }
    },
    [suggestions, highlightedIndex, selectSuggestion, submit],
  )

  return {
    query,
    onQueryChange,
    suggestions,
    loading,
    selectSuggestion,
    submit,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
  }
}
