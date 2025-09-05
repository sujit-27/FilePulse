import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { store } from './app/store.js';

const ClerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={ClerkPublishableKey}>
    <Provider store={store}>
      <App/>
    </Provider>
  </ClerkProvider>
)
