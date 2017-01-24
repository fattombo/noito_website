smoothScroll.init();

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
