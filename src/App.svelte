<script lang="ts">
    import ePub, { Book } from "epubjs";
    import FileInput from "./FileInput.svelte";
    import { arrangeAsChapters } from "./chapters.js";
    import type { Chapter, FoundJson } from "./chapters.js";

    let book: Book = null;
    let chapters: Chapter[] = null;

    function onBookInput(event: CustomEvent<{ file: File }>) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(event.detail.file);

        reader.addEventListener("loadend", () => {
            ePub(reader.result).opened.then((openedBook) => {
                book = openedBook;
                console.log(book);
            });
        });
    }

    function onJsonInput(event: CustomEvent<{ file: File }>) {
        let reader = new FileReader();
        reader.readAsText(event.detail.file);

        reader.addEventListener("loadend", () => {
            let found_json = JSON.parse(reader.result as string) as FoundJson;
            chapters = arrangeAsChapters(found_json);
            console.log(chapters);
        });
    }
</script>

<main>
    <FileInput
        label="EPUB"
        accept="application/epub+zip"
        uploaded={book !== null}
        on:fileChosen={onBookInput}
    />
    <FileInput
        label="found.json"
        accept="application/json"
        uploaded={chapters !== null}
        on:fileChosen={onJsonInput}
    />

    {#if chapters}
        {#each chapters as chapter}
            {#if chapter.name}
                <h1>{chapter.name}</h1>
            {/if}
            <h2>{chapter.id}</h2>
            {#each chapter.quotes as quote}
                <p>{quote.cfi}</p>
            {/each}
        {/each}
    {/if}
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
</style>
