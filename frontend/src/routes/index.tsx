import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Docs from '@/pages/Docs'
import GithubCallback from '@/pages/GithubCallback'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/auth/github/callback" element={<GithubCallback />} />
    </Routes>
  )
} 