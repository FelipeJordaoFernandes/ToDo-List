import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TodoProvider } from './components/TodoProvider/index.jsx'

const app = (
  <StrictMode>
    <TodoProvider>
      <App />
    </TodoProvider>
  </StrictMode>
)
const root = document.getElementById('root')
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
