<script>
    import { meta } from "tinro";
    const route = meta();


    let movies = {
        Data : [{
            Result: [
                {
                    title : "기생충",
                    genre : "드라마, 스릴러",
                    nation : "한국",
                    rating : "15세 관람가",
                    repRlsDate : "20220127",
                    runtime : "93",
                    Awards1 : "청룡영화상(2022) : 각본상 - 정서경, 박찬욱|청룡영화상(2022) : 남우주연상 - 박해일",
                    keywords : "암벽등반,알리바이",
                    posters : "http://file.koreafilm.or.kr/thm/02/99/17/75/tn_DPF025643.jpg|http://file.koreafilm.or.kr/thm/02/99/17/72/tn_DPF025470.jpg",
                    movieId : "F",
                    movieSeq : "55469",

                    plots : {
                        plot : [
                            {
                                plotLang : "한국어",
                                plotText : "형사 '해준'(박해일)은 사망자의 아내 '서래'(탕웨이)와 마주하게 된다. 산에 가서 안 오면 걱정했어요."
                            }
                        ]
                    },
                    directors : {
                        director : [
                            {
                                directorNm : "봉준호"
                            }
                        ]
                    },
                    actors : {
                        actor : [
                            {
                                actorNm : "송강호"
                            }
                        ]
                    }

                },
                {
                    title : "괴물",
                    genre : "SF, 스릴러",
                    nation : "한국",
                    rating : "15세 관람가",
                    repRlsDate : "20060222",
                    runtime : "119",
                    Awards1 : "청룡영화상(2022) : 각본상 - 정서경, 박찬욱|청룡영화상(2022) : 남우주연상 - 박해일",
                    keywords : "암벽등반,알리바이",
                    posters : "http://file.koreafilm.or.kr/thm/02/99/17/75/tn_DPF025643.jpg|http://file.koreafilm.or.kr/thm/02/99/17/72/tn_DPF025470.jpg",
                    movieId : "F",
                    movieSeq : "55469",



                    plots : {
                        plot : [
                            {
                                plotLang : "한국어",
                                plotText : "형사 '해준'(박해일)은 사망자의 아내 '서래'(탕웨이)와 마주하게 된다. 산에 가서 안 오면 걱정했어요."
                            }
                        ]
                    },
                    directors : {
                        director : [
                            {
                                directorNm : "봉준호"
                            }
                        ]
                    },
                    actors : {
                        actor : [
                            {
                                actorNm : "송강호"
                            }
                        ]
                    }
                }
            ]
        }]
    }
    // console.log(movie);
</script>

<style>
    /* #movie-info {
        padding: 36px;
    } */
    #movie-info img {
        border-radius: 20px;
    }
    h4 {
        font-size: 14px;
        font-weight: 600;
        margin: 4px 0 6px 0;
        color: #444444;
    }

    h5 {
        font-size: 12px;
        font-weight: 400;
        margin: 0px;
        padding: 2px, 0;
        color: #444444;
    }

</style>

<div id="lists" class="uk-grid-column-small uk-grid-row-small uk-child-width-1-4 uk-child-width-1-6@l uk-child-width-1-6@xl" uk-grid="masonry: true">
    {#each movies.Data[0].Result as movie}
    <div>
        <div in:fade class="uk-card uk-card-default movie-card">
            <div>
                <a href="/movie/{movie.movieId}/{movie.movieSeq}">
                    <img src={movie.posters.split('|', 1)[0]} alt="포스터 불러오기 실패"/>
                </a>
            </div>
            <div class="uk-card-body">
                <a href="/movie/{movie.movieId}/{movie.movieSeq}">
                    <h4>{movie.title.replace(/!HS | !HE/g, "")}</h4>
                    <h5>{movie.directors.director[0].directorNm} 감독</h5>
                    <h5>{movie.actors.actor[0].actorNm} 주연</h5>
                </a>
            </div>
        </div>
    </div>
    {/each}
</div>

