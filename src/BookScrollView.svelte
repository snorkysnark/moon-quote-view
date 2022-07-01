<script lang="ts">
    import { setContext } from "svelte";
    import type { Book } from "epubjs";
    import BookPage from "./BookPage.svelte";
    import { scrollViewContext } from "./context.js";

    export let book: Book;
    export let location: string | number;
    export let highlights: string[] = [];

    let scrollView: HTMLDivElement;

    setContext(scrollViewContext, {
        setScrollPosition: (top: number) => {
            scrollView.scrollTop = top;
        },
    });

    let currentLocation: string | number = 0;
    $: currentLocation = location;
</script>

<div id="scrollview" bind:this={scrollView}>
    <BookPage {book} display={currentLocation} {highlights} />
</div>

<style>
    #scrollview {
        overflow-y: scroll;
        padding-top: 1em;
        padding-bottom: 1em;
        background-color: lightgray;
    }
</style>
