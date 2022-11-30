<script>
    const colorThief = new ColorThief();
    const cards = document.querySelectorAll(".movie-card");
    // const img = document.querySelector('.movie-img');

    function getColorData(color) { // rgb 배열을 rgba문자열, 밝기값을 포함한 객체로 배열 color = [R, G, B] -> rbga(R,G,B);
        return {
            rgb : "rgba(" + color[0] + "," + color[1] + "," + color[2] + ")", // [255, 255, 255] -> "rgba(255,255,255)"
            luma : 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]
        }
    }

    function getGamma(color1, color2) { // 두 색상의 밝기 (luma) 차이 절댓값을 반환
        return Math.abs(getColorData(color1).luma - getColorData(color2).luma)
    }

    window.onload = () => {
        cards.forEach((card) => {
            const movieImg = card.querySelector(".movie-img");
            const bg = colorThief.getColor(movieImg);
        
            let titleColor = getColorData(colorThief.getPalette(movieImg).reduce((p, c) => { //ㅍ컬러 팔레트의 색상을 하나씩 순차적으로 비교 
                return getGamma(bg,p) > getGamma(bg,c) ? p : c; // 감마 차이가 더 큰 값을 리턴하여 배열의 다음 값과 비교
            }));
        
            card.style.backgroundColor = getColorData(bg).rgb; // 
        
            card.querySelector(".movie-title").style.color = titleColor.rgb;
            card.querySelector(".movie-year").style.color = titleColor.rgb;
            card.querySelector(".movie-comment").style.color = titleColor.rgb;
        })
    }
</script>