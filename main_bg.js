var g_api_addr = 'http://api.gdfans.net/';

var g_global_email = '';
var g_global_passwd = '';
var g_global_auth = '';

var g_usr_cmt_cnt = 0;
var g_usr_url_cnt = 0;
var g_usr_fav_cnt = 0;

var g_url_cmt_page_no = 1;
var g_url_cmt_page_size = 5;
var g_my_cmt_page_no = 1;
var g_my_cmt_page_size = 5;
var g_my_site_page_no = 1;
var g_my_site_page_size = 15;
var g_my_fav_page_no = 1;
var g_my_fav_page_size = 5;
var g_top_cmt_page_no = 1;
var g_top_cmt_page_size = 5;

var g_last_active_tab_idx = 0;

function get_url_cmt(page_no, on_data_fun)
{
    if (page_no == -1) {
        page_no = g_url_cmt_page_no;
    }

    chrome.tabs.getSelected(null, function(tab) {
        $.post(g_api_addr,
            { cmd: '1505',
            alt: 'json',
            auth: g_global_auth,
            url: encodeURIComponent(tab.url),
            page_size: g_url_cmt_page_size,
            page_no: page_no },
            function(data){
                g_url_cmt_page_no = page_no;
                on_data_fun(JSON.parse(data));
            });
        }
    );

    return true;
}

function get_my_cmt(page_no, on_data_fun)
{
    if (! g_global_auth || g_global_auth.length <= 0) {
        return false;
    }

    if (page_no == -1) {
        page_no = g_my_cmt_page_no;
    }

    chrome.tabs.getSelected(null, function(tab) {
        $.post(g_api_addr,
            { cmd: '1504',
            alt: 'json',
            auth: g_global_auth,
            url: encodeURIComponent(tab.url),
            page_size: g_my_cmt_page_size,
            page_no: page_no},
            function(data){
                g_my_cmt_page_no = page_no;
                on_data_fun(JSON.parse(data));
            });
        });

    return true;
}

function get_my_site(page_no, on_data_fun)
{
    if (! g_global_auth || g_global_auth.length <= 0) {
        return false;
    }

    if (page_no == -1) {
        page_no = g_my_site_page_no;
    }

    $.post(g_api_addr,
        { cmd: '1509',
        alt: 'json',
        auth: g_global_auth,
        page_size: g_my_site_page_size,
        page_no: page_no},
        function(data){
            g_my_site_page_no = page_no;
            on_data_fun(JSON.parse(data));
        }
    );

    return true;
}

function get_my_fav(page_no, on_data_fun)
{
    if (! g_global_auth || g_global_auth.length <= 0) {
        return false;
    }

    if (page_no == -1) {
        page_no = g_my_fav_page_no;
    }

    $.post(g_api_addr,
        { cmd: '1512',
        alt: 'json',
        auth: g_global_auth,
        page_size: g_my_site_page_size,
        page_no: page_no},
        function(data){
            g_my_fav_page_no = page_no;
            on_data_fun(JSON.parse(data));
        }
    );

    return true;
}

function get_top_cmt(page_no, on_data_fun)
{
    if (page_no == -1) {
        page_no = g_top_cmt_page_no;
    }

    $.post(g_api_addr,
        { cmd: '1510',
        alt: 'json',
        auth: g_global_auth,
        page_size: g_top_cmt_page_size,
        page_no: page_no},
        function(data){
            g_top_cmt_page_no = page_no;
            on_data_fun(JSON.parse(data));
        }
    );

    return true;
}

function on_cmt_ifo_change()
{
    chrome.tabs.getSelected(null, function(tab) {
        $.post(g_api_addr,
            { cmd: '1505',
            alt: 'json',
            url: encodeURIComponent(tab.url),
            page_size: 1,
            page_no: 1},
            function(data){
                var htmltxt = "";
                var resp = JSON.parse(data);
                if ((! resp) || (resp.result == 1501) || (resp.result != 0)) {
                    chrome.browserAction.setBadgeText({text: ''});
                    chrome.browserAction.setBadgeBackgroundColor({color:[110, 140, 180, 255]});
                    return false;
                }

                if (resp.found == 0) {
                    chrome.browserAction.setBadgeText({text: ''});
                    chrome.browserAction.setBadgeBackgroundColor({color:[110, 140, 180, 255]});
                }
                else {
                    chrome.browserAction.setBadgeText({text: resp.found});
                    chrome.browserAction.setBadgeBackgroundColor({color:[86, 207, 27, 255]});
                }
            });
        });

    return true;
}

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    on_cmt_ifo_change();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.url) {
    on_cmt_ifo_change();
  }
});

function refresh_login_info()
{
    if (! g_global_auth || g_global_auth.length <= 0) {
        return false;
    }

    $.post(g_api_addr,
        { cmd: '1508',
        alt: 'json',
        auth: g_global_auth },
        function(data){
            var resp = JSON.parse(data);
            if (! resp) {
                show_popmsg('悲剧了，获取数据失败……', function() {});
                return false;
            }

            if (resp.result != 0) {
                show_popmsg("获取用户信息失败，返回值：" + resp.result, function() {});
                return false;
            }

            g_bgpg.g_usr_cmt_cnt = resp.usr_cmt_cnt;
            g_bgpg.g_usr_url_cnt = resp.usr_url_cnt;
            g_bgpg.g_usr_fav_cnt = resp.usr_fav_cnt;
            refresh_login_content();
        }
    );
}

function bg_init()
{
    g_global_email = localStorage['urlcmt_email'];
    g_global_auth = localStorage['urlcmt_auth'];
    if (g_global_auth && g_global_auth.length > 0) {
        $.post(g_api_addr,
            { cmd: '1508',
            alt: 'json',
            auth: g_global_auth },
            function(data){
                var resp = JSON.parse(data);
                if (! resp) {
                    return false;
                }

                if (resp.result != 0) {
                    return false;
                }

                g_usr_cmt_cnt = resp.usr_cmt_cnt;
                g_usr_url_cnt = resp.usr_url_cnt;
                g_usr_fav_cnt = resp.usr_fav_cnt;
            }
        );
    }
}
