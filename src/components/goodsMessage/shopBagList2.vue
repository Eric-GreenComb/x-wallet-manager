<template>
  <div>
    <common-header :title="'店长礼包'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="gift_name"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
      </div>
      <el-table :data="tableData" max-height="500" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="names" label="商品组合名" min-width="150"></el-table-column>
        <el-table-column prop="bar_code" label="商品条码"></el-table-column>
        <el-table-column prop="goods_code" label="商品代号"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="original_price" label="销售价格"></el-table-column>
        <el-table-column prop="purchase_price" label="进货价格"></el-table-column>
        <el-table-column prop="integral" label="积分"></el-table-column>
        <el-table-column prop="interest_rate" label="毛利率"></el-table-column>
        <el-table-column prop="pic" label="图片" min-width="200">
          <template slot-scope="scope">
            <img :src="(scope.row).pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" v-if="scope.row.is_show == 1" @click="isUpRow(scope.row.is_show, scope.row.id)" type="primary" size="mini">上线</el-button>
            <el-button style="margin: 0px 5px 5px" v-if="scope.row.is_show == 0" @click="isUpRow(scope.row.is_show, scope.row.id)" type="info" size="mini">下线</el-button>
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品组合名" prop="names">
            <el-input v-model="ruleForm.names" placeholder="请输入商品组合名" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品主图(750*750)">
            <el-upload style="width: 90%;margin: 0 auto;text-align: left;"
                       :action="actionUrl"
                       v-model="ruleForm.pics"
                       list-type="picture-card"
                       name="uploadfile"
                       :data= "upLoadData"
                       :file-list= "fileListPic"
                       :on-success="successMessage"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品条码" prop="bar_code">
            <el-input v-model="ruleForm.bar_code" placeholder="请输入商品条码" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品代号" prop="goods_code">
            <el-input v-model="ruleForm.goods_code" placeholder="请输入商品代号" clearable></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="ruleForm.stock" placeholder="请输入库存" clearable></el-input>
          </el-form-item>
          <el-form-item label="销售价格" prop="original_price">
            <el-input v-model="ruleForm.original_price" placeholder="请输入销售价格" clearable></el-input>
          </el-form-item>
          <el-form-item label="进货价格" prop="purchase_price">
            <el-input v-model="ruleForm.purchase_price" placeholder="请输入进货价格" clearable></el-input>
          </el-form-item>
          <el-form-item label="积分" prop="integral">
            <el-input v-model="ruleForm.integral" placeholder="请输入积分" clearable></el-input>
          </el-form-item>
          <el-form-item label="毛利率" prop="interest_rate">
            <el-input v-model="ruleForm.interest_rate" placeholder="请输入毛利率" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import config from '../../api/config' // 引入config文件里，图片上传的方法第一步
  import {getGiftGoods, deleteCommonWithType, getGiftgoodsDetail, addEditGiftgoods} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        gift_name: '',
        actionUrl: '',
        upLoadData: {
          date_time: '',
          type: 'goods'
        },
        fileListPic:[],
        dialogImageUrl:'',
        dialogVisible: false,
        picArr: [],
        isShowTrue: true,
        date_time: '',
        pic: '',
        file: '',
        loading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogTitle: '',
        successMsg: '',
        errorMsg: '',
        textMessage: '',
        tableData: [],
        ids: 0,
        params: { // table表格数据展示
          subject_id: 1
        },
        ruleForm: {// 编辑的弹框展示
          id: '',
          names: '',
          goods_id: '',
          original_price: '',
          stock: '',
          integral: '',
          purchase_price: '',
          interest_rate: '',
          goods_code: '',
          bar_code: '',
          pics: '',
          pic_times: '',
          token: ''
        },
        params3: {
          id: '',
          token: '',
          table: 'goods_price'
        },
      }
    },
    mounted () {
      this.actionUrl = config.uploadMaterialsPic // 引入config文件里，图片上传的方法第二步
      this.gift_name = '店长礼包_'+this.$route.query.gift_name
      console.log('this.gift_name',this.gift_name)
    },
    created () { // 一进页面就执行方法
      this.params3.token = window.sessionStorage.getItem('session')
      this.ruleForm.token = window.sessionStorage.getItem('session')
      this.params.subject_id = this.$route.query.subject_id
      this.ruleForm.goods_id = this.$route.query.subject_id

      var date = new Date()
      this.upLoadData.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.getData()
    },
    methods: {
      handleRemove (file, fileList) {
        console.log('fileListdel',fileList)
        this.picArr = [];
        for (var i = 0; i < fileList.length; i++) {
          console.log('i',fileList[i])
          if ('response' in fileList[i]) {
            this.picArr.push(fileList[i].response.data)
          } else {
            var obj = {
              date_time: this.upLoadData.date_time,
              pic_name: fileList[i].name,
              pic_url: fileList[i].url
            }
            this.picArr.push(obj)
          }
        }
        console.log('del',this.picArr)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      successMessage (file,fileList) {
        var obj = fileList.response.data
        this.picArr.push(obj)
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        console.log('file',file);
      },
      getData () {
        var _this = this
        getGiftGoods(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data
          _this.ruleForm.goods_id = res.data.data[0].goods_id
        }).catch(function (err) {
        })
      },
      add () {
        this.dialogTitle = '添加'
        this.dialogFormVisible = true
        this.ruleForm.id = 0
        this.ruleForm.super_id = this.params.super_id
        this.ruleForm.names = ''
        this.ruleForm.original_price = ''
        this.ruleForm.stock = ''
        this.ruleForm.integral = ''
        this.ruleForm.purchase_price = ''
        this.ruleForm.interest_rate = ''
        this.ruleForm.goods_code = ''
        this.ruleForm.bar_code = ''
        this.fileListPic = []
        this.src = ''
      },
      editRow (id) {
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.ruleForm.id = id
        this.getContent(id)
      },
      getContent (id) {
        var _this = this;
        var getpic_name = ''
        var getpic_url = ''
        this.fileListPic = []
        this.picArr = []
        getGiftgoodsDetail({id: id}).then(function (res) {
          console.log('res',res)
          _this.ruleForm.names = res.data.data.names
          _this.ruleForm.goods_code = res.data.data.goods_code
          _this.ruleForm.bar_code = res.data.data.bar_code
          _this.ruleForm.integral = res.data.data.integral
          _this.ruleForm.interest_rate = res.data.data.interest_rate
          _this.ruleForm.original_price = res.data.data.original_price
          _this.ruleForm.purchase_price = res.data.data.purchase_price
          _this.ruleForm.stock = res.data.data.stock
          _this.ruleForm.pics = res.data.data.pics[0].pic_name
          _this.ruleForm.pic_times = res.data.data.pics[0].pic_time
          _this.src = res.data.data.pics[0].pic_url

          for (var i = 0; i < res.data.data.pics.length; i++) {
            var obj = {
              name: res.data.data.pics[i].pic_name,
              url: res.data.data.pics[i].pic_url
            }
            if(obj.name != ''){
              _this.fileListPic.push(obj)  // 展示在页面上
              getpic_name += res.data.data.pics[i].pic_name + ','
              getpic_url += res.data.data.pics[i].pic_url + ','
            }
          }

          var obj2 = {
            date_time: res.data.data.pics[0].pic_time,
            pic_name: getpic_name.substring(0,getpic_name.length-1),
            pic_url: getpic_url
          }
          _this.picArr.push(obj2) // 后台得到的图片数组
          console.log('dss',_this.picArr)
        }).catch(function (err) {
          console.log(err)
        })
      },
      isUpRow (is_show, id) {
        var _this = this
        this.params3.id = id
        if (is_show == 0 ){
          this.params3.type = 'on'
          this.textMessage = '是否上线, 是否继续?'
          this.successMsg = '上线成功！'
          this.errorMsg = '已取消上线'
        } else {
          this.params3.type = 'off'
          this.textMessage = '是否下线, 是否继续?'
          this.successMsg = '下线成功！'
          this.errorMsg = '已取消下线'
        }

        this.$confirm(this.textMessage, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCommonWithType(this.params3).then(function (res) {
            if (res.data.errcode == 0) {
              _this.$message({
                type: 'success',
                message: _this.successMsg
              })
              _this.getData()
            }
          }).catch(function (err) {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.errorMsg
          })
        })
      },
      delRow (id) {
        var _this = this;
        this.$confirm('是否删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.params3.type = 'delete'
          this.params3.id = id
          deleteCommonWithType(this.params3).then(function (res) {
            if (res.data.errcode == 0) {
              _this.$message({
                type: 'success',
                message: '删除成功'
              })
              _this.getData()
            }
          }).catch(function (err) {
            console.log(err)
          })
          this.getData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      commit () {
        this.ruleForm.pic_times = ''
        this.ruleForm.pics = ''
        var pic_times = ''
        var pics = ''
        console.log('picArr',this.picArr);
        for (var i = 0; i < this.picArr.length; i++) {
          pic_times += this.picArr[i].date_time + ','
          pics += this.picArr[i].pic_name + ','
        }
        this.ruleForm.pic_times = pic_times.substring(0,pic_times.length-1)
        this.ruleForm.pics = pics.substring(0,pics.length-1)

        var _this = this
        if (this.ruleForm.names == ''){
          this.$message({
            type: 'warning',
            message: '名称不能为空哦'
          })
          return
        }

        if (this.ruleForm.bar_code == ''){
          this.$message({
            type: 'warning',
            message: '商品条码不能为空哦'
          })
          return
        }

        if (this.ruleForm.goods_code == ''){
          this.$message({
            type: 'warning',
            message: '商品代号不能为空哦'
          })
          return
        }

        if (this.ruleForm.original_price == ''){
          this.$message({
            type: 'warning',
            message: '销售价不能为空哦'
          })
          return
        }

        if (this.ruleForm.stock == ''){
          this.$message({
            type: 'warning',
            message: '库存不能为空哦'
          })
          return
        }

        if (this.ruleForm.integral == ''){
          this.$message({
            type: 'warning',
            message: '积分不能为空哦'
          })
          return
        }

        if (this.ruleForm.purchase_price == ''){
          this.$message({
            type: 'warning',
            message: '进货价不能为空哦'
          })
          return
        }

        if (this.ruleForm.interest_rate == ''){
          this.$message({
            type: 'warning',
            message: '毛利率不能为空哦'
          })
          return
        }

        if (this.ruleForm.pics == ''){
          this.$message({
            type: 'warning',
            message: '请选择图片哦'
          })
          return
        }

        addEditGiftgoods(this.ruleForm).then(function (res) {
          if (res.data.errcode == 0) {
            _this.$message({
              message: '成功',
              type: 'success'
            })
            _this.getData()
            _this.dialogFormVisible = false
          } else {
            _this.$message({
              message: '失败',
              type: 'warning'
            })
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    }
  }
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }
  .table_pic{
    width: auto;
    height: 80px;
  }
  .img-box img{
    width:350px;
    height:350px;
  }

</style>
