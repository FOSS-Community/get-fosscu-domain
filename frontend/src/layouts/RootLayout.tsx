import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import '../styles/squiggle.css'
import '../styles/star.css'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="squiggle-bottom bg-emerald-600 text-white" role="navigation">
        <div>
          <div className="nav-row px-8 flex flex-wrap justify-center lg:justify-between items-center">
            <h3 className="xl:pl-32 text-center my-8">
              <Link to="/" className="text-3xl star-link font-bold no-underline">
                <span className="star text-xl mr-1">★</span>
                Get Fosscu Domain
                <span className="star text-xl ml-1">★</span>
              </Link>
              <div className="text-normal">
                a <a href="https://fosscu.org" 
                     className="hover:underline"
                     target="_blank"
                     rel="noopener noreferrer">
                     fosscu
                   </a> project
              </div>
            </h3>
            <div className="w-full lg:w-0"></div> 
            <div className="mr-4 lg:mb-0 mb-8 font-bold">
              <Link to="/about" className="no-underline mx-4">About</Link>
              <Link to="/docs" className="no-underline mx-4">DNS dictionary</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-8 py-12">
        {children}
      </main>
    </div>
  )
} 