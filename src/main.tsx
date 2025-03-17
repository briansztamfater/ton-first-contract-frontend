import './index.css'

import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { createRoot } from 'react-dom/client'

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/markokhman/func-course-chapter-5-code/master/public/manifest.json';

createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
)
