import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import Main from '@/components/main'
import Login from '@/components/login'     //登录
import register from '@/components/register'     //创建用户
import UserList from '@/components/userMessage/userList'  //用户列表
import AddressList from '@/components/userMessage/addressList'
import BuyList from '@/components/userMessage/buyList'
import FriendsList from '@/components/userMessage/friendsList'
import MoneyList from '@/components/userMessage/moneyList'
import ScoreList from '@/components/userMessage/scoreList'
import War from '@/components/userMessage/war'
import userdetail from '@/components/userMessage/userdetail'
import Analects from '@/components/BusinessSchool/Analects'
import Courseware from '@/components/BusinessSchool/Courseware'
import Classification from '@/components/BusinessSchool/classification'
import Supervision from '@/components/BusinessSchool/supervision'
import Addnew from '@/components/BusinessSchool/addnew'
import AddnewPic from '@/components/BusinessSchool/addnewPic'
import Find from '@/components/find/find'
import AddFind from '@/components/find/addFind'
import WidthdrawCash from '@/components/widthdrawCashMessage/widthdrawCash'
import News from '@/components/newsMessage/news'
import OrderList from '@/components/orderMessage/orderList'
import OrderDesc from '@/components/orderMessage/order_desc'
import ShopkeeperBag from '@/components/goodsMessage/ShopkeeperBag'
import ShopBagEdit from '@/components/goodsMessage/shop_BagEdit'
import ShopBagList2 from '@/components/goodsMessage/shopBagList2'
import GoodsList from '@/components/goodsMessage/goodsList'
import GroupBuying from '@/components/goodsMessage/groupBuying'
import RushBuying from '@/components/goodsMessage/rushBuying'
import PriceEdit from '@/components/goodsMessage/priceEdit'
import ClassfiyMessage from '@/components/goodsMessage/classfiyMessage'
import SmallClassfiyMessage from '@/components/goodsMessage/smallClassfiyMessage'
import AddGoodsList from '@/components/goodsMessage/addGoodsList'
import SizeList from '@/components/goodsMessage/sizeList'
import SizeContent from '@/components/goodsMessage/sizeContent'
import AddGroup from '@/components/goodsMessage/addGroup'
import AddRush from '@/components/goodsMessage/addRush'
import BannerPics from '@/components/goodsMessage/BannerPics'
import ActivityList from '@/components/activityMessage/activityList'
import AddActivity from '@/components/activityMessage/addActivity'
import BannerList from '@/components/bannerMessage/bannerList'
import EditBanner from '@/components/bannerMessage/editBanner'
import MallParams from '@/components/system/MallParams'
import GVRP from '@/components/system/GVRP'
import KF from '@/components/system/KF'
import GetVoucherList from '@/components/system/getVoucherList'
import getVoucherList_score from '@/components/system/getVoucherList_score'
import AccessMessage from '@/components/system/accessMessage'
import hotWords from '@/components/system/hotWords'
import power_set from '@/components/system/power_set'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        // -----------------------------------------------用户管理
        {
          path: '/userList', // 用户列表
          name: 'userList',
          component: UserList,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/buyList', // 购买记录
          name: 'buyList',
          component: BuyList,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/scoreList', // 积分记录
          name: 'scoreList',
          component: ScoreList,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/war', // 网关查询
          name: 'war',
          component: War,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/moneyList', // 奖金纪录
          name: 'moneyList',
          component: MoneyList,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/userdetail', // 用户认证详情
          name: 'userdetail',
          component: userdetail,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addressList', // 收获地址
          name: 'addressList',
          component: AddressList,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/friendsList', // 好友
          name: 'friendsList',
          component: FriendsList,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },

        // -----------------------------------------------商学院
        {
          path: '/Analects', // 论语
          name: 'Analects',
          component: Analects,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/Courseware', // 课件
          name: 'Courseware',
          component: Courseware,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/classification', // 分类
          name: 'classification',
          component: Classification,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/supervision', // 监督
          name: 'supervision',
          component: Supervision,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addnew', // 添加论语
          name: 'addnew',
          component: Addnew,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addnewPic', // 添加课件
          name: 'addnewPic',
          component: AddnewPic,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          }
        },

        // --------------------------------------------------商品管理
        {
          path: '/ShopkeeperBag', // 店长礼包
          name: 'ShopkeeperBag',
          component: ShopkeeperBag,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/shopBagEdit', // 店长礼包列表
          name: 'shopBagEdit',
          component: ShopBagEdit,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/shopBagList2', // 店长礼包列表--礼包商品
          name: 'shopBagList2',
          component: ShopBagList2,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/groupBuying', // 团购列表
          name: 'groupBuying',
          component: GroupBuying,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
            // keepAlive: true // 此组件需要被缓存
          }
        },
        {
          path: '/rushBuying', // 抢购列表
          name: 'rushBuying',
          component: RushBuying,
          meta: {
            // requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
            // keepAlive: true // 此组件需要被缓存
          }
        },
        {
          path: '/goodsList', // 商品列表
          name: 'goodsList',
          component: GoodsList,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
            // keepAlive: true // 此组件需要被缓存
          }
        },
        {
          path: '/priceEdit', // 价格编辑
          name: 'priceEdit',
          component: PriceEdit,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/classfiyMessage', // 分类管理
          name: 'classfiyMessage',
          component: ClassfiyMessage,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/smallClassfiyMessage', // 小类管理
          name: 'smallClassfiyMessage',
          component: SmallClassfiyMessage,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addGoodsList', // 商品管理--商品列表--添加商品
          name: 'addGoodsList',
          component: AddGoodsList,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addGroup', // 商品管理--团购列表--添加商品
          name: 'addGroup',
          component: AddGroup,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addRush', // 商品管理--抢购列表--添加商品
          name: 'addRush',
          component: AddRush,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/sizeContent', // 商品管理--规格详情
          name: 'sizeContent',
          component: SizeContent,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/sizeList', // 商品管理--商品列表--添加商品
          name: 'sizeList',
          component: SizeList,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/BannerPics', // 商品管理--商品列表--素材列表
          name: 'BannerPics',
          component: BannerPics,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        // --------------------------------------------------
        {
          path: '/orderList', // 订单管理
          name: 'orderList',
          component: OrderList,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/orderDesc', // 订单详情
          name: 'orderDesc',
          component: OrderDesc,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/bannerList', // banner管理
          name: 'bannerList',
          component: BannerList,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/editBanner', // 添加编辑banner管理
          name: 'editBanner',
          component: EditBanner,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        // -----------------------------------------------------发现----------------------------------------------
        {
          path: '/find', // 发现
          name: 'find',
          component: Find,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
           // /* keepAlive: true, // 此组件需要被缓存*/
            /*isBack: false // 用于判断上一个页面是哪个*/
          }
        },
        {
          path: '/addFind', // 新建/编辑发现
          name: 'addFind',
          component: AddFind,
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
           // /* keepAlive: false // 此组件不需要被缓存*/
          }
        },
        // -----------------------------------------------------提现管理----------------------------------------------
        {
          path: '/widthdrawCash', // 提现管理
          name: 'widthdrawCash',
          component: WidthdrawCash,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/news', // 消息管理
          name: 'news',
          component: News,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        // -----------------------------------------------------活动管理
        {
          path: '/activityList', // 活动列表
          name: 'activityList',
          component: ActivityList,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/addActivity', // 新增/编辑活动列表
          name: 'addActivity',
          component: AddActivity,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        // -----------------------------------------------------系统管理
        {
          path: '/getVoucherList', // 抵用券
          name: 'getVoucherList',
          component: GetVoucherList,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/getVoucherList_score', // 抵用券
          name: 'getVoucherList_score',
          component: getVoucherList_score,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/KF', // 常见问题
          name: 'KF',
          component: KF,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/GVRP', // 注册协议
          name: 'GVRP',
          component: GVRP,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/hotWords', // 注册协议
          name: 'hotWords',
          component: hotWords,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/power_set', // 权限设置
          name: 'power_set',
          component: power_set,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/accessMessage', // 权限管理
          name: 'accessMessage',
          component: AccessMessage,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: '/MallParams', // 商城参数配置
          name: 'MallParams',
          component: MallParams,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限

    if (localStorage.getItem('token')) { // 通过vuex state获取当前的token是否存在
      next()
    } else {
      next({
        path: '/',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.errcode==90000){
      alert(response.data.errdesc);
      // if(router.currentRoute.fullPath>0){
      window.sessionStorage.removeItem('session');
      router.replace({
        path: '/',
        query: {redirect: router.currentRoute.fullPath}
      })
      // }
      return
    }
    return response
  },
  error => {
    if (error.response) {
      console.log('errorerror=====',error.response);
    }
  })

export default router
