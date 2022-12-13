<script>
    let btn_like = 0;
    const likeClick = () => btn_like = btn_like+1;
</script>

<button on:click={likeClick}><a href="" uk-icon="heart"></a>  {btn_like}</button>

<style>
    button {
        border-radius: 71.5px;
        background: #b9b9b9;
        width: 50px;
        height: 30px;
        font-size: 15px;
        border: none;
        font-weight: bold;
    }
</style>