// KobisOpenAPIRestService("b468420905744f639536c8d12b730291", "http://www.kobis.or.kr");

let keyValue = "d11f7f757dd8b713327d4f54090a4c5a"

// let a = KobisOpenAPIRestService.getDailyBoxOffice(true);

function getDailyBoxOffice() {
    fetch("http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key: keyValue,
            targetDt: "20150101",
        })
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error)
    })
}


getDailyBoxOffice();