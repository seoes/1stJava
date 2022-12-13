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
    <p>번호 : {post.id}</p>
    <p>제목 : {post.title}</p>
    <p>글쓴이 : {post.author}</p>
    <p>내용 : {post.content}</p>
    <Post_detail_like_btn/>
    <button>수정</button>
    <button>삭제</button>
    <!-- <PostDetailModifyBtn/> -->
    <!-- <PostDetailDeleteBtn/> -->

</div>