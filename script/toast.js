;(function(window, document) {

	let ins = [];		// 实例化集合

  function Toast(options = {}) {

    let eleCon = {},    // dom集合
        isExit = false,
				timeoutId;

    // 默认配置
    let defaultsOptions = {

      // html结构
      outerHTML:
       `<div class="toast_backdrop"></div>
        <div class="toast_wrapper">
          <div class="toast_container">
						已完成
          </div>
        </div>`,

			lodingHTMl :
			 `<div class="bk_loading">
            <div class="loading_leaf loading_leaf_0"></div>
            <div class="loading_leaf loading_leaf_1"></div>
            <div class="loading_leaf loading_leaf_2"></div>
            <div class="loading_leaf loading_leaf_3"></div>
            <div class="loading_leaf loading_leaf_4"></div>
            <div class="loading_leaf loading_leaf_5"></div>
            <div class="loading_leaf loading_leaf_6"></div>
            <div class="loading_leaf loading_leaf_7"></div>
            <div class="loading_leaf loading_leaf_8"></div>
            <div class="loading_leaf loading_leaf_9"></div>
            <div class="loading_leaf loading_leaf_10"></div>
            <div class="loading_leaf loading_leaf_11"></div>
        </div>`,
      // 插入内容或dom节点
      // "<div></div>" || document.getElementById("content")
      content : "已完成",

			loding : false,

			autoRender : false,

      //内容区域高度， 可以取 数值(320) || "auto"
      height : 'auto',

      // 显示事件 以 ms毫秒 计时
      showTime : 2000,

      //点击遮罩时是否关闭面板
      closeOnMaskClicked : false,

      //遮罩被点击时的句柄
      onMaskClick(){},

			// 初始化
			onInit(){},

			// 渲染页面回调
			onRender(){},

			// 移除dom回调
			onDestory(){},

			// 打开时回调
			onOpen(){},

			// 关闭时回调
			onClose(){},

      // 渲染父节点
      renderTo : document.body,
    }

    options = extend(defaultsOptions, options);

    // 初始化结构
    function init() {
      if(isExit) return false;

			// 初始化回调
			options.onInit && options.onInit();

      // 加载html
      let ele = document.createElement('div');
			eleCon.toast_maxwrap = ele;
      ele.innerHTML = options.outerHTML;

      // 加载content
      let con_wrap = ele.querySelector('.toast_container');
			if(options.loding === true) {
				con_wrap.innerHTML = options.lodingHTMl;
				options.height = 100;
			}else {
				if(options.content.nodeType === 1) {
					con_wrap.innerHTML = '';
	        con_wrap.appendChild(options.content);
	      } else {
	        con_wrap.innerHTML = options.content;
	      }
			}

			// 设置content高度
      con_wrap.style.height = options.height === 'auto' ?
        'auto' : options.height + 'px';

      // 设置外部容器
      ele.style.display = 'none';
      ele.className = 'toast_maxwrap';

      // 添加到文档
      if(options.renderTo.nodeType === 1) {
        options.renderTo.appendChild(ele);
      }else {
        document.getElementsByTagName('body')[0].appendChild(ele);
      }

			// 渲染回调
			options.onRender && options.onRender();

      isExit = true;
    };

    function initElecon() {
      if(!isExit) return false;
			let ele = eleCon.toast_maxwrap;
			eleCon.toast_backdrop = ele.querySelector('.toast_backdrop');
			eleCon.toast_wrapper = ele.querySelector('.toast_wrapper');
			eleCon.toast_container = ele.querySelector('.toast_container');
    };

    function bindListener() {
      if(!isExit) return false;

      // 点击背景快速关闭
      addEventHandler(eleCon.toast_backdrop, 'touchstart', (ev) => {
        let ret = typeof options.onMaskClick === 'function' ?
          options.onMaskClick.apply(this, arguments) : true;
        if(options.closeOnMaskClicked) {
          ret !== false ? close() : '';
        }
				stopDefault(ev);
      });

			addEventHandler(eleCon.toast_maxwrap, 'touchmove', (ev) => {
				stopDefault(ev);
			});

			// addEventHandler(eleCon.toast_container, 'touchstart', (ev) => {
			// 	stopDefault(ev);
			// });
			//
			// addEventHandler(eleCon.toast_container, 'touchmove', (ev) => {
			// 	stopDefault(ev);
			// });
    };

    function setContent(content = '') {
      if(!isExit || content === '') return false;
      options.content = content;
      if(content.nodeType === 1) {
				eleCon.toast_container.innerHTML = '';
				eleCon.toast_container.appendChild(content);
      } else {
				eleCon.toast_container.innerHTML = content;
      }
    }

    function getContentEle() {
      if(!isExit) return false;

      return eleCon.toast_container;
    }

    function open() {
      if(!isExit) {
        init();
        initElecon();
        bindListener();
      }
      for(var i=0,len=ins.length;i<len;i++){
				ins[i] !== this ? ins[i].close() : '';
      }
      eleCon.toast_maxwrap.style.display = 'block';
			if(options.loding !== true) {
				timeoutId = setTimeout(function(){
					close();
				}, options.showTime);
			}


			options.onOpen && options.onOpen();
    }

    function close() {
      if(!isExit) return false;
      eleCon.toast_maxwrap.style.display = 'none';

			options.onClose && options.onClose();
    }

    function destory() {
      if(!isExit) return false;

      let parentElement = eleCon.toast_maxwrap.parentNode;
      parentElement.removeChild(eleCon.toast_maxwrap);

			// 移除dom回调
			options.onDestory && options.onDestory();

      isExit = false;
    }

    /**
     * 工具函数
     */
    function extend(my = {}, old = {}, bOverwrite = false) {
      for(let key in old) {
        if(old.hasOwnProperty(key)) {
          if(typeof(my[key]) != 'undefined' && bOverwrite){ continue; }
          my[key] = old[key];
        }
      }
      return my;
    }

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

    function removeClass(element, strClass){
      var reg = new RegExp("(?:^| )" + strClass + "(?: |$)", "g");
      element.className = element.className.replace(reg, ' ').trim();
    }

    function addClass(element, strClass){
      if( element.className.indexOf(strClass) ===  -1) {
        element.className = element.className.trim() + ' ' + strClass;
      }
    }

		function stopDefault(event) {
			event.preventDefault();
			event.stopPropagation();
		}

		(function(){
			// 是否自动在 new 时追加dom
			if(options.autoRender) {
				init();
        initElecon();
        bindListener();
			}
		})();

    let instance = {

      setContent: setContent,
      getContentEle: getContentEle,

      open: open,
      close: close,
      destory: destory
    };

  	ins.push(instance);
    return instance;
  }

  // 模块加载方式
  if(typeof module !== 'undefined' && typeof exports === 'object'
    && define.cmd) {
      module.exports = Toast;
  } else if (typeof define === 'function' && define.amd) {
    define(() => {
      return Toast;
    });
  } else {
    window.Toast = Toast;
  }

})(window, document);
