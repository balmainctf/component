
function Touch(el) {
    if(el.nodeType){    //判断是否为DOM对象
        var clickPos = {};
        var dir = '';   //l,r,u,d,s
        var guid = 1;
        var eventHandles = {
            l: {},
            r: {},
            u: {},
            d: {},
            s: {}
        };
        var eventName = {
            swipeLeft: 'l',
            swipeRight: 'r',
            swipeUp: 'u',
            swipeDown: 'd',
            tap: 's'
        };

        function tan(x, y) {
            return Math.abs(y) / Math.abs(x)
        }

        function throwError() {
            throw new Error('event name is illegal.');
        }

        el.addEventListener('touchstart', function(e) {
            clickPos.x = e.targetTouches[0].clientX;
            clickPos.y = e.targetTouches[0].clientY;
        });
        el.addEventListener('touchend', function(e) {
            //判断方向
            var deltaX = e.changedTouches[0].clientX - clickPos.x;
            var deltaY = e.changedTouches[0].clientY - clickPos.y;
            var tangent = tan(deltaX, deltaY);
            if(deltaX > 20) {
                if(tangent < 1) {
                    dir = 'r';
                } else if(deltaY < -20) {
                    dir = 'u';
                } else {
                    dir = 'd';
                }
            } else if(deltaX < -20) {
                if(tangent < 1) {
                    dir = 'l';
                } else if(deltaY < -20) {
                    dir = 'u';
                } else {
                    dir = 'd';
                }
            } else if(deltaY > 20) {
                dir = 'd';
            } else if(deltaY < -20) {
                dir = 'u';
            } else {
                dir = 's';
            }

//                    console.log(dir);

            var list = Object.keys(eventHandles[dir]).sort();
            for(var i = 0; i < list.length; i ++){
                eventHandles[dir][list[i]](e);
            }
        });
        return {
            bind: function(event, fn) {
                var ename = eventName[event];
                if(ename) {
                    if(typeof fn.$$guid !== 'object') {
                        fn.$$guid = {};
                    }
                    if(!fn.$$guid[ename]) {
                        var inx = fn.$$guid[ename] = guid ++;
                        eventHandles[ename][inx] = fn;
                    }
                    return fn;
                } else {
                    throwError();
                }
            },
            unbind: function(event, fn) {
                var ename = eventName[event];
                if(ename) {
                    if(fn.$$guid[ename]) {
                        var inx = fn.$$guid[ename];
                        delete eventHandles[ename][inx];
                    }
                } else {
                    throwError();
                }
            },
            one: function(event, fn) {
                var _this = this;
                var tempfn = function(e) {
                    fn(e);
                    _this.unbind(event, tempfn);
                };
                _this.bind(event, tempfn);
            }
        }
    } else {
        return {}
    }
}
var touch = new Touch(document);
var fn = touch.bind('swipeLeft', function(){});
touch.unbind('swipeLeft', fn);
