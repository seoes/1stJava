<script>
import { Route } from "tinro";
import FindMyLocation from "./FindMyLocation.svelte";
import SearchLocation from "./SearchLocation.svelte";
import SetMap from "./SetMap.svelte";
import SetMarker from "./SetMarker.svelte";
import TheaterPopup from "./TheaterPopup.svelte";

let map;
let selectedTheater = {};


    // fetch("/movie")
    // .then(res => res.json())
    // .then(result => {
    //     //코드
    // })
    
</script>

<style>
    #map {
        display: flex;
        height: 400px;
    }
</style>

<p>hello</p>
    <div>
        <!-- <p style="margin-top:-12px">
            <em class="link">
                <a href="javascript:void(0);" onclick="window.open('http://fiy.daum.net/fiy/map/CsGeneral.daum', '_blank', 'width=981, height=650')">
                    혹시 주소 결과가 잘못 나오는 경우에는 여기에 제보해주세요.
                </a>
            </em>
        </p> -->
        <div id="map">
            <SetMap bind:map={map}/>
            <SetMarker bind:map={map} bind:selectedTheater={selectedTheater}/>
        </div>
        <!-- <SearchLocation /> -->
        <FindMyLocation bind:map={map}/>
        <a href="/theater/detail/123">123가보자</a>
        <a href="/theater/detail/456">456가보자</a>
        <Route path='/detail/:_code'>
            <TheaterPopup bind:selectedTheater={selectedTheater}/>
        </Route>

        
    </div>