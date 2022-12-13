<script>
    import {Route} from 'tinro';
    import Post_write from "../Post_write/Post_write.svelte"
    
</script>

<style>
    .right-box {
        float: right;
    }
</style>


<Route path="/post_write">
    <Post_write/>
</Route>
<div class = 'right-box'>
    <a href = "/board/post_write">
        <p uk-margin>
            <button class="uk-button uk-button-default uk-button-small">
                글쓰기
            </button>
        </p>
    </a>
    </div>