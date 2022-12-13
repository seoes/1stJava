<script>
    import { each } from "svelte/internal";
  import { Route } from "tinro";
    import Post_detail from "../Post_detail/Post_detail.svelte";
    export let post;
    let select_post;
    
</script>

<Route path="/post_detail/:post_id"><Post_detail bind:post={select_post}/>></Route>
<div>
    <table class="uk-table uk-table-hover">
      <thead>
      <tr>
        <th scope="col">번호</th>
        <th scope="col">제목</th>
        <th scope="col">작성자</th>
        <th scope="col">작성일</th>
      </tr>
      </thead>
      <tbody>
        {#each post as post}
        <tr>
          <th><span>{post.id}</span></th>
          <th>
            
            <a href='/board/post_detail/{post.id}' on:click ={()=>{select_post=post}} ><span>{post.title}</span></a>
          </th>
          <th><span>{post.author}</span></th>
          <th><span>{post.date}</span></th>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>