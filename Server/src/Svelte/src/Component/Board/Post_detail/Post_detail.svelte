<script>
    import Header from '../Common/Header.svelte';
    import {meta} from 'tinro';
    import Post_detail_like_btn from './Post_detail_like_btn.svelte';
    import PostDetailLikeBtn from './Post_detail_like_btn.svelte';
    import PostDetailModifyBtn from './Post_detail_modify_btn.svelte';
    import PostDetailDeleteBtn from './Post_detail_delete_btn.svelte';
    const route = meta();
    let post_id = route.params.post_id;
    export let post;

</script>
<div>
<article class="uk-article">

    <h1 class="uk-article-title"><a class="uk-link-reset" href="">{post.title}</a></h1>

    <p class="uk-article-meta">Written by <a href="#">{post.author}</a> on 12 April 2012.</p>

    <p class="uk-text-lead">{post.content}</p>


    <div class="uk-grid-small uk-child-width-auto" uk-grid>
        <div>
            <a class="uk-button uk-button-text" href="/board">목록으로</a>
        </div>  
    </div>
    <Post_detail_like_btn/>
    <button>수정</button>
    <button>삭제</button>


</article>
</div>