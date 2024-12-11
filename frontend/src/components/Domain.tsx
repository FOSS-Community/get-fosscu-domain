import { useState } from 'react'

interface DNSRecord {
    name: string;
    type: string;
    content: string;
    ttl: number;
}

interface ExperimentProps {
    domain: string;
}

function Experiments({ domain }: ExperimentProps) {
    return (
        <div id="experiments" className="text-sm  pl-8 col-span-3 w-full">
            <h1 className="font-bold text-xl text-left mb-8">
                <svg className="inline" width="50px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" fillRule="nonzero" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" markerStart="none" markerMid="none" markerEnd="none" strokeMiterlimit="4" strokeDashoffset="0" d="m43.035622,6.4153c6.53336,6.41494 5.54726,11.26442 5.618279,19.0292l0.224281,24.521339l-31.822762,47.669956c-7.70109,12.839386 -2.49131,25.401253 10.13991,24.659454l73.043257,0.073807c13.653183,-0.057426 18.638214,-12.708916 8.057533,-26.039894l-30.186295,-46.244804l-0.56813,-24.560598c-0.071014,-7.76478 -1.14566,-12.595409 5.269279,-19.12877l-39.775352,0.02031z" />
                    <path fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="4" d="m77.493759,25.174719l-10.905273,0" />
                    <path fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="4" d="m77.493759,44.409069l-10.905273,0" />
                    <path fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="4" d="m83.676224,64.330353l-10.905266,0" />
                    <path fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="4" d="m94.323807,79.786522l-10.905266,0" />
                    <path fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="4" d="m104.971397,95.242691l-10.905273,0" />
                </svg>
                Try an experiment!
            </h1>
            <div className="tutorial border-pink-200 pl-4 border-l-4">
                <p>
                    <span className="font-bold">Tutorial experiments:</span> These 3 experiments explain some DNS basics and how the site works
                </p>
                <details className="experiment">
                    <summary>
                        <h3>1. Create an A record</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            Let's create the most basic DNS record: an A record. For the IP address, we'll use an IP (213.188.218.160) I set up
                            for this project which just shows a picture of an orange.
                        </p>
                        <ol>
                            <li>
                                Create a record with
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> orange</li>
                                    <li><strong>Type:</strong> A</li>
                                    <li><strong>IPv4 Address:</strong> <code>213.188.218.160</code></li>
                                    <li><strong>TTL:</strong> 60</li>
                                </ul>
                                TTLs are always in seconds on this page.
                            </li>
                            <li>Click "Create"</li>
                            <li>Go to orange.{domain}.fosscu.org in your browser</li>
                            <li>You should see a website with a picture of an orange!</li>
                        </ol>
                    </div>
                </details>
                <details className="experiment">
                    <summary>
                        <h3>2. Create a CNAME record</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            Let's create a CNAME record that points at exactly the
                            same orange IP address, but indirectly.
                        </p>
                        <ol>
                            <li>
                                Create a record with
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> fruit</li>
                                    <li><strong>Type:</strong> CNAME</li>
                                    <li><strong>Target:</strong> <code>orange.jvns.ca</code></li>
                                    <li><strong>TTL:</strong> 60</li>
                                </ul>
                            </li>
                            <li>Click "Create"</li>
                            <li>Go to fruit.{domain}.fosscu.org in your browser</li>
                            <li>You should see a website with a picture of an orange!</li>
                        </ol>
                    </div>
                </details>
                <details className="experiment">
                    <summary>
                        <h3>3. See how CNAME records work</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            The "Requests" section at the bottom of this page lets you see all
                            DNS requests being made for subdomains of <code className="text-green-700">{domain}.fosscu.org</code>!
                            Let's look at the CNAME record we created in the previous experiment, to see how CNAME records work!
                        </p>
                        <ol>
                            <li>Look in the "Requests" section at the bottom of the page. You should see a request for
                                fruit.{domain}.fosscu.org.
                            </li>
                            <li>
                                Look at the "From" name on the request. Do you recognize
                                it? It might be your ISP, or a public DNS resolver like
                                Cloudflare or Google
                            </li>
                            <li>
                                Look at the type of the request and response. You should see
                                that it's requesting an A record, but the DNS server responded
                                with a CNAME record.
                            </li>
                        </ol>
                    </div>
                </details>
            </div>
            <hr className="my-4" />
            <div className="weird border-purple-200 pl-4 border-l-4">
                <p>
                    <span className="font-bold">Weird experiments:</span> In these 5 experiments, we break things for fun and learning!
                </p>
                <details className="experiment">
                    <summary>
                        <h3>1. Visit a domain before creating its DNS record</h3>
                    </summary>
                    <div className="details-modal">
                        <p className="my-4">
                            Did you know that just <span className="font-bold">visiting</span> a
                            domain can make it not work? This is weird but true! In this experiment, we'll:
                            <ul className="steps">
                                <li>Create a DNS record for a subdomain, and then visit it after (this will work!)</li>
                                <li>Visit a subdomain, and create the DNS record for it, and then visit it again (this <span className="wont">won't</span> work!)</li>
                            </ul>
                            Let's go!
                        </p>
                        <ol>
                            <li>
                                Create a CNAME record with
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> visit-after</li>
                                    <li><strong>Type:</strong> CNAME</li>
                                    <li><strong>Target:</strong> <code>orange.jvns.ca</code></li>
                                    <li><strong>TTL:</strong> 3600</li>
                                </ul>
                            </li>
                            <li>
                                Go to visit-after.{domain}.fosscu.org
                                in your browser. You should see an orange site -- everything works!
                            </li>
                            <li>
                                Now, go to visit-before.{domain}.fosscu.org
                                in your browser. You should get an error like "Server Not
                                Found", since we haven't created the record yet.
                            </li>
                            <li>
                                Create a CNAME record with:
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> visit-before</li>
                                    <li><strong>Type:</strong> CNAME</li>
                                    <li><strong>Target:</strong> <code>orange.jvns.ca</code></li>
                                    <li><strong>TTL:</strong> 3600</li>
                                </ul>
                            </li>
                            <li>
                                Go to visit-before.{domain}.fosscu.org in your browser again. You should get the same "Server Not Found" error as before. Even if you force reload the page!
                            </li>
                        </ol>

                        <p className="my-4">
                            <details>
                                <summary>
                                    <span className="text-green-700">
                                        Why do I get a "server not found" error?
                                    </span>
                                </summary>
                                <p>
                                    Here's what happens with "visit-after", where everything's working as expected
                                    <ul className="explanation-list">
                                        <li className="you">You create the record</li>
                                        <li className="browser">Browser asks: where's visit-after.{domain}.fosscu.org?</li>
                                        <li className="server">DNS server responds: success!</li>
                                    </ul>
                                </p>

                                <p>
                                    With visit-before, it doesn't work because of something DNS resolvers do called <strong>negative caching</strong>, where they cache the <strong>absence</strong> of a record.

                                    <ul className="explanation-list">
                                        <li className="browser">Browser: where's visit-before.{domain}.fosscu.org?</li>
                                        <li className="server">DNS server: doesn't exist!</li>
                                        <li className="resolver action">DNS resolver: "oops it doesn't exist! Better cache that!"</li>
                                        <li className="resolver">DNS resolver: Doesn't exist</li>
                                        <li className="you">You create record</li>
                                        <li className="browser">Request: where's visit-before.{domain}.fosscu.org?</li>
                                        <li className="resolver action">DNS resolver: "I saw this before!! It doesn't exist!"</li>
                                        <li className="resolver">DNS resolver: doesn't exist</li>
                                        <li className="you">You: :( :( :( IT EXISTS THOUGH</li>
                                        <li className="you">You wait 1 hour and try again, everything works because the cache expired</li>
                                    </ul>
                                </p>
                            </details>

                            <details>
                                <summary>
                                    <span className="text-green-700">
                                        I didn't get a "server not found" error at the end...
                                    </span>
                                </summary>
                                <p>
                                    Not all DNS resolvers do negative DNS caching! For example,
                                    Cloudflare doesn't, so this experiment won't work for you
                                    if you're using Cloudflare DNS!
                                </p>
                            </details>
                        </p>
                    </div>
                </details>

                <details className="experiment">
                    <summary>
                        <h3>2. Set a very long TTL</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            Setting a very long TTL (like 10 days) makes your life very
                            inconvenient: if you want to make a change, you need to wait up to 10
                            days for the change to happen! We'll:
                            <ul className="pl-2 md:pl-8 steps">
                                <li>Create a record with a <span className="font-bold">short</span> TTL, visit the page in our browser, change the record, and refresh the page. We'll see the change!</li>
                                <li>Create a record with a <span className="font-bold">long</span> TTL, visit the page in our browser, change the record, and refresh the page. We <span className="wont">won't</span> see the change!</li>
                            </ul>
                        </p>
                        <p>
                            Let's start with the short TTL!
                        </p>
                        <ol>
                            <li>
                                Create a CNAME record with:
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> short-ttl</li>
                                    <li><strong>Type:</strong> CNAME</li>
                                    <li><strong>Target:</strong> <code>orange.jvns.ca</code></li>
                                    <li><strong>TTL:</strong> 30</li>
                                </ul>
                            </li>
                            <li>
                                Go to short-ttl.{domain}.fosscu.org
                                in your browser. You should see an orange website.
                            </li>
                            <li>
                                Click 'Edit' and change the CNAME record to point at <code>purple.jvns.ca</code> instead.
                            </li>
                            <li>
                                <p>
                                    Go to short-ttl.{domain}.fosscu.org
                                    in your browser again. You might need to force-refresh with
                                    Ctrl+Shift-R/Cmd+Shift+R, but you should see a purple site now.
                                    The update worked!
                                </p>
                                <p>
                                    Now, let's see what happens if you set a long TTL.
                                </p>
                            </li>
                            <li>
                                Create a CNAME record with:
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> long-ttl</li>
                                    <li><strong>Type:</strong> CNAME</li>
                                    <li><strong>Target:</strong> <code>orange.jvns.ca</code></li>
                                    <li><strong>TTL:</strong> 3000000 (that's 30 days! Or use any reasonably big number)</li>
                                </ul>
                            </li>
                            <li>
                                Go to long-ttl.{domain}.fosscu.org
                                in your browser. You should see an orange website.
                            </li>
                            <li>
                                Click 'Edit' and change the CNAME record to point at <code>purple.jvns.ca</code> instead.
                            </li>
                            <li>
                                Go to long-ttl.{domain}.fosscu.org
                                in your browser again. You should see
                                the same orange site -- no change!
                                This is because your old DNS record is
                                still cached.
                                You might also notice that there are no new requests in the "Requests" section.
                            </li>
                        </ol>

                        <p className="my-4">
                            <details>
                                <summary>
                                    <span className="text-green-700">
                                        What's happening behind the scenes when I set a long/short TTL?
                                    </span>
                                </summary>

                                <p>
                                    When the TTL is 30 seconds, the second time you make the request, the
                                    cache will have expired so you'll get the new version. Here's what that looks like in detail:
                                </p>
                                <ul className="explanation-list">
                                    <li className="you">You create a record</li>
                                    <li className="browser">Browser asks: where's short-ttl.{domain}.fosscu.org?</li>
                                    <li className="resolver action">Resolver doesn't have this in cache, so requests it</li>
                                    <li className="server">DNS server responds: Here's the IP! The TTL is 30 seconds!</li>
                                    <li className="resolver action">Resolver caches the IP for 30 seconds</li>
                                    <li className="resolver">Resolver responds: Here's the IP!</li>
                                    <li className="action">... 30 seconds pass</li>
                                    <li className="you">You update the record</li>
                                    <li className="browser">Browser asks: where's short-ttl.{domain}.fosscu.org?</li>
                                    <li className="resolver action">Resolver notices that the cache expired, and requests it again</li>
                                    <li className="server">DNS server responds: Here's the IP!</li>
                                    <li className="resolver action">Resolver caches the IP for 30 seconds</li>
                                    <li className="resolver">Resolver responds: Here's the new IP!</li>
                                </ul>

                                <p>
                                    And when the TTL is a big number like 10 days, the cache never expires, so you can't get the updated site. Here's what that looks like:
                                </p>

                                <ul className="explanation-list">
                                    <li className="you">You create a record</li>
                                    <li className="browser">Browser asks: where's long-ttl.{domain}.fosscu.org?</li>
                                    <li className="resolver action">Resolver doesn't have this in cache, so requests it</li>
                                    <li className="server">DNS server responds: Here's the IP! The TTL is 10 days!</li>
                                    <li className="resolver action">Resolver caches the IP for 10 days</li>
                                    <li className="resolver">Resolver responds: Here's the IP!</li>
                                    <li className="action">... 30 seconds pass</li>
                                    <li className="you">You update the record</li>
                                    <li className="browser">Browser asks: where's long-ttl.{domain}.fosscu.org?</li>
                                    <li className="resolver">Resolver responds: I have that cached! Here's the IP!</li>
                                </ul>
                            </details>
                        </p>
                    </div>
                </details>

                <details className="experiment">
                    <summary>
                        <h3>3. Point to <code>example.com</code></h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            Did you know that if you point 2 different domains at the same IP
                            address, you can get different webpages when you visit the 2 domains? We're going to
                            <ul className="steps">
                                <li>Point your domain at the same IP as a <a href="https://example.com">example.com</a></li>
                                <li>Get a 404 error (which is different from what happens when you visit example.com)</li>
                            </ul>

                            Let's start!
                        </p>
                        <ol>
                            <li>Visit <a href="https://example.com">example.com</a> in your browser. Notice that you don't get a 404 error.</li>
                            <li>Find the IP address for <code>example.com</code>. You can do this by running <code>dig +short example.com</code> in your terminal. Or you can just pretend you did it, the IP is <code>93.184.216.34</code> :).</li>
                            <li>
                                Create an A record with
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> bad-ip</li>
                                    <li><strong>Target:</strong> <code>93.184.216.34</code></li>
                                    <li><strong>TTL:</strong> anything you want</li>
                                </ul>
                            </li>
                            <li>Go to bad-ip.{domain}.fosscu.org in your browser. You should get a 404 not found error.</li>
                        </ol>
                        <details className="my-4">
                            <summary>
                                <span className="text-green-700">
                                    Why do I get a 404 error?
                                </span>
                            </summary>
                            <div>
                                <p>
                                    When your browser requests a website, it
                                    sends a <code>Host</code> header with the name of the domain you typed in.
                                    If the server (like Apache/nginx) doesn't recognize that name, it'll often
                                    return a 404. Here's more detail about how that works.
                                </p>

                                <p>
                                    When you request example.com and everything works, here's what happens:
                                </p>
                                <ul className="explanation-list">
                                    <li className="you">Type example.com into your browser</li>
                                    <li className="browser">Browser asks: where's example.com?</li>
                                    <li className="resolver">Resolver responds: 93.184.216.34</li>
                                    <li className="browser">Browser (to 93.184.216.34): an HTTP request for <code>Host: example.com</code>!</li>
                                    <li className="example">Example.com server: I know that site! Here's a response!</li>
                                </ul>
                                <p>
                                    But when you request bad-ip.{domain}.fosscu.org and you get a 404, here's how it goes:
                                </p>
                                <ul className="explanation-list">
                                    <li className="you">Type http://bad-ip.{domain}.fosscu.org into your browser</li>
                                    <li className="browser">Browser asks: where's bad-ip.{domain}.fosscu.org?</li>
                                    <li className="resolver">Resolver responds: 93.184.216.34</li>
                                    <li className="action">(everything is the same so far!)</li>
                                    <li className="browser">Browser (to 93.184.216.34): an HTTP request for <code>Host: bad-ip.{domain}.fosscu.org</code>!</li>
                                    <li className="example">Example.com server: I've never heard of that site!! 404!</li>
                                </ul>
                            </div>
                        </details>
                    </div>
                </details>

                <details className="experiment">
                    <summary>
                        <h3>4. Convince 3 different DNS servers that your subdomain has 3 different IPs (3-ips)</h3>
                    </summary>
                    <div className="details-modal">
                        <p className="my-4">
                            Did you know that different DNS resolvers can have conflicting beliefs about the IP address for your domain?
                            This is usually a bad thing, but let's make it happen on purpose so that you can see how it could happen accidentally.
                        </p>
                        <p className="my-4">
                            We're going to convince:
                        </p>
                        <ul className="steps">
                            <li>
                                Google's DNS server that your subdomain has one IP (10.11.12.13),
                            </li>
                            <li>
                                Cloudflare's DNS server that your subdomain has another IP (20.21.22.23)
                            </li>
                            <li>
                                Quad9's DNS server that your subdomain has a third IP (30.31.32.33)
                            </li>
                        </ul>

                        <p className="my-4">
                            Let's start!
                        </p>
                        <ol>
                            <li>
                                Create an A record with:
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> 3-ips</li>
                                    <li><strong>Target:</strong> <code>10.11.12.13</code></li>
                                    <li><strong>TTL:</strong> 3600</li>
                                </ul>
                                We need a reasonably long TTL because the resolvers need to cache the IP for at least the length of this experiment.
                            </li>
                            <li>
                                In your terminal, run
                                <pre>$ dig +noall +answer @8.8.8.8 3-ips.{domain}.fosscu.org</pre>
                                Run it 10 times just to be safe. Google has many DNS servers, so we want to hit most of them.
                            </li>
                            <li>
                                Change the A record to point at <code>20.21.22.23</code> instead. Keep the TTL the same.
                            </li>
                            <li>
                                Time to tell Cloudflare about the domain! In your terminal, run
                                <pre>$ dig +noall +answer @1.1.1.1 3-ips.{domain}.fosscu.org</pre>
                                Run it a few times.
                            </li>
                            <li>
                                Last change!
                                Change the A record to point at <code>30.31.32.33</code> instead. Keep the TTL the same.
                            </li>
                            <li>
                                Now we'll tell Quad9 about the domain. In your terminal, run
                                <pre>$ dig +noall +answer @9.9.9.9 3-ips.{domain}.fosscu.org</pre>
                            </li>
                            <li>
                                Now, let's ask all 3 providers what they think our IP address is. Here's what I see:

                                <pre>
                                    $ dig +noall +answer @8.8.8.8 3-ips.{domain}.fosscu.org
                                    3-ips.{domain}.fosscu.org. 30 IN A 10.11.12.13
                                    $ dig +noall +answer @1.1.1.1 3-ips.{domain}.fosscu.org
                                    3-ips.{domain}.fosscu.org. 30 IN A 20.21.22.23
                                    $ dig +noall +answer @9.9.9.9 3-ips.{domain}.fosscu.org
                                    3-ips.{domain}.fosscu.org. 30 IN A 30.31.32.33
                                </pre>
                                All of the 3 DNS servers have different opinion about what our IP address is! Mischief managed.
                            </li>
                        </ol>
                        <p className="my-4">
                            <details>
                                <summary>
                                    <span className="text-green-700">
                                        Why does this work?
                                    </span>
                                </summary>
                                <p>
                                    The reason this works is that Google, Cloudflare, and Quad9 will never
                                    proactively look up our domain -- they only look up domain when someone
                                    makes a request for it. And because you're literally the only person in the
                                    world who's ever made a request for 3-ips.{domain}.fosscu.org,
                                    you have total control over when they learn about the domain for the first
                                    time.
                                </p>
                            </details>
                            <details>
                                <summary>
                                    <span className="text-green-700">
                                        I got 30.31.32.33 from Google at the end, not 10.11.12.13. Why?
                                    </span>
                                </summary>
                                <p>
                                    8.8.8.8 isn't one server, it's many DNS servers. What
                                    probably happened is that when you queried 8.8.8.8 the first
                                    time, you missed some of its servers. And then at the end,
                                    you reached a new server that hadn't cached the record yet.
                                    (this is why it says "query 10 times", but sometimes 10
                                    times isn't enough)
                                </p>
                            </details>
                        </p>
                    </div>
                </details>

                <details className="experiment">
                    <summary>
                        <h3>5. Set two conflicting A records</h3>
                    </summary>
                    <div className="details-modal">
                        Lots of domains have multiple IP addresses associated with them.
                        Usually you don't notice because the two IP addresses serve the exact
                        same webpage. But we can see more easily how this works by using two IPs which are totally different websites.
                        <ul className="steps">
                            <li>Create 2 records that point to different webpages (one orange and one purple)</li>
                            <li>Use curl to repeatedly request the same domain, and see what happens!</li>
                        </ul>

                        <ol>
                            <li>
                                Create an A record with:
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> conflict</li>
                                    <li><strong>IPv4 Address:</strong> <code>213.188.218.160</code></li>
                                    <li><strong>TTL:</strong> 5</li>
                                </ul>
                            </li>
                            <li>Create another A record with:
                                <ul className="record-expl">
                                    <li><strong>Name:</strong> conflict</li>
                                    <li><strong>IPv4 Address:</strong> <code>213.188.209.192</code></li>
                                    <li><strong>TTL:</strong> 5</li>
                                </ul>
                            </li>
                            <li>
                                In your terminal, run
                                <pre>curl http://conflict.{domain}.fosscu.org 2&gt;/dev/null | grep title</pre>
                                10 times.
                                When I run it, the result I get changes back and forth between 'orange' and 'purple', like this. You might see different behaviour though, which we'll talk about in the explanation :)
                                <pre>
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;orange&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;purple&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;orange&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;purple&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;orange&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;purple&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;orange&lt;/title&gt;
                                    $ curl http://conflict.{domain}.fosscu.org/ 2&gt; /dev/null | grep title
                                    &lt;title&gt;purple&lt;/title&gt;
                                </pre>
                            </li>
                        </ol>
                        It can't make up its mind what website it is!
                        <p className="my-4">
                            <details>
                                <summary>
                                    <span className="text-green-700">
                                        Why do different people get different results for this experiment?
                                    </span>
                                </summary>
                                <p>
                                    I've seen 3 different results for this experiment. Why is that? Well, let's start by thinking about what happens when you run <code>curl</code>.
                                </p>
                                <ul className="explanation-list">
                                    <li className="you">You create 2 records</li>
                                    <li className="you">You run <code>curl conflict.{domain}.fosscu.org</code></li>
                                    <li className="">curl makes a DNS request</li>
                                    <li className="resolver">Resolver finds 2 matching records</li>
                                </ul>

                                Your resolver now has 2 records, and it needs to decide what order to return them in. It might do any of:
                                <ul className="normal-list">
                                    <li>Return the records in the same order it received them</li>
                                    <li>Change the order every time it receives a request (this is what mine does!)</li>
                                    <li>Pick an order at random</li>
                                    <li>Maybe do something else that I haven't listed here! I don't know!</li>
                                </ul>

                                curl will then pick the first record returned, but which one that is depends on the order that the resolver picked.
                            </details>
                        </p>
                    </div>
                </details>
            </div>
            <hr className="my-4" />
            <div className="useful border-blue-200 pl-4 border-l-4">
                <p>
                    <span className="font-bold">Useful experiments:</span> The rest of the
                    experiments are things that you actually might want to do in real
                    life. These are more like a challenge than a tutorial: each one has a brief outline.
                </p>
                <details className="experiment">
                    <summary>
                        <h3>1. Set up a website</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            You can use any service you want for this experiment, for example Netlify, GitHub Pages, GitLab Pages, etc. Here's an example of some steps using Netlify:
                        </p>
                        <ol>
                            <li>On Netlify: Create a new site</li>
                            <li>On Netlify: Add the domain www.{domain}.fosscu.org to your Netlify site</li>
                            <li>On Mess With DNS: Create a CNAME record pointing www.{domain}.fosscu.org at your new Netlify site</li>
                            <li>Visit www.{domain}.fosscu.org in your browser and see if it works!</li>
                        </ol>
                        <p>DNS records are deleted after a week, so don't use this site for anything real! :)</p>
                    </div>
                </details>

                <details className="experiment">
                    <summary>
                        <h3>2. Receive an email</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            You can use any email service that lets you use your own domain for this experiment. Here's an example of some steps using Fastmail (though these instructions haven't been tested in a long time and may not work!):
                        </p>
                        <ol>
                            <li>On Fastmail: Sign up for a free trial using the email <code>you@mail.{domain}.fosscu.org</code></li>
                            <li>On Mess With DNS: Create 2 MX records pointing mail.{domain}.fosscu.org at Fastmail's mail servers. Fastmail will give you instructions when you sign up.</li>
                            <li>Send yourself an email at you@mail.{domain}.fosscu.org and see if you get it!</li>
                        </ol>
                        <p>DNS records are deleted after a week, so don't use this email address for anything real! :)</p>
                    </div>
                </details>

                <details className="experiment">
                    <summary>
                        <h3>3. Make your email's SPF and DKIM records pass</h3>
                    </summary>
                    <div className="details-modal">
                        <p>
                            The goal is to create SPF and DKIM records so that receivers recognize your mail as coming from your domain.
                        </p>
                        <ol>
                            <li>First you need to set up an email account, as described in experiment 2.</li>
                            <li>Test your SPF records using the instructions on this <a href="https://www.appmaildev.com/en/spf">SPF Test</a> page</li>
                            <li>On Fastmail: Follow Fastmail's instructions to set up SPF and DKIM</li>
                            <li>Test your SPF records again and make sure that they're working. The <a href="https://www.appmaildev.com/en/spf">SPF Test</a> page explains how to confirm that they're working.</li>
                        </ol>
                    </div>
                </details>
            </div>
        </div>
    )
}

export default function Domain( { setShowDomain }: { setShowDomain: (showDomain: boolean) => void } ) {
    const [domain] = useState('example346');
    const [records, setRecords] = useState<DNSRecord[]>([
        {
            name: 'example346.fosscu.org.',
            type: 'SOA',
            content: 'fosscu1.fosscu.org. fake.example.com. 2024121101 1080 3600 0 3600 604800 3600',
            ttl: 3600
        }
    ]);
    const [newRecord, setNewRecord] = useState<DNSRecord>({
        name: '',
        type: 'A',
        content: '',
        ttl: 3600
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRecords([...records, newRecord]);
        setNewRecord({
            name: '',
            type: 'A',
            content: '',
            ttl: 3600
        });
    };

    const handleDelete = (index: number) => {
        const newRecords = records.filter((_, i) => i !== index);
        setRecords(newRecords);
    };

    return (
        <div className="mx-auto py-8 lg:gap-0 gap-8 grid grid-cols-1 lg:grid-cols-9">
            <div className="w-full  col-span-6 lg:pl-16 pr-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl">
                        Your subdomain is: <span className="text-emerald-600 font-bold">{domain}.fosscu.org</span>
                    </h2>
                    <button onClick={() => setShowDomain(false)} className="text-gray-600 hover:text-gray-800 underline">Logout</button>
                </div>

                <section className="mb-8">
                    <h3 className="flex items-center gap-2 font-bold mb-4">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        Add a record
                    </h3>

                    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={newRecord.name}
                                onChange={e => setNewRecord({ ...newRecord, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                value={newRecord.type}
                                onChange={e => setNewRecord({ ...newRecord, type: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="A">A</option>
                                <option value="AAAA">AAAA</option>
                                <option value="CNAME">CNAME</option>
                                <option value="MX">MX</option>
                                <option value="TXT">TXT</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">IPv4 Address</label>
                            <input
                                type="text"
                                value={newRecord.content}
                                onChange={e => setNewRecord({ ...newRecord, content: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">TTL</label>
                            <input
                                type="number"
                                value={newRecord.ttl}
                                onChange={e => setNewRecord({ ...newRecord, ttl: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="col-span-4 text-right">
                            <button
                                type="submit"
                                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </section>

                <section>
                    <h3 className="flex items-center gap-2 font-bold mb-4">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        All DNS records
                        {records.length > 0 && (
                            <button
                                onClick={() => setRecords([])}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                (clear)
                            </button>
                        )}
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-y">
                                    <th className="text-left p-3">Name</th>
                                    <th className="text-left p-3">Type</th>
                                    <th className="text-left p-3">Content</th>
                                    <th className="text-left p-3">TTL</th>
                                    <th className="text-left p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-3">{record.name}</td>
                                        <td className="p-3">{record.type}</td>
                                        <td className="p-3 font-mono text-sm">{record.content}</td>
                                        <td className="p-3">{record.ttl}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mt-8">
                    <h3 className="flex items-center gap-2 font-bold mb-4">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Requests
                    </h3>
                    <p className="text-gray-600 mb-4">This is a list of all requests for your subdomain's records.</p>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-y">
                                <th className="text-left p-3">Time</th>
                                <th className="text-left p-3">Request</th>
                                <th className="text-left p-3">Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Request rows will go here */}
                        </tbody>
                    </table>
                </section>
            </div>
            <Experiments domain={domain} />
        </div>
    )
}