/**
 * PAjaxFilter
 **/
var PAjaxFilter = function () { };

/**
 * 在请求发生异常时
 **/
PAjaxFilter.prototype.onError = function (context, next) {
    next();
};

/**
 * 在请求到达时
 **/
PAjaxFilter.prototype.onRequest = function (context, next) {
    next();
};

/**
 * 在收到请求数据时
 **/
PAjaxFilter.prototype.onReceived = function (context, next) {
    next();
};

/**
 * 在发送响应时
 **/
PAjaxFilter.prototype.onResponse = function (context, next) {
    next();
};

//exports
module.exports = PAjaxFilter;