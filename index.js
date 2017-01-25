
window.onload = function () {
  const remote = require('electron').remote;
  const devRant = require('rantscript');
  const fs = require('fs');
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
    .rants('algo', 10, 0)
    .then((response)=>{
      for (var i = 0; i < response.length; i++) {
        app.rants.push(response[i]);
      }
      console.log(response);
    })
}
