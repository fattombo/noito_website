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
  props: ['title', 'icon', 'info', 'address'],
  template: '\
    <article @click="show" class="project">\
      <h2 class="project__title">{{ title }}</h2>\
      <div :v-if="icon" class="project__icons">{{ icon }}</div>\
      <p class="project__info">{{ info }}</p>\
    </article>',
  data: function() {
    return {
      index: this.address
    }
  },
  methods: {
    show: function() {
      // console.log(this.index);
      this.$emit('show', this.index);
    }
  }
});

Vue.component('projectCard', {
  template: '\
    <div class="project__card">\
      <div @click="$emit(\'hide\')" class="btn__close"><img src="images/close.svg" alt="close"></div>\
      <slot></slot>\
    </div>'
});

Vue.component('projectInfo', {
  props: ['project'],
  template: '\
    <transition name="fade">\
      <div class="project__info">\
        <h1 class="info__title">{{ project.title }}</h1>\
        <p class="info__text--short">{{ project.shortInfo }}</p>\
        <p class="info__text--long">{{ project.longInfo }}</p>\
        <div><img class="info__img" v-for="image in project.images" :src="\'images/projects/\' + image.title + image.type"></div>\
      </div>\
    </transition>'
});


var app = new Vue({
  el: '#app',
  data: {
    upload: false,
    showcase: false,
    number: null,
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
    show: function(index) {
      if (!this.showcase) {
        this.showcase = true;
        this.number = index;
      } else {
        this.number = index;
      }
      document.documentElement.style.overflow = 'hidden';
    },
    hide: function() {
      if (this.showcase) {
        this.showcase = false;
      }
      document.documentElement.style.overflow = 'auto';
    }
  }
});


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
