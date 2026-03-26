import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
      <AuthProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>

)
