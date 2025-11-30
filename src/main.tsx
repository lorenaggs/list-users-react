import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './context/ThemeProvider'
import { UsersProvider } from './context/UsersContext.tsx'
import { ListUsers } from './components/ListUsers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UsersProvider>
        <ListUsers />
      </UsersProvider>
    </ThemeProvider>
  </StrictMode>,
)
