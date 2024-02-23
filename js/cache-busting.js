jQuery(document).ready(function () {
    //  ローカルテスト時は、--allow-file-access-from-files オプション付きのChromeでのみ動く。

    const _ua = navigator.userAgent.toLowerCase();
    const _isIE = (_ua.indexOf('trident') != -1 || _ua.indexOf('msie') != -1);
    if (_isIE) {
        const _parent = $('#mainContainer');
        _parent.empty();
        const _pJa = $('<p>').css({ 'text-align': 'center' });
        _pJa.text('Internet Explorerには対応していません。他の最新ブラウザをご利用ください。');
        _parent.append(_pJa);
        _parent.append($('<hr>'));
        const _pEn = $('<p>').css({ 'text-align': 'center' });
        _pEn.text('Unsupported. Please use a modern browser other than this Internet Explorer.');
        _parent.append(_pEn);
        _parent.css({ 'display': 'block' });
        return;
    }
    $.ajaxSetup({ cache: true });

    const _ts = $('#version').text();

    let _l = $('<link>').attr({ 'rel': 'stylesheet', 'href': 'css/main.css?' + _ts });
    $('head').append(_l);
    let _s1 = $('<script>').attr({ 'type': 'text/javascript', 'src': 'js/listupIdea.js?' + _ts });
    $('head').append(_s1);

    $('#_CACHE_BUSTER_').remove();

    $.ajaxSetup({ cache: false });
});