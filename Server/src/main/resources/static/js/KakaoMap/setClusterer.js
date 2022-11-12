

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
    $.ajax({
        url: 'js/KakaoMap/TheaterInfo.csv',
        dataType: 'text',
        async: false,
        success: function(data) {
            result = data;
        }
    })
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

// let newMarkers = addMarker();
// console.log(newMarkers)
// clusterer.addMarkers(newMarkers)

//커스텀 이미지 넣기

//지도가 이동, 확대, 축소되었을 때(영역이 변경되었을 때) - bounds_changed 이벤트
//마커의 표시 여부 검사 후 getVisible()
//표시되는 마커의 정보들만 HTML리스트로 출력

// 예시 - CGV 명동역 라이브러리
//
// 광역단체 서울시
// 기초단체 중구
// 영화상영관 코드
// 영화상영관명 CGV 명동역 라이브러리
// 3D 상영관수 3
// 4D 상영관수 0
// IMAX 상영관 수 0
// 전송사업자명 CJ올리브네트웍스(주)
// 주소 서울특별시 중구 충무로2가 65-9 번지 하이해리엇 10층
// 경도 138
// 위도 37




// newMarkers.forEach(data => {
//     // console.log(data);
//     let marker = new kakao.maps.Marker({
//         position: new kakao.maps.LatLng(data.y, data.x)
//     })
//     // console.log(marker);
//     clusterer.addMarker(marker)
// })

//리턴받은 newMarkers값 바로 추가해버리기

console.log(newMarkers);
clusterer.addMarkers(newMarkers);

// theaterInfo.forEach(theater => {
//     geocoder.addressSearch(theater["주소"], function(result, status) {
//         if (status === kakao.maps.services.Status.OK) {
//             // console.log(result[0].x, result[0].y);
//         }
//     })
// });

// geocoder.addressSearch(theaterInfo[1]["주소"], function(result, status) {
//     console.log(status)
//     console.log(result)
//     // console.log(result[0].x)
// })


// geocoder.addressSearch('제주특별자치도 제주시 첨단로 242', function(result, status) {
//     // 정상적으로 검색이 완료됐으면 
//     if (status === kakao.maps.services.Status.OK) {
        
//         var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        
//         // 결과값으로 받은 위치를 마커로 표시합니다
//         var marker = new kakao.maps.Marker({
//             map: map,
//             position: coords
//         });
        
//         // 인포윈도우로 장소에 대한 설명을 표시합니다
//         var infoWindow = new kakao.maps.InfoWindow({
//             content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
//         });
//         infoWindow.open(map, marker);
        
//         // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
//         map.setCenter(coords);
//     } 
// });

// 데이터를 가져오기 위해 jQuery를 사용합니다
// 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
// $.get("js/KakaoMap/sample.json", function(data) {
//     // 데이터에서 좌표 값을 가지고 마커를 표시합니다
//     // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
//     console.log(data)
//     var markers = $(data.positions).map(function(i, position) {
//         // console.log(i);
//         // console.log(position);
//         return new kakao.maps.Marker({
//             position : new kakao.maps.LatLng(position.lat, position.lng)
//         });
//     });
//     console.log(markers)

//     // 클러스터러에 마커들을 추가합니다
//     clusterer.addMarkers(markers);
// });













