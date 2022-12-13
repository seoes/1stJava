<script>
    import { meta } from "tinro";
    
    const route = meta();
    $: movieTitle = route.params.title;

    async function getMovie() {
        const response = await fetch(`/searchTitle?releaseDts=19000101&title=${movieTitle}`);
        const result = await response.json();

        return result;
    }

    let bgColor = "white";
    let titleColor = "black";

    function getColorData(color) { // rgb 배열을 rgba문자열, 밝기값을 포함한 객체로 배열 color = [R, G, B] -> rbga(R,G,B);
        return {
            rgb : "rgba(" + color[0] + "," + color[1] + "," + color[2] + ")", // [255, 255, 255] -> "rgba(255,255,255)"
            luma : 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]
        }
    }

    function getGamma(color1, color2) { // 두 색상의 밝기 (luma) 차이 절댓값을 반환
        return Math.abs(getColorData(color1).luma - getColorData(color2).luma)
    }
    function setColor(img) {
        const colorThief = new ColorThief();
        bgColor = colorThief.getColor(img);
        
        titleColor = getColorData(colorThief.getPalette(img).reduce((p, c) => { //컬러 팔레트의 색상을 하나씩 순차적으로 비교 
            return getGamma(bg,p) > getGamma(bg,c) ? p : c; // 감마 차이가 더 큰 값을 리턴하여 배열의 다음 값과 비교
        }));
    }

    $: movies = getMovie();
    $: {
        console.log(movies);
    }


    // let movies = {
    //     Data : [{
    //         Result: [
    //             {
    //                 title : "기생충",
    //                 genre : "드라마, 스릴러",
    //                 nation : "한국",
    //                 rating : "15세 관람가",
    //                 repRlsDate : "20220127",
    //                 runtime : "93",
    //                 Awards1 : "청룡영화상(2022) : 각본상 - 정서경, 박찬욱|청룡영화상(2022) : 남우주연상 - 박해일",
    //                 keywords : "암벽등반,알리바이",
    //                 posters : "http://file.koreafilm.or.kr/thm/02/99/17/75/tn_DPF025643.jpg|http://file.koreafilm.or.kr/thm/02/99/17/72/tn_DPF025470.jpg",
    //                 movieId : "F",
    //                 movieSeq : "55469",

    //                 plots : {
    //                     plot : [
    //                         {
    //                             plotLang : "한국어",
    //                             plotText : "형사 '해준'(박해일)은 사망자의 아내 '서래'(탕웨이)와 마주하게 된다. 산에 가서 안 오면 걱정했어요."
    //                         }
    //                     ]
    //                 },
    //                 directors : {
    //                     director : [
    //                         {
    //                             directorNm : "봉준호"
    //                         }
    //                     ]
    //                 },
    //                 actors : {
    //                     actor : [
    //                         {
    //                             actorNm : "송강호"
    //                         }
    //                     ]
    //                 }

    //             },
    //             {
    //                 title : "괴물",
    //                 genre : "SF, 스릴러",
    //                 nation : "한국",
    //                 rating : "15세 관람가",
    //                 repRlsDate : "20060222",
    //                 runtime : "119",
    //                 Awards1 : "청룡영화상(2022) : 각본상 - 정서경, 박찬욱|청룡영화상(2022) : 남우주연상 - 박해일",
    //                 keywords : "암벽등반,알리바이",
    //                 posters : "http://file.koreafilm.or.kr/thm/02/99/17/75/tn_DPF025643.jpg|http://file.koreafilm.or.kr/thm/02/99/17/72/tn_DPF025470.jpg",
    //                 movieId : "F",
    //                 movieSeq : "55469",



    //                 plots : {
    //                     plot : [
    //                         {
    //                             plotLang : "한국어",
    //                             plotText : "형사 '해준'(박해일)은 사망자의 아내 '서래'(탕웨이)와 마주하게 된다. 산에 가서 안 오면 걱정했어요."
    //                         }
    //                     ]
    //                 },
    //                 directors : {
    //                     director : [
    //                         {
    //                             directorNm : "봉준호"
    //                         }
    //                     ]
    //                 },
    //                 actors : {
    //                     actor : [
    //                         {
    //                             actorNm : "송강호"
    //                         }
    //                     ]
    //                 }
    //             }
    //         ]
    //     }]
    // }
    // console.log(movie);
</script>

<style>
    /* #movie-info {
        padding: 36px;
    } */

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
    {#await movies}
    {:then movies}     
    {#each movies.Data[0].Result as movie}
    <div>
        <div class="uk-card uk-card-default movie-card">
            <div>
                <a href="/movie/{movie.movieId}/{movie.movieSeq}">
                    {#if movie.posters == ""}
                    <img src="/img/alt-poster.png" alt="이미지 불러오기 실패"/>
                    {:else}
                    <img src={movie.posters.split('|', 1)[0]} alt="이미지 불러오기 실패"/>
                    {/if}
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
    {/await}
</div>
