<script>
    import { meta ,router} from "tinro";
    const route = meta();
    let movieTitle = route.params.title;

    console.log(movieTitle)
    console.log("loading..")
    router.goto(`/search/${movieTitle}`)
</script>