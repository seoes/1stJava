<script>
    import { each } from "svelte/internal";
    import { Route } from "tinro";
    import Post_detail from "../Post_detail/Post_detail.svelte";
    let select_post;
    
    let posts = getPosts();
    console.log(posts);
    async function getPosts() {
      const response = await fetch("/postlist", {
      header : {
        "Content-Type" : 'application/json',
      }
    });
      const result = await response.json();
      return result;
    }
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
        {#await posts}
        <!-- 로딩중 -->
        <h4>L o a d i n g</h4>
        {:then posts} 
            {#each posts as post}
            <tr>
              <th><span>{post.id}</span></th>
              <th>
                <a href='/board/post_detail/{post.id}' on:click ={()=>{select_post=post}} ><span>{post.title}</span></a>
              </th>
              <th><span>{post.author}</span></th>
              <th><span>{post.date}</span></th>
            </tr>
            {/each}
        {/await}
      </tbody>
    </table>
  </div>