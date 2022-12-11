<script>
    import Header from '../Common/Header.svelte';
    export let post;
</script>

<div class="card-body">
    <h5 post.title+post.author"></h5>
    <p class="card-text">
        <small
                class="text-muted"
                th:text="${#temporals.format(post.createdDate, 'yyyy-MM-dd HH:mm')}"
        ></small>
    </p>
    <p class="card-text" th:text="${post.content}"></p>
</div>
