<script>
    export let post;
</script>

<div>
    <form id="delete-form" action="/post/+{post.id}" method="post">
        <input type="hidden" name="_method" value="delete" />
        <button id="delete-btn" type="submit" class="btn btn-danger">삭제</button>
    </form>
</div>