import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import * as url from "url";
import * as xtend from "xtend";
import * as qs from "querystring";

export interface Parser {
    parse(headers: HttpHeaders);
}

export interface PaginatedLink {
    per_page: string,
    page: string,
    rel: string,
    url: string
}

export interface PaginationObject {
    next?: PaginatedLink,
    prev?: PaginatedLink,
    last?: PaginatedLink,
    first?: PaginatedLink
}

@Injectable()
export class LinkHeaderParser implements Parser {
    constructor() { }
    public parse(responseHeaders: HttpHeaders): PaginationObject {
        if (!responseHeaders.has('Link') || responseHeaders.get('Link').length == 0) {
            return null;
        }

        return responseHeaders.get('Link').split(/,\s*</)
            .map(this.parseLink)
            .filter(this.hasRel)
            .reduce(this.intoRels, {});
    }

    private parseLink(link) {
        try {
            var m         =  link.match(/<?([^>]*)>(.*)/)
              , linkUrl   =  m[1]
              , parts     =  m[2].split(';')
              , parsedUrl =  url.parse(linkUrl)
              , qry       =  qs.parse(parsedUrl.query);
        
            parts.shift();
        
            var info = parts
              .reduce((acc, p) => {
                var m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
                if (m) acc[m[1]] = m[2];
                return acc;
            }, {});
            info = xtend(qry, info);
            info.url = linkUrl;
            return info;
          } catch (e) {
            return null;
          }
    }

    private hasRel(x) {
        return x && x.rel;
    }

    private intoRels(acc, x) {
        const splitRel = (rel) => {
            acc[rel] = xtend(x, { rel: rel });
        };
        
        x.rel.split(/\s+/).forEach(splitRel);
        
        return acc;
    }
}