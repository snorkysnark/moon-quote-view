<script lang="ts">
    import ePub, { Book } from "epubjs";
    import FileInput from "./FileInput.svelte";
    import BookScrollView from "./BookScrollView.svelte";
    import ToC from "./ToC.svelte";

    let book: Book = null;
    /* let location = "epubcfi(/6/22!/4/36[ris3-1]/4,/1:0,/6[note-26-backlink]/1:2)"; */
    let highlights = [
        "epubcfi(/6/22!/4/36[ris3-1]/4,/1:0,/6[note-26-backlink]/1:2)"
    ];

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
</script>

<main>
    <div class="container">
        <FileInput
            label="EPUB"
            accept="application/epub+zip"
            uploaded={book !== null}
            on:fileChosen={onBookInput}
        />
        {#if book}
            <div id="bookMenu">
                <div id="bookContainer">
                    <BookScrollView book={book} location={0} />
                </div>
                <div id="toc">
                    <ToC items={book.navigation.toc} />
                </div>
            </div>
        {/if}
    </div>
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

    .container {
        display: flex;
        flex-flow: column;
        height: 100vh;
    }

    #bookMenu {
        display: flex;
        flex-flow: row;
        height: 100%;
    }

    #bookContainer {
        flex-grow: 1;
    }

    #toc {
        flex-basis: 25%;
        overflow: scroll;
    }
</style>
