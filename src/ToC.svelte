<script lang="ts" context="module">
    export interface TocClick {
        location: string;
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { TocItem } from "./quotes.js";

    export let items: TocItem[];

    const dispatch = createEventDispatcher<{ click: TocClick }>();

    function onItemClicked(cfi: string) {
        dispatch("click", {
            location: cfi,
        });
    }
</script>

<ul>
    {#each items as item}
        <li>
            {#if item.kind === "quote"}
                <button
                    class="quote"
                    on:click={() => {
                        onItemClicked(item.quote.cfi);
                    }}>{item.quote.text}</button
                >
            {:else}
                <button
                    class="toc"
                    on:click={() => onItemClicked(item.navItem.href)}
                    >{item.navItem.label.trim()}</button
                >
                {#if item.children.length > 0}
                    <svelte:self items={item.children} on:click />
                {/if}
            {/if}
        </li>
    {/each}
</ul>

<style>
    button.toc {
        border: none;
        background: none;
        text-align: left;
        text-decoration: underline;
        cursor: pointer;
    }

    button.quote {
        border: none;
        text-align: left;
        background-color: #ffecaf;
        cursor: pointer;
    }
</style>
