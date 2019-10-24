import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/page/Index'
import center from '@/page/center'
import list from '@/page/list'
import upload from '@/page/upload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Index
    },
    {
      path: '/center',
      name: '',
      component: center
    },
    {
      path: '/list',
      name: '',
      component: list
    },
    {
      path: '/upload',
      name: '',
      component: upload
    },

  ],
  scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
  	    return savedPosition
  	} else {
  		if (from.meta.keepAlive) {
  			from.meta.savedPosition = document.body.scrollTop;
  		}
  	    return { x: 0, y: to.meta.savedPosition || 0 }
  	}
  }
})