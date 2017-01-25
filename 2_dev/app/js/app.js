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


Vue.component('project', {
  props: ['title', 'icon', 'info'],
  template: '<article class="project"> <h2 class="project__title"> {{ title }} </h2> <div class="project__icons"> {{ icon }} </div> <p class="project__info"> {{ info }} </p> </article>'
})


var app = new Vue({
  el: '#app',
  data: {
    message: 'Vue test!',
    projects: [
      { title: 'alfa_bet',
        type: ['typography', 'digital'],
        info: 'interactive fasade system based on a custom typeface',
        done: false
      },
      { title: 'one two three',
        type: ['digital'],
        info: 'simple app for children based on Montessori methodology to help learn new words',
        done: false
      },
      { title: '808,2 km',
        type: ['print', 'product'],
        info: 'history of a trip along Warta river with an old wooden camera',
        done: true
      },
      { title: 'kolekcja wrzesińska',
        type: ['print', 'product'],
        info: 'an ongoing project of capturing the esense of the city through lenses of different artists',
        done: true
      }
    ]
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
