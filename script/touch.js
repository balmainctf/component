
'use strict';

;(function(root, factory){
  if(typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);  // register as module
  } else {
    root.touch = factory();
  }
})(this, function(){

    console.log(32);
    console.log(32132);

});
