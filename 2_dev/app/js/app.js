smoothScroll.init();

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
  props: ['url', 'title'],
  template: '<h3><a :href="url">{{ title }}</a></h3>'
})


var app = new Vue({
  el: '#app',
  data: {
    message: 'Vue test!'
  }
})


var feed = new Instafeed({
  get: 'user',
  userId: 'self',
  accessToken: '1497992223.54da896.46ee4bcf6aa148b78d4b2899b6a2eca0',
  target: 'insta',
  resolution: 'standard_resolution',
  limit: 3,
  template: '<div class="insta__pic"><a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}"></a></div>',
  success: function() {
    document.querySelector('.insta__load').style.display = 'none';
  },
  error: function() {
    var el = document.querySelector('.insta__load');
    if (el.textContent) {
      el.textContent = 'oh my, it takes a little too long! probably an error has occured while loading instagram feed';
    } else {
      el.innerText = 'oh my, it takes a little too long! probably an error has occured while loading instagram feed';
    }
  }
});
feed.run();
