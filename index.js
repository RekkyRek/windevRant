
window.onload = function () {
  const remote = require('electron').remote;
  const devRant = require('rantscript');
  const fs = require('fs');
  var cursorX;
  var cursorY;
  var loadingRants = false;
  document.onmousemove = function(e){
      cursorX = e.pageX;
      cursorY = e.pageY;
  }

  var menuopen = false;
  setInterval(()=>{
    var rantscont = document.getElementById('rants');
    if(rantscont.scrollTop + window.innerHeight >= rantscont.scrollHeight + 28 && !loadingRants) {
      loadNextRants();
    }

    if(cursorX < 70 && !menuopen) {
      document.getElementById('sidebar').setAttribute('data-active', 'true');
      menuopen = true;
    }

    if(cursorX > 250 && menuopen) {
      document.getElementById('sidebar').setAttribute('data-active', 'false');
      menuopen = false;
    }

  },100);


  var app = new Vue({
    el: '#rants',
    data: {
      rants: [
      ]
    }
  })
  devRant
    .rants('algo', 25, app.rants.length)
    .then((response)=>{

      console.log(response);

    })

  function loadNextRants() {
    loadingRants = true;
    document.getElementById('loadIndicator').setAttribute('data-loading', 'true');
    devRant
      .rants('algo', 25, app.rants.length)
      .then((response)=>{
        for (var i = 0; i < response.length; i++) {
          app.rants.push(response[i]);
        }
        console.log(response);
        loadingRants = false;
        document.getElementById('loadIndicator').setAttribute('data-loading', 'false');
      })
  }
}
