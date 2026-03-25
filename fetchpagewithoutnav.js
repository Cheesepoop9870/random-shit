const targetUrl = 'https://example.com'; // Replace with your URL
const originUrl = targetUrl.match(/https?:\/\/(www\.)?.+\.[^\/?#]{3}/g)[0]; //gets origin

console.log(originUrl)
function loadPage(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            
            // Fix relative links/media by injecting a <base> tag
            const base = doc.createElement('base');
            base.href = url;
            doc.head.insertBefore(base, doc.head.firstChild);

            replaceEverything(doc, url);
        })
        .catch(err => console.error('Fetch failed:', err));
}

function replaceEverything(newDoc, url) {
    const range = document.createRange();

    // Update Head & Body
    document.head.innerHTML = '';
    document.head.appendChild(range.createContextualFragment(newDoc.head.innerHTML));
    
    document.body.innerHTML = '';
    document.body.appendChild(range.createContextualFragment(newDoc.body.innerHTML));

    const videos = document.querySelectorAll('video');
    videos.forEach(video => { //fix videos
    // Essential: Tell the browser to look at the src/source tags again
        video.load(); 

        // Handle autoplay if it was present
        // if (video.hasAttribute('autoplay')) {
        //     // Browsers often require a user gesture (like a click) 
        //     // before play() will work, but this attempts it anyway.
        //     video.play().catch(err => {
        //         console.warn("Autoplay was prevented. User interaction may be required.", err);
        //     });
        // }
    });
    document.title = "Wikimedia Commons";

    // 1. Get the base URL to fix relative paths like "/slug.js"
    const baseUrl = new URL(url);

    // 2. Select all scripts
    const scripts = Array.from(document.querySelectorAll('script'));

    scripts.forEach(oldScript => { // fix scripts
    const newScript = document.createElement('script');

    // 1. Copy all attributes exactly
    Array.from(oldScript.attributes).forEach(attr => {
        let attrValue = attr.value;
        
        // Fix relative 'src' to be absolute
        if (attr.name === 'src') {
            const absoluteUrl = new URL(attrValue, url).href;
            // Add cache-buster to force re-execution of modules
            attrValue = `${absoluteUrl}${absoluteUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
        }
        
        newScript.setAttribute(attr.name, attrValue);
    });

    // 2. Use textContent for inline code (the fix for "empty" tags)
    if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
    }

    // 3. Replace the old tag to trigger the browser's execution engine
    oldScript.parentNode.replaceChild(newScript, oldScript);
    });


    
    // Update the URL in the browser bar without reloading
    window.history.pushState({}, '', url);
}
console.log(document)
// 1. Hijack all link clicks
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname === window.location.hostname) {
        e.preventDefault(); 
        console.log("Loading "+ link.href)
        loadPage(link.href);
        
    }
});

// 2. Handle back/forward buttons
window.onpopstate = () => loadPage(window.location.href);

// Initial load
loadPage(targetUrl);
