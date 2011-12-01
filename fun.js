function adjust_div_height(id, ht)
{
    $('#'+id).height('');
    if ($('#'+id).height() >= ht) {
        $('#'+id).css({
            'overflow-x': 'hidden',
            'overflow-y': 'auto',
            'width': '100%'
        });
        $('#'+id).height(ht);
        $('#' + id).jscroll({
            W: "15px",
            BgUrl: "url(imgs/s_bg.gif)",
            Bg:"right 0 repeat-y",
            Bar:{Bd: {Out:"#CCC",Hover:"#BBB"}, Bg:{Out:"-45px 0 repeat-y", Hover:"-58px 0 repeat-y", Focus:"-71px 0 repeat-y"}},
            Btn:{btn:true, uBg:{Out:"0 0",Hover:"-15px 0",Focus:"-30px 0"}, dBg:{Out:"0 -15px", Hover:"-15px -15px", Focus:"-30px -15px"}}
        });
        $('.cmt_tool_icon').addClass('margin_r15px');
    }
    else {
    }

    return true;
}

function set_html_and_adjust_ht(id, html, ht)
{
    $('#'+id).html(html);
    adjust_div_height(id, ht);
}

function get_base_addr(u)
{
    var url = new URL(u);
    return url.scheme + '://' + url.hostname;
}

function is_url_valid(u)
{
    var url = new URL(u);

    if ((url.scheme != 'http') && (url.scheme != 'https') && (url.scheme != 'ftp')) {
        return false;
    }

    return true;
}

function truncate_textarea(ta, len)
{
    if (ta.value.length > len) {
        ta.value = ta.value.substring(0, len);
    }

    return true;
}

function get_time_status_txt(time, svr_time)
{
    itv = svr_time - time;

    if (itv < 60) {
        return itv + chrome.i18n.getMessage('seconds_before');
    }

    min = Math.floor(itv / 60);
    if (min < 60) {
        return min + chrome.i18n.getMessage('minutes_before');
    }

    hour = Math.floor(min / 60);
    if (hour < 60) {
        return hour + chrome.i18n.getMessage('hours_before');
    }

    day = Math.floor(hour / 24);
    if (day < 10) {
        return day + chrome.i18n.getMessage('days_before');
    }

    var dt = new Date(time * 1000);
    return (dt.getFullYear())+"-"+(dt.getMonth()+1)+"-"+(dt.getDate())+" "+(dt.getHours())+":"+(dt.getMinutes())+":"+(dt.getSeconds());;
}

function show_float_tooltip(obj, msg)
{
    $('#float_tooltip').html(msg);
    var wd = $('#float_tooltip').outerWidth();
    var ht = $('#float_tooltip').outerHeight();
    var ps = $(obj).position();
    $('#float_tooltip').css({
        'top':(obj.y - ht) +'px',
        'left':(obj.x - wd) +'px',
        'position':'absolute',
        'border':'1px solid #FFF',
        'padding':'5px',
        'background':'#DDD',
        'opacity':'0.8',
        'z-index': '1000'
    }).show("fast");
    $('#float_tooltip').show();
    //setTimeout(removeTip,1000);
}

function remove_float_tooltip()
{
    $('#float_tooltip').hide();
}

function on_cmt_tool_icon_mover(obj, src)
{
    $(obj).addClass('mover_tool_icon');
    $(obj).toggleClass('opacity_40');
    $(obj).attr('src', src);
}

function on_cmt_tool_icon_mout(obj, src)
{
    $(obj).removeClass('mover_tool_icon');
    $(obj).toggleClass('opacity_40');
    $(obj).attr('src', src);
}

function position_top_adj(obj, adj)
{
    $(obj).css({
        'top': adj + 5 + 'px'
    });
}

String.prototype.len = function(){
    return this.replace(/[^\x00-\xff]/g,"**").length;
}

function substr(str, len)
{
    if(!str || !len){
        return '';
    }

    var a = 0;
    var i = 0;
    var temp = '';

    for (i=0; i<str.length; i++) {
        if (str.charCodeAt(i)>255) {
            a+=2;
        }
        else {
            a++;
        }

        if(a > len) {
            return temp;
        }

        temp += str.charAt(i);
    }

    return str;
}
