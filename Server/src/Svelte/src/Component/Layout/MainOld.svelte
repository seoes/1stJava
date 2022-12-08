<script>
  import BoxOffice from "../BoxOffice.svelte";
  import Content from "../Content.svelte";
  import MovieCards from "../MovieCards.svelte";
import SideNav from "../Nav/SideNav.svelte";

</script>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- UIkit CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css" />
<link href='https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css' rel='stylesheet' type='text/css'> 

<!-- UIkit JS -->
<script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js"></script>
</head>
<style>
    body {
        background-color: whitesmoke;
    }
    * {
        font-family: Helvetica, Arial, sans-serif, sans-serif,NanumSquare ;
    }
    .uk-card {
        border-radius: 20px;
    }

    #lists > div > .uk-card img{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
    dl dt {
        font-weight: 800;
    }
</style>
<body>
    <div style="background-color:#282828; height:64px">
        <h2 style="color:#FFFFFF">My Cinema</h2>
    </div>
    <section>

    </section>
    <div uk-grid class="uk-grid-collapse">
        <!-- <Content /> -->
    </div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"></script>
<script src="js/KobisOpenAPIRestService.js"></script>
<script src="js/setColor.js"></script>
<script src="js/getBoxOffice.js"></script>
</html>