<script>
    import { fade } from "svelte/transition";


    export let data;

    function getColorData(color) { // rgb 배열을 rgba문자열, 밝기값을 포함한 객체로 배열 color = [R, G, B] -> rbga(R,G,B);
        return {
            rgb : "rgba(" + color[0] + "," + color[1] + "," + color[2] + ")", // [255, 255, 255] -> "rgba(255,255,255)"
            luma : 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]
        }
    }

    function getGamma(color1, color2) { // 두 색상의 밝기 (luma) 차이 절댓값을 반환
        return Math.abs(getColorData(color1).luma - getColorData(color2).luma)
    }
    function setColor(card) {
        const colorThief = new ColorThief();
        const movieImg = card.querySelector(".movie-img");
        const bg = colorThief.getColor(movieImg);
        
        let titleColor = getColorData(colorThief.getPalette(movieImg).reduce((p, c) => { //컬러 팔레트의 색상을 하나씩 순차적으로 비교 
            return getGamma(bg,p) > getGamma(bg,c) ? p : c; // 감마 차이가 더 큰 값을 리턴하여 배열의 다음 값과 비교
        }));
        card.style.backgroundColor = getColorData(bg).rgb;
        card.querySelector(".movie-title").style.color = titleColor.rgb;
        card.querySelector(".movie-year").style.color = titleColor.rgb;
        card.querySelector(".movie-comment").style.color = titleColor.rgb;
    }

    window.onload = () => {
        const cards = document.querySelectorAll(".movie-card");
        cards.forEach(card => setColor(card));
    };
</script>


<div in:fade class="uk-card uk-card-default movie-card">
    <div>
        <img class="movie-img" src={data.img} alt="이미지 불러오기 실패" style="width: 100%"  >
    </div>
    <div class="uk-card-body">
        <dl class="uk-description-list">
            <h5 class="movie-title">{data.title}</h5>
            <dd class="movie-year">{data.year}년 개봉</dd>
            <dd class="movie-comment">{data.comment}</dd>
        </dl>
    </div>
</div>














