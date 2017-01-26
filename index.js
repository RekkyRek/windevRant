
window.onload = function () {
  const remote = require('electron').remote;
  const devRant = require('rantscript');
  const fs = require('fs');
  var cursorX;
  var cursorY;
  var loadingRants = false;
  if(fs.existsSync('config.cfg')) {
    var auth = JSON.parse(fs.readFileSync('config.cfg'));
    loginScreen.style.display = "none"

  } else {
    loginScreen.style.display = "block"
  }

  document.onmousemove = function(e){
      cursorX = e.pageX;
      cursorY = e.pageY;
  }

  var menuopen = false;
  setInterval(()=>{
    var rantscont = document.getElementById('rants');
    if(rantscont.scrollTop + window.innerHeight >= rantscont.scrollHeight + 28 && !loadingRants && auth != null) {
      loadNextRants();
    }
    if(cursorX < 70 && !menuopen && auth != null) {
      document.getElementById('sidebar').setAttribute('data-active', 'true');
      menuopen = true;
    }
    if(cursorX > 250 && menuopen && auth != null) {
      document.getElementById('sidebar').setAttribute('data-active', 'false');
      menuopen = false;
    }
  },100);

  var sidebar_vue = new Vue({
    el: '#sidebar',
    data: {
      username: 'Login'
    },
    methods: {
       setSidebarActive: function (idx) {
         if(auth != null) {
           var sidebarItems = document.getElementById('sidebar').children;
           for (var i = 0; i < sidebarItems.length; i++) {
             sidebarItems[i].setAttribute('data-active', 'false');
           }
           sidebarItems[idx].setAttribute('data-active', 'true');
        }
       }
    }
  })

  if(auth != null) {
    sidebar_vue.username = auth['username'];
  }

  var rants_vue = new Vue({
    el: '#rants',
    data: {
      rants: [
      ]
    },
    methods: {
      vote: function (id, type) {
        devRant
          .vote(type, id, auth['token']['id'], auth['token']['key'], auth['token']['user_id'])
      }
    }
  })

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(loginForm.username.value != "" && loginForm.password.value != "") {
      devRant
        .login(loginForm.username.value,loginForm.password.value)
        .then((resp)=>{
          auth = {
            username: loginForm.username.value,
            token: resp['auth_token']
          };
          console.log(auth)
          document.getElementById('loginError').setAttribute('data-active', 'false');
          fs.writeFile('config.cfg', JSON.stringify(auth), function (err) {
            if (err)
              return console.log(err);
            console.log('Saved Auth');
          });
        })
        .catch((err)=>{
          console.log(err);
          document.getElementById('loginError').setAttribute('data-active', 'true');
        });
    } else {
      document.getElementById('loginError').setAttribute('data-active', 'true');
    }
  });

  function loadNextRants() {
    loadingRants = true;
    document.getElementById('loadIndicator').setAttribute('data-loading', 'true');
    devRant
      .rants('algo', 25, rants_vue.rants.length)
      .then((response)=>{
        for (var i = 0; i < response.length; i++) {
          rants_vue.rants.push(response[i]);
        }
        console.log(response);
        loadingRants = false;
        document.getElementById('loadIndicator').setAttribute('data-loading', 'false');
      })
  }
}
