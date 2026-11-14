import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('listings', () => {
  it.each([
    ['literotica-category.js', 'parseLiteroticaCategory', 'https://www.literotica.com/c/romance-stories'],
  ])('%s keeps no text, so the default parse does not read the cards as the page', (file, parser, url) => {
    visit(url, '<article class="_card_1"><a class="_title_link_1" href="/s/a">A story</a></article>')
    expect(load(file, [parser])[parser]().content).toEqual([])
  })

  it.each([
    ['literotica-category.js', 'parseLiteroticaCategory', 'https://www.literotica.com/c/romance-stories'],
  ])('marks %s\'s page, %s %s', (file, name, url) => {
    visit(url, '')
    expect(load(file, [name])[name]().listing).toBe(true)
  })
})

describe('authors', () => {
  describe('literotica', () => {
    it.each([
      ['literotica-category.js', 'parseLiteroticaCategory', 'https://www.literotica.com/c/a'],
    ])('links %s to the author of each card', (file, parser, url) => {
      visit(url, `
        <article class="_card_1"><a class="_title_link_1" href="https://www.literotica.com/s/one">One</a><a class="_author_link_1" href="https://www.literotica.com/authors/ann/works/audio">ann</a></article>
        <article class="_card_1"><a class="_title_link_1" href="https://www.literotica.com/s/two">Two</a><a class="_author_link_1" href="https://www.literotica.com/authors/ann/works/stories">ann</a></article>`)
      const urls = load(file, [parser])[parser]().links.filter((link: any) => link.url.includes('/authors/'))
      expect(urls).toEqual([{ url: 'https://www.literotica.com/authors/ann', score: 0.1 }, { url: 'https://www.literotica.com/authors/ann', score: 0.1 }])
    })
})
})
