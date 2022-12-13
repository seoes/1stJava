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



<div class="uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m" uk-grid>
    <div>
        <div class="uk-card uk-card-default">
            {#await movie}
                
            {:then movie} 
                <h4>{movie.Data[0].Result[0].title.replace(/!HS | !HE/g, "")}</h4>
            {/await}
        </div>
    </div>
</div>

