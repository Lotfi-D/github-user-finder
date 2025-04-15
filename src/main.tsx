import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import EditModeProvider from './providers/editMode/EditModeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EditModeProvider>
      <App />
    </EditModeProvider>
  </StrictMode>,
)
