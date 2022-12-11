<script>
    import {Route} from 'tinro';
    import Post_Write from "../Post_write/Post_write.svelte";    
</script>


<button>
    <a href="/board/post_write">글쓰기</a>
</button>
<Route path="/board/post_write"><Post_Write/></Route>
<!-- <div>
    <p class="on" on:keypress={to_Post_write}>Go to Posting</p>
</div> -->