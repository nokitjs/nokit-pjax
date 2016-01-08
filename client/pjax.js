/* global jQuery */
(function (owner, $, document, undefined) {

    owner.CONTAINER_PARAM = 'x-pjax-container';
    owner.ATTR_NAME = 'data-pjax-container';
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

    //绑定事件
    $(function () {
        $(document).on(owner.EVENT_NAME, '[' + owner.ATTR_NAME + ']', function (event) {
            var containers = $(this).attr('ATTR_NAME');
            if (!containers || containers.length < 1) {
                return false;
            }
            owner.request(containers, function (result) {
                owner.render(result);
            });
            return false;
        });
    });

})(window.pjax = window.pjax || {}, jQuery, document, undefined);