<script>
    import Login from "../User/login.svelte";
    import Content from "./Content.svelte";
    import { router } from "tinro";
    let movieTitle;
</script>

<svelte:head>
<<<<<<< HEAD
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css" />
    <link href='https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css' rel='stylesheet' type='text/css'> 
    <script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
=======
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css" />
<link href='https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css' rel='stylesheet' type='text/css'> 
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css"/>
<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css" />

<script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js"></script>
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
<script src="/webjars/jquery/3.5.1/jquery.min.js"></script>


>>>>>>> 1df6956
</svelte:head>

<style>
    #header {
        background-color:#FFFFFF;
        color: #000000;
        height:96px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #header-logo {
        margin: 0 48px;
        display: flex;
    }
    #header-logo > div > * {
        margin: 0px;
        font-family: 'Binggrae-Two';
        font-weight: 400;
        color: #19416D;
    }

    #header-logo > img {
        width: 64px;
        height: 64px;
        margin-top: 6px;
        margin-right: 6px;
    }

    #header-menu {
        display: flex;
        margin: 0 48px;
    }

    #header-menu > * {
        margin: 0 12px 0 12px;
        font-weight: 200;
        font-size: 14px;
        color: #9c9c9c;
    }

    #header-menu > *:hover {
        /* margin: 0 12px 0 12px;
        font-weight: 200;
        color: #9c9c9c; */
        cursor: pointer;
    }

    #header-search > div{
        width: 524px;
        height: 45px;
        left: 466px;
        background-color: #E2E2E2;
        border-radius: 71.5px;
        border: 0;
        

        
        
    }

    #header-search input {
        width: 480px;
        height: 45px;
        left: 466px;
        background-color: transparent;
        border: 0;
    }
    #header-search span {
        width: 24px;
    }

    a {
        color: #9c9c9c;
        text-decoration: none;
    }

    a:hover {
        
    }
</style>


<div id="header">
    <a href="/">
        <div id="header-logo">
            <img src="/img/wwm_logo.png"/>
            <div>
                <h2>WWM</h2>
                <h3>World Wide Movie</h3>
            </div>
       
        </div>
    </a>
    <div id="header-search">
        <div>
            <input id="search-input" type="text" placeholder="영화 제목 검색" bind:value={movieTitle}/>
            <span uk-icon="search" on:click={() => {router.goto(`/loading/${movieTitle}`)}}></span>
        </div>
    </div>
    <div id="header-menu">
        <h4><a>영화 탐색</a></h4>
        <h4><a>영화관 찾기</a></h4>
       <h4><a href='../login'>Login</a></h4>
       <h4><a href="../register">Register</a></h4>
        
    </div>
</div>
<div uk-grid class="uk-grid-collapse">
    <Content/>
</div>