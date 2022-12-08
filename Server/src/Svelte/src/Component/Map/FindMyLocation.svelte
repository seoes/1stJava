<script>
    export let map;
    function findMyLocation () {
        console.log("현재위치 찾기 버튼 눌림");
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    }

    function onSuccessGeolocation() { // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        let lat = position.coords.latitude; // 위도
        let lon = position.coords.longitude; // 경도
        let locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        let message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

        displayMarker(locPosition, message); // 마커와 인포윈도우를 표시합니다
    }

    function onErrorGeolocation() {
        let locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
        let message = '위치를 찾지 못했어요...'

        displayMarker(locPosition, message);
    }

    function displayMarker(locPosition, message) { // 지도에 마커와 인포윈도우를 표시하는 함수

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({  
            map: map, 
            position: locPosition
        }); 

        var iwContent = message, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

        // 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content : iwContent,
            removable : iwRemoveable
        });

        // 인포윈도우를 마커위에 표시합니다 
        infowindow.open(map, marker);

        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);      
    }
</script>


<div>
    <button on:click={findMyLocation}>현재위치 찾기</button>
</div>

