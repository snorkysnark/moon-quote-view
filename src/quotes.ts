import type { NavItem } from "epubjs";

interface FoundQuote {
    chapter_id: string;
    chapter_order: number;
    toc_parent: string;
    text: string;
    distance: number;
    cfi: string;
}

interface OriginalQuote {
    original: string;
    found: FoundQuote[];
}

export interface FoundJson {
    [mrId: string]: OriginalQuote;
}

export interface Quote {
    chapterId: string;
    chapteOrder: number;
    text: string;
    cfi: string;
}

export interface TocNavItem {
    kind: 'nav';
    navItem: NavItem;
    children: TocItem[];
}

export interface TocQuoteItem {
    kind: 'quote';
    quote: Quote;
}

export type TocItem = TocNavItem | TocQuoteItem;
export type QuotesByHref = Map<string, Quote[]>;

export function arrangeByHref(foundJson: FoundJson): QuotesByHref {
    const quotesByHref = new Map<string, Quote[]>();

    for (const originalQuote of Object.values(foundJson)) {
        if (originalQuote.found.length === 0) continue;

        const foundQuote = originalQuote.found[0];
        const tocParent = foundQuote.toc_parent || "_";

        if (!quotesByHref.has(tocParent)) {
            quotesByHref.set(tocParent, []);
        }
        quotesByHref.get(tocParent).push({
            chapterId: foundQuote.chapter_id,
            chapteOrder: foundQuote.chapter_order,
            text: foundQuote.text,
            cfi: foundQuote.cfi,
        });
    }

    // Sort by chapter order
    for (const quoteList of quotesByHref.values()) {
        quoteList.sort((quoteA, quoteB) => {
            return quoteA.chapteOrder - quoteB.chapteOrder;
        });
    }

    return quotesByHref;
}

export function extractCfis(quotesByHref: QuotesByHref) {
    const cfis = [];

    for (const quoteList of quotesByHref.values()) {
        for (const quote of quoteList) {
            cfis.push(quote.cfi);
        }
    }

    return cfis;
}

export function mergeTocWithQuotes(
    toc: NavItem[],
    quotesByHref: QuotesByHref,
    parentHref: string = ""
): TocItem[] {
    const tocItems: TocItem[] = [];

    // Quotes before the first TOC item
    if (quotesByHref && quotesByHref.has(parentHref)) {
        for (const quote of quotesByHref.get(parentHref)) {
            tocItems.push({kind: 'quote', quote: quote});
        }
    }

    for (const navItem of toc) {
        tocItems.push({
            kind: 'nav',
            navItem: navItem,
            children: mergeTocWithQuotes(
                navItem.subitems || [],
                quotesByHref,
                navItem.href
            ),
        });
    }

    return tocItems;
}
