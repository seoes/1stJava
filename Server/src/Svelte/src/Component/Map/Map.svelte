<script>
import FindMyLocation from "./FindMyLocation.svelte";
import SearchLocation from "./SearchLocation.svelte";
import SetMap from "./SetMap.svelte";
import SetMarker from "./SetMarker.svelte";
let map;

    fetch("/movie")
    .then(res => res.json())
    .then(result => {
        //코드
    })
</script>

<p>hello</p>
    <div>
        <!-- <p style="margin-top:-12px">
            <em class="link">
                <a href="javascript:void(0);" onclick="window.open('http://fiy.daum.net/fiy/map/CsGeneral.daum', '_blank', 'width=981, height=650')">
                    혹시 주소 결과가 잘못 나오는 경우에는 여기에 제보해주세요.
                </a>
            </em>
        </p> -->
        <SetMap bind:map={map}/>
        <SetMarker bind:map={map}/>
        <!-- <SearchLocation /> -->
        <FindMyLocation bind:map={map}/>
    </div>