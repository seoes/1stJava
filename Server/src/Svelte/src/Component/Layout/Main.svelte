<script>
    import Content from "./Content.svelte";

</script>

<svelte:head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css" />
<link href='https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css' rel='stylesheet' type='text/css'> 

<script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js"></script>

</svelte:head>


<div style="background-color:#282828; height:64px">
    <h2 style="color:#FFFFFF">My Cinema</h2>
</div>
<div uk-grid class="uk-grid-collapse">
    <Content />
</div>