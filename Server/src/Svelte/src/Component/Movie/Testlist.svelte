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
    h2 {
        font-size: 28px;
        font-weight: 600;
        margin: 12px;
        padding: 0;
        color: #444444;
    }
    h4 {
        font-size: 14px;
        font-weight: 600;
        margin: 12px;
        padding: 0;
        color: #444444;
    }

    h5 {
        font-size: 12px;
        font-weight: 400;
        margin: 12px;
        padding: 0;
        color: #444444;
    }
    #poster {
        border-radius: 20px;
    }

    #infos {
        display: flex;
    }

    #infos > div {
        padding: 24px;
    }

</style>

<div id="lists">
    <div>
        <div in:fade class="uk-card uk-card-default movie-card">
            <div id="infos">
                <div>
                    <img id="poster" src={movies.Data[0].Result[0].posters.split('|', 1)[0]} alt="포스터 불러오기 실패"/>
                </div>
                <div>
                    <h2>{movies.Data[0].Result[0].title.replace(/!HS | !HE/g, "")}</h2>
                    <h4>{movies.Data[0].Result[0].nation}, {movies.Data[0].Result[0].repRlsDate.substring(0,4)}</h4>
                    <h5>장르 : {movies.Data[0].Result[0].genre}</h5>
                    <h5>관람등급 : {movies.Data[0].Result[0].rating}</h5>
                    <h5>상영시간 : {movies.Data[0].Result[0].runtime}분</h5>
                    <h5>{movies.Data[0].Result[0].directors.director[0].directorNm} 감독</h5>
                    <h5>{movies.Data[0].Result[0].actors.actor[0].actorNm} 주연</h5>
                    <h5>{movies.Data[0].Result[0].plots.plot[0].plotText}</h5>
                </div>
                
            </div>
        </div>
    </div>
</div>

