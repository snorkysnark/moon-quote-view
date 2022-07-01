<script lang="ts">
    import type { Book, Rendition } from "epubjs";

    export let book: Book;
    export let display: string | number;
    export let highlights: string[] = [];

    let viewContainer: HTMLElement;
    let rendition: Rendition;
    let prevHighlights: string[] = [];

    function onKeyUp(event: KeyboardEvent) {
        if (!rendition) return;

        switch (event.key) {
            case "ArrowLeft":
                rendition.prev();
                break;
            case "ArrowRight":
                rendition.next();
                break;
        }
    }

    function renderBook(book: Book, container: HTMLElement) {
        if (!container) return;

        if (rendition) {
            rendition.destroy();
        }
        rendition = book.renderTo(container, {
            height: "100%",
            width: "100%",
            flow: "scrolled-doc",
            allowScriptedContent: true // Needed for key events to work
        });
        rendition.on("keyup", onKeyUp);
    }

    function updateLocation(location: string | number, rendition: Rendition) {
        if (!rendition) return;

        // There are overloaded methods display(string) and display(number),
        // but tsc is not smart enough for that
        rendition.display(location as any).then(() => {
            // Disable horizontal scrollbar
            const renderer = viewContainer.children.item(0) as HTMLDivElement;
            renderer.style.overflowX = "hidden";
        });
    }

    function updateHighlights(highlights: string[], rendition: Rendition) {
        if (!rendition) return;

        // Remove previous highlights
        for (const prevCfi of prevHighlights) {
            rendition.annotations.remove(prevCfi, "highlight");
        }

        for (const cfi of highlights) {
            rendition.annotations.highlight(cfi);
        }

        prevHighlights = [...highlights];
    }

    $: renderBook(book, viewContainer);
    $: updateLocation(display, rendition);
    $: updateHighlights(highlights, rendition);
</script>

<svelte:window on:keyup={onKeyUp} />
<div id="reader" bind:this={viewContainer} />

<style>
    #reader {
        height: 100%;
        width: 100%;
    }
</style>
