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
    author : "풍혜림",
    title : "백두산 <이번 생에 꼭 봐야할 영화 1순위>",
    content : "ihihihihihihihihihihihhihihihihihihihihi",
    date : "2022-11-22",
    movieCode : "6783"
    },
    {
    id : "2",
    author : "서도원",
    title : "헤어질결심 보러갔다가 헤어질 뻔 했습니다.",
    content : "ihihihihihihihihihihihhihihihihihihihihi",
    date : "2022-11-24",
    movieCode : "6783"

    },
    {
    id : "3",
    author : "김나영",
    title : "토이스토리 너무 재밌어요ㅜㅜ 엉엉 울었어요",
    content : "ihihihihihihihihihihihhihihihihihihihihi",
    date : "2022-12-03",
    movieCode : "6783"
    },
    {
    id : "4",
    author : "이영진",
    title : "미나리 두 번 봐도 또 보고 싶네요",
    content : "ihihihihihihihihihihihhihihihihihihihihi",
    date : "2022-12-10",
    movieCode : "6783"

    }
]
</script>

<Header/>
<List_write_btn/>
<List_table bind:post={post}/>