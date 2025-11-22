import { Theme } from '@radix-ui/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Provider as JotaiProvider } from 'jotai'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'

import { jotaiStore } from './jotai/jotaiStore.ts'
import reportWebVitals from './reportWebVitals.ts'
import { routeTree } from './routeTree.gen'

import './styles.css'
import '@radix-ui/themes/styles.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const queryClient = new QueryClient()

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <Theme appearance="dark" grayColor="slate">
      <Toaster richColors position="top-center" />
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider store={jotaiStore}>
            <RouterProvider router={router} />
          </JotaiProvider>
        </QueryClientProvider>
      </StrictMode>
    </Theme>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
