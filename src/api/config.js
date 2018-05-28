//let base = 'https://wqbang.cn/qPHA/admin/index.php'
// let base = 'http://www.91top.club/hpt/admin/index.php'

/*数字钱包接口*/
let domain = "http://123.206.29.15:4100";
let base = "http://123.206.29.15:4100/api/v1";
let base_admin = "http://123.206.29.15:4100/api/admin/v1";

export default{

  //登录
  systemLogin: `${base_admin}/login`,
  createUser:`${base_admin}/users/create`, //创建管理员
  getUserList: `${base}/user/list`, // 管理员列表
  ListToken: `${base}/token/list`, //积分列表
  TokenDeploy:`${base}/token/deploy`, //发布积分
  updatePwd:`${base_admin}/users/updatepasswd`, //修改管理员密码
  userCount:`${base}/user/count`, //用户数量
  tokenCount:`${base}/token/count`, //积分数量
  transCount:`${base}/token/transfer/allcount`, //交易总量
  transSum:`${base}/token/transfer/allsum`, //交易总额







  // 登录
  //systemLogin: `${base}/user_manger/systemLogin`,
  //getUserList: `${base}/users/get_user_list`, // 用户列表
  getUserscoreList: `${base}/users/get_userscore_list`, // 用户积分纪录
  getMyTrade: `${base}/users/get_my_trade`, // 用户积分纪录
  getFrontPerson: `${base}/users/get_front_person`, // 用户积分纪录
  getUserAuthorInfo: `${base}/users/getUserAuthorInfo`, // 用户认证详情
  userAuthor: `${base}/users/userAuthor `, // 用户认证审核

  // 商品规格管理-获取规格列表
  getGoodsSize: `${base}/goods/get_goods_size`,

  // 获取礼包列表
  getGiftList: `${base}/goods/get_gift_list`,

  // 获取某个礼包详情
  getGiftDetail: `${base}/goods/get_gift_detail`,

  // 添加/编辑开店礼包
  addEditGiftbag: `${base}/goods/add_edit_giftbag`,

  // 获取礼包 de 商品列表
  getGiftGoods: `${base}/goods/get_gift_goods`,

  // 添加/编辑礼包中的商品列表
  addEditGiftgoods: `${base}/goods/add_edit_giftgoods`,

  // 获取礼包-商品详情
  getGiftgoodsDetail: `${base}/goods/get_giftgoods_detail`,

  // 获取商品列表
  getGoodsList: `${base}/goods/get_goods_list`,

  // 获取商品分类
  getClassfiy: `${base}/goods/getgoods_classify`,

  // 上传商品图片
  uploadGoodsPic: `${base}/goods/upload_goods_pic`,

  // 上传商品分类分类图片
  uploadCalssfyPic: `${base}/goods/upload_calssfy_pic`,

  // 添加、编辑商品
  updateGoods: `${base}/goods/update_goods`,

  // 获取商品详情
  getGoodsDetail: `${base}/goods/get_goods_detail`,

  // 获取商品分类详情
  getClassfyDetail: `${base}/goods/get_classfy_detail`,

  // 商品分类管理-获取分类列表
  getCalssfy: `${base}/goods/get_calssfy`,

  // 分类管理删除/上下线
  deleteCalssfy: `${base}/goods/delete_calssfy`,

  // 分类管理添加/编辑
  addClassfy: `${base}/goods/add_classfy`,

  // 商品规格管理-新增/编辑规格列表
  addGoodsSize: `${base}/goods/add_goods_size`,

  // 商品规格管理-规格详情
  getDetailSize: `${base}/goods/get_detail_size`,

  // 获取商品价格列表
  getGoodsPricesize: `${base}/goods/get_goods_pricesize`,

  // 获取某个商品的所有规格类
  getSizeList: `${base}/goods/get_size_list`,

  // 添加/编辑价格-规格
  addGoodsPricesize: `${base}/goods/add_goods_pricesize`,

  // 获取价格规格详情
  getDetailPricesize: `${base}/goods/get_detail_pricesize`,

  // 获取团购/抢购列表
  getActivityGoods: `${base}/goods/get_activity_goods`,

  // 团购添加/编辑
  addGroupActivity: `${base}/goods/add_group_activity`,

  // 活动商品详情
  getDetailActivityGoods: `${base}/goods/getDetail_activity_goods`,

  // 抢购添加/编辑
  addScareActivity: `${base}/goods/add_scare_activity`,

  // 通用上架/下架/删除
  deleteCommonWithType: `${base}/goods/delete_common_with_type`,

  // 商品列表 新品推荐/置顶分类
  supportGoods: `${base}/goods/support_goods`,

  // 上传图片 通用
  uploadMaterialsPic: `${base}/find/upload_materials_pic`,

  // 添加/编辑发现
  addGoods: `${base}/find/add_goods`,

  // 发现列表
  getFindList: `${base}/find/get_find_list`,

  // 发现详情
  getDetailFindinfo: `${base}/find/get_detail_findinfo`,

  // 商品提交素材
  updateGoodsMaterials: `${base}/find/update_goods_materials`,

  // 获取商品素材详情
  getGoodsMaterials: `${base}/find/get_goods_materials`,

  // 获取轮播图
  getTopBanner: `${base}/find/get_top_banner`,

  // 添加/编辑轮播图
  addTopBanner: `${base}/find/add_top_banner`,

  // 获取某一个轮播图的详情
  getDetailBanner: `${base}/find/get_detail_banner`,

  // 论语/课件 列表
  getCollegeMaterialList: `${base}/college/get_college_material_list`,
  getCollegeClassfy: `${base}/college/get_college_classfy`, // 获取分类
  addTags: `${base}/college/add_tags`, // 添加/编辑商学院分类
  addCollegeMaterial: `${base}/college/add_college_material`, // 编辑/添加 课件/论语
  getCollegeMaterialDetail: `${base}/college/get_college_material_detail`, // 获取某一个课件的详情
  uploadVedio: `${base}/college/upload_vedio`, // 通用 上传课件视频、音频 （格式：mp4|mp3）
  supervise_study: `${base}/college/supervise_study`, // 监督列表

  // 获取活动列表
  getActivityList: `${base}/activity/get_activity_list`,

  // 活动-店铺分享
  uploadActivityShare: `${base}/activity/upload_activity_share`,

  // 活动-店铺分享
  addActivity: `${base}/activity/add_activity`,

  // 获取活动详情
  getDetailActivity: `${base}/activity/get_detail_activity`,

  // 抵用券列表
  getVoucherList: `${base}/vouchers/getVoucherList`,

  // 获取某一个券的详情
  getVoucherDetail: `${base}/vouchers/get_voucher_detail`,

  // 添加/编辑抵用券
  addEditVoucher: `${base}/vouchers/add_edit_voucher`,

  // 常见问题列表
  getFaqList: `${base}/systemManage/get_faq_list`,
  getFaqType: `${base}/systemManage/get_faq_type`, // 获取常见问题分类
  getFaqDetail: `${base}/systemManage/get_faq_detail`, // 获取某一个问题的详情
  addEditFaq: `${base}/systemManage/add_edit_faq`, // 添加/编辑 常见问题
  getAgressContent: `${base}/systemManage/getAgressContent`, // 获取协议
  addAgressContent: `${base}/systemManage/addAgressContent`, // 添加协议
  get_hotstr: `${base}/systemManage/get_hotstr`, // 获取热词
  add_hot_str: `${base}/systemManage/add_hot_str`, // 更新热词
  get_authority_list: `${base}/systemManage/get_authority_list`, // 获取权限列表

  // 提现记录
  getallWithdrawcash: `${base}/order/getallWithdrawcash`,
  getOrderList: `${base}/order/get_order_list`, // 订单列表
  getOrderDesc: `${base}/order/get_order_detail`, // 订单详情
  export_withdraw_cash: `${base}/order/export_withdraw_cash` // 提现导出 excel

}
