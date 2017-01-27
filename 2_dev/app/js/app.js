smoothScroll.init();
removeHover();

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
}


Vue.component('projectTab', {
  props: ['title', 'icon', 'info'],
  template: '\
    <article class="project">\
      <h2 class="project__title">{{ title }}</h2>\
      <div :v-if="icon" class="project__icons">{{ icon }}</div>\
      <p class="project__info">{{ info }}</p>\
    </article>'
})

Vue.component('projectCard', {
  props: ['title', 'info'],
  template: '\
    <div>\
      <h1 class="">{{ title }}</h1>\
      <p class="">{{ info }}</p>\
    </div>'
})


var app = new Vue({
  el: '#app',
  data: {
    upload: false,
    showcase: false,
    projects: []
  },
  created: function () {
    var self = this;
    get('work_data.json')
      .then(function (response) {
        self.projects = JSON.parse(response);
        if (!self.upload) {
          self.upload = true;
        }
      })
      .catch(function (er) {
        console.log(er);
      });
  },
  methods: {
    toggleShow: function(e) {
      this.showcase = !this.showcase;
      console.log(e.target);
    }
  }
})


var feed = new Instafeed({
  get: 'user',
  userId: 'self',
  accessToken: '1497992223.6d137b1.c5edfc696aca4cdd8116be94359c26d6',
  target: 'insta',
  resolution: 'standard_resolution',
  limit: 3,
  template: '<div class="insta__pic"><a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}"></a></div>',
  success: function() {
    document.querySelector('.insta__load').style.display = 'none';
  },
  error: function() {
    var el    = document.querySelector('.insta__load');
    var text  = 'oh my, it takes a little too long! probably an error has occured while loading instagram feed';
    (el.textContent) ? el.textContent = text : el.innerText = text;
  }
});
feed.run();
