<script>
  let post = {
  }
  const postSubmit =()=> {
    console.log(post.id, post.title, post.author);
  };
  import Post_write_form from './Post_write_form.svelte';
  import Post_write_submit_btn from './Post_write_submit_btn.svelte';
  fetch("localhost:8080/board/post_write", {
    method : "POST",
    header : {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify ({
      title : post.title,
      author : post.author,
      content : post.content
    })  
})
.then(response => response.json())
.catch(error => error.log(error))
</script>

<!--<script>
  import Post_write_form from './Post_write_form.svelte'
  export let post;

  
</script>
-->
<h3>Write the posting</h3>
<form on:submit|preventDefault={postSubmit}>
  <input type="text" placeholder="author" bind:value={post.author} />
  <input type="text" placeholder="title" bind:value={post.title} />
  <textarea type="text" placeholder="내용을 입력하세요" bind:value={post.content}/>
  <button>ADD</button>
</form> 