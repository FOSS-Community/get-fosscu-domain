export default function About() {
    return (
        <div style={{ maxWidth: '600px' }} className="m-auto p-4 main">
            <h1 className="text-3xl mt-8 mb-8 text-center">About</h1>
            <h2 className="text-2xl mt-8 mb-8">Why did you build this?</h2>

            <p>
                We created this platform to make it easier for FOSS (Free and Open Source Software) 
                communities to establish their online presence. Many FOSS projects struggle with 
                getting proper domain names due to cost or administrative barriers. Get Fosscu Domain 
                aims to solve this by providing a streamlined way to obtain and manage domain names 
                for FOSS projects.
            </p>
            <p>
                Our goal is to support the growth of the FOSS ecosystem by removing one of the 
                common hurdles in project development - domain management.
            </p>

            <h2 className="text-2xl mt-8 mb-8">FAQ</h2>

            <h3 className="font-bold mt-6 mb-1">I found a bug!</h3>
            <p>
                We'd love to hear about it! You can report issues with the site on{' '}
                <a href="https://github.com/FOSS-Community/get-fosscu-domain/" 
                   className="text-emerald-600 hover:underline" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    GitHub
                </a>.
            </p>

            <h3 className="font-bold mt-6 mb-1">What domains are available?</h3>
            <p>
                Currently, we offer subdomains under <code className="bg-gray-100 px-2 py-1 rounded">fosscu.org</code>. 
                Each project gets a unique subdomain like <code className="bg-gray-100 px-2 py-1 rounded">yourproject.fosscu.org</code>.
            </p>

            <h3 className="font-bold mt-6 mb-1">Who can request a domain?</h3>
            <p>
                Any Free and Open Source Software project can request a domain. The project 
                should be publicly accessible and maintain an open source license.
            </p>

            <h3 className="font-bold mt-6 mb-1">Is this service free?</h3>
            <p>
                <strong>Yes</strong>, this service is completely free for FOSS projects. We believe in 
                supporting the open source community and making it easier for projects to 
                grow and reach their users.
            </p>

            <h3 className="font-bold mt-6 mb-1">How long can I keep the domain?</h3>
            <p>
                As long as your project remains active and continues to be open source, 
                you can keep the domain. We do periodic reviews to ensure domains are being 
                used for active FOSS projects.
            </p>

            <h2 className="text-2xl mt-8 mb-8">Credits</h2>
            <p>
                This project is maintained by the{' '}
                <a href="https://fosscu.org" 
                   className="text-emerald-600 hover:underline"
                   target="_blank" 
                   rel="noopener noreferrer">
                    FOSSCU
                </a>{' '}
                community. Special thanks to all our contributors who help make this service possible.
            </p>
        </div>
    )
}