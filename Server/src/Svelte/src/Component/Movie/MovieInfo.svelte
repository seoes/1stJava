<script>
    import { meta } from "tinro";
    const route = meta();
    const movieId = route.params.movieId;
    const movieSeq = route.params.movieSeq;

    async function getMovie() {
        const response = await fetch(`/searchCode?movieId=${movieId}&movieSeq=${movieSeq}`);
        const result = await response.json();

        return result;
    }


    let movie = getMovie()
    console.log(movie);
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
        {#await movie}
            
        {:then movie} 
        <div in:fade class="uk-card uk-card-default movie-card">
            <div id="infos">
                <div>
                    <img class="uk-width-2xlarge" id="poster" src={movie.Data[0].Result[0].posters.split('|', 1)[0]} alt="포스터 불러오기 실패"/>
                </div>
                <div>
                    <h2>{movie.Data[0].Result[0].title.replace(/!HS | !HE/g, "")}</h2>
                    <h4>{movie.Data[0].Result[0].nation}, {movie.Data[0].Result[0].repRlsDate.substring(0,4)}</h4>
                    <h5>장르 : {movie.Data[0].Result[0].genre}</h5>
                    <h5>관람등급 : {movie.Data[0].Result[0].rating}</h5>
                    <h5>상영시간 : {movie.Data[0].Result[0].runtime}분</h5>
                    <h5>{movie.Data[0].Result[0].directors.director[0].directorNm} 감독</h5>
                    <h5>{movie.Data[0].Result[0].actors.actor[0].actorNm} 주연</h5>
                    <h5>{movie.Data[0].Result[0].plots.plot[0].plotText}</h5>
                </div>
                
            </div>
        </div>
        {/await}
    </div>
</div>

