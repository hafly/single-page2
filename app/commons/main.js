require(['jquery', 'bootstrap', 'Layer', 'appUtils', 'menu'], function () {
    // 下拉菜单
    $('.dropdown-toggle[data-toggle="dropdown2"]').parent().hover(function () {
        $(this).removeClass('closed').addClass('open');
    }, function () {
        $(this).removeClass('open').addClass('closed').one('animationend', function () {
            $(this).removeClass('closed');
        })
    });
});