fetch('https://onmodel3d.itch.io/space-rangers-interrogation')
  .then(response => {
    // When the page is loaded convert it to text
    return response.text()
  })
  .then(html => {
    // Initialize the DOM parser
    const parser = new DOMParser()

    // Parse the text
    const doc = parser.parseFromString(html, "text/html")

    // You can now even select part of that html as you would in the regular DOM
    // Example:
    // const docArticle = doc.querySelector('article').innerHTML
    function replaceEverything(newDoc) {
        const range = document.createRange();

         // 1. Replace the Head (scripts, styles, meta tags)
        const headHtml = newDoc.head.innerHTML;
        const headFragment = range.createContextualFragment(headHtml);
        document.head.innerHTML = '';
        document.head.appendChild(headFragment);

        // 2. Replace the Body (content, iframes, inline scripts)
        const bodyHtml = newDoc.body.innerHTML;
        const bodyFragment = range.createContextualFragment(bodyHtml);
        document.body.innerHTML = '';
        document.body.appendChild(bodyFragment);
    }

    // Usage:
    replaceEverything(doc);
    // document.body.innerHTML = ''
    // const range = document.createRange();
    // const htmlString = doc.documentElement.innerHTML;
    // const fragment = range.createContextualFragment(htmlString);
    // document.body.appendChild(fragment);
    console.log(doc)
    console.log(JSON.stringify(doc))
  })
  .catch(error => {
     console.error('Failed to fetch page: ', error)
  })
