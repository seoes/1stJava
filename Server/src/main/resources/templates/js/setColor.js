const colorThief = new ColorThief();
    const div = document.querySelectorAll(".movie-card");
    const img = document.querySelector('.movie-img');
    const movieTitle = document.querySelector("#movieTitle");

    function getColorData(color) { // color = [R, G, B] -> rbga(R,G,B);
        return {
            rgb : "rgba(" + color[0] + "," + color[1] + "," + color[2] + ")",
            luma : 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]
        }
    }
    
    // Make sure image is finished loading
    if (img.complete) {
        div.forEach((card) => {
            const movieImg = card.querySelector(".movie-img");
            const movieTitle = card.querySelector(".movie-title");
            const movieYear = card.querySelector(".movie-year");
            const movieComment = card.querySelector(".movie-comment");

            const colors = getColorData(colorThief.getColor(movieImg));
            let maxGamma = 0;
            let titleColor;
            colorThief.getPalette(movieImg).forEach(color => {
                const newColor = getColorData(color);
                if(Math.abs(colors.luma - newColor.luma) > maxGamma){
                    maxGamma = Math.abs(colors.luma - newColor.luma);
                    // console.log("new Luma = " + maxGamma, color)
                    titleColor = newColor;
                }
            });
            card.style.backgroundColor = colors.rgb;
            
            movieTitle.style.color = titleColor.rgb;
            movieYear.style.color = titleColor.rgb;
            movieComment.style.color = titleColor.rgb;
        })
    } 
    else {
        image.addEventListener('load', function() {
            console.log(colorThief.getColor(img));
        console.log(colors);
        div.style.backgroundColor = colors;
    });
    }