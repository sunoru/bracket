function loadData() {
    var data_url = 'data';
    var data = new CSV(data, {
        header: ['group_id', 'signup_id', 'baidu_id', 'player_id', 'friend_code']
    }).parse();
}

function printBracket() {
    var mc = $('#main-container');
    var data = loadData();
}

$(printBracket);
