<script>
    import { meta } from "tinro";
    const route = meta();
    $: movieTitle = route.params.title;

    async function getMovie() {
        const response = await fetch(`/searchTitle?releaseDts=19000101&title=${movieTitle}`);
        const result = await response.json();

        return result;
    }

    $: movieList = getMovie();
    $: {
        console.log(movieList);
    }
</script>



<div class="uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m" uk-grid>
    <div>
        <div class="uk-card uk-card-default">
            {#await movieList}
            {:then movieList} 
            {#each movieList.Data[0].Result as data}
                <div>
                    {data.title.replace(/!HS | !HE/g, "")}
                </div>
            {/each}
            {/await}
        </div>
    </div>
</div>
