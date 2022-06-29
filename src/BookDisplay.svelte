<script lang="ts">
    import type { Book, Rendition } from "epubjs";

    export let book: Book;
    export let cfi: string;

    let viewContainer: HTMLElement;

    function renderBook(book: Book, container: HTMLElement, cfi: string) {
        if (book && container && cfi) {
            const rendition = book.renderTo(container, {
                height: "40em",
                allowScriptedContent: true,
            });
            rendition.display(cfi);
            rendition.annotations.highlight(cfi);

            /* rendition.on("resized", () => { */
            /*     console.log("resized"); */
            /*     rendition.display(cfi); */
            /* }); */
        }
    }
    $: renderBook(book, viewContainer, cfi);
</script>

<main>
    <div bind:this={viewContainer} />
</main>

<style>
</style>
