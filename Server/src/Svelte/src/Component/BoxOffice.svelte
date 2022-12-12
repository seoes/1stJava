<script>
    import { onMount } from "svelte";
    import SampleData from "./MovieCard/SampleData.svelte";

    

    async function getBoxOffice(range) {
        const regex = /[^0-9]/g;
        const response1 = await fetch("/" + range);
        const result1 = await response1.json();

        
        
        const list = await result1.boxOfficeResult.dailyBoxOfficeList.map(async (movie) => {
            const response = await fetch(`/searchTitle?title=${movie.movieNm}&releaseDts=${movie.openDt.replace(regex, "")}`);
            const result = await response.json();
            console.log(result);
            return result;
        })

        await console.log(list);
        console.log(list);

        return list;
    }

    let ranks = getBoxOffice("daily");

    $: {
        console.log(ranks);
    }

    let sampleDatas = [
        {
            title:"언더 더 실버레이크",
            audiCnt: 54344,
            actor:["앤드류 가필드", "앤드류 가필드"],
            rank: 1,
            poster: "/img/sample-silverlake.jpeg"
        },
        {
            title:"헤어질 결심",
            audiCnt: 26890,
            actor:["박해일", "탕웨이"],
            rank: 2,
            poster: "/img/sample-park.jpeg"
        },
        {
            title:"미드나잇 인 파리",
            audiCnt: 16890,
            actor:["오웬 윌슨", "레이첼 맥아담스"],
            rank: 3,
            poster: "/img/sample-paris.jpeg"
        },
        {
            title:"미드소마",
            audiCnt: 9162,
            actor:["플로렌스 퓨", "잭 레이너"],
            rank: 4,
            poster: "/img/sample-midsommar.jpg"
        },
        {
            title:"스타 이즈 본",
            audiCnt: 9162,
            actor:["브래들리 쿠퍼", "레이디 가가"],
            rank: 5,
            poster: "/img/sample-starisborn.jpg"
        },
    ]
</script>

<style>
    .card-body {
        padding: 24px;
    }
    .card-body p {
        margin-top: 18px;
        margin-bottom: 0;
    }

    #card-boxoffice {
        display: flex;
        /* overflow-x: scroll; */
        padding: 24px 48px 12px 48px;
    }
    #card-boxoffice > div {
        width: 500px;
        margin: 0 12px;
    }

    #card-boxoffice img {
        height: 400px;
        border-radius: 20px;
        background-size: cover;
    }

    #card-boxoffice span {
        position: absolute;
        background-color: #FF1111;
        padding: 8px 12px 4px 14px;
        border-radius: 20px 0 0 0;
        /* width: 20px; */
        /* height: 20px; */
        color: white;
        font-weight: 800;
    }

    #movie-info h4 {
        font-size: 14px;
        font-weight: 600;
        margin: 4px 0 6px 0;
        color: #444444;
    }

    #movie-info h5 {
        font-size: 12px;
        font-weight: 400;
        margin: 0px;
        color: #444444;
    }

    #movie-info {
        padding: 12px;
    }
</style>

<div class="uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m" uk-grid>
    <div>
        <button on:click={() => {ranks = getBoxOffice("daily")}}>일간박스오피스</button>
        <button on:click={() => {ranks = getBoxOffice("weekly")}}>주간박스오피스</button>
    </div>
    <div>
        {#await ranks}
        {:then ranks}
        <div class="uk-card uk-card-default">
            <div id="card-boxoffice"class="card-body" uk-slider>
                <ul class="uk-slider-items uk-child-width-1-4 uk-grid">
                    {#each ranks as movie, index}
                    {#await movie}
                    {:then movie} 
                    <li>
                        <div class="uk-panel">
                            <div>
                                <span>{index+1}</span>
                                <img src={movie.Data[0].Result[0].posters.split('|', 1)[0]} alt="포스터 불러오기 실패"/>
                            </div>
                            <div id="movie-info">
                                <h4>{movie.Data[0].Result[0].title.replace(/!HS | !HE/g, "")}</h4>
                                <h5>{movie.Data[0].Result[0].actors.actor[0].actorNm} 주연</h5>
                                <h5>{movie.Data[0].Result[0].actors.actor[0].actorNm} 주연</h5>
                                <!-- <h5>{movie.audiInten.toLocaleString("kr")}명</h5> -->
                            </div>
                        </div>
                    </li>
                    {/await}
                    {/each}
                </ul>
                <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
                <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
            </div>
        </div>
        {/await}
    </div>
    <!-- <div>
        <div class="uk-card uk-card-default">
            <div class="card-body">
                <h5>일간 박스오피스</h5>
                <span><p>1위 아바타2</p></span>
                <p>2위 데시벨</p>
                <p>3위 헤어질 결심</p>
                <p>4위 아마겟돈 타임</p>
                <p>5위 녹색광선</p>
            </div>
        </div>
    </div> -->
    <!-- <div>
        {#await rankWeekly}
                <p>로딩 중</p>
        {:then rankWeekly}
        <div class="uk-card uk-card-default">
            <div class="uk-card-body">
                <h5>주간 박스오피스</h5>
                
                {#each rankWeekly.boxOfficeResult.weeklyBoxOfficeList as rank}
                <span><p>{rank.rank}위 {rank.movieNm} (관객수 : {rank.audiCnt})</p></span>
                {/each}
                
            </div>
        </div>
        {:catch error}
                <p>로딩 실패</p>
        {/await}
    </div> -->
</div>