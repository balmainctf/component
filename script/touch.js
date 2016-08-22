
;(function(window, document){

  function Touch(element) {

    if(element.nodeType !== 1) throw new Error('argument need element.');

    let ele = ele || [];        // 触摸元素集合
    let evCon = evCon || [];  // 事件集合

    ele.push(element);


    function addEventHandler(element, type, handler){
      if(element.addEventListener) {
        element.addEventListener(type, handler, false);
      }else if(element.attachEvent) {
        element.attachEvent('on' + type, handler);
      }else {
        element['on' + type] = handler;
      }
    }

    function dalegateEventHandler(parElement, chilElementNodename, type, handler){
      addEventHandler(parElement, type, function(ev){
        var target = ev.target || ev.srcElement;
        if(target.nodeName.toLowerCase() === chilElementNodename.toLowerCase()) {
          handler(target);
        }
      });
    }

    function on(type, callback) {
      if(arguments.length < 2) throw new Error('need two arguments');
      evCon.push({name : type, handler : callback});
    }

    function _emitEvent(type, ev) {

      for(let i = 0, len = evCon.length; i < len; i++) {
        if(evCon[i].name !== type) continue;

        let ret = typeof evCon[i].handler === 'function' ?
          evCon[i].handler.apply(this) : true;
      }

      // ret !== false ? close() : '';
    }


    function tap() {
      _emitEvent('tap', ev);
      // _getTime() {
    	//   return new Date().getTime();
    	// }
    	// _onTouchStart(e) {
    	//     //记录touch开始的位置
    	//     this.startX = e.touches[0].pageX;
    	//     this.startY = e.touches[0].pageY;
    	//     if(e.touches.length > 1) {
    	//       //多点监测
    	//       ...
    	//     }else {
    	//       //记录touch开始的时间
    	//       this.startTime = this._getTime();
    	//     }
    	//  }
    	// _onTouchMove(e) {
    	//   ...
    	//   //记录手指移动的位置
    	//   this.moveX = e.touches[0].pageX;
    	//   this.moveY = e.touches[0].pageY;
    	//   ...
    	// }
    	// _onTouchEnd(e) {
    	//   let timestamp = this._getTime();
    	//   if(this.moveX !== null && Math.abs(this.moveX - this.startX) > 10 ||
    	//     this.moveY !== null && Math.abs(this.moveY - this.startY) > 10) {
    	//       ...
    	//   }else {
    	//     //手指移动的位移要小于10像素并且手指和屏幕的接触时间要短语500毫秒
    	//     if(timestamp - this.startTime < 500) {
    	//       this._emitEvent('onTap')
    	//     }
    	//   }
    	// }
    }


    let instance = {
      tap : tap,
      on : on,
    }

    return instance;
  }


  // 模块加载方式
  if(typeof module !== 'undefined' && typeof exports === 'object'
    && define.cmd) {
      module.exports = Touch;
  } else if (typeof define === 'function' && define.amd) {
    define(() => {
      return Touch;
    });
  } else {
    window.Touch = Touch;
  }

})(window, document);
