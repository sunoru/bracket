var mc = null;
var data = {};
var q = 0;
var placeholder = null;
var md = null;
var maeline = null;
var bootstrap_jsurl = 'http://libs.baidu.com/bootstrap/3.3.4/js/bootstrap.min.js';

function setPlayer(md, tdata) {
    md.attr('id', 'player-' + tdata.signup_id);
    md.find('.player-group_id').text(tdata.group_id);
    md.find('.player-baidu_id').text(tdata.baidu_id);
    if (tdata.baidu_id != "轮空") {
        var infostr = '报名序号: ' + tdata.signup_id + '<br>' +
            '游戏名称: ' + tdata.player_id + '<br>' +
            'FC: ' + tdata.friend_code + '<br>' +
            '在线时间:' + tdata.online_time;
        md
            .attr('data-title', tdata.group_id + ' <strong>' + tdata.baidu_id + '</strong>')
            .attr('data-html', true)
            .attr('data-container', 'body')
            .attr('data-toggle', 'popover')
            .attr('data-placement', 'top')
            .attr('data-content', infostr);
    } else {
        md.addClass('player-bye');
    }
    return md;
}
function genDiv(istop) {
    if (istop) {
        return md.clone().addClass('player-top');
    }
    return md.clone().addClass('player-bottom');
}

var k = 0;
function genTurn(turn, group) {
    var tturn = $('<td></td>')
        .attr('id', 'group-' + group + '-t' + (turn + 1))
        .addClass('bracket-turn');
    var p = 8 / Math.pow(2, turn);
    var np = 7;
    if (turn < 4) {
        np = Math.pow(2, turn) - 1;
    }
    for (var j = 0; j < p; j++) {
        var vs = $('<div></div>');
        for (var i1 = 0; i1 < np; i1++) {
            vs.append(placeholder.clone());
        }
        vs.append(
            $('<table></table>')
                .addClass('match')
                .append('<tr></tr>'));
        if (turn < 3) {
            if ((j & 1) == 0) {
                vs.addClass('match-odd');
            } else {
                vs.addClass('match-even');
            }
        }
        if (turn < 4) {
            vs.addClass('match-m' + (j + 1))
        }

        k += 1;
        var left = null;
        var right = null;
        var vsm = vs.find('tr');
        if (turn > 0) {
            vsm.append(maeline.clone())
        }
        if (turn < 4) {
            vsm.append($('<td></td>')
                .addClass('match-title')
                .append($('<div>' + k + '</div>')
                    .addClass('match-title-href')));
        }
        if (turn < 4) {
            vsm.append($('<td></td>')
                .addClass('match-players')
                .append(left = genDiv(true))
                .append(right = genDiv(false)));
        } else {
            vsm.append(
                $('<td></td>')
                    .addClass('group-champion')
                    .append(left = md.clone()));
        }

        if (turn == 0) {
            setPlayer(left, data.main[group + (j * 2 + 1)]);
            setPlayer(right, data.main[group + (j * 2 + 2)]);
        }
        for (i1 = 0; i1 < np; i1++) {
            vs.append(placeholder.clone());
        }
        tturn.append(vs);
    }
    return tturn;
}

function setPlayers() {
    for (var i = 1; i < 4; i++) {
        var pdata = data['t' + i];
        for (var j = 0; j < pdata.length; j++) {
            var winner = pdata[j];
            var group = winner.group_id[0];
            var gid = parseInt(winner.group_id.substr(1));
            var mid = Math.floor((gid + 3) / Math.pow(2, i + 1));
            var tr = (Math.floor((gid + 1) / Math.pow(2, i)) & 1) == 1;
            setPlayer($('#group-' + group + '-t' + (i + 1) + ' .match-m' + mid +
                (tr ? ' .player-top' : ' .player-bottom')), data.main[winner.group_id]);
        }
    }
}

function checkLoaded() {
    if (q != 6)
        return;
    var gl = $('#group-list');
    var brackets = $('#brackets');
    var lgroup = Object.keys(data.info).length;
    placeholder = $('<div></div>')
        .addClass('match-placeholder');
    md = $('<div></div>')
        .addClass('player')
        .append($('<div></div>')
            .addClass('player-group_id player-meta'))
        .append($('<div></div>')
            .addClass('player-baidu_id player-meta'))
        .append($('<div></div>')
            .addClass('player-tail'));
    maeline = $('<td></td>')
        .addClass('match-maeline')
        .append('<div></div>');
    for (var i = 0; i < lgroup; i++) {
        var group = String.fromCharCode(65 + i);
        gl.append(
            $('<a></a>')
                .attr('type', 'button')
                .addClass('btn btn-info group-button')
                .attr('href', '#group-' + group)
                .text(group + ' 组'));
        var bracket = $('<table></table>')
            .append($('<tr></tr>')
                .attr('id', 'group-' + group + '-bracket')
                .addClass('group-bracket'));
        var groupdiv = $('<div></div>')
            .attr('id', 'group-' + group)
            .addClass('group-container')
            .append($('<div>↑</div>')
                .addClass('return-top'))
            .append('<h3>' + group + ' 组（' + data.info[group].description + '）</h3>')
            .append(bracket);
        brackets.append(groupdiv);
    }
    for (var j = 0; j < 5; j++) {
        for (i = 0; i < lgroup; i++) {
            group = String.fromCharCode(65 + i);
            $('#group-' + group + '-bracket')
                .append(genTurn(j, group));
        }
    }
    setPlayers();
    if (location.hash != '') {
        location.href = location.hash;
    }
    $.getScript(bootstrap_jsurl, function () {
        var popovers = $("[data-toggle='popover']");
        popovers.on('shown.bs.popover', function () {
            var me = this;
            popovers.each(function () {
                if (this != me) {
                    $(this).popover('hide');
                }
            })
        });
        popovers.popover();
    });
    $('.return-top').click(function () {
        location.hash = '';
        window.scrollTo(0, 0);
    });
}
function loadTurnData(data_url, data_name) {
    $.get(data_url + data_name + '.csv', function (resp, status) {
        data[data_name] = new CSV(resp, {
            header: ['group_id', 'battle_code']
        }).parse();
        q += 1;
        checkLoaded();
    });
}
function loadData() {
    var data_url = 'data/';
    var data_names = ['t1', 't2', 't3'];
    $.get(data_url + 'main.csv', function (resp, status) {
        var data_tmp = new CSV(resp, {
            header: ['group_id', 'signup_id', 'baidu_id', 'player_id', 'friend_code', 'online_time']
        }).parse();
        data['main'] = {};
        for (var i = 0; i < data_tmp.length; i++) {
            data.main[data_tmp[i].group_id] = data_tmp[i];
        }
        q += 1;
        checkLoaded();
    });
    $.get(data_url + 'info.csv', function (resp, status) {
        var data_tmp = new CSV(resp, {
            header: ['group_id', 'description']
        }).parse();
        data['info'] = {};
        for (var i = 0; i < data_tmp.length; i++) {
            data.info[data_tmp[i].group_id] = data_tmp[i];
        }
        q += 1;
        checkLoaded();
    });
    $.get(data_url + 'champion.csv', function (resp, status) {
        var data_tmp = new CSV(resp, {
            header: ['group_id', 'battle_code_1', 'battle_code_2', 'battle_code_3']
        }).parse();
        q += 1;
        checkLoaded();
    });
    for (var i = 0; i < data_names.length; i++) {
        loadTurnData(data_url, data_names[i]);
    }
}

function printBracket() {
    mc = $('#main-container');
    loadData();
}

$(printBracket);
