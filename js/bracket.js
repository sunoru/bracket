var mc = null;
var data = {};
var q = 0;
function checkLoaded() {
    if (q != 5)
        return;
    alert(q);
}
function loadData() {
    var data_url = "data/";
    var data_names = ["t1", "t2", "t3", "t4"];
    $.get(data_url + "main.csv",function(resp,status){
        var data_tmp = new CSV(resp, {
            header: ["group_id", "signup_id", "baidu_id", "player_id", "friend_code", "online_time"]
        }).parse();
        data["main"] = {};
        for (var i=0; i< data_tmp.length; i++) {
            data.main[data_tmp[i].group_id] = data_tmp[i];
        }
        q += 1;
        checkLoaded();
    });
    for (var i=0; i < data_names.length; i++) {
        var data_name = data_names[i];
        $.get(data_url + data_name + ".csv", function(resp, status){
            alert(data_name);
            data[data_name] = new CSV(resp, {
                header: ["group_id", "battle_code"]
            }).parse();
            q += 1;
            checkLoaded();
        });
    }
}

function printBracket() {
    mc = $("#main-container");
    loadData();
}

$(printBracket);
