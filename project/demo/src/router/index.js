import Vue from 'vue'
import Router from 'vue-router'
import timeshow from '../components/timeshow'
import formdata from '../components/formdata'
import uploadfile from '../components/uploadfile'
import home from '../views/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'',
      name:'home',
      component:home,
    },
    {
      path:'/home',
      component:home,
      redirect:'/timeshow',
      children:[{
        path:'/timeshow',
        name:'timeshow',
        component:timeshow
      },{
        path:'/formdata',
        name:'formdata',
        component:formdata,
      },{
        path:'/uploadfile',
        name:'uploadfile',
        component:uploadfile,
      },]
    },
   
  ]
})
