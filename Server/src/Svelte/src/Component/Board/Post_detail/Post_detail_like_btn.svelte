<script>
    let btn_like = 0;
    const likeClick = () => btn_like = btn_like+1;
</script>

<button on:click={likeClick}>추천{btn_like}</button>