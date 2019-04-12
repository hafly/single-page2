/**
 * 路由
 */
define('router', ['jquery', 'pjax', 'jqajax'], function () {
    function Router(options) {
        var defaults = {
            hash: '',            // 默认hash值
            container: '#page-wrapper', // 容器
            pushState: false,    // 改变地址栏url
        };
        this.settings = $.extend({}, defaults, options);
        this.init();
    }

    Router.prototype = {
        refresh: function () {
            var self = this;
            self.settings.hash = location.hash.slice(1) || self.settings.hash;
            var url = $.menuData[self.settings.hash];
            if (url) {
                $($.ajaxList).each(function () {
                    this.abort();
                });
                $.pjax({
                    type: 'get',
                    url: url,
                    container: self.settings.container,
                    push: self.settings.pushState
                });
            }
        },

        init: function () {
            window.addEventListener('hashchange', this.refresh.bind(this), false);
            // $(document).on('pjax:start', function () {
            //     layer.load();
            // });
            // $(document).on('pjax:complete', function () {
            //     layer.closeAll('loading');
            // });
        }
    };

    return Router;
});