import { useState } from 'react';
import Domain from '@/components/Domain';

export default function Home() {
  const [showDomain, setShowDomain] = useState(false);

  if (showDomain) {
    return <Domain setShowDomain={setShowDomain} />;
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
            onClick={() => setShowDomain(true)}
            className="no-underline bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xl"
          >
            Get your domain
          </button>
        </div>
      </div>
    </div>
  );
} 