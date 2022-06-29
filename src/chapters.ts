interface FoundQuote {
    chapter_id: string;
    chapter_name: string;
    chapter_order: number;
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
    text: string;
    distance: number;
    cfi: string;
}

export interface Chapter {
    id: string;
    name: string;
    quotes: Quote[];
}

export function arrangeAsChapters(foundJson: FoundJson): Chapter[] {
    let chapters = new Map<number, Chapter>();

    for (const originalQuote of Object.values(foundJson)) {
        if (originalQuote.found.length === 0) continue;

        const foundQuote = originalQuote.found[0];
        let chapter = chapters.get(foundQuote.chapter_order);

        if (!chapter) {
            chapter = {
                id: foundQuote.chapter_id,
                name: foundQuote.chapter_name,
                quotes: [],
            };
            chapters.set(foundQuote.chapter_order, chapter);
        }

        chapter.quotes.push({
            text: foundQuote.text,
            distance: foundQuote.distance,
            cfi: foundQuote.cfi,
        });
    }

    // Sort by chapter order
    return [...chapters.entries()]
        .sort((entryA, entryB) => entryA[0] - entryB[0])
        .map((entry) => entry[1]);
}
