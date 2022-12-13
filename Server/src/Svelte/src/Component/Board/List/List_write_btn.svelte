<script>
    import {Route} from 'tinro';
    import Post_write from "../Post_write/Post_write.svelte"
</script>

<style>
    .right-box {
        float: right;
    }
</style>

<div class = 'right-box'>
    <p uk-margin>
        <a href="/board/post_write">
        <button class="uk-button uk-button-default uk-button-small">
            글쓰기
        </button>
        </a>

    </p>
</div>

<Route path="/post_write">
    <Post_write/>
</Route>        
