const targetUrl = 'example.com'; // Replace with your URL

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

    document.title = "Wikimedia Commons";
    
    // Update the URL in the browser bar without reloading
    window.history.pushState({}, '', url);
}

// 1. Hijack all link clicks
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname === window.location.hostname) {
        e.preventDefault(); 
        loadPage(link.href);
    }
});

// 2. Handle back/forward buttons
window.onpopstate = () => loadPage(window.location.href);

// Initial load
loadPage(targetUrl);
