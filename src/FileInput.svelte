<script lang="ts" context="module">
    export interface FileChosen {
        file: File;
    }
</script>

<script lang="ts">
    import uploadIcon from "./assets/upload-svgrepo-com.svg";
    import okIcon from "./assets/ok-svgrepo-com.svg";
    import { createEventDispatcher } from "svelte";

    export let label: string = "";
    export let accept: string = "";
    export let uploaded: boolean = false;

    const dispatch = createEventDispatcher<{ fileChosen: FileChosen }>();
    let input: HTMLInputElement;

    function onInputChange() {
        if (input.files.length > 0) {
            dispatch("fileChosen", {
                file: input.files.item(0),
            });
        }
    }
</script>

<main>
    <label>
        {label}
        <input
            type="file"
            {accept}
            bind:this={input}
            on:change={onInputChange}
        />
        <img
            id="uploadIcon"
            src={uploaded ? okIcon : uploadIcon}
            alt="Upload"
        />
    </label>
</main>

<style>
    input {
        display: none;
    }

    label {
        font-size: 1.25em;
        font-weight: 700;
        color: white;
        background-color: #fb3d02;
        display: inline-block;
        cursor: pointer;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
        padding-left: 0.3em;
        padding-right: 0.4em;
        margin: 0.1em;
        border-radius: 0.3em;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
    }

    #uploadIcon {
        height: 1em;
        filter: invert(100%);
        margin-left: 0.4em;
    }
</style>
