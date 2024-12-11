import { BrowserRouter as Router } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <RootLayout>
          <AppRoutes />
        </RootLayout>
      </Router>
    </AuthProvider>
  )
}

export default App
