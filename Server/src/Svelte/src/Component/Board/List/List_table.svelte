<script>
    import { each } from "svelte/internal";
    export let post
</script>

<div>
    <table>
      <thead>
      <tr>
        <th scope="col">  </th>
        <th scope="col">제목</th>
        <th scope="col">작성자</th>
        <th scope="col">작성일</th>
      </tr>
      </thead>
      <tbody>
        {#each post as post}
        <tr>
          <th><span>{post.id}</span></th>
          <th><span>{post.title}</span></th>
          <th><span>{post.author}</span></th>
          <th><span>{post.date}</span></th>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>