<script>
    import BoxOffice from "../BoxOffice.svelte";
    import Map from "../Map/Map.svelte";
    import MovieCards from "../MovieCard/MovieCards.svelte";
    import SideNav from "../Nav/SideNav.svelte";
    import {Route} from 'tinro';
    import Register from "../user/register.svelte"
    import Login from "../User/login.svelte";

    let viewMode = 'map';
</script>
<!-- <SideNav/> -->
<div style="margin:0 auto;" class="uk-width-1-1 uk-width-5-6@s uk-padding-small">
    <div>
        <h3>테스트용</h3>
        <button><a href="/">페이지 보기</a></button>
        <button><a href="/theater">지도페이지 보기</a></button>
    </div>
    <Route path="/">
        <BoxOffice/>
        <MovieCards/>
    </Route>
    <Route path="/theater/*">
        <Map />
    </Route>
    <Route path="/register">
        <Register />
    </Route>
    <Route path ="/login">
        <Login />
    </Route>
</div>