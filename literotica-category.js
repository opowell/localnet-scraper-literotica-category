// The authors these links name, each linking to their page rather than the list of their works (/works/stories,
// /works/audio).
function literoticaAuthors(selector) {
  return linkedAuthors(selector).map(({ name, url }) => ({ name, url: url.replace(/\/works\/.*$/, '') }))
}

// The page's title without the site's name, which every Literotica title ends with.
function literoticaTitle() {
  return document.title.replace(/ - Literotica\.com$/, '')
}

function parseLiteroticaCategory() {
  console.info('parseLiterotica category', location)
  if (
    location.hostname !== 'www.literotica.com'
    || !location.pathname.includes('/c/')
  ) {
    return null
  }
  console.info('Parsing Literotica category')

  // Story cards, with nothing to read of its own: empty content, as none would leave the page to the default parse.
  const result = { title: literoticaTitle(), listing: true, content: [] }

  // Links
  // Story cards; Literotica's class names carry build hashes, so they are matched on their stable prefix.
  const newStories = Array.from(document.querySelectorAll('article[class*="_card_"]')).map((card) => {
    const title = card.querySelector('a[class*="_title_link_"]')
    return {
      url: title?.href,
      title: title?.textContent,
      score: 0.1,
      description: card.querySelector('[class*="_description_"]')?.textContent,
      author: card.querySelector('a[class*="_author_link_"]')?.textContent,
      category: card.querySelector('a[class*="_category_"]')?.textContent,
      dateApproved: card.querySelector('time')?.textContent,
    }
  }).filter(story => story.url)
  const authors = literoticaAuthors('article[class*="_card_"] a[class*="_author_link_"]')
  result.links = [
    { url: 'https://www.literotica.com/stories', score: 0.1 },
    ...newStories,
    ...authorLinks(authors, 0.1),
  ]

  return result
}

// The parser a scrape calls.
registerParser(parseLiteroticaCategory)
