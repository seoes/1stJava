<script>
    import Modal from "../Layout/Modal.svelte";

    function setSelectColor(range) {
        const left = document.querySelector("#boxoffice-select-left");
        const right = document.querySelector("#boxoffice-select-right");
        if (range === "daily") {
            left.style.backgroundColor = "#FFFFFF";
            right.style.backgroundColor = "#EFEFEF";
        }
        else if (range === "weekly") {
            left.style.backgroundColor = "#EFEFEF";
            right.style.backgroundColor = "#FFFFFF";
        }
    }

    

    async function getBoxOffice(range) {
        const regex = /[^0-9]/g;
        const response1 = await fetch("/" + range);
        const result1 = await response1.json();


        let list

        
        if(range === "daily") {
            list = await result1.boxOfficeResult.dailyBoxOfficeList.map(async (movie) => {
                const response = await fetch(`/searchTitle?title=${movie.movieNm}&releaseDts=${movie.openDt.replace(regex, "")}`);
                const result = await response.json();
                console.log(result);
                return result;
            })
        }
        else if (range === "weekly") {
            list = await result1.boxOfficeResult.weeklyBoxOfficeList.map(async (movie) => {
                const response = await fetch(`/searchTitle?title=${movie.movieNm}&releaseDts=${movie.openDt.replace(regex, "")}`);
                const result = await response.json();
                console.log(result);
                return result;
            })
        }

        await console.log(list);

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
    let showModal = false;
    console.log(showModal);
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
        /* display: flex; */
        /* overflow-x: scroll; */
        padding: 24px 48px 12px 48px;
        min-height: 504px;
    }
    #card-boxoffice > div {
        
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
        padding: 2px, 0;
        color: #444444;
    }

    #movie-info {
        padding: 12px;
    }
    #select-boxoffice {
        width: 100%;
    }
    #divided {
        width: 100%;
        display: flex;
        /* margin: 0; */
    }

    #divided > div {
        width: 100%;
    }

    #boxoffice-box {
        margin: 0 12px;
    }

    #boxoffice-select h5 {
        color: #9c9c9c;
    }

    #boxoffice-select-left {
        /* background-color: #FFFFFF; */
        border-top-left-radius: 20px;
        cursor: pointer;
    }
    #boxoffice-select-right {
        background-color: #EfEfEf;
        border-top-right-radius: 20px;
        cursor: pointer;
    }
</style>

<div class="uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m" uk-grid>
    <div>
        <div class="uk-card uk-card-default">
            <div>
                <div id="boxoffice-select" class="uk-grid-collapse uk-child-width-expand uk-text-center uk-margin-large-top" uk-grid>
                    <div id="boxoffice-select-left" on:click={() => {ranks = getBoxOffice("daily"); setSelectColor("daily")}} class="uk-padding-small">
                        <h5>일간 박스오피스</h5>
                    </div>
                    <div id="boxoffice-select-right" on:click={() => {ranks = getBoxOffice("weekly"); setSelectColor("weekly")}} class="uk-padding-small">
                        <h5>주간 박스오피스</h5>
                    </div>
                </div>
            </div>
            <div id="card-boxoffice"class="card-body">
                {#await ranks}
                {:then ranks}
                <div id="boxoffice-box" uk-slider>
                    <ul class="uk-slider-items uk-child-width-1-4 uk-grid">
                        {#each ranks as movie, index}
                        {#await movie}
                        {:then movie} 
                        <li>
                            <div class="uk-panel">
                                <div>
                                    <a href="/movie/{movie.Data[0].Result[0].movieId}/{movie.Data[0].Result[0].movieSeq}">
                                        <span>{index+1}</span>
                                        <img src={movie.Data[0].Result[0].posters.split('|', 1)[0]} alt="포스터 불러오기 실패"/>
                                    </a>
                                </div>
                                <div id="movie-info">
                                    <a href="/movie/{movie.Data[0].Result[0].movieId}/{movie.Data[0].Result[0].movieSeq}">
                                        <h4>{movie.Data[0].Result[0].title.replace(/!HS | !HE/g, "")}</h4>
                                        <h5>{movie.Data[0].Result[0].directors.director[0].directorNm} 감독</h5>
                                        <h5>{movie.Data[0].Result[0].actors.actor[0].actorNm} 주연</h5>
                                    </a>
                                </div>
                            </div>
                        </li>
                        {/await}
                        {/each}
                    </ul>
                    <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
                    <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
                </div>
                {/await}
            </div>
        </div>
    </div>
</div>