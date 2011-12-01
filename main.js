var g_bgpg = null;
var g_tab_1_reinit_navi = false;
var g_tab_2_reinit_navi = false;
var g_tab_3_reinit_navi = false;
var g_tab_4_reinit_navi = false;
var g_tab_5_reinit_navi = false;
var g_api_addr = 'http://api.gdfans.net/';
var g_float_msg_to = null;
var g_clipboard = null;

function clear_floatmsg()
{
    $('div#float_msgdlg').fadeOut();
}

function show_floatmsg(msg, timeout)
{
    $('div#float_msgdlg').hide();
    $('div#float_msgdlg_cnt').html(msg);
    $('div#float_msgdlg').css({
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'margin-top': -($('div#float_msgdlg').height() / 2) + 'px',
        'margin-left': -($('div#float_msgdlg').width() / 2) + 'px',
        'z-index': '100000',
        'opacity': '0.9'
    });
    $('div#float_msgdlg').fadeIn();

    if (timeout != 0) {
        if (g_float_msg_to != null) {
            clearTimeout(g_float_msg_to);
        }
        g_float_msg_to = setTimeout(clear_floatmsg, timeout * 1000);
    }

    return true;
}

function show_popmsg(msg, on_close)
{
    $('#popmsg_dialog').html(msg);
    $('#popmsg_dialog').keydown(function(e) {
        if (e.keyCode == 13) {
            $(this).dialog("close");
        }
    });
    var btns = new Object;
    btns[chrome.i18n.getMessage('dlg_btn_ok')] = function() { $('#popmsg_dialog').dialog("close"); };
    $('#popmsg_dialog').dialog({
        buttons: btns,
        modal: true,
        width: 200,
        height: 125,
        close: on_close
    });
}

function rankup_cmt(id)
{
    var localname = 'usrcmt_rankup_' + id;
    if (localStorage[localname] == 1) {
        show_floatmsg(chrome.i18n.getMessage('already_ranked'), 3);
        return false;
    }

    localStorage[localname] = 1;
    $.post(g_api_addr,
        { cmd: '1502',
        alt: 'json',
        auth: g_bgpg.g_global_auth,
        cmt_id: id },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_floatmsg(chrome.i18n.getMessage('rank_op_fail'), 3);
                return false;
            }

            if (resp.result == 1503) {
                show_floatmsg(chrome.i18n.getMessage('already_ranked'), 3);
            }
            else if (resp.result != 0) {
                show_floatmsg(chrome.i18n.getMessage('rank_op_error') + resp.result, 3);
                return false;
            }
            else {
                // resp.result == 0
                on_tab_switch(g_bgpg.g_last_active_tab_idx);
                show_floatmsg(chrome.i18n.getMessage('rank_success'), 3);
            }
        });
}

function rankdown_cmt(id)
{
    var localname = 'usrcmt_rankdown_' + id;
    if (localStorage[localname] == 1) {
        show_floatmsg(chrome.i18n.getMessage('already_ranked'), 3);
        return false;
    }

    localStorage[localname] = 1;
    $.post(g_api_addr,
        { cmd: '1503',
        alt: 'json',
        cmt_id: id },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_floatmsg(chrome.i18n.getMessage('rank_op_fail'), 3);
                return false;
            }

            if (resp.result == 1503) {
                show_floatmsg(chrome.i18n.getMessage('already_ranked'), 3);
            }
            else if (resp.result != 0) {
                show_floatmsg(chrome.i18n.getMessage('rank_op_error') + resp.result, 3);
                return false;
            }
            else {
                // resp.result == 0
                on_tab_switch(g_bgpg.g_last_active_tab_idx);
                show_floatmsg(chrome.i18n.getMessage('rank_success'), 3);
            }
        });
}

function add_fav_cmt(id)
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        show_login_dialog();
        return false;
    }

    $.post(g_api_addr,
        { cmd: '1511',
        alt: 'json',
        cmt_id: id,
        auth: g_bgpg.g_global_auth
        },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_floatmsg(chrome.i18n.getMessage('add_fav_fail'), 3);
                return false;
            }

            if (resp.result != 1502 && resp.result != 0) {
                show_floatmsg(chrome.i18n.getMessage('add_fav_error') + resp.result, 3);
                return false;
            }

            refresh_login_info();
            on_tab_switch(g_bgpg.g_last_active_tab_idx);
            show_floatmsg(chrome.i18n.getMessage('add_fav_success'), 3);
        });
}

function del_fav_cmt(id)
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        show_login_dialog();
        return false;
    }

    $.post(g_api_addr,
        { cmd: '1513',
        alt: 'json',
        cmt_id: id,
        auth: g_bgpg.g_global_auth
        },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_floatmsg(chrome.i18n.getMessage('del_fav_fail'), 3);
                return false;
            }

            if (resp.result != 0) {
                //show_floatmsg(chrome.i18n.getMessage('del_fav_error') + resp.result, 3);
                return false;
            }

            refresh_login_info();
            on_tab_switch(g_bgpg.g_last_active_tab_idx);
            show_floatmsg(chrome.i18n.getMessage('del_fav_success'), 3);
        });
}

function del_my_cmt(id)
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        show_login_dialog();
        return false;
    }

    $.post(g_api_addr,
        { cmd: '1506',
        alt: 'json',
        cmt_id: id,
        auth: g_bgpg.g_global_auth
        },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_floatmsg(chrome.i18n.getMessage('del_cmt_fail'), 3);
                return false;
            }

            if (resp.result != 0) {
                //show_floatmsg(chrome.i18n.getMessage('del_cmt_error') + resp.result, 3);
                return false;
            }

            g_bgpg.on_cmt_ifo_change();
            refresh_login_info();
            on_tab_switch(g_bgpg.g_last_active_tab_idx);
            show_floatmsg(chrome.i18n.getMessage('del_cmt_success'), 3);
        });
}

function refresh_login_info()
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        return false;
    }

    $.post(g_api_addr,
        { cmd: '1508',
        alt: 'json',
        auth: g_bgpg.g_global_auth },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_floatmsg(chrome.i18n.getMessage('get_usrifo_fail'), 3);
                return false;
            }

            if (resp.result != 0) {
                show_floatmsg(chrome.i18n.getMessage('get_usrifo_error') + resp.result, 3);
                return false;
            }

            g_bgpg.g_usr_cmt_cnt = resp.usr_cmt_cnt;
            g_bgpg.g_usr_url_cnt = resp.usr_cmt_cnt;
            g_bgpg.g_usr_fav_cnt = resp.usr_fav_cnt;
            refresh_login_content();
        }
    );
}

function refresh_login_content()
{
    var htmltxt = '';
    var htmlicon = '';
    if ((g_bgpg.g_global_auth == undefined) || (g_bgpg.g_global_auth.length <= 0)) {
        htmltxt = chrome.i18n.getMessage('prompt_to_login_1') + '<a href="#" onclick="show_login_dialog();">' + chrome.i18n.getMessage('login') + '</a>' + chrome.i18n.getMessage('prompt_to_login_2') + '<a href="#" onclick="chrome.tabs.create({url: \'http://cyanbean.com/client/webroot/index.php?c=user&a=reg\'});">' + chrome.i18n.getMessage('register') + '</a>' + chrome.i18n.getMessage('prompt_to_login_3');
        htmlicon = '<img src="imgs/toux.png" align="left" class="toux_img"\>';
    }
    else {
        htmltxt = 'Mr. ' + g_bgpg.g_global_email + ' <a href="#" onclick="logout();">' + chrome.i18n.getMessage('usr_logout') + '</a><br /><a href="#" onclick="$(\'#tabs\').tabs(\'select\', 1);">' + g_bgpg.g_usr_cmt_cnt + chrome.i18n.getMessage('x_comments') + '</a> | <a href="#" onclick="$(\'#tabs\').tabs(\'select\', 2);">' + g_bgpg.g_usr_url_cnt + chrome.i18n.getMessage('x_sites') + '</a> | <a href="#" onclick="$(\'#tabs\').tabs(\'select\', 3);">' + g_bgpg.g_usr_fav_cnt + chrome.i18n.getMessage('x_favourites') + '</a>';
        gvt_img_path = 'http://www.gravatar.com/avatar/' + $.md5(jQuery.trim(g_bgpg.g_global_email).toLowerCase()) + '?s=40';
        htmlicon = '<img src="' + gvt_img_path + '" align="left" class="toux_img"\>';
    }

    $('#usrinfo_txt').html(htmltxt + "\n");
    $('#usrinfo_icon').html(htmlicon);
    return true;
}

function do_login()
{
     if ($('input#email').val() == '') {
         $('input#email').focus();
         return false;
     }
     if ($('input#passwd').val() == '') {
         $('input#passwd').focus();
         return false;
     }

    $('#login_dialog').dialog({ disabled: true });
    $.post(g_api_addr,
        { cmd: '1010',
        alt: 'json',
        email: login_form.email.value,
        passwd: login_form.passwd.value},
        function(data) {
            var resp = JSON.parse(data);
            if (! resp) {
                show_popmsg(chrome.i18n.getMessage('login_fail'), function() { $('#login_dialog').dialog({ disabled: false }); });
                return false;
            }

            if (resp.result == 1001) {
                show_popmsg(chrome.i18n.getMessage('login_invalid_unamepwd'), function() { $('#login_dialog').dialog({ disabled: false }); });
                return false;
            }

            if (resp.result != 0) {
                show_popmsg(chrome.i18n.getMessage('login_error') + resp.result, function() { $('#login_dialog').dialog({ disabled: false }); });
                return false;
            }

            $('#login_dialog').dialog('close');
            g_bgpg.g_global_email = login_form.email.value;
            g_bgpg.g_global_passwd = login_form.passwd.value;
            g_bgpg.g_global_auth = resp.auth;
            localStorage['urlcmt_email'] = login_form.email.value;
            localStorage['urlcmt_auth'] = resp.auth;
            refresh_login_info();
        }
    );

    return true;
}

function logout()
{
    g_bgpg.g_global_email = '';
    g_bgpg.g_global_passwd = '';
    g_bgpg.g_global_auth = '';
    localStorage['urlcmt_email'] = '';
    localStorage['urlcmt_auth'] = '';
    refresh_login_content();
    return true;
}

function show_login_dialog()
{
    var btns = new Object;
    btns[chrome.i18n.getMessage('login_clear')] = function() {
                        $('input#email').val('');
                        $('input#passwd').val('');
                        $('input#email').focus();
                      };
    btns[chrome.i18n.getMessage('login_login')] = function() { do_login(); };
    btns[chrome.i18n.getMessage('login_cancel')] = function() { $(this).dialog("close"); };
    var obj = $('#login_dialog');
    $('#login_dialog').dialog({
        buttons: btns,
        modal: true,
    });
    $('#login_dialog').keydown(function(e) {
        if (e.keyCode == 13) {
            do_login();
        }
    });
}

function cb_tab_1_page_sel(page_idx, jq)
{
    if (g_tab_1_reinit_navi) {
        g_tab_1_reinit_navi = false;
        return true;
    }

    g_bgpg.g_url_cmt_page_no = page_idx + 1;
    on_tab_1_focus();
    return true;
}

function cb_tab_2_page_sel(page_idx, jq)
{
    if (g_tab_2_reinit_navi) {
        g_tab_2_reinit_navi = false;
        return true;
    }

    g_bgpg.g_my_cmt_page_no = page_idx + 1;
    on_tab_2_focus();
    return true;
}

function cb_tab_3_page_sel(page_idx, jq)
{
    if (g_tab_3_reinit_navi) {
        g_tab_3_reinit_navi = false;
        return true;
    }

    g_bgpg.g_my_site_page_no = page_idx + 1;
    on_tab_3_focus();
    return true;
}

function cb_tab_4_page_sel(page_idx, jq)
{
    if (g_tab_4_reinit_navi) {
        g_tab_4_reinit_navi = false;
        return true;
    }

    g_bgpg.g_my_fav_page_no = page_idx + 1;
    on_tab_4_focus();
    return true;
}

function cb_tab_5_page_sel(page_idx, jq)
{
    if (g_tab_5_reinit_navi) {
        g_tab_5_reinit_navi = false;
        return true;
    }

    g_bgpg.g_top_cmt_page_no = page_idx + 1;
    on_tab_5_focus();
    return true;
}

function copy_to_clipboard(str)
{
    var obj=document.getElementById("clipboard_txt");
    if (obj) {
        obj.value = str;
        obj.select();
        document.execCommand("copy", false, null);
    }

    show_floatmsg(chrome.i18n.getMessage('copy_share_cnt_succ'), 3);
    return true;
}

function on_tab_1_focus()
{
    chrome.tabs.getSelected(null, function(tab) {
        if (! is_url_valid(tab.url)) {
            set_html_and_adjust_ht('url_cmt_div', '<div style="text-align: center;height: 60px; padding: 35px 0px 0px 0px;">' + chrome.i18n.getMessage('does_not_sup_url') + '</div>', 410);
            $('#cmt_form').hide();
            return false;
        }

        $('#cmt_form').show();
        return g_bgpg.get_url_cmt(-1, function(resp) {
            if (! resp || resp.result != 0) {
                set_html_and_adjust_ht('url_cmt_div', chrome.i18n.getMessage('get_cmt_fail'), 410);
                return false;
            }

            var idx = 0;
            var htmltxt = '';
            for (var key in resp.data) {
                var usrname = chrome.i18n.getMessage('anonymous_usr');
                if (resp.data[key]['usr_id'] != 11) {
                    usrname = resp.data[key]['email'];
                }
                gvt_img_path = 'http://www.gravatar.com/avatar/' + $.md5(jQuery.trim(resp.data[key]['email']).toLowerCase()) + '?s=40';
                htmltxt += '<div style="margin: 0 0 3px 0;" onmouseover="position_top_adj(\'#url_float_tool_icon_' + idx + '\', $(this).position().top);$(\'#url_float_tool_icon_' + idx + '\').show();" onmouseout="$(\'#url_float_tool_icon_' + idx + '\').hide();"><div class="invisible cmt_tool_icon" id="url_float_tool_icon_' + idx + '"><img title="' + resp.data[key]['pos_rank'] + chrome.i18n.getMessage('x_likes') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/like.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/like_gr.ico\')" onclick="rankup_cmt(' + resp.data[key]['id'] + ');" src="imgs/like_gr.ico" />&nbsp;<img title="' + resp.data[key]['neg_rank'] + chrome.i18n.getMessage('x_dislikes') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/dislike.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/dislike_gr.ico\')" onclick="rankdown_cmt(' + resp.data[key]['id'] + ');" src="imgs/dislike_gr.ico" />&nbsp;';

                if (resp.data[key]['fav']) {
                    htmltxt += '<img title="' + resp.data[key]['fav_cnt'] + chrome.i18n.getMessage('cancel_favourite') + '" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/fav_gr.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/fav.ico\')" onclick="del_fav_cmt(' + resp.data[key]['id'] + ');" src="imgs/fav.ico" />';
                }
                else {
                    htmltxt += '<img title="' + resp.data[key]['fav_cnt'] + chrome.i18n.getMessage('add_favourite') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/fav.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/fav_gr.ico\')" onclick="add_fav_cmt(' + resp.data[key]['id'] + ');" src="imgs/fav_gr.ico" />';
                }

                htmltxt += '&nbsp;<br /><img title="' + chrome.i18n.getMessage('share_to_sina') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/sina_t.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/sina_t_gr.ico\')" onclick="chrome.tabs.create({url: \'http://v.t.sina.com.cn/share/share.php?title='+ resp.data[key]['cmt'] + '%20|%20' + resp.data[key]['url'] + '%20|%20' + usrname +'%20|%20' + chrome.i18n.getMessage('urlcmt_short') + '(urlcmt)\'});" src="imgs/sina_t_gr.ico" />&nbsp;<img title="' + chrome.i18n.getMessage('copy_share_cnt') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/click_brd.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/click_brd_gr.ico\')" onclick="copy_to_clipboard(\''+ resp.data[key]['cmt'] + ' | ' + resp.data[key]['url'] + ' | ' + usrname +' | ' + chrome.i18n.getMessage('urlcmt_short') + '(urlcmt)\');" src="imgs/click_brd_gr.ico" /></div><div class="ui-widget-content ui-corner-all"><table style="width: 100%"><tbody><tr><td><img class="cmt_avatar" src="' + gvt_img_path + '" />' + usrname + '<br />' + resp.data[key]['cmt'] + '</td></tr><tr><td><font class="font_8px colo_aaa">' + get_time_status_txt(resp.data[key]['insert_time'], resp.svr_time) + chrome.i18n.getMessage('come_from')  + resp.data[key]['ip_addr'] + '(' + resp.data[key]['gsd'] + ')' + ' </font></td></tr></tbody></table></div></div>';
                idx ++;
            }

            if (htmltxt.length == 0) {
                set_html_and_adjust_ht('url_cmt_div', '', 410);
                $('textarea#cmt_cnt').focus();
                return false;
            }

            set_html_and_adjust_ht('url_cmt_div', htmltxt + '<div id="url_pagination" class="pagination"></div>' + "\n", 410);
            g_tab_1_reinit_navi = true;
            $("#url_pagination").pagination(resp.found, {
                prev_text: chrome.i18n.getMessage('pagnav_prev'),
                next_text: chrome.i18n.getMessage('pagnav_next'),
                num_edge_entries: 1,
                num_display_entries: 3,
                callback: cb_tab_1_page_sel,
                items_per_page: g_bgpg.g_url_cmt_page_size,
                current_page: g_bgpg.g_url_cmt_page_no - 1
            });

            return true;
        });
    });
}

function on_tab_2_focus()
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        set_html_and_adjust_ht('my_cmt_div', '<div style="text-align: center;height: 60px; padding: 35px 0px 0px 0px;">' + chrome.i18n.getMessage('nofity_login_1') + '<a href="#" onclick="show_login_dialog();">' + chrome.i18n.getMessage('nofity_login_2') + '</a>' + chrome.i18n.getMessage('nofity_login_3') + '</div>', 500);
        return true;
    }

    return g_bgpg.get_my_cmt(-1, function(resp) {
        if (! resp || resp.result != 0) {
            set_html_and_adjust_ht('my_cmt_div', chrome.i18n.getMessage('get_cmt_fail'), 500);
            return false;
        }

        var idx = 0;
        var htmltxt = '';
        for (var key in resp.data) {
            gvt_img_path = 'http://www.gravatar.com/avatar/' + $.md5(jQuery.trim(g_bgpg.g_global_email).toLowerCase()) + '?s=40';
            htmltxt += '<div style="margin: 0 0 3px 0;" onmouseover="position_top_adj(\'#my_float_tool_icon_' + idx + '\', $(this).position().top);$(\'#my_float_tool_icon_' + idx + '\').show();" onmouseout="$(\'#my_float_tool_icon_' + idx + '\').hide();"><div class="invisible cmt_tool_icon" id="my_float_tool_icon_' + idx + '"><img title="' + resp.data[key]['pos_rank'] + chrome.i18n.getMessage('x_likes') + '" src="imgs/like.ico" />&nbsp;<img title="' + resp.data[key]['neg_rank'] + chrome.i18n.getMessage('x_dislikes') + '" src="imgs/dislike.ico" />&nbsp;<img title="' + resp.data[key]['fav_cnt'] + chrome.i18n.getMessage('xp_favourites') + '" src="imgs/fav.ico" /><br /><img title="' + chrome.i18n.getMessage('delete') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/del.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/del_gr.ico\')" onclick="del_my_cmt(' + resp.data[key]['id'] + ');" src="imgs/del_gr.ico" /></div><div class="ui-widget-content ui-corner-all"><table style="width: 100%"><tbody><tr><td><img class="cmt_avatar" src="' + gvt_img_path + '" /><a href="#" onclick="chrome.tabs.create({url: \''+ resp.data[key]['url'] +'\'});">' + resp.data[key]['title'] + '</a><br />' + resp.data[key]['cmt'] + '</td></tr><tr><td><font class="font_8px colo_aaa">' + get_time_status_txt(resp.data[key]['insert_time'], resp.svr_time) + chrome.i18n.getMessage('come_from') + resp.data[key]['ip_addr'] + '(' + resp.data[key]['gsd'] + ')' + ' </font></td></tr></tbody></table></div></div>';
            idx ++;
        }

        if (htmltxt.length == 0) {
            set_html_and_adjust_ht('my_cmt_div', '<div style="text-align: center;height: 30px; padding: 15px 0px 0px 0px;">' + chrome.i18n.getMessage('no_comments') + '</div>', 500);
            return false;
        }

        set_html_and_adjust_ht('my_cmt_div', htmltxt + '<div id="my_pagination" class="pagination"></div>' + "\n", 500);
        g_tab_2_reinit_navi = true;
        $("#my_pagination").pagination(resp.found, {
            prev_text: chrome.i18n.getMessage('pagnav_prev'),
            next_text: chrome.i18n.getMessage('pagnav_next'),
            num_edge_entries: 1,
            num_display_entries: 3,
            callback: cb_tab_2_page_sel,
            items_per_page: g_bgpg.g_my_cmt_page_size,
            current_page: g_bgpg.g_my_cmt_page_no - 1
        });
        return true;
    });
}

function on_tab_3_focus()
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        set_html_and_adjust_ht('my_site_div', '<div style="text-align: center;height: 60px; padding: 35px 0px 0px 0px;">' + chrome.i18n.getMessage('nofity_login_1') + '<a href="#" onclick="show_login_dialog();">' + chrome.i18n.getMessage('nofity_login_2') + '</a>' + chrome.i18n.getMessage('nofity_login_3') + '</div>', 500);
        return true;
    }

    return g_bgpg.get_my_site(-1, function(resp) {
        if (! resp || resp.result != 0) {
            set_html_and_adjust_ht('my_site_div', chrome.i18n.getMessage('get_site_fail'), 500);
            return false;
        }

        var idx = 0;
        var htmltxt = '';
        for (var key in resp.data) {
            gvt_img_path = 'http://www.gravatar.com/avatar/' + $.md5(jQuery.trim(g_bgpg.g_global_email).toLowerCase()) + '?s=40';
            htmltxt += '<div class="ui-widget-content ui-corner-all" style="margin: 1px 0px; padding: 0px 0px 6px 2px;" height="20"><img src="' + (get_base_addr(resp.data[key]['url']) + '/favicon.ico') + '" class="toux_img" width="16" height="16"></img><a href="#" onclick="chrome.tabs.create({url: \''+ resp.data[key]['url'] +'\'});">' + resp.data[key]['title'] + '</a>&nbsp;( ' + resp.data[key]['cmt_cnt'] + chrome.i18n.getMessage('x_comments') + ')</div>';
            idx ++;
        }

        if (htmltxt.length == 0) {
            set_html_and_adjust_ht('my_site_div', '<div style="text-align: center;height: 30px; padding: 15px 0px 0px 0px;">' + chrome.i18n.getMessage('no_sites') + '</div>', 500);
            return false;
        }

        set_html_and_adjust_ht('my_site_div', htmltxt + '<div id="site_pagination" class="pagination"></div>' + "\n", 500);
        g_tab_3_reinit_navi = true;
        $("#site_pagination").pagination(resp.found, {
            prev_text: chrome.i18n.getMessage('pagnav_prev'),
            next_text: chrome.i18n.getMessage('pagnav_next'),
            num_edge_entries: 1,
            num_display_entries: 3,
            callback: cb_tab_3_page_sel,
            items_per_page: g_bgpg.g_my_site_page_size,
            current_page: g_bgpg.g_my_site_page_no - 1
        });
        return true;
    });
}

function on_tab_4_focus()
{
    if (! g_bgpg.g_global_auth || g_bgpg.g_global_auth.length <= 0) {
        set_html_and_adjust_ht('my_fav_div', '<div style="text-align: center;height: 60px; padding: 35px 0px 0px 0px;">' + chrome.i18n.getMessage('nofity_login_1') + '<a href="#" onclick="show_login_dialog();">' + chrome.i18n.getMessage('nofity_login_2') + '</a>' + chrome.i18n.getMessage('nofity_login_3') + '</div>', 500);
        return true;
    }

    return g_bgpg.get_my_fav(-1, function(resp) {
        if (! resp || resp.result != 0) {
            set_html_and_adjust_ht('my_fav_div', chrome.i18n.getMessage('get_fav_fail'), 500);
            return false;
        }

        var idx = 0;
        var htmltxt = '';
        for (var key in resp.data) {
            var usrname = chrome.i18n.getMessage('anonymous_usr');
            if (resp.data[key]['usr_id'] != 11) {
                usrname = resp.data[key]['email'];
            }
            gvt_img_path = 'http://www.gravatar.com/avatar/' + $.md5(jQuery.trim(resp.data[key]['email']).toLowerCase()) + '?s=40';
            htmltxt += '<div style="margin: 0 0 3px 0;" onmouseover="position_top_adj(\'#fav_float_tool_icon_' + idx + '\', $(this).position().top);$(\'#fav_float_tool_icon_' + idx + '\').show();" onmouseout="$(\'#fav_float_tool_icon_' + idx + '\').hide();"><div class="invisible cmt_tool_icon" id="fav_float_tool_icon_' + idx + '"><img title="' + resp.data[key]['pos_rank'] + chrome.i18n.getMessage('x_likes') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/like.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/like_gr.ico\')" onclick="rankup_cmt(' + resp.data[key]['id'] + ');" src="imgs/like_gr.ico" />&nbsp;<img title="' + resp.data[key]['neg_rank'] + chrome.i18n.getMessage('x_dislikes') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/dislike.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/dislike_gr.ico\')" onclick="rankdown_cmt(' + resp.data[key]['id'] + ');" src="imgs/dislike_gr.ico" />&nbsp;<img title="' + resp.data[key]['fav_cnt'] + chrome.i18n.getMessage('cancel_favourite') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/del.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/del_gr.ico\')" onclick="del_fav_cmt(' + resp.data[key]['id'] + ');" src="imgs/del_gr.ico" />&nbsp;<br /><img title="' + chrome.i18n.getMessage('share_to_sina') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/sina_t.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/sina_t_gr.ico\')" onclick="chrome.tabs.create({url: \'http://v.t.sina.com.cn/share/share.php?title='+ resp.data[key]['cmt'] + '%20|%20' + resp.data[key]['url'] + '%20|%20' + usrname +'%20|%20' + chrome.i18n.getMessage('urlcmt_short') + '(urlcmt)\'});" src="imgs/sina_t_gr.ico" />&nbsp;<img title="' + chrome.i18n.getMessage('copy_share_cnt') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/click_brd.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/click_brd_gr.ico\')" onclick="copy_to_clipboard(\''+ resp.data[key]['cmt'] + ' | ' + resp.data[key]['url'] + ' | ' + usrname +' | ' + chrome.i18n.getMessage('urlcmt_short') + '(urlcmt)\');" src="imgs/click_brd_gr.ico" /></div><div class="ui-widget-content ui-corner-all"><table style="width: 100%"><tbody><tr><td><img class="cmt_avatar" src="' + gvt_img_path + '" />' + usrname + '<br /><a href="#" onclick="chrome.tabs.create({url: \''+ resp.data[key]['url'] +'\'});">' + resp.data[key]['title'] + '</a><br />' + resp.data[key]['cmt'] + '</td></tr><tr><td><font class="font_8px colo_aaa">' + get_time_status_txt(resp.data[key]['insert_time'], resp.svr_time) + chrome.i18n.getMessage('come_from')  + resp.data[key]['ip_addr'] + '(' + resp.data[key]['gsd'] + ')' + ' </font></td></tr></tbody></table></div></div>';
            idx ++;
        }

        if (htmltxt.length == 0) {
            set_html_and_adjust_ht('my_fav_div', '<div style="text-align: center;height: 30px; padding: 15px 0px 0px 0px;">' + chrome.i18n.getMessage('no_favourites') + '</div>', 500);
            return false;
        }

        set_html_and_adjust_ht('my_fav_div', htmltxt + '<div id="fav_pagination" class="pagination"></div>' + "\n", 500);
        g_tab_4_reinit_navi = true;
        $("#fav_pagination").pagination(resp.found, {
            prev_text: chrome.i18n.getMessage('pagnav_prev'),
            next_text: chrome.i18n.getMessage('pagnav_next'),
            num_edge_entries: 1,
            num_display_entries: 3,
            callback: cb_tab_4_page_sel,
            items_per_page: g_bgpg.g_my_fav_page_size,
            current_page: g_bgpg.g_my_fav_page_no - 1
        });

        return true;
    });
}

function on_tab_5_focus()
{
    return g_bgpg.get_top_cmt(-1, function(resp) {
        if (! resp || resp.result != 0) {
            set_html_and_adjust_ht('top_cmt_div', chrome.i18n.getMessage('get_cmt_fail'), 500);
            return false;
        }

        var idx = 0;
        var htmltxt = '';
        for (var key in resp.data) {
            var usrname = chrome.i18n.getMessage('anonymous_usr');
            if (resp.data[key]['usr_id'] != 11) {
                usrname = resp.data[key]['email'];
            }
            gvt_img_path = 'http://www.gravatar.com/avatar/' + $.md5(jQuery.trim(resp.data[key]['email']).toLowerCase()) + '?s=40';
            htmltxt += '<div style="margin: 0 0 3px 0;" onmouseover="position_top_adj(\'#top_float_tool_icon_' + idx + '\', $(this).position().top);$(\'#top_float_tool_icon_' + idx + '\').show();" onmouseout="$(\'#top_float_tool_icon_' + idx + '\').hide();"><div class="invisible cmt_tool_icon" id="top_float_tool_icon_' + idx + '"><img title="' + resp.data[key]['pos_rank'] + chrome.i18n.getMessage('x_likes') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/like.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/like_gr.ico\')" onclick="rankup_cmt(' + resp.data[key]['id'] + ');" src="imgs/like_gr.ico" />&nbsp;<img title="' + resp.data[key]['neg_rank'] + chrome.i18n.getMessage('x_dislikes') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/dislike.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/dislike_gr.ico\')" onclick="rankdown_cmt(' + resp.data[key]['id'] + ');" src="imgs/dislike_gr.ico" />&nbsp;';
            if (resp.data[key]['fav']) {
                htmltxt += '<img title="' + resp.data[key]['fav_cnt'] + chrome.i18n.getMessage('cancel_favourite') + '" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/fav_gr.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/fav.ico\')" onclick="del_fav_cmt(' + resp.data[key]['id'] + ');" src="imgs/fav.ico" />';
            }
            else {
                htmltxt += '<img title="' + resp.data[key]['fav_cnt'] + chrome.i18n.getMessage('add_favourite') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/fav.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/fav_gr.ico\')" onclick="add_fav_cmt(' + resp.data[key]['id'] + ');" src="imgs/fav_gr.ico" />';
            }
            htmltxt += '&nbsp;<br /><img title="' + chrome.i18n.getMessage('share_to_sina') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/sina_t.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/sina_t_gr.ico\')" onclick="chrome.tabs.create({url: \'http://v.t.sina.com.cn/share/share.php?title='+ resp.data[key]['cmt'] + '%20|%20' + resp.data[key]['url'] + '%20|%20' + usrname +'%20|%20' + chrome.i18n.getMessage('urlcmt_short') + '(urlcmt)\'});" src="imgs/sina_t_gr.ico" />&nbsp;<img title="' + chrome.i18n.getMessage('copy_share_cnt') + '" class="opacity_40" onmouseover="on_cmt_tool_icon_mover(this, \'imgs/click_brd.ico\')" onmouseout="on_cmt_tool_icon_mout(this, \'imgs/click_brd_gr.ico\')" onclick="copy_to_clipboard(\''+ resp.data[key]['cmt'] + ' | ' + resp.data[key]['url'] + ' | ' + usrname +' | ' + chrome.i18n.getMessage('urlcmt_short') + '(urlcmt)\');" src="imgs/click_brd_gr.ico" /></div><div class="ui-widget-content ui-corner-all"><table style="width: 100%"><tbody><tr><td><img class="cmt_avatar" src="' + gvt_img_path + '" />' + usrname + '<br /><a href="#" onclick="chrome.tabs.create({url: \''+ resp.data[key]['url'] +'\'});">' + resp.data[key]['title'] + '</a><br />' + resp.data[key]['cmt'] + '</td></tr><tr><td><font class="font_8px colo_aaa">' + get_time_status_txt(resp.data[key]['insert_time'], resp.svr_time) + chrome.i18n.getMessage('come_from')  + resp.data[key]['ip_addr'] + '(' + resp.data[key]['gsd'] + ')' + ' </font></td></tr></tbody></table></div></div>';
            idx ++;
        }

        if (htmltxt.length == 0) {
            set_html_and_adjust_ht('top_cmt_div', '<div style="text-align: center;height: 50px;">' + chrome.i18n.getMessage('no_top_comments') + '</div>', 500);
            return false;
        }

        set_html_and_adjust_ht('top_cmt_div', htmltxt + '<div id="top_pagination" class="pagination"></div>' + "\n", 500);
        g_tab_5_reinit_navi = true;
        $("#top_pagination").pagination(resp.found, {
            prev_text: chrome.i18n.getMessage('pagnav_prev'),
            next_text: chrome.i18n.getMessage('pagnav_next'),
            num_edge_entries: 1,
            num_display_entries: 3,
            callback: cb_tab_5_page_sel,
            items_per_page: g_bgpg.g_top_cmt_page_size,
            current_page: g_bgpg.g_top_cmt_page_no - 1
        });

        return true;
    });
}

function on_tab_switch(tab_idx)
{
    g_bgpg.g_last_active_tab_idx = tab_idx;

    switch (tab_idx)
    {
    case 0:
        on_tab_1_focus();
        break;
    case 1:
        on_tab_2_focus();
        break;
    case 2:
        on_tab_3_focus();
        break;
    case 3:
        on_tab_4_focus();
        break;
    case 4:
        on_tab_5_focus();
        break;
    default:
        alert('Error tab no: ' + tab_idx);
        break;
    }
}

function on_cmt_sbmt()
{
    if ( $('textarea#cmt_cnt').val() == '') {
        $('textarea#cmt_cnt').focus();
        return false;
    }

    $('input#cmt_sbmt_btn').button('disable');
    chrome.tabs.getSelected(null, function(tab) {
        if (! is_url_valid(tab.url)) {
            show_floatmsg(chrome.i18n.getMessage('does_not_sup_url'), 3);
            $('input#cmt_sbmt_btn').button('enable');
            return false;
        }

        $.post(g_api_addr,
            { cmd: '1501',
            alt: 'json',
            auth: g_bgpg.g_global_auth,
            url: encodeURIComponent(tab.url),
            title: tab.title,
            cmt: encodeURIComponent($('textarea#cmt_cnt').val())},
            function(data){
                var resp = JSON.parse(data);
                if (! resp) {
                    show_floatmsg(chrome.i18n.getMessage('comment_fail'), 3);
                    $('input#cmt_sbmt_btn').button('enable');
                    return false;
                }

                if (resp.result == 1504) {
                    show_floatmsg(chrome.i18n.getMessage('comment_too_long'), 3);
                    $('input#cmt_sbmt_btn').button('enable');
                    return false;
                }

                if (resp.result != 0) {
                    show_floatmsg(chrome.i18n.getMessage('comment_error') + resp.result, 3);
                    $('input#cmt_sbmt_btn').button('enable');
                    return false;
                }

                g_bgpg.on_cmt_ifo_change();
                show_floatmsg(chrome.i18n.getMessage('comment_success'), 3);
                hide_sbmt_form();
                $('input#cmt_sbmt_btn').button('enable');
                on_tab_1_focus();
            });
        });

    return true;
}

function hide_sbmt_form()
{
    $('input#cmt_sbmt_btn').hide();
    $('#char_left_inner').hide();
    $('textarea#cmt_cnt').attr('rows', 1);
    $('textarea#cmt_cnt').text(chrome.i18n.getMessage('click_to_write_cmt'));
    $('textarea#cmt_cnt').css( { 'color': '#AAA' } );
    $('textarea#cmt_cnt').blur();
}

function show_sbmt_form()
{
    $('textarea#cmt_cnt').attr('rows', 3);
    if ($('textarea#cmt_cnt').text() == chrome.i18n.getMessage('click_to_write_cmt')) {
        $('textarea#cmt_cnt').text('');
    }
    $('textarea#cmt_cnt').css( { 'color': '#000' } );
    $('textarea#cmt_cnt').keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            on_cmt_sbmt();
        }
    });
    adjust_left_char_cnt();
    $('#char_left_inner').show();
    $('input#cmt_sbmt_btn').show();
}

function adjust_left_char_cnt()
{
    var cnt_len = $('textarea#cmt_cnt').val().length;
    var max_len = $('textarea#cmt_cnt').attr('maxlength');
    if (cnt_len > max_len) {
        $('textarea#cmt_cnt').val($('textarea#cmt_cnt').val().substring(0, max_len));
        //$('#char_left_inner').html('还可以输入 <font style="color:#333333; font-family:Constantia,Georgia; font-size:16px; font-weight:bold;" id="cmt_cnt_left_cnt">' + (400 - cnt_len) + '</font> 字');
    }
    else {
        $('#char_left_inner').html('还可以输入 <font style="color:#333333; font-family:Constantia,Georgia; font-size:16px; font-weight:bold;" id="cmt_cnt_left_cnt">' + (max_len - cnt_len) + '</font> 字');
    }
}

function init()
{
    /// init DOM
    $('#a_tabs-1').text(chrome.i18n.getMessage('tab_title_page_cmt'));
    $('#a_tabs-2').text(chrome.i18n.getMessage('tab_title_my_cmt'));
    $('#a_tabs-3').text(chrome.i18n.getMessage('tab_title_my_sites'));
    $('#a_tabs-4').text(chrome.i18n.getMessage('tab_title_my_fav'));
    $('#a_tabs-5').text(chrome.i18n.getMessage('tab_title_top_cmt'));
    $('#cmt_sbmt_btn').attr('value', chrome.i18n.getMessage('submit_btn_text'));
    $('#login_dialog').attr('title', chrome.i18n.getMessage('login_dialog_title'));
    $('#popmsg_dialog').attr('title', chrome.i18n.getMessage('login_dialog_title'));
    $('#login_dialog_tips').text(chrome.i18n.getMessage('login_dialog_tips'));
    $('#login_form_uname').text(chrome.i18n.getMessage('login_form_uname'));
    $('#login_form_passwd').text(chrome.i18n.getMessage('login_form_passwd'));

    $('div#float_msgdlg').hide();
    $('div#tabs').tabs({select: function(event, ui) { on_tab_switch(ui.index); } });
    $('div#login_dialog').hide();
    $('div#popmsg_dialog').hide();
    $('div#float_tooltip').hide();
    $('input#cmt_sbmt_btn').button();
    $('input#cmt_sbmt_btn').click(on_cmt_sbmt);
    $('textarea#cmt_cnt').focus(show_sbmt_form);
    $('textarea#cmt_cnt').keyup(adjust_left_char_cnt);
    hide_sbmt_form();

    /// init Global Variable
    g_bgpg = chrome.extension.getBackgroundPage();
    if (g_bgpg == null) {
        alert('Null background page.');
        return false;
    }

    /// init login info
    refresh_login_content();

    /// init comments
    $('div#tabs').tabs('select', g_bgpg.g_last_active_tab_idx);
    $('div#tabs').removeClass('ui-widget-content');
    switch (g_bgpg.g_last_active_tab_idx)
    {
    case 1:
        on_tab_2_focus();
        break;
    case 2:
        on_tab_2_focus();
        break;
    case 3:
        on_tab_3_focus();
        break;
    case 4:
        on_tab_4_focus();
        break;
    default:
        on_tab_1_focus();
        break;
    }
}
