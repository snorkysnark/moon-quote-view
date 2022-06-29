<script lang="ts">
    import ePub, { Book } from "epubjs";
    import FileInput from "./FileInput.svelte";
    import BookDisplay from "./BookDisplay.svelte";
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
    <div class="centered">
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
    </div>

        {#if book && chapters}
            {#each chapters as chapter}
                {#if chapter.name}
                    <h1>{chapter.name}</h1>
                {/if}
                <h2>{chapter.id}</h2>
    
    
                <div class="centered">
                    <div class="gridContainer">
                        {#each chapter.quotes as quote}
                            <BookDisplay book={book} cfi={quote.cfi} />
                        {/each}
                    </div>
                </div>
            {/each}
        {/if}
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    .centered {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .gridContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, 50em);
        justify-content: center;
        width: 100%;
    }

    h1 {
        margin: 0;
    }

    h2 {
        margin-top: 0;
        color: gray;
    }
</style>
