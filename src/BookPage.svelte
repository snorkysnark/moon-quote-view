<script lang="ts">
    import { getContext } from "svelte";
    import type { Book, Rendition } from "epubjs";
    import { scrollViewContext } from "./context.js";

    export let book: Book;
    export let display: string | number;
    export let highlights: string[] = [];

    let viewContainer: HTMLElement;
    let rendition: Rendition;

    const parentScrollView: { setScrollPosition: (top: number) => {} } =
        getContext(scrollViewContext);

    function renderBook(book: Book, container: HTMLElement) {
        if (container) {
            rendition = book.renderTo(container, {
                width: "100%",
                flow: "scrolled-doc",
            });
        }
    }

    function displayTarget(target: string | number, rendition: Rendition) {
        if (rendition) {
            rendition.display(target as string).then(() => {
                if (typeof target === "string" && parentScrollView) {
                    // @ts-ignore: Wrong type definition for Rendition.views()
                    const view = rendition.views().get(0);
                    const location: { left: number; top: number } =
                        view.locationOf(target);

                    parentScrollView.setScrollPosition(location.top);
                }
            });
        }
    }

    function updateHighlights(highlights: string[], rendition: Rendition) {
        if (rendition) {
            for (const cfi of highlights) {
                rendition.annotations.highlight(cfi);
            }
        }
    }

    $: renderBook(book, viewContainer);
    $: displayTarget(display, rendition);
    $: updateHighlights(highlights, rendition);
</script>

<div id="reader" bind:this={viewContainer} />

<style>
    #reader {
        width: 50%;
        background-color: white;
        box-shadow: 0 0 10px;
        padding-top: 2em;
        padding-bottom: 2em;
        margin: 0 auto;
    }
</style>
