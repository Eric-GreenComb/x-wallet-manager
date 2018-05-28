import config from './config'
import axios from 'axios'
var qs = require('qs')

/*数字钱包*/
// 用户登录
export const systemLogin = (data) => {
  return axios.post(config.systemLogin, createPostParams(data))
}
//创建用户
export const createUser = (data) => {
  return axios.post(config.createUser, createPostParams(data))
}
// 用户列表
export const getUserList = (data) => {
  return axios.get(config.getUserList+data)
}
//积分列表
export const getTokenList = (data) => {
  return axios.get(config.ListToken+data)
}
//发布积分
export const tokenDeploy = (data) => {
  return axios.post(config.TokenDeploy, createPostParams(data))
}
//修改管理员密码
export const updatePass = (data)=> {
   return axios.post(config.updatePwd+data)
}
//用户数量
export const userCount = (data) => {
  return axios.get(config.userCount)
}
//积分数量
export const tokenCount = (data) => {
  return axios.get(config.tokenCount)
}
//交易数量
export const transCount = (data) => {
  return axios.get(config.transCount)
}

//交易总额
export const transSum = (data) => {
  return axios.get(config.transSum)
}










// 获取商品列表
export const getGoodsList = (data) => {
  return axios.post(config.getGoodsList, createPostParams(data))
}

// 商品规格管理-获取规格列表
export const getGoodsSize = (data) => {
  return axios.post(config.getGoodsSize, createPostParams(data))
}

// 获取商品分类
export const getClassfiy = () => {
  return axios.get(config.getClassfiy)
}

// 上传商品图片
export const uploadGoodsPic = (formdata) => {
  return axios.post(config.uploadGoodsPic, formdata)
}

// 上传分类图片
export const uploadCalssfyPic = (formdata) => {
  return axios.post(config.uploadCalssfyPic, formdata)
}

// 通用 上传课件视频、音频 （格式：mp4|mp3）
export const uploadVedio = (formdata) => {
  return axios.post(config.uploadVedio, formdata)
}

// 商品列表 新品推荐/置顶分类
export const uploadMaterialsPic = (formdata) => {
  return axios.post(config.uploadMaterialsPic, formdata)
}

// 商品详情
export const getGoodsDetail = (data) => {
  return axios.post(config.getGoodsDetail, createPostParams(data))
}

// 商品分类详情
export const getClassfyDetail = (data) => {
  return axios.post(config.getClassfyDetail, createPostParams(data))
}

// 添加、编辑商品
export const updateGoods = (data) => {
  return axios.post(config.updateGoods, createPostParams(data))
}

// 添加、编辑商品
export const getCalssfy = (data) => {
  return axios.post(config.getCalssfy, createPostParams(data))
}

// 分类管理删除/上下线
export const deleteCalssfy = (data) => {
  return axios.post(config.deleteCalssfy, createPostParams(data))
}

// 分类管理删除/上下线
export const addClassfy = (data) => {
  return axios.post(config.addClassfy, createPostParams(data))
}

// 礼包列表
export const getGiftList = (data) => {
  return axios.post(config.getGiftList, createPostParams(data))
}

// 获取某个礼包详情
export const getGiftDetail = (data) => {
  return axios.post(config.getGiftDetail, createPostParams(data))
}

// 添加/编辑开店礼包
export const addEditGiftbag = (data) => {
  return axios.post(config.addEditGiftbag, createPostParams(data))
}

// 获取礼包 de 商品列表
export const getGiftGoods = (data) => {
  return axios.post(config.getGiftGoods, createPostParams(data))
}

// 添加/编辑礼包中的商品列表
export const addEditGiftgoods = (data) => {
  return axios.post(config.addEditGiftgoods, createPostParams(data))
}

// 获取礼包-商品详情
export const getGiftgoodsDetail = (data) => {
  return axios.post(config.getGiftgoodsDetail, createPostParams(data))
}

// 商品规格管理-新增/编辑规格列表
export const addGoodsSize = (data) => {
  return axios.post(config.addGoodsSize, createPostParams(data))
}

// 商品规格管理-规格详情
export const getDetailSize = (data) => {
  return axios.post(config.getDetailSize, createPostParams(data))
}

// 获取商品价格列表
export const getGoodsPricesize = (data) => {
  return axios.post(config.getGoodsPricesize, createPostParams(data))
}

// 获取某个商品的所有规格类
export const getSizeList = (data) => {
  return axios.post(config.getSizeList, createPostParams(data))
}

// 添加/编辑价格-规格
export const addGoodsPricesize = (data) => {
  return axios.post(config.addGoodsPricesize, createPostParams(data))
}

// 获取价格规格详情
export const getDetailPricesize = (data) => {
  return axios.post(config.getDetailPricesize, createPostParams(data))
}

// 获取团购/抢购列表
export const getActivityGoods = (data) => {
  return axios.post(config.getActivityGoods, createPostParams(data))
}

// 团购添加/编辑
export const addGroupActivity = (data) => {
  return axios.post(config.addGroupActivity, createPostParams(data))
}

// 活动商品详情
export const getDetailActivityGoods = (data) => {
  return axios.post(config.getDetailActivityGoods, createPostParams(data))
}

// 抢购添加/编辑
export const addScareActivity = (data) => {
  return axios.post(config.addScareActivity, createPostParams(data))
}

// 通用 上架/下架/删除
export const deleteCommonWithType = (data) => {
  return axios.post(config.deleteCommonWithType, createPostParams(data))
}

// 商品列表 新品推荐/置顶分类
export const supportGoods = (data) => {
  return axios.post(config.supportGoods, createPostParams(data))
}

// 添加/编辑发现
export const addGoods = (data) => {
  return axios.post(config.addGoods, createPostParams(data))
}

// 发现列表
export const getFindList = (data) => {
  return axios.post(config.getFindList, createPostParams(data))
}

// 发现详情
export const getDetailFindinfo = (data) => {
  return axios.post(config.getDetailFindinfo, createPostParams(data))
}

// 发现详情
export const updateGoodsMaterials = (data) => {
  return axios.post(config.updateGoodsMaterials, createPostParams(data))
}

// 获取商品素材详情
export const getGoodsMaterials = (data) => {
  return axios.post(config.getGoodsMaterials, createPostParams(data))
}

// 获取轮播图
export const getTopBanner = (data) => {
  return axios.post(config.getTopBanner, createPostParams(data))
}

// 添加/编辑轮播图
export const addTopBanner = (data) => {
  return axios.post(config.addTopBanner, createPostParams(data))
}

// 获取轮播图
export const getDetailBanner = (data) => {
  return axios.post(config.getDetailBanner, createPostParams(data))
}

// 语/课件 列表
export const getCollegeMaterialList = (data) => {
  return axios.post(config.getCollegeMaterialList, createPostParams(data))
}

// 获取分类
export const getCollegeClassfy = (data) => {
  return axios.post(config.getCollegeClassfy, createPostParams(data))
}

// 获取分类
export const addTags = (data) => {
  return axios.post(config.addTags, createPostParams(data))
}

// 编辑/添加 课件/论语
export const addCollegeMaterial = (data) => {
  return axios.post(config.addCollegeMaterial, createPostParams(data))
}

// 获取某一个课件的详情
export const getCollegeMaterialDetail = (data) => {
  return axios.post(config.getCollegeMaterialDetail, createPostParams(data))
}

// 获取活动列表
export const getActivityList = (data) => {
  return axios.post(config.getActivityList, createPostParams(data))
}

// 活动-店铺分享
export const uploadActivityShare = (data) => {
  return axios.post(config.uploadActivityShare, createPostParams(data))
}

// 添加/编辑活动
export const addActivity = (data) => {
  return axios.post(config.addActivity, createPostParams(data))
}

// 获取活动详情
export const getDetailActivity = (data) => {
  return axios.post(config.getDetailActivity, createPostParams(data))
}

// 抵用券列表
export const getVoucherList = (data) => {
  return axios.post(config.getVoucherList, createPostParams(data))
}

// 获取某一个券的详情
export const getVoucherDetail = (data) => {
  return axios.post(config.getVoucherDetail, createPostParams(data))
}

// 添加/编辑抵用券
export const addEditVoucher = (data) => {
  return axios.post(config.addEditVoucher, createPostParams(data))
}

// 常见问题列表
export const getFaqList = (data) => {
  return axios.post(config.getFaqList, createPostParams(data))
}

// 获取常见问题分类
export const getFaqType = (data) => {
  return axios.post(config.getFaqType, createPostParams(data))
}

// 获取某一个问题的详情
export const getFaqDetail = (data) => {
  return axios.post(config.getFaqDetail, createPostParams(data))
}

// 添加/编辑 常见问题
export const addEditFaq = (data) => {
  return axios.post(config.addEditFaq, createPostParams(data))
}

// 用户列表
/*export const getUserList = (data) => {
  return axios.post(config.getUserList, createPostParams(data))
}*/

// 用户积分纪录
export const getUserscoreList = (data) => {
  return axios.post(config.getUserscoreList, createPostParams(data))
}

// 用户奖金纪录
export const getMyTrade = (data) => {
  return axios.post(config.getMyTrade, createPostParams(data))
}

// 提现记录
export const getallWithdrawcash = (data) => {
  return axios.post(config.getallWithdrawcash, createPostParams(data))
}

// 订单列表
export const getOrderList = (data) => {
  return axios.post(config.getOrderList, createPostParams(data))
}

// 订单详情
export const getOrderDesc = (data) => {
  return axios.post(config.getOrderDesc, createPostParams(data))
}

// 网关查询
export const getFrontPerson = (data) => {
  return axios.post(config.getFrontPerson, createPostParams(data))
}

// 获取协议
export const getAgressContent = (data) => {
  return axios.post(config.getAgressContent, createPostParams(data))
}
// 添加协议
export const addAgressContent = (data) => {
  return axios.post(config.addAgressContent, createPostParams(data))
}
// 获取热词
export const get_hotstr = (data) => {
  return axios.post(config.get_hotstr, createPostParams(data))
}
// 编辑热词
export const add_hot_str = (data) => {
  return axios.post(config.add_hot_str, createPostParams(data))
}

// 监督列表
export const supervise_study = (data) => {
  return axios.post(config.supervise_study, createPostParams(data))
}

// 用户认证详情
export const getUserAuthorInfo = (data) => {
  return axios.post(config.getUserAuthorInfo, createPostParams(data))
}

// 用户认证审核
export const userAuthor = (data) => {
  return axios.post(config.userAuthor, createPostParams(data))
}

// 提现导出 excel
export const export_withdraw_cash = (data) => {
  return axios.post(config.export_withdraw_cash, createPostParams(data))
}

// 取权限列表
export const get_authority_list = (data) => {
  return axios.post(config.get_authority_list, createPostParams(data))
}








/*
 * 创建Post x-www-form-urlencode请求参数
 * */
function createPostParams (obj) {
  return qs.stringify(obj)
}
