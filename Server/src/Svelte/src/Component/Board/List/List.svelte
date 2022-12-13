<script>
  import Header from '../Common/Header.svelte'
  import Post_write from '../Post_write/Post_write.svelte'
  import List_table from './List_table.svelte';
  import List_write_btn from './List_write_btn.svelte';
  import { Route } from 'tinro';
  const to_Post_write = () => Route.goto('/board/post_write')
  
</script>

<Header/>
<List_write_btn/>
<List_table/>