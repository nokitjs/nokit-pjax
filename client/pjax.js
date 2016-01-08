/* global jQuery */
(function (owner, $, window, document, undefined) {

    //检查是否支持 pushState
    if (!window.history.pushState) {
        return;
    }

    //定义 “常量”
    owner.CONTAINER_PARAM = 'x-pjax-container';
    owner.CONTAINER_ATTR_NAME = 'data-pjax-container';
    owner.URL_ATTR_NAME = "data-pjax-url";
    owner.EVENT_NAME = 'click';

    //请求
    owner.request = function (url, containers, callback) {
        var options = {
            "type": "GET",
            "url": url,
            "dataType": "json",
            "success": callback
        };
        options.headers = {};
        options.headers[owner.CONTAINER_PARAM] = containers;
        $.ajax(options);
    };

    //呈现
    owner.render = function (result) {
        owner.elements = owner.elements || {};
        for (var key in result) {
            owner.elements[key] = owner.elements[key] || $(key);
            owner.elements[key].html(result[key]);
        }
    };

    //更新地址和标题
    owner.pushState = function (url) {
        window.history.pushState({}, "", url);
    };

    //绑定事件
    $(function () {
        $(document).on(owner.EVENT_NAME, '[' + owner.CONTAINER_ATTR_NAME + ']', function (event) {
            var link = $(this);
            var url = link.attr(owner.URL_ATTR_NAME) || link.attr('href');
            var containers = link.attr(owner.CONTAINER_ATTR_NAME);
            if (!url || !containers || containers.length < 1) {
                return false;
            }
            owner.request(url, containers, function (result) {
                owner.render(result);
                owner.pushState(url);
            });
            return false;
        });
    });

})(window.pjax = window.pjax || {}, jQuery, window, document, undefined);