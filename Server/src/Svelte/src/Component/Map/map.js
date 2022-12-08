//store writable로 map 리턴
import { writable } from 'svelte/store';


function setNewMap() {
    // const map = new kakao.maps.Map(mapContainer, mapOption);
    const mapContainer = `<div id="map-container" bind:this={mapContainer} style="width:100%;height:600px;"></div>`
    let mapOption = { //지도 생성 전 초기 설정
        center: new kakao.maps.LatLng(36.635,127.4869444), //지도의 초기위치(CGV 청주서문)
        level: 5 //지도 확대 정도
    }

    let map;
    const {subscribe, update, set} = writable(map);
    
    function addMap() {
        const mapContainer = document.querySelector("#map-container")
        console.log(mapContainer);
        map = new kakao.maps.Map(mapContainer, mapOption);
    }


    return {
        addMap
    } //새로운 지도 객체 생성하여 리턴
}

export const map = setNewMap();

// 메소드 셋맵 -> 카카오맵 생성 후 리턴
