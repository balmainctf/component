
'use strict';

;(function(root, factory){
  if(typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);  // register as module
  } else {
    root.touch = factory();
  }
})(typeof window !== 'undefined' ? window : this, function(){

  var __onEvents = {},
      __cnt = 0, // evnet counter

      string_str = 'string',
      function_str = 'function',

      hasOwnKey = Function.call.bind(Object.hasOwnProperty),
      slice = Function.call.bind(Array.prototype.slice);

  function _each(obj, callback) {
    for (var key in obj) {
      if (hasOwnKey(obj, key)) callback(key, obj[key]);
    }
  }

  function _bind(element, eventName, callback, context) {
    if (typeof eventName !== string_str || typeof callback !== function_str) {
      throw new Error('args: '+string_str+', '+function_str+'');
    }
    if (! hasOwnKey(__onEvents, eventName)) {
      __onEvents[eventName] = {};
    }
    __onEvents[eventName][++__cnt] = [callback, context, element];

    return [eventName, __cnt];
  }

  function on(element, eventName, callback, context) {
    return _bind(element, eventName, callback, context);
  }

  function _trigger(eventName, args) {
    if (hasOwnKey(__onEvents, eventName)) {
      _each(__onEvents[eventName], function(key, item) {
        item[0].apply(item[1], args); // do the function
      });
    }
  }

  function trigger(eventName) {
    // fire events
    var args = slice(arguments, 1);
    setTimeout(function () {
      _trigger(eventName, args);
    });
  }

  function triggerSync(eventName) {
    _trigger(eventName, slice(arguments, 1));
  }

  function un(event) {
    var eventName, key, r = false, type = typeof event;
    if (type === string_str) {
      // cancel the event name if exist
      if (hasOwnKey(__onEvents, event)) {
        delete __onEvents[event];
        return true;
      }
      return false;
    }
    else if (type === 'object') {
      eventName = event[0];
      key = event[1];
      if (hasOwnKey(__onEvents, eventName) && hasOwnKey(__onEvents[eventName], key)) {
        delete __onEvents[eventName][key];
        return true;
      }
      // can not find this event, return false
      return false;
    }
    else if (type === function_str) {
      _each(__onEvents, function(key_1, item_1) {
        _each(item_1, function(key_2, item_2) {
          if (item_2[0] === event) {
            delete __onEvents[key_1][key_2];
            r = true;
          }
        });
      });
      return r;
    }
    return true;
  }

  function clear() {
    __onEvents = {};
  }

  let instance = {
    on: on,
    un: un,
    trigger: trigger,
    triggerSync: triggerSync,
    clear: clear
  };

  return instance;

});
