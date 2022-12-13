<script>
  import Post_write_form from './Post_write_form.svelte';
  import Post_write_submit_btn from './Post_write_submit_btn.svelte';
  
  let post = {};
  async function addPost() {
    const response = await fetch("/postwriting", {
      method : "POST",
      headers : { "Content-Type":"application/json"},
      body : JSON.stringify ({
        title : post.title,
        author : post.author,
        content : post.content
      })
    })
    await console.log(response);
  }
  
</script>

<form>
  <fieldset class="uk-fieldset">

      <legend class="uk-legend">포스팅 작성</legend>

      <div class="uk-margin">
        <label class="uk-form-label" for="form-horizontal-text">제 목</label>
        <input class="uk-input" type="text" aria-label="Title" bind:value={post.title}/>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="form-horizontal-text">작 성 자</label>

        <input class="uk-input" type="text" aria-label="Author" bind:value={post.author}>
    </div>
    <hr>

      <div class="uk-margin">
        <textarea class="uk-textarea" rows="5" placeholder="내용을 입력해주세요" aria-label="Textarea" bind:value={post.content}></textarea>
      </div>
      <div>
      </div>
      <hr>
    </fieldset>
  </form>
  <div>
      <button on:click={() => {console.log(post); addPost();}} class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">저장</button>
      <button on:click={() => {console.log(post)}}>post값 확인</button>
  </div>
  
<style>
  textarea {
    resize: none;
  }
</style>