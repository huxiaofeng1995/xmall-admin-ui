import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/first',
    name: 'category',
    meta: {title: '分类', icon: 'product-cate'},
    children: [
      {
        path: 'first',
        name: 'first',
        component: () => import('@/views/category/index'),
        meta: { title: '一级分类', icon: 'product-brand' }
      },
      {
        path: 'second',
        name: 'second',
        component: () => import('@/views/category/second/index'),
        meta: { title: '二级分类', icon: 'product-brand' }
      },
      {
        path: 'tm',
        name: 'trademark',
        component: () => import('@/views/category/tm/index'),
        meta: { title: '品牌管理', icon: 'product-brand' }
      }
    ]
  },
  {
    path: '/spu',
    component: Layout,
    redirect: '/spu/product',
    name: 'spu',
    meta: {title: '商品', icon: 'product'},
    children: [
      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/spu/index'),
        meta: { title: '商品列表', icon: 'product-list' }
      },
      {
        path: 'addspu',
        name: 'addspu',
        component: () => import('@/views/spu/add'),
        meta: { title: '添加商品', icon: 'product-add' }
      },
      {
        path: 'updatespu',
        name: 'updatespu',
        hidden: true,
        component: () => import('@/views/spu/update'),
        meta: { title: '修改商品', icon: 'product-add' }
      },
      {
        path: 'updatespuImg',
        name: 'updatespuImg',
        hidden: true,
        component: () => import('@/views/spu/img/index'),
        meta: { title: '图片管理', icon: 'product-img' }
      },
      {
        path: 'attrList',
        name: 'productAttrList',
        component: () => import('@/views/attr/index'),
        meta: {title: '属性管理', icon: 'product-attr'},
      },
      {
        path: 'addAttr',
        name: 'addAttr',
        component: () => import('@/views/attr/add'),
        meta: { title: '添加属性', icon: 'product-add' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

