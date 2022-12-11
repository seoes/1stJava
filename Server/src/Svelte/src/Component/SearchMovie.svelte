<script>
    
    let movieTitle = '';
    function searchMovieByTitle(title) {
        fetch("/searchTitle?title="+title)
        .then(res => res.json())
        .then(result => {
            console.log(result)
        })
    }
</script>



<div>
    <input bind:value={movieTitle}/>
    <button on:click={() => searchMovieByTitle(movieTitle)}></button>
</div>