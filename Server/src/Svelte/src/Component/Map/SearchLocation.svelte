<script>
	import { map } from './map';
    const btnSearchLocation = document.querySelector("button#loc-search");
    console.log(map);
    
    let searchValue;

</script>

<div>
    <input bind:value={searchValue} type="text" placeholder="주소 입력"/>
    <button on:click={() => {map.searchLocation(searchValue)}}>주소 검색</button>
</div>