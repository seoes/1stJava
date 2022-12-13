<script>
    import MovieCard from "./MovieCard.svelte";
    const movieCardList = []
    const datas = [
        {
            title: "그랜드 부다페스트 호텔",
            year: 2017,
            comment: "영상미 엄청남",
            img: "./img/sample-budapest.jpeg"
        },
        {
            title: "헤어질 결심",
            year: 2022,
            comment: "칸 영화제 감독상",
            img: "./img/sample-park.jpeg"
        },
        {
            title: "듄",
            year: 2021,
            comment: "드니 빌뇌브 감독",
            img: "./img/sample-dune.jpeg"
        },
        {
            title: "스타 이즈 본",
            year: 2020,
            comment: "브래들리 쿠퍼 감독",
            img: "./img/sample-starisborn.jpg"
        },
        {
            title: "미드나잇 인 파리",
            year: 2014,
            comment: "우디 앨런 감독",
            img: "./img/sample-paris.jpeg"
        }
    ]
    </script>

<style>
    #lists > div > .uk-card img{
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}
</style>

<div id="lists" class="uk-grid-column-small uk-grid-row-small uk-child-width-1-2 uk-child-width-1-3@m uk-child-width-1-5@l uk-child-width-1-6@xl" uk-grid="masonry: true">
    {#each datas as data}
        <div>
            <MovieCard {data}/>
        </div>
    {/each}
</div>