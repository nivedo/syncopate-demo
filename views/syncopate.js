var Syncopate = Syncopate || (function(){
    var liveData = {}

    return {
        init : function(token, group) {
            regex=/\{\{\s*([^}\s:]+)\s*\}\}/;
            wsurl="ws://52.8.222.214:8080/ws?token=" + token;
            var elems = document.body.getElementsByTagName("*");
            for (var i = elems.length; i--;) {
                content=elems[i].innerHTML;
                match=content.match(regex);
                while(match) {
                    console.log(match)
                    if(group != undefined) {
                        if(match[1].split('.').length < 2) {
                            match[1] = group + "." + match[1]
                        }
                    }
                    wsurl=wsurl+"&series="+match[1];
                    res=content.replace(match[0],"<span class=\"syncopate-var " + match[1] + "\"></span>");
                    elems[i].innerHTML = res
                    // Match rest of InnerHTML
                    content=elems[i].innerHTML;
                    match=content.match(regex);
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
                var response = data["Series"][i];
                liveData[response["k"]] = response["v"];
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
