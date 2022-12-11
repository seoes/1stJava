<script>
	import { router } from 'tinro';


    export let map;
    export let selectedTheater;

    const theaters = [];

    $: list = [];

    

    let geocoder = new kakao.maps.services.Geocoder();

    let markerSize = new kakao.maps.Size(48, 48);
    let markerOption = {offset: new kakao.maps.Point(24, 48)}

    let cgvMarker = new kakao.maps.MarkerImage('./img/marker/cgv_marker.png' ,markerSize, markerOption);
    let cgv4dxMarker = new kakao.maps.MarkerImage('./img/marker/cgv_4dx_marker.png' ,markerSize, markerOption);
    let cgvImaxMarker = new kakao.maps.MarkerImage('./img/marker/cgv_imax_marker.png' ,markerSize, markerOption);
    let lotteMarker = new kakao.maps.MarkerImage('./img/marker/lottecinema_marker.png' ,markerSize, markerOption);
    let megaboxMarker = new kakao.maps.MarkerImage('./img/marker/megabox_marker.png' ,markerSize, markerOption);
    let otherMarker = new kakao.maps.MarkerImage('./img/marker/other_marker.png' ,markerSize, markerOption);

    function setImg(theater) {
        switch(theater.company) {
            case 'CJ올리브네트웍스(주)':
                if(theater.countImax > 0) {
                    console.log(theater);
                    return cgvImaxMarker;
                }
                else if(theater.count4d > 0) {
                    return cgv4dxMarker;
                }
                else {
                    return cgvMarker;
                }
                
            case '롯데컬처웍스(주)롯데시네마':
                return lotteMarker;
            case '메가박스(주)':
                return megaboxMarker;
            default:
                return otherMarker;
        }
    }
    
    async function getTheaterList() {
        
        const response = await fetch('/theater');
        const result = await response.json();
        var clusterer = new kakao.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
            minLevel: 10 // 클러스터 할 최소 지도 레벨 
        });
        result.forEach((theater) => {
            if(theater.name === /./g)
            if(theater.latitude === null || theater.longitude === null) {
                setCoords(theater.address, theater.code);
                if(theater.latitude === null || theater.longitude === null) {
                    const newAddress = theater.address.match(/.+(?=번지)/g);
                    setCoords(newAddress, theater.code);
                }
            }
            let coords = new kakao.maps.LatLng(theater.latitude, theater.longitude);
            let marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: setImg(theater)
            });
            let infowindow = new kakao.maps.InfoWindow({
                content : theater.name,
                removable : false
            });
            kakao.maps.event.addListener(marker, 'mouseover', () => {
                infowindow.open(map, marker);
            })
            kakao.maps.event.addListener(marker, 'mouseout', () => {
                infowindow.close();
            })
            kakao.maps.event.addListener(marker, 'click', () => {
                console.log(theater);
                router.goto('/theater/detail/' + theater.code);
            })
            theater.marker = marker;
            theaters.push(theater);
            // clusterer.addMarker(marker);
        })
        kakao.maps.event.addListener(map, 'dragend', setMarkerList);
        kakao.maps.event.addListener(map, 'zoom_changed', setMarkerList);

        function setMarkerList() {
            let bounds = map.getBounds();
            const latMin = bounds.getSouthWest().getLat();
            const lngMin = bounds.getSouthWest().getLng();
            const latMax = bounds.getNorthEast().getLat();
            const lngMax = bounds.getNorthEast().getLng();
            const latAvg = (latMin + latMax) / 2;
            const lngAvg = (lngMin + lngMax) / 2;
            const listTheater = [];
            console.log("map changed")
            theaters.forEach(theater => {
                const lat = theater.marker.getPosition().getLat();
                const lng = theater.marker.getPosition().getLng();
                if(lat > latMin && lat < latMax && lng > lngMin && lng < lngMax) {
                    listTheater.push(theater);
                    console.log(listTheater);
                }
            })

            list = listTheater.sort((a, b) => {
                return getDistance(a, latAvg, lngAvg) - getDistance(b, latAvg, lngAvg);
            });
        }
        setMarkerList();
        
        
    }

    function getDistance(theater, latMid, lngMid) {
            const lat = theater.marker.getPosition().getLat();
            const lng = theater.marker.getPosition().getLng();
            return ((latMid - lat) ** 2) + ((lngMid - lng) ** 2);
        }

    function setCoords(address, code) {
        geocoder.addressSearch(address, (result, status) => {
            if(status === kakao.maps.services.Status.OK) {
                console.log(result[0].y);
                console.log(result[0].x);
                console.log(code);
                fetch('/setcoords', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        latitude : result[0].y,
                        longitude : result[0].x,
                        code : code
                    })
                })
            }
        });
    }
    getTheaterList();

    function handleMouseEnter(event) {
        event.target.style.backgroundColor = "#eeeeee";
    }

    function handleMouseOut(event) {
        event.target.style.backgroundColor = "white";
    }
</script>

<style>
    #selected-theater {
        background-color: aqua;
        color: white;
    }
    #theaterInfo {
        width: 400px;
    }

    #list-theater {
        background-color: white;
        height: 400px;
        overflow-y: scroll;
        
    }

    .theater-info-mini {
        padding: 20px 18px 2px 18px;
        display: flex;
    }

    .theater-info-mini h5 {
        font-size: 14px;
        font-weight: 600;
    }
    .theater-info-mini p {
        font-size: smaller;
    }
</style>

<div id="theaterInfo">
    <div>
        <div id="list-theater">
            <div on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseOut} class="theater-info-mini">
                <div>
                    <h5>메가박스 청주사창</h5>
                    <p>충청북도 청주시 서원구 내수동로102번길 52-4</p>
                </div>
                <div>
                    <a href="theater/detail/123" class="uk-icon-link" uk-icon="info"></a>
                </div>
            </div>
            {#each list as theater}
            <div on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseOut} class="theater-info-mini">
                <div>
                    <h5>{theater.name}</h5>
                    <p>{theater.address}</p>
                </div>
                <div>
                    <a href="/theater/detail/{theater.code}" class="uk-icon-link" uk-icon="info"></a>
                </div>
            </div>
            {/each}
        </div>
    </div>
    <div>
        <button on:click={() => {getTheaterList()}}>위도 경도 새로 구하기12</button>
    </div>
</div>