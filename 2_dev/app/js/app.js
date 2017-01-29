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
  props: ['project', 'index'],
  template: '\
    <article @click="show" class="project__tab">\
      <h2 class="tab__title">{{ project.title }}</h2>\
      <div class="tab__type">\
        <ul>\
          <li v-for="type in project.type">\
            <img :src="\'images/picto/\' + type + \'.svg\'">\
          </li>\
        </ul>\
      </div>\
      <p class="tab__info">{{ project.shortInfo }}</p>\
    </article>',
  data: function() {
    return {
      id: this.index
    }
  },
  methods: {
    show: function() {
      this.$emit('show', this.id);
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
        <div class="info__cat">\
          <ul>\
            <li v-for="category in project.type">{{ category }}</li>\
          </ul>\
        </div>\
        <h1 class="info__title">{{ project.title }}</h1>\
        <p class="info__text--short">{{ project.shortInfo }}</p>\
        <div class="info__img">\
          <img v-for="image in project.images" :src="\'images/projects/\' + image.title + image.type">\
        </div>\
        <p v-for="text in project.longInfo" class="info__text--long">{{ text }}</p>\
        <div class="info__task">\
          <p>what I did:</p>\
          <ul>\
            <li v-for="task in project.tasks">{{ task }}</li>\
          </ul>\
        </div>\
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
