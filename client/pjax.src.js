/* global NProgress */
/* global jQuery */
(function (owner, $, window, document, undefined, NProgress) {

    //检查是否支持 pushState
    if (!window.history.pushState) {
        return;
    }

    owner.progress = NProgress;

    //定义 “常量”
    owner.CONTAINER_PARAM = 'x-pjax-container';
    owner.CONTAINER_ATTR_NAME = 'data-pjax-container';
    owner.URL_ATTR_NAME = "data-pjax-url";
    owner.EVENT_NAME = 'click';
    owner.FORM_EVENT_NAME = 'submit';

    //设置
    //NProgress.configure({ showSpinner: false });
    //remark #009a61

    //包裹URL
    owner.wrapUrl = function (url) {
        if (!url) return url;
        var urlParts = url.split('#');
        var hash = urlParts[1];
        url = urlParts[0] + (url.indexOf('?') > -1 ? '&' : '?') + '__t=' + Date.now();
        return hash ? url + '#' + hash : url;
    };

    //请求
    owner.request = function (options, callback) {
        NProgress.start();
        options.type = options.type || "GET";
        options.dataType = "json";
        options._success = options.success;
        options.success = function (result) {
            if (result && result.__location__) {
                location.href = result.__location__;
            } else {
                if (callback) callback(result);
                if (options._success) options._success(result);
            }
        };
        options.progress = function (event) {
            if (event.lengthComputable) {
                var pct = event.loaded / event.total;
                NProgress.set(pct);
            }
        };
        options.headers = options.headers || {};
        options.headers[owner.CONTAINER_PARAM] = options.containers;
        var oldUrl = options.url;
        options.url = owner.wrapUrl(options.url);
        $.ajax(options);
        options.url = oldUrl;
        return owner;
    };

    //呈现
    owner.render = function (result) {
        owner.elements = owner.elements || {};
        if (!result) return owner;
        //更新标题
        if (result.title !== null && result.title !== undefined) {
            document.title = result.title;
        }
        //更新容器内容
        for (var key in result) {
            if (key != 'title' && result[key] !== null && result[key] !== undefined) {
                owner.elements[key] = owner.elements[key] || $(key);
                owner.elements[key].html(result[key]);
            }
        }
        NProgress.done();
        return owner;
    };

    //更新地址和标题
    owner.pushState = function (url, result) {
        result = result || {};
        window.history.pushState(result, result.title, url);
        return owner;
    };

    //提交
    owner.submit = function (options, callback) {
        owner.request(options, function (result) {
            owner.render(result);
            owner.pushState(options.url, result);
            var hash = options.url.split('#')[1];
            if (hash) {
                location.href = '#' + hash;
            } else {
                document.body.scrollTop = 0;
                document.body.scrollLeft = 0;
            }
            if (callback) callback();
        });
        return owner;
    };

    //绑定事件
    $(function () {
        //链接处理
        $(document).on(owner.EVENT_NAME,
            '[' + owner.CONTAINER_ATTR_NAME + ']',
            function (event) {
                var link = $(this);
                var url = link.attr(owner.URL_ATTR_NAME) || link.attr('href');
                var containers = link.attr(owner.CONTAINER_ATTR_NAME);
                if (!url || !containers || containers.length < 1) {
                    return;
                }
                owner.submit({
                    "url": url,
                    "containers": containers
                });
                event.preventDefault();
            });

        //表单处理
        $(document).on(owner.FORM_EVENT_NAME,
            'form[' + owner.CONTAINER_ATTR_NAME + ']',
            function (event) {
                if (typeof FormData == 'undefined') {
                    return;
                }
                var form = $(this);
                var url = form.attr('action') || location.href;
                var containers = form.attr(owner.CONTAINER_ATTR_NAME);
                var method = form.attr('method') || 'POST';
                if (!url || !containers || containers.length < 1) {
                    return;
                }
                var formData = new FormData(this);
                owner.submit({
                    "url": url,
                    "type": method,
                    "containers": containers,
                    "data": formData,
                    "processData": false,
                    "contentType": false
                });
                event.preventDefault();
            });

        //state 改变事件
        $(window).on('popstate', function (event) {
            //location.replace(location.href)
            owner.render(window.history.state);
        });
    });

})(window.pjax = window.pjax || {}, jQuery, window, document, undefined, NProgress);