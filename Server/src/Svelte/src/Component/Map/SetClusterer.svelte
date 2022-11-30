<script>
    // 마커 클러스터러를 생성합니다 
    var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 10 // 클러스터 할 최소 지도 레벨 
    });

    // console.log(clusterer);

    let geocoder = new kakao.maps.services.Geocoder();

    function readCSV() {
        let result = "";
        fetch('js/KakaoMap/TheaterInfo.csv')
            .then(res => res.text())
            .then(txt => JSON.parse(txt))
            .then(data => {
                console.log(data)
                result = data;
            });
        // $.ajax({
        //     url: 'js/KakaoMap/TheaterInfo.csv',
        //     dataType: 'text',
        //     async: false,
        //     success: function(data) {
        //         result = data;
        //     }
        // })
        return result;
    }

    function parseJSON(data) {
        const list = [];
        const rows = data.split("\n");
        const header = rows[0].split(",");
        for(let i = 1; i < rows.length; i++) {
            let obj = {};
            for(let j = 0; j < header.length; j++) {
                obj[header[j]] = rows[i].split(",")[j];
            }
            list.push(obj);
        }
        // console.log(header);
        return list;
    }

    const theaterInfo = parseJSON(readCSV())
    console.log(theaterInfo);

    let newMarkers = theaterInfo.map((data) => {
        geocoder.addressSearch(data["주소"], function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x)
                const marker = new kakao.maps.Marker({
                    position: coords
                })
                const infoWindow = new kakao.maps.InfoWindow({
                    content: data["영화상영관명"]
                })
                kakao.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(map, marker))
                kakao.maps.event.addListener(marker, 'mouseout', () => infoWindow.close())
                clusterer.addMarker(marker)
                // infoWindow.open(map, marker)
                // console.log(marker);
                return marker;
            }
        })
    })

    console.log(newMarkers);
    clusterer.addMarkers(newMarkers);
</script>