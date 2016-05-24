var cheerio = require("cheerio");

var CONTAINER_PARAM = 'x-pjax-container';

/**
 * PjaxFilter
 **/
var PjaxFilter = function (server) {
    var self = this;
    self.configs = server.configs.pjax || {};
};

/**
 * 在发送响应时
 **/
PjaxFilter.prototype.onResponse = function (context, next) {
    var self = this;
    //检查参数
    var containers = context.param(CONTAINER_PARAM) ||
        context.request.headers[CONTAINER_PARAM];
    if (!containers || containers.length < 1) {
        return next();
    }
    //重置重定向动作
    if (self.configs.redirect &&
        [301, 302, 307].indexOf(context.response.statusCode) > -1) {
        context.response.statusCode = 200;
        return context.json({
            __location__: context.response.getHeader('Location')
        });
    }
    //检查 statusCode & mime
    var htmlMime = context.server.mime('.html');
    if (context.response.statusCode != 200 ||
        context.response.mime != htmlMime ||
        !context.response.contentStream) {
        return next();
    }
    //处理内容
    var buffer = '';
    context.response.contentStream.on('data', function (chunk) {
        buffer += chunk;
    });
    context.response.contentStream.on('end', function () {
        buffer = buffer.toString();
        var $ = cheerio.load(buffer, { decodeEntities: false });
        containers = containers.split(',');
        containers.push('title');
        var result = {};
        containers.forEach(function (selector) {
            result[selector] = $(selector).html();
        });
        context.json(result);
    });
};

//exports
module.exports = PjaxFilter;