<script>
    let showModal = false;
    import Modal from "../Layout/Modal.svelte";
    import { meta } from "tinro";
    import { onMount } from "svelte";
  import { draw } from "svelte/transition";
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


    function setModalHeaderColor(company) {
        if(company === "CJ올리브네트웍스(주)") return "#D42E26"
        else if(company === "롯데컬처웍스(주)롯데시네마") return "#D32D26"
        else if(company === "메가박스(주)") return "#392B74"
        else return "#444444"
    }

    function setModalImg(company) {
        if(company === "CJ올리브네트웍스(주)") return "/img/TheaterLogo/cgv_logo.svg"
        else if(company === "롯데컬처웍스(주)롯데시네마") return "/img/TheaterLogo/lotte_logo.svg"
        else if(company === "메가박스(주)") return "/img/TheaterLogo/megabox_logo.svg"
        else return "#444444"
    }
</script>

<!-- <button on:click="{() => showModal = true}">
    show modal
</button> -->

<!-- {#if showModal} -->

<style>
    #modal-header {
        width: 100%;
        height: 54px;
    }
    #modal-content {
        padding: 24px;
    }
    img {
        padding: 12px;
    }

    #modal-content-info {
        padding: 24px;
    }
    
    #modal-content-info * {
        font-weight: 400;

    }
</style>
<Modal on:close="{() => showModal = false}">
    {#await modalTheater}
    {:then modalTheater}
    <div id="modal-header" style="background-color: {setModalHeaderColor(modalTheater.company)};"></div>
    <div id="modal-content">
        <div class="uk-width-1-1 uk-child-width-1-3" id="modal-theater-top" uk-grid>
            <div>
                <img id="modal-theater-img" src="{setModalImg(modalTheater.company)}" alt="사진 불러오기 실패"/>
            </div>
            <div></div>
            <div class="uk-child-width-1-1">
                {#if modalTheater.countImax > 0}
                <img src="/img/TheaterLogo/imax_logo.svg" alt="사진 불러오기 실패"/>
                {/if}
                {#if modalTheater.count4d > 0}
                <img src="/img/TheaterLogo/4dx_logo.svg" alt="사진 불러오기 실패"/>
                {/if}
            </div>
        </div>
        <div id="modal-content-info">
            <h3>{modalTheater.name}</h3>
            <h4>{modalTheater.address}</h4>
            <h4>{modalTheater.company}</h4>
        </div>
    </div>
    {:catch}
        <p>올바르지 않은 주소입니다.</p>
    {/await}
</Modal>
<!-- {/if} -->