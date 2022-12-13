<script>
    let showModal = false;
    import Modal from "../Layout/Modal.svelte";
    import { meta } from "tinro";
    import { onMount } from "svelte";
    let route = meta();
    

    console.log(route.params._code);
    let code = route.params._code;
    console.log(code);

    async function findTheater(code) {
        const response = await fetch("/theatercode?code=" + code);
        
        const result = await response.json();
        console.log(response);
        console.log(result);

        return result;
    }
    let modalTheater = findTheater(route.params._code);
    console.log(modalTheater);
    $: {
        console.log(modalTheater);
    }
</script>

<!-- <button on:click="{() => showModal = true}">
    show modal
</button> -->

<!-- {#if showModal} -->
<Modal on:close="{() => showModal = false}">
    <h2 slot="header">
    </h2>
    {#await modalTheater}
    {:then modalTheater} 
    {modalTheater.name}
    

    
    <h4>{modalTheater.address}</h4>
    <h4>{modalTheater.company}</h4>

    <ol class="definition-list">
        <li>of or relating to modality in logic</li>
    </ol>
    {:catch}
        <p>올바르지 않은 주소입니다.</p>
    {/await}
</Modal>
<!-- {/if} -->