import { Navigate, Route, Routes } from 'react-router-dom'
import { getAuthState } from './services/authService'
import NPFrontPage from './pages/NPFrontPage.jsx'
import LoginPage from './pages/LogInPage.jsx'
import NotFound from './pages/NotFound.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AdminPage from './pages_admin/AdminPage.jsx'
import FlappyPage from './games/flappy.jsx'
import MemesPage from './pages/MemesPage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import GamePage from './pages/GamePage.jsx'

function AdminProtectedRoute({ children }) {
  const authState = getAuthState()
  const userRole = authState?.user?.role
  const isAllowed = userRole === 'editor' || userRole === 'admin'

  if (!isAllowed) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<NPFrontPage />} />
      <Route path="/articles/:articleId" element={<ArticlePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/memes" element={<MemesPage />} />
      <Route path="/games" element={<GamePage />} />
      <Route path="/game" element={<GamePage />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminPage />
          </AdminProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

