import { LinkHeaderParser } from "./link-header.parser";
import { HttpHeaders } from '@angular/common/http';

describe('LinkHeader', () => {
    let parser;
    beforeEach(() => {
        parser = new LinkHeaderParser();
    });

    const expectSameProperties = (key, actual, expected) => {
        expect(actual[key].per_page).toEqual(expected[key].per_page);
        expect(actual[key].page).toEqual(expected[key].page);
        expect(actual[key].rel).toEqual(expected[key].rel);
        expect(actual[key].url).toEqual(expected[key].url);
    }
    
    it('should parse empty header', () => {
        const responseHeadersMissingLink = new HttpHeaders({
                'foo': 'bar' 
        });
        const parsedHeader = parser.parse(responseHeadersMissingLink);

        expect(parsedHeader).toEqual(null);
    });

    it('should parse empty link header', () => {
        const responseHeadersMissingLink = new HttpHeaders({
            'Link': ''
        });
        const parsedHeader = parser.parse(responseHeadersMissingLink);

        expect(parsedHeader).toEqual(null);
    });

    it('should parse same next and last links header', () => {
        const responseHeadersMissingLink = new HttpHeaders({
            'Link': '<https://api.github.com/repositories/34351682/contributors?per_page=60&page=2>; rel="next", <https://api.github.com/repositories/34351682/contributors?per_page=60&page=2>; rel="last"'
        });
        const expected = {
            next: {
                page: '2',
                per_page: '60',
                rel: 'next',
                url: 'https://api.github.com/repositories/34351682/contributors?per_page=60&page=2'
            },
            last: {
                page: '2',
                per_page: '60',
                rel: 'last',
                url: 'https://api.github.com/repositories/34351682/contributors?per_page=60&page=2'
            }
        };
        
        const actual = parser.parse(responseHeadersMissingLink);

        expectSameProperties('next', actual, expected);
        expectSameProperties('last', actual, expected);
    });

    it('should parse next and last links header', () => {
        const responseHeadersMissingLink = new HttpHeaders({
            'Link': '<https://api.github.com/repositories/24195339/contributors?per_page=10&page=2>; rel="next", <https://api.github.com/repositories/24195339/contributors?per_page=10&page=41>; rel="last"'
        });
        const expected = {
            next: {
                page: '2',
                per_page: '10',
                rel: 'next',
                url: 'https://api.github.com/repositories/24195339/contributors?per_page=10&page=2'
            },
            last: {
                page: '41',
                per_page: '10',
                rel: 'last',
                url: 'https://api.github.com/repositories/24195339/contributors?per_page=10&page=41'
            }
        };
        
        const actual = parser.parse(responseHeadersMissingLink);

        expectSameProperties('next', actual, expected);
        expectSameProperties('last', actual, expected);
    });

    it('should parse next and prev links', () => {
        const responseHeadersMissingLink = new HttpHeaders({
            'Link': '<https://api.github.com/repositories/24195339/contributors?per_page=10&page=3>; rel="next", <https://api.github.com/repositories/24195339/contributors?per_page=10&page=2>; rel="prev"'
        });
        const expected = {
            next: {
                page: '3',
                per_page: '10',
                rel: 'next',
                url: 'https://api.github.com/repositories/24195339/contributors?per_page=10&page=3'
            },
            prev: {
                page: '2',
                per_page: '10',
                rel: 'prev',
                url: 'https://api.github.com/repositories/24195339/contributors?per_page=10&page=2'
            }
        };
        
        const actual = parser.parse(responseHeadersMissingLink);

        expectSameProperties('next', actual, expected);
        expectSameProperties('prev', actual, expected);
    });

    it('should parse first and prev links', () => {
        const responseHeadersMissingLink = new HttpHeaders({
            'Link': '<https://api.github.com/repositories/24195339/contributors?per_page=10&page=3>; rel="prev", <https://api.github.com/repositories/24195339/contributors?per_page=10&page=1>; rel="first"'
        });
        const expected = {
            prev: {
                page: '3',
                per_page: '10',
                rel: 'prev',
                url: 'https://api.github.com/repositories/24195339/contributors?per_page=10&page=3'
            },
            first: {
                page: '1',
                per_page: '10',
                rel: 'first',
                url: 'https://api.github.com/repositories/24195339/contributors?per_page=10&page=1'
            }
        };
        
        const actual = parser.parse(responseHeadersMissingLink);

        expectSameProperties('prev', actual, expected);
        expectSameProperties('first', actual, expected);
    });
});