<script>
    import { onMount } from "svelte";

    export let map;
    let mapContainer;
    let locPosition = new kakao.maps.LatLng(36.635,127.4869444);

    let imageSrc = './img/marker/megabox_marker.png'; // 마커이미지의 주소입니다    
    let imageSize = new kakao.maps.Size(48, 48) // 마커이미지의 크기입니다
    let imageOption = {offset: new kakao.maps.Point(24, 48)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);



    onMount(() => {
        let mapOption = { //지도 생성 전 초기 설정
            center: new kakao.maps.LatLng(36.635,127.4869444), //지도의 초기위치(CGV 청주서문)
            level: 5 //지도 확대 정도
        }
        map = new kakao.maps.Map(mapContainer, mapOption);
    });
</script>

<style>
    #map-container {
        width: 100%;
    }
</style>

<div id="map-container" bind:this={mapContainer}></div>

