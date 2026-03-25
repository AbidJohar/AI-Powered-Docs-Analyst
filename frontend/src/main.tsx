import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // retry failed requests once
      refetchOnWindowFocus: false, // don't refetch when tab regains focus
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>

)
