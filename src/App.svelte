<script lang="ts">
    import ePub, { Book } from "epubjs";
    import FileInput, { FileChosen } from "./FileInput.svelte";
    import BookView from "./BookView.svelte";
    import ToC, { TocClick } from "./ToC.svelte";
    import { arrangeByHref, extractCfis, mergeTocWithQuotes } from "./quotes.js";
    import type { FoundJson, QuotesByHref, TocItem } from "./quotes.js";

    let book: Book = null;
    let location: string | number = 0;

    let quotesByHref: QuotesByHref = null;
    let highlights: string[] = [];
    let toc: TocItem[];

    $: if (book) toc = mergeTocWithQuotes(book.navigation.toc, quotesByHref);
    $: if (quotesByHref) highlights = extractCfis(quotesByHref);

    function onBookInput(event: CustomEvent<FileChosen>) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(event.detail.file);

        reader.addEventListener("loadend", () => {
            ePub(reader.result).opened.then((openedBook) => {
                console.log(book);
                book = openedBook;
                location = 0;
            });
        });
    }

    function onJsonInput(event: CustomEvent<FileChosen>) {
        let reader = new FileReader();
        reader.readAsText(event.detail.file);

        reader.addEventListener("loadend", () => {
            let foundJson: FoundJson = JSON.parse(reader.result as string);
            quotesByHref = arrangeByHref(foundJson);
            console.log(quotesByHref);
        });
    }

    function onTocClick(event: CustomEvent<TocClick>) {
        location = event.detail.location;
    }
</script>

<main>
    <div class="horizontal">
        <FileInput
            label="EPUB"
            accept="application/epub+zip"
            uploaded={book !== null}
            on:fileChosen={onBookInput}
        />
        <FileInput
            label="found.json"
            accept="application/json"
            uploaded={quotesByHref !== null}
            on:fileChosen={onJsonInput}
        />
    </div>
    {#if book}
        <div id="bookUI">
            <div id="bookWrapper">
                <BookView {book} display={location} {highlights} />
            </div>
            <nav id="toc">
                <ToC items={toc} on:click={onTocClick} />
            </nav>
        </div>
    {/if}
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    main {
        display: flex;
        flex-flow: column;
        height: 100vh;
    }

    .horizontal {
        display: flex;
        flex-direction: row;
    }

    #bookUI {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        flex-grow: 1;
    }

    #bookWrapper {
        flex-grow: 1;
        overflow: hidden;
    }

    #toc {
        width: 30%;
        overflow-y: scroll;
    }
</style>
