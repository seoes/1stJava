<script>
    import BoxOffice from "../Movie/BoxOffice.svelte";
    import Map from "../Map/Map.svelte";
    import MovieCards from "../MovieCard/MovieCards.svelte";
    import SideNav from "../Nav/SideNav.svelte";
    import MovieInfo from "../Movie/MovieInfo.svelte";
    import MovieSearch from "../Movie/MovieSearch.svelte";
    import Loading from "../Movie/Loading.svelte";
    import Testlist from "../Movie/Testlist.svelte";
    import {Route} from 'tinro';
    import Register from "../user/register.svelte"
    import Login from "../User/login.svelte";

    import List from "../Board/List/List.svelte"
    // import Main from "./Main.svelte";
    import ListTable from "../Board/List/List_table.svelte";
    // import {Route} from 'tinro';
    let viewMode = 'map';
</script>

<div style="margin:0 auto;" class="uk-width-1-1 uk-width-5-6@s uk-padding-small">
    <Route path="/">
        <!-- <Testlist /> -->
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
    <Route path="/movie/:movieId/:movieSeq">
        <MovieInfo />
    </Route>
    <Route path="/search/:title">
        <MovieSearch/>
    </Route>
    <Route path="/loading/:title">
        <Loading />
    </Route>
    <Route path="/board/*">
        <List/>
    </Route>


</div>