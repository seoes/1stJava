<script>
  import Header from '../Common/Header.svelte'
  import Post_write from '../Post_write/Post_write.svelte'
  import List_table from './List_table.svelte';
  import List_write_btn from './List_write_btn.svelte';
  import { Route } from 'tinro';
  const to_Post_write = () => Route.goto('/board/post_write')
  let post = [
    {
    id : "1",
    author : "풍죠리카",
    title : "백두산 <이번 생에 꼭 봐야할 영화 1순위>",
    date : "2022-11-22"
    },
    {
    id : "2",
    author : "풍죠리카",
    title : "백두산 <이번 생에 꼭 봐야할 영화 1순위>",
    date : "2022-11-22"
    },
    {
    id : "3",
    author : "풍죠리카",
    title : "백두산 <이번 생에 꼭 봐야할 영화 1순위>",
    date : "2022-11-22"
    },
    {
    id : "4",
    author : "풍죠리카",
    title : "백두산 <이번 생에 꼭 봐야할 영화 1순위>",
    date : "2022-11-22"
    }
]

  // src="/webjars/jquery/3.5.1/jquery.min.js"
  // src="/webjars/bootstrap/4.5.0/js/bootstrap.min.js"
</script>

<Header/>
<List_table bind:post={post}/>
<List_write_btn/>