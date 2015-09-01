var Syncopate = Syncopate || (function(){
    var liveData = {}

    return {
        init : function(token) {
            regex=/\{\{\s*([^}\s-]+)\s*\}\}/;
            wsurl="ws://api.blub.io:32815/ws?token=" + token;
            var elems = document.body.getElementsByTagName("*");
            for (var i = elems.length; i--;) {
                content=elems[i].innerHTML;
                match=content.match(regex);
                if(match) {
                    elems[i].className = elems[i].className + " " + match[1];
                    wsurl=wsurl+"&series="+match[1];
                    elems[i].textContent="";
                }
            }

            if (window["WebSocket"]) {
                conn = new WebSocket(wsurl);
                conn.onmessage = function(evt) {
                    Syncopate.parse(evt.data);
                }
            }
        },
        parse : function(rawData) {
            data = JSON.parse(rawData);
            for(i = 0; i < data["Series"].length; i++) {
                var id = data["Series"][i]["Key"]
                var response = data["Series"][i]["Response"]
                for (var key in response["Snapshot"]) {
                    liveData[id] = response["Snapshot"][key];
                }
            }
        },
        update : function(data) {
            for (var key in data) {
                var elems = document.getElementsByClassName(key);
                for (var i = elems.length; i--;) {
                    elems[i].textContent=data[key];
                }
            }
        },
        data : function() {
            return liveData
        },
        callback : function() {
            return
        },
        run : function() {
            setInterval(function() {
                Syncopate.update(liveData);
                Syncopate.callback();
            }, 100);
        }
    };
}());
