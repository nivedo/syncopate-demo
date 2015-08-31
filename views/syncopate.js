var liveData = {}

document.addEventListener('DOMContentLoaded', function () {
    regex=/\{\{\s*([^}\s-]+)\s*\}\}/;
    var elems = document.body.getElementsByTagName("*");
    for (var i = elems.length; i--;) {
        content=elems[i].innerHTML;
        match=content.match(regex);
        if(match) {
            elems[i].id = match[1];
            elems[i].textContent="";
        }
    }

    if (window["WebSocket"]) {
        conn = new WebSocket("ws://api.blub.io:32804/ws?series=testcluster.num_threads&series=testcluster.cpu_usage&series=testcluster.aapl_price");
        conn.onmessage = function(evt) {
            console.log(evt.data)
            parseData(evt.data);
        }
    }
});

function parseData(rawData){
    console.log(rawData);
    data = JSON.parse(rawData);
    for(i = 0; i < data["Series"].length; i++) {
        for (var key in data["Series"][i]["Snapshot"]) {
            liveData["testcluster:" + key] = data["Series"][i]["Snapshot"][key];
        }
    }
}

function update(data) {
    for (var key in data) {
        document.getElementById(key).textContent=data[key];
    }
}

// Add a random value to each line every second
setInterval(function() {
    update(liveData);
}, 100);