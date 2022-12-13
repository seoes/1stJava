<script>
    import BoxOffice from "../BoxOffice.svelte";
    import Map from "../Map/Map.svelte";
    import MovieCards from "../MovieCard/MovieCards.svelte";
    import SideNav from "../Nav/SideNav.svelte";
    import List from "../Board/List/List.svelte"
    // import Main from "./Main.svelte";
    import ListTable from "../Board/List/List_table.svelte";
    import {Route} from 'tinro';
    let viewMode = 'map';
</script>

<div style="margin:0 auto;" class="uk-width-1-1 uk-width-5-6@s uk-padding-small">

    <div>
        <h3>테스트용</h3>
        <button><a href="/">페이지 보기</a></button>
        <button><a href="/theater">지도페이지 보기</a></button>
        <button><a href="/board">게시판 보기</a></button>
    </div>

    <Route path="/">
        <BoxOffice/>
        <MovieCards/>
    </Route>
    <Route path="/theater/*">
        <Map />
    </Route>
    <Route path="/board/*">
        <List/>
    </Route>


</div>