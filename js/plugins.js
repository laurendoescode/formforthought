// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
$.fn.infiniteCarousel = function(config){
    config = $.extend({
        itemsPerMove : 2,
        duration : 1000,
        vertical : false
    },config);

    var viewportEl = this.find('.viewport'), listEl = viewportEl.find('.list');
    var first = listEl.children(":first"), last = listEl.children(":last");
    
    var distance, prevProp, nextProp;
    if(config.vertical){
        distance = Math.max(first.outerHeight(true),last.outerHeight(true)) * config.itemsPerMove;
        prevProp = { 'scrollTop' : "-=" + distance };
        nextProp = { 'scrollTop' : distance }; 
    }else{
        distance = Math.max(first.outerWidth(true),last.outerWidth(true)) * config.itemsPerMove;
        prevProp = { 'scrollLeft' : "-=" + distance };
        nextProp = { 'scrollLeft' : '+=' + distance };
    }

    function move(config) {
        if (config.dir === 'next') {
            viewportEl.stop().animate(nextProp,{
                duration : config.duration,
                complete : function() {
                    config.vertical ? viewportEl.scrollTop(0) : viewportEl.scrollLeft(0);
                    repeatRun(function(){
                        listEl.children(":last").after(listEl.children(":first"));
                    },config.itemsPerMove);
                }
            });
        }

        if (config.dir === 'pre') {
            for(var i = 0; i < config.itemsPerMove; i++){
                listEl.prepend(listEl.children(":last"));
            }
            viewportEl[config.vertical ? 'scrollTop' : 'scrollLeft'](distance)
            .stop().animate(prevProp, {
                duration : config.duration
            });
        }
    }

    function repeatRun(func,times){
        for(var i = 0; i < times; i++){
            func();
        }
    }

    setInterval(function() {
        move($.extend(config,{
            dir: 'pre'
        }));
    }, 1000);

    return this;
};