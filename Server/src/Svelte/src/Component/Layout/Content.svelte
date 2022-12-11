<script>
    import BoxOffice from "../BoxOffice.svelte";
    import Map from "../Map/Map.svelte";
    import MovieCards from "../MovieCard/MovieCards.svelte";
    import SideNav from "../Nav/SideNav.svelte";
    import List from "../Board/List/List.svelte"
    import Main from "./Main.svelte";
  import ListTable from "../Board/List/List_table.svelte";
    let viewMode = 'map';

</script>
<!-- <SideNav/> -->
<div class="uk-width-1-1 uk-width-expand@s uk-padding-small">


    <div>
        <h3>테스트용</h3>
        <button on:click={() => {viewMode = 'sns'}}>sns페이지 보기</button>
        <button on:click={() => {viewMode = 'map'}}>지도페이지 보기</button>
        <button on:click={() => {viewMode = 'board'}}>게시판 보기</button>

    </div>
    {#if viewMode === 'sns'}
    <BoxOffice/>
    <MovieCards/>
    {:else if viewMode === 'board'}
    <List/>
    {:else}
    <Map/>
    {/if}
</div>