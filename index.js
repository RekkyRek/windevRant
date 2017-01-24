const remote = require('electron').remote;
const devRant = require('rantscript');

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

var menuopen = false;

setInterval(()=>{
  if(cursorX < 70 && !menuopen) {
    document.getElementById('sidebar').setAttribute('data-active', 'true');
    menuopen = true;
  }

  if(cursorX > 250 && menuopen) {
    document.getElementById('sidebar').setAttribute('data-active', 'false');
    menuopen = false;
  }

},10);

var app = new Vue({
  el: '#rants',
  data: {
    rants: [
    ]
  }
})

devRant
  .rants('top', 10, 0)
  .then((response)=>{
    console.log(response);
  })
