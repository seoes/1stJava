const btnSearchLocation = document.querySelector("button#loc-search");

let geoCoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체를 생성합니다


function searchLocation() {
    const searchValue = document.querySelector("input#loc-search").value;
    console.log(searchValue);
    geoCoder.addressSearch(searchValue, (result, status) => { // 주소로 좌표를 검색합니다
        console.log(result);
        console.log(status);
        if (status === kakao.maps.services.Status.OK) { // 정상적으로 검색이 완료됐으면 
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            var marker = new kakao.maps.Marker({ // 결과값으로 받은 위치를 마커로 표시합니다
                map: map,
                position: coords
            });
            var infowindow = new kakao.maps.InfoWindow({ // 인포윈도우로 장소에 대한 설명을 표시합니다
                content: '<div style="width:150px;text-align:center;padding:6px 0;">이곳인가요??!?!!?</div>'
            });
            infowindow.open(map, marker);
            map.setCenter(coords); // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        }
        else {
            alert("장소를 찾지 못했습니다.쏘리");
        }
    });
}


btnSearchLocation.addEventListener("click", searchLocation);