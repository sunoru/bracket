var mc = null;
var data = {};
var q = 0;
function genDiv(tdata, istop) {
    var md = $('<div></div>')
        .attr('id', 'player-'+tdata.signup_id)
        .addClass('player')
        .append($('<div></div>')
            .addClass('player-group_id player-meta')
            .text(tdata.group_id))
        .append($('<div></div>')
            .addClass('player-baidu_id player-meta')
            .text(tdata.baidu_id))
        .append($('<div></div>')
            .addClass('player-tail'));
    if (tdata.baidu_id!="轮空") {
        var infostr = '报名序号: ' + tdata.signup_id + '<br>' +
            '游戏名称: ' + tdata.player_id + '<br>' +
            'FC: ' + tdata.friend_code + '<br>' +
            '在线时间:' + tdata.online_time;
        md
            //.attr('data-title', tdata.group_id + ' <a target="_blank" href="http://tieba.baidu.com/home/main/?un=' +
            //    encodeURI(tdata.baidu_id)+'">'+tdata.baidu_id+'</a>')
            .attr('data-title', tdata.group_id + ' <strong>' +tdata.baidu_id+'</strong>')
            .attr('data-html', true)
            .attr('data-container', 'body')
            .attr('data-toggle', 'popover')
            .attr('data-placement', 'top')
            .attr('data-content', infostr);
    } else {
        md.addClass('player-bye')
    }

    if (istop) {
        md.addClass('player-top');
    } else {
        md.addClass('player-bottom');
    }
    return md
}
function checkLoaded() {
    if (q != 6)
        return;
    var gl = $('#group-list');
    var brackets = $('#brackets');
    var k = 0;
    for(var i=0; i<Object.keys(data.info).length; i++) {
        var group = String.fromCharCode(65 + i);
        gl.append('<a type="button" class="btn btn-info group-button" href="#group-' + group + '">'+ group +' 组</a>');
        var t1 = $('<td></td>')
            .attr('id', 'group-'+group+'-t1')
            .addClass('bracket-turn');
        for (var j=0; j<8; j++) {
            var vs = $('<table></table>')
                .addClass('match')
                .append('<tr></tr>');
            k += 1;
            var vsm = vs.find('tr')
                .append($('<td></td>')
                    .addClass('match-title')
                    .append($('<div>'+k+'</div>')
                        .attr('id', 'match-'+group+(j+1))
                        .addClass('match-title-href')))
                .append($('<td></td>')
                    .addClass('match-players')
                    .addClass((j & 1)==0?'match-odd':'match-even')
                    .append(genDiv(data.main[group+(j*2+1)], true))
                    .append(genDiv(data.main[group+(j*2+2)], false)));
            t1.append(vs)
        }
        var bracket = $('<table></table>')
            .attr('id', 'group-'+group+'-bracket')
            .addClass('group-bracket')
            .append('<tr></tr>');
        var m = bracket.find('tr');
        m.append(t1);
        var groupdiv = $('<div></div>')
            .attr('id', 'group-'+group)
            .addClass('group-container')
            .append('<div class="return-top">↑</div>')
            .append('<h3>'+group+' 组（'+data.info[group].description+'）</h3>')
            .append(bracket);
        brackets.append(groupdiv);
    }

    $.getScript("http://libs.baidu.com/bootstrap/3.3.4/js/bootstrap.min.js", function () {
        var popovers = $("[data-toggle='popover']");
        popovers.on('shown.bs.popover', function () {
            var me = this;
            popovers.each(function () {
                if (this!=me) {
                    $(this).popover('hide');
                }
            })
        });
        popovers.popover();
    });
    $('.return-top').click(function () {
        window.scrollTo(0, 0);
    })
}
function loadTurnData(data_url, data_name) {
    $.get(data_url + data_name + '.csv', function(resp, status){
        data[data_name] = new CSV(resp, {
            header: ['group_id', 'battle_code']
        }).parse();
        q += 1;
        checkLoaded();
    });
}
function loadData() {
    var data_url = 'data/';
    var data_names = ['t1', 't2', 't3', 't4'];
    $.get(data_url + 'main.csv',function(resp,status){
        var data_tmp = new CSV(resp, {
            header: ['group_id', 'signup_id', 'baidu_id', 'player_id', 'friend_code', 'online_time']
        }).parse();
        data['main'] = {};
        for (var i=0; i< data_tmp.length; i++) {
            data.main[data_tmp[i].group_id] = data_tmp[i];
        }
        q += 1;
        checkLoaded();
    });
    $.get(data_url + 'info.csv',function(resp,status){
        var data_tmp = new CSV(resp, {
            header: ['group_id', 'description']
        }).parse();
        data['info'] = {};
        for (var i=0; i< data_tmp.length; i++) {
            data.info[data_tmp[i].group_id] = data_tmp[i];
        }
        q += 1;
        checkLoaded();
    });
    for (var i=0; i < data_names.length; i++) {
        loadTurnData(data_url, data_names[i]);
    }
}

function printBracket() {
    mc = $('#main-container');
    loadData();
}

$(printBracket);
