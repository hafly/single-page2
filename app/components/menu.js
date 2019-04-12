/**
 * 目录
 */
define('menu', ['jquery', 'metisMenu', 'router'], function ($, metisMenu, Router) {
    var Menu = function (options) {
        var defaults = {
            defaultMenu: 'dashboard1',   // 默认激活页面
            container: '#metismenu',     // 目录父id
            toggle: true,
        };
        this.iconOpen = 'M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z';
        this.iconClose = 'M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 0 0 0 13.8z';

        this.settings = $.extend({}, defaults, options);
        this.init();
        this.bindEvent();
    };
    Menu.prototype = {
        init: function () {
            var self = this;
            $('.menu-fold').find('svg path').attr('d', self.iconOpen);
            $.get('json/menu.json', function (data) {
                self.buildMenu(data);
            });
        },

        // 动态构建目录
        buildMenu: function (data) {
            var self = this;
            var menuData = {};
            var html = '';
            $.each(data, function (index, menu) {
                if (menu.status == 0) return;
                if (menu.hash) menuData[menu.hash] = menu.url;
                var href = '#' + menu.hash;
                var arrow = (menu.children.length == 0) ? '' : 'has-arrow';

                var parent = '<li><a class="' + arrow + '" href="' + href + '"><i class="fa ' + menu.icon + '"></i><span>' + menu.name + '</span></a></li>';
                var $parent = $(parent);
                // 二级目录
                if (menu.children.length > 0) {
                    var $ul = $('<ul></ul>');
                    var li = '';
                    $.each(menu.children, function (idx, submenu) {
                        if (submenu.status == 0) return;
                        if (submenu.hash) menuData[submenu.hash] = submenu.url;
                        var href = '#' + submenu.hash;
                        li += '<li><a href="' + href + '">' + submenu.name + '</a></li>';
                    });
                    $ul.append(li);
                    $($parent).append($ul);
                }
                html += $parent[0].outerHTML;
            });
            $(self.settings.container).html(html).metisMenu({toggle: self.settings.container});
            $.menuData = menuData;

            var hash = location.hash.slice(1) || self.settings.defaultMenu;
            $(self.settings.container).find('a[href="#' + hash + '"]').addClass('active').parent('li').parents('li').children('a.has-arrow').click();

            var router = new Router({hash: hash});
            router.refresh();
        },

        fold: function (fold) {
            var self = this;
            var $menu = $('.menu-fold');
            if (fold) {
                $menu.find('svg path').attr('d', self.iconOpen);
                $('#layout-left').addClass('ant-layout-sider-collapsed').css('width', '80px');
                $('#layout-right').css('padding-left', '80px');
            }
            else {
                $menu.find('svg path').attr('d', self.iconClose);
                $('#layout-left').removeClass('ant-layout-sider-collapsed').css('width', '256px');
                $('#layout-right').css('padding-left', '256px');
            }
        },

        bindEvent: function () {
            var self = this;
            var $menu = $(self.settings.container);
            $menu.delegate('li>a:not(.has-arrow)', 'click', function () {
                $menu.find('li>a').removeClass('active');
                $(this).addClass('active');
            });

            // 菜单缩放
            $('.menu-fold').click(function () {
                if (!$('#layout-left').hasClass('ant-layout-sider-collapsed')) {
                    self.fold(true);
                }
                else {
                    self.fold(false);
                }
            });

            // 自适应
            $(window).resize(function () {
                var width = $(window).width();
                if (width < 768) {
                    self.fold(true);
                }
                else {
                    self.fold(false);
                }
            });
        }
    };

    new Menu();
});