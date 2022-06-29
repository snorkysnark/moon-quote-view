<script lang="ts">
    import type { Book, Rendition } from "epubjs";

    export let book: Book;
    export let cfi: string;

    let viewContainer: HTMLElement;
    let rendition: Rendition;

    function renderBook(book: Book, container: HTMLElement, cfi: string) {
        if (book && container && cfi) {
            rendition = book.renderTo(container, {
                width: "100%",
                height: "100%",
                flow: "scrolled"
            });

            rendition.annotations.highlight(cfi);
            rendition.display(cfi);
            rendition.on("resized", () => rendition.display(cfi));
        }
    }
    $: renderBook(book, viewContainer, cfi);
</script>

<main>
    <div id="reader" bind:this={viewContainer} />
</main>

<style>
    #reader {
        height: 25em;
        width: 100%;
        border: 2px solid;
    }
</style>
