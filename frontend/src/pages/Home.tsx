import Domain from '@/components/Domain';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { login, isLoading, user } = useAuth();

  if (user) {
    return <Domain />;
  }

  return (
      <div className="max-w-3xl mx-auto mt-12 w-full bg-white border-l-4 border-emerald-500 rounded-lg shadow-md p-10">
        <div className="relative">
          <h1 className="font-bold text-3xl md:text-4xl text-slate-800 mb-2">
            Welcome to Get Fosscu Domain!
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-100 rounded-full -z-10 opacity-50" />
          </h1>
          
          <div className="relative">
            <p className="text-lg text-slate-600 mt-8 leading-relaxed">
              It's easy to establish your FOSSCU project's online presence!
              Here you can get a free domain for your open source project
              and manage it with ease.
            </p>

            <p className="text-lg text-slate-600 mt-6">
              Click the button below to get started.
            </p>
            
            <div className="absolute -right-6 bottom-0 w-16 h-16 bg-emerald-50 rounded-full -z-10 opacity-50" />
          </div>
        </div>
        
        <div className="mt-12 relative">
          <button 
            onClick={() => login()}
            disabled={isLoading}
            className={`
              relative overflow-hidden
              bg-emerald-600 text-white font-semibold
              px-8 py-3 rounded-md text-lg
              transform transition-all duration-200
              hover:bg-emerald-700 hover:shadow-lg
              active:scale-95
              flex items-center justify-center gap-3
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Connecting to GitHub...</span>
              </>
            ) : (
              <>
                <span>Get your domain</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
          <div className="absolute -left-4 top-1/2 w-12 h-12 bg-emerald-100 rounded-full -z-10 opacity-50" />
        </div>
    </div>
  );
} 