import Domain from '@/components/Domain';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { login, isLoading, user } = useAuth();

  if (user) {
    return <Domain />;
  }

  return (
    <div className="bg-white p-8 w-full m-auto flex mt-32" style={{ maxWidth: '40em' }}>
      <div className="m-auto">
        <h1 className="font-bold text-3xl text-center">
          Welcome to Get Fosscu Domain!
        </h1>
        <p className="mt-8 mb-4 text-xl">
          It's easy to establish your FOSSCU project's online presence!
          Here you can get a free domain for your open source project
          and manage it with ease.
        </p>

        <p className="mb-8 text-xl">
          Click the button below to get started.
        </p>
        
        <div className="text-center mt-16">
          <button 
            onClick={() => login()}
            disabled={isLoading}
            className={`no-underline bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xl flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Connecting to GitHub...
              </>
            ) : (
              'Get your domain'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 