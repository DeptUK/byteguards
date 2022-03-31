import { indefiniteArticle } from '../src/indefinite-article'
import {expect} from 'chai'

const test_words = ["", "a", "g", "x", "user", "hour", "year", "Testing", "Otter", "Moose", "Bacon fillet", "Historic event", "Honorable Mention", "U.S. Currency", "Unified Front", "UK", "UNIX"]
const matches = ["an", "an", "a", "an", "a", "an", "a", "a", "an", "a", "a", "a", "an", "a", "a", "a", "a"];

const testWord = (i: number) => {
  it(`should return the correct article from ${test_words[i]}`, () => {
    expect(indefiniteArticle(test_words[i])).to.equal(matches[i]);
  });
}

describe('the indefinite article functionality', () => {
  for (let i = 0; i < test_words.length; i++) {
    testWord(i)
  }
})
