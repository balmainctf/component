;(function(window, document) {

	let ins = [];		// 实例化集合

  function Dialog(options = {}) {

    let eleCon = {},    // dom集合
        isExit = false;

    // 默认配置
    let defaultsOptions = {

      // html结构
      outerHTML:
       `<div class="dialog_backdrop"></div>
        <div class="dialog_wrapper">
         <h3 class="dialog_title">温馨提示</h3>
         <div class="dialog_container">
           该商品仅限北京地区可服务，与您当前定位上海不符。关注58到家公众号，了解更多优惠吧
         </div>
         <button class="dialog_btn">我知道了</button>
        </div>`,

      title : "温馨提示",

      // 插入内容或dom节点
      // "<div></div>" || document.getElementById("content")
      content : "您来晚了一步，本次活动已结束，期待下次优惠活动吧~",

			autoRender : false,

      //内容区域高度， 可以取 数值 || "auto"
      height : 320,

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

      button : {
          name : '我知道啦',
          // disabled: false,
          handel(){
            console.log('点击button');
            // return false;
          }
      },
    }

    options = extend(defaultsOptions, options);

    // 初始化结构
    function init() {
      if(isExit) return false;

			// 初始化回调
			options.onInit && options.onInit();

      // 加载html
      let ele = document.createElement('div');
			eleCon.dialog_maxwrap = ele;
      ele.innerHTML = options.outerHTML;

      // 设置 tilte
      ele.querySelector('.dialog_title').innerHTML = options.title;

      // 加载content
      let con_wrap = ele.querySelector('.dialog_container');
      if(options.content.nodeType === 1) {
				con_wrap.innerHTML = '';
        con_wrap.appendChild(options.content);
      } else {
        con_wrap.innerHTML = options.content;
      }
			// 设置content高度
      con_wrap.style.height = options.height === 'auto' ?
        'auto' : options.height + 'px';

      // 设置btn
      ele.querySelector('.dialog_btn').innerHTML = options.button.name;


      // 设置外部容器
      ele.style.display = 'none';
      ele.className = 'dialog_maxwrap';

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
			let ele = eleCon.dialog_maxwrap;
			eleCon.dialog_backdrop = ele.querySelector('.dialog_backdrop');
			eleCon.dialog_wrapper = ele.querySelector('.dialog_wrapper');
			eleCon.dialog_title = ele.querySelector('.dialog_title');
			eleCon.dialog_container = ele.querySelector('.dialog_container');
			eleCon.dialog_btn = ele.querySelector('.dialog_btn');
    };

    function bindListener() {
      if(!isExit) return false;

      // 点击背景快速关闭
      addEventHandler(eleCon.dialog_backdrop, 'touchstart', (ev) => {
        let ret = typeof options.onMaskClick === 'function' ?
          options.onMaskClick.apply(this, arguments) : true;
        if(options.closeOnMaskClicked) {
          ret !== false ? close() : '';
        }
				stopDefault(ev);
      });

			addEventHandler(eleCon.dialog_maxwrap, 'touchmove', (ev) => {
				stopDefault(ev);
			});

			// addEventHandler(eleCon.dialog_container, 'touchstart', (ev) => {
			// 	stopDefault(ev);
			// });
			//
			// addEventHandler(eleCon.dialog_container, 'touchmove', (ev) => {
			// 	stopDefault(ev);
			// });

      // 点击按钮
      addEventHandler(eleCon.dialog_btn, 'touchstart', (ev) => {
				// cosole.log(123);
        let ret = typeof options.button.handel === 'function' ?
          options.button.handel.apply(this, arguments) : true;
        ret !== false ? close() : '';
        stopDefault(ev);
      });

    };

    function setContent(content = '') {
      if(!isExit || content === '') return false;
      options.content = content;
      if(content.nodeType === 1) {
				eleCon.dialog_container.innerHTML = '';
				eleCon.dialog_container.appendChild(content);
      } else {
				eleCon.dialog_container.innerHTML = content;
      }
    }

    function getContentEle() {
      if(!isExit) return false;

      return eleCon.dialog_container;
    }

    function getTitle() {
      if(!isExit) return false;
      return options.title;
    }

    function setTitle(title = '') {
      if(!isExit) return false;
      eleCon.dialog_title.innerHTML = title;
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
      eleCon.dialog_maxwrap.style.display = 'block';

			options.onOpen && options.onOpen();
    }

    function close() {
      if(!isExit) return false;
      eleCon.dialog_maxwrap.style.display = 'none';

			options.onClose && options.onClose();
    }

    function destory() {
      if(!isExit) return false;

      let parentElement = eleCon.dialog_maxwrap.parentNode;
      parentElement.removeChild(eleCon.dialog_maxwrap);

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

      getTitle: getTitle,
      setTitle: setTitle,

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
      module.exports = Dialog;
  } else if (typeof define === 'function' && define.amd) {
    define(() => {
      return Dialog;
    });
  } else {
    window.Dialog = Dialog;
  }

})(window, document);
