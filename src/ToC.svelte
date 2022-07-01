<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { NavItem } from "epubjs";

    export let items: NavItem[];
</script>

<ul>
    {#each items as item}
        <li>
            <button>{item.label.trim()}</button>
        </li>
        {#if item.subitems}
            <svelte:self items={item.subitems} />
        {/if}
    {/each}
</ul>

<style>
</style>
