<body>
  <div class="container">
    <form action="/post" method="post">
      <div class="form-group row">
        <label for="inputTitle" class="col-sm-2 col-form-label"><strong>제목</strong></label>
        <div class="col-sm-10">
          <input type="text" name="title" class="form-control" id="inputTitle" />
        </div>
      </div>
      <div class="form-group row">
        <label for="inputAuthor" class="col-sm-2 col-form-label"><strong>작성자</strong></label>
        <div class="col-sm-10">
          <input type="text" name="author" class="form-control" id="inputAuthor" />
        </div>
      </div>
      <div class="form-group row">
        <label for="inputContent" class="col-sm-2 col-form-label"><strong>내용</strong></label>
        <div class="col-sm-10">
          <textarea type="text" name="content" class="form-control" id="inputContent"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-auto mr-auto"></div>
        <div class="col-auto">
          <input class="btn btn-primary" type="submit" role="button" value="글쓰기" />
        </div>
      </div>
    </form>
  </div>
</body>


<!-- <div>
  <div>
    <label for="inputTitle"><strong >제목</strong></label>
    <input type="text" name="title" id="inputTitle"/>
  </div>
  <div>
    <label for="inputAuthor"><strong >작성자</strong></label>
    <input type="text" name="author" id="inputAuthor"/>
  </div>
  <div>
    <label for="inputContent"><strong >내용</strong></label>
    <input type="text" name="content" id="inputContent"/>
  </div>
</div>
 -->

<!-- <script>
  export let post;

  const postSubmit =()=> {
    console.log(post.id, post.title, post.author);
  };
</script>

<h3>Write the posting</h3>
<form on:submit|preventDefault={postSubmit}>
  <input type="text" placeholder="author" bind:value={post.author} />
  <input type="text" placeholder="title" bind:value={post.title} />
  <input type="text" placeholder="content" bind:value={post.content} />
  <button>ADD</button>
</form> -->