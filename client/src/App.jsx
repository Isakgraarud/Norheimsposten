import { Navigate, Route, Routes } from 'react-router-dom'
import { getAuthState } from './services/authService'
import NPFrontPage from './pages/NPFrontPage.jsx'
import LoginPage from './pages/LogInPage.jsx'
import NotFound from './pages/NotFound.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AdminPage from './pages_admin/AdminPage.jsx'
import AdminArticlesManage from './pages_admin/AdminArticlesManage.jsx'
import AdminArticleEditor from './pages_admin/AdminArticleEditor.jsx'
import AdminUsersPage from './pages_admin/AdminUsersPage.jsx'
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

function AdminOnlyRoute({ children }) {
  const authState = getAuthState()

  if (authState?.user?.role !== 'admin') {
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
      <Route
        path="/admin/articles"
        element={
          <AdminProtectedRoute>
            <AdminArticlesManage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/articles/new"
        element={
          <AdminProtectedRoute>
            <AdminArticleEditor mode="new" />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/articles/:id/edit"
        element={
          <AdminProtectedRoute>
            <AdminArticleEditor mode="edit" />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminOnlyRoute>
            <AdminUsersPage />
          </AdminOnlyRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

