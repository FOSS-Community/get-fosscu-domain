import './Docs.css'

export default function Docs() {
    return (
        <div style={{ maxWidth: '600px' }} className="m-auto dictionary p-4">
            <h1 className="text-3xl mt-8 mb-8 text-center">DNS dictionary</h1>
            
            <p className="my-4">Here are a few quick definitions to get you started:</p>

            <table>
                <tbody>
                    <tr>
                        <td className="word">A record</td>
                        <td>
                            A very common type of DNS record. It contains an IPv4 address, like <code>1.2.3.4</code>
                        </td>
                    </tr>
                    <tr>
                        <td className="word">Authoritative DNS server</td>
                        <td>
                            This is one type of DNS server. Every domain has an
                            authoritative DNS server assigned to it.
                            The way DNS requests generally flow is:
                            <pre>you -&gt; DNS resolver -&gt; authoritative
                         DNS server</pre>
                        </td>
                    </tr>
                    <tr>
                        <td className="word">CNAME record</td>
                        <td>
                            A common type of DNS record. It contains a hostname
                            address, like <code>example.com</code>.
                        </td>
                    </tr>
                    <tr>
                        <td className="word">DNS name</td>
                        <td>
                            Every time you type a domain, subdomain, or sub-sub-domain into your browser, that's a DNS name!
                            A DNS name (like <code>yourproject.fosscu.org</code>) has to:
                            <ul>
                                <li>be less than 255 characters</li>
                                <li>each part like ("yourproject") needs to be less than 63 characters</li>
                                <li>theoretically it should be composed of only a-z, A-Z, 0-9, and "-" characters, but it's common for domain names to have underscores in them too</li>
                            </ul>
                            Other than that, DNS queries can contain any DNS name.
                        </td>
                    </tr>
                    <tr>
                        <td className="word">DNS record</td>
                        <td>
                            When you make a DNS query, you get 0 or more records in response. Every record has at least 4 fields: the <strong>name</strong>, the <strong>TTL</strong>, the <strong>type</strong>, and one or more <strong>content</strong> fields. For example the IP address in an A record is its content.
                        </td>
                    </tr>
                    <tr>
                        <td className="word">DNS resolver</td>
                        <td>
                            This is one type of DNS server. A resolver takes your request, sends it to the right authoritative DNS server, and caches the result. You might be using a resolver run by Google, Cloudflare, or your ISP.
                        </td>
                    </tr>
                    <tr>
                        <td className="word">DNS query</td>
                        <td>
                            A DNS query is a request that you send to a DNS server. It contains 2 fields: the name (like example.com), and the type (like "A").
                        </td>
                    </tr>
                    <tr>
                        <td className="word">Subdomain</td>
                        <td>
                            See DNS name
                        </td>
                    </tr>
                    <tr>
                        <td className="word">TTL</td>
                        <td>
                            Stands for <strong>Time To Live</strong>. This is a DNS record field. It's a number of seconds. DNS resolvers use it to decide how long to cache the record.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}   