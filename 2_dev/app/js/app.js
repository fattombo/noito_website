var n = (function() {

  var get = function(url) {
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
      <article @click="$emit(\'show\', index)" class="project-tab">\
        <h2 class="project-tab__title">{{ project.title }}</h2>\
        <div class="project-tab__type">\
          <ul>\
            <li v-for="type in project.type" class="project-tab__icon">\
              <img :src="\'images/picto/\' + type + \'.svg\'">\
            </li>\
          </ul>\
        </div>\
        <p class="project-tab__info">{{ project.shortInfo }}</p>\
      </article>'
  });

  Vue.component('projectCard', {
    template: '\
      <div class="project-card">\
        <div @click="$emit(\'hide\')" class="btn-close"><img src="images/close.svg" alt="close"></div>\
        <div class="wrapper">\
          <slot></slot>\
        </div>\
      </div>'
  });

  Vue.component('projectInfo', {
    props: ['project'],
    template: '\
      <transition name="fade">\
        <div>\
          <div class="project-card__topinfo">\
            <ul>\
              <li class="project-card__category" v-for="category in project.type">{{ category }}</li>\
            </ul>\
          </div>\
          <h1 class="project-card__title">{{ project.title }}</h1>\
          <p class="project-card__text">{{ project.shortInfo }}</p>\
          <div class="project-card__pictures">\
            <img class="picture" v-for="image in project.images" :src="\'images/projects/\' + image.title + image.type">\
          </div>\
          <p v-for="text in project.longInfo" class="project-card__text">{{ text }}</p>\
          <div class="project-card__bottominfo">\
            <h3 class="project-card__text">responsibilities:</h3>\
            <ul>\
              <li class="project-card__task" v-for="task in project.tasks">{{ task }}</li>\
            </ul>\
          </div>\
        </div>\
      </transition>'
  });

  var feed = new Instafeed({
    get: 'user',
    userId: 'self',
    accessToken: '1497992223.6d137b1.c5edfc696aca4cdd8116be94359c26d6',
    target: 'insta',
    resolution: 'standard_resolution',
    limit: 3,
    template: '<div class="picture picture--insta">\
                <a href="{{link}}" target="_blank">\
                  <img src="{{image}}" alt="{{caption}}">\
                </a>\
              </div>',
    success: function() {
      document.querySelector('.js-insta-loading').style.display = 'none';
    },
    error: function() {
      var el    = document.querySelector('.js-insta-loading');
      var text  = 'oh my, it takes a little too long! probably an error has occured while loading instagram feed';
      (el.textContent) ? el.textContent = text : el.innerText = text;
    }
  });


  // init module
  var init = function() {
    new Vue({
      el: '#container',
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

    feed.run();
    smoothScroll.init();
    removeHover();
  }

  return {
      init: init
  };

})();
