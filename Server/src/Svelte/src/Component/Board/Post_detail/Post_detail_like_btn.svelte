<script>
    let btn_like = 0;
    const likeClick = () => btn_like = btn_like+1;
</script>

<button on:click={likeClick}><a href="" uk-icon="heart"></a>{btn_like}</button>