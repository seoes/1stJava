console.log("done")


const mapContainer = document.querySelector('#map'); //html상 지도를 표시할 영역 지정

let mapOption = { //지도 생성 전 초기 설정
    center: new kakao.maps.LatLng(36.635,127.4869444), //지도의 초기위치(CGV 청주서문)
    level: 5 //지도 확대 정도
}
let map = new kakao.maps.Map(mapContainer, mapOption); //새로운 지도 객체 생성하여 리턴