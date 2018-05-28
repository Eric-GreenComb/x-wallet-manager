<template>
  <div>
    <common-header :title="'Banner管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <el-form-item label="标题" style="width:95%;text-align: left;">
            <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="位 置" style="text-align: left;width:95%">
            <el-select v-model="ruleForm.type" clearable placeholder="请选择位置"  @change="handleChangeAddress">
              <el-option label="首页" value="home"></el-option>
              <el-option label="分类" value="classfy"></el-option>
              <el-option label="商学院" value="article"></el-option>
              <el-option label="新品推荐" value="new_elect"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类 型" style="text-align: left;width:95%">
            <el-select v-model="ruleForm.infor_type" clearable placeholder="请选择类型"  @change="handleChangeClassfiy">
              <el-option label="活动" value="activity"></el-option>
              <el-option label="商品" value="goods"></el-option>
              <el-option label="课件" value="article"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品/活动/课件" >
            <div style="text-align: left;margin: 0 auto 0px;">
              <el-button v-if="isActivity =='goods'" type="primary" @click="addFind('goods')" size="small">选择商品</el-button>
              <el-button v-if="isActivity =='activity'" type="primary" @click="addFind('activity')" size="small">选择活动</el-button>
              <el-button v-if="isActivity =='article'" type="primary" @click="addFind('article')" size="small">选择课件</el-button>
              <el-button v-if="isActivity ==''" type="primary" size="small" disabled>选择商品/活动/课件</el-button>
            </div>
            <div style="text-align: left;">
              <p>名称：{{goods_name}}</p>
              <img width="100%" :src="pic" alt="" style="min-width: 200px;width: 20%;box-shadow: transparent;">
            </div>
          </el-form-item>
          <el-form-item label="封 面 图（750*360）" prop="pic" >
            <div style="width: 90%;text-align: left;">
              <div v-show=" src==''" class="add-img img-box" @click="uploadInput()" v-if="isShowTrue">
                <i class="el-icon-picture-outline"></i>
              </div>
              <div class="img-box" @click="uploadInput()" v-show="src!=''" v-if="isShowTrue">
                <img :src="src" alt="" ref="img">
              </div>
              <input type="file" ref="file"  v-on:change="upload()" hidden v-if="isShowTrue">
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <div class="header_search">
          <el-row>
            <el-col :span="8">
              <el-input v-model="params.key_word" placeholder="商品名搜索" clearable></el-input>
            </el-col>
            <!--<el-col :span="5" :offset="1">-->
              <!--<div class="block">-->
                <!--<el-cascader clearable placeholder="请选择分类"-->
                             <!--:options="options"-->
                             <!--v-model="selectedOptions"-->
                             <!--@change="handleChange">-->
                <!--</el-cascader>-->
              <!--</div>-->
            <!--</el-col>-->
            <el-col :span="10" :offset="1" style="text-align: left;">
              <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search(isActivity)">搜索</el-button>
            </el-col>
          </el-row>
        </div>
        <p class="clearfix" style="margin-bottom: 10px;"><span class="fl">当前选中标题为：{{nowChoosedRow}}</span><span class="fr" style="color:red">注：点击某行任意位置，即可选中某行</span></p>
        <el-table :data="tableData"  highlight-current-row @current-change="handleCurrentChange2" max-height="450" style="width: 100%;" border v-loading="loading">
          <el-table-column type="index" label="#" width="100%"></el-table-column>
          <el-table-column v-if="isActivity =='goods'" prop="goods_name" label="商品名"></el-table-column>
          <el-table-column v-else prop="title" label="商品名"></el-table-column>
          <el-table-column prop="pic" label="图 片" style="text-align: center;" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.pic" style="width: 100px;" />
            </template>
          </el-table-column>
          <!--<el-table-column label="操作">
            <template scope="scope">
              <el-radio class="radio" v-model="radio" :label='scope.$index'>备选项</el-radio>
            </template>
          </el-table-column>-->
        </el-table>
        <!--分页-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="total_count">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" v-if="isActivity =='goods'" @click="commit('goods')">确 定</el-button>
            <el-button type="primary" v-else @click="commit('other')">确 定</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent,semi */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {getGoodsList, getActivityList, getCollegeMaterialList, addTopBanner, getDetailBanner, uploadMaterialsPic} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        nowChoosedRow: '',
        isActivity: '',
        isShowTrue: true,
        currentRow: null,
        loading: false,
        goods_name: '',
        title: '',
        pic: '',
        date_time: '',
        ruleForm: {
          title: '',
          token: '',
          id: '',
          pic: '',
          type: ''
        },
        file: '',
        src: '',
        tableData: [],
        currentPage1: 1,
        total_count: 0,
//        searchKey: '',
        params: {
          key_word: '',
          page: 1,
          number: 10,
          class_id: 0,
          super_calssid: 0
        },
        dialogFormVisible: false,
        formLabelWidth: '240px',
        dialogTitle: ''
      }
    },
    created () {
      var date = new Date()
      this.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.title2 = this.$route.query.title;
      this.ruleForm.id = this.$route.query.id
      this.ruleForm.token = window.sessionStorage.getItem('session')
      if (this.ruleForm.id != 0){
        this.getContent(this.ruleForm.id);
      }
    },
    methods: {
      handleChangeAddress (val){
        console.log('address',val)
        this.ruleForm.type = val
      },
      handleChangeClassfiy (val){
        console.log('classfiy',val)
        this.ruleForm.infor_type = val
        this.isActivity = val
      },
      uploadInput () {
        this.isShowTrue = true;
        this.$refs.file.click();
      },
      upload () {
        var _this = this;
        if (this.$refs.file.files.length == 0){
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(this.$refs.file.files[0]);
        reader.onload = function () {
          _this.src = this.result;
        };

        var formData = new FormData();
        formData.append('uploadfile', this.$refs.file.files[0]);
        formData.append('type', 'banner') // 上传图片类型，发现图片
        formData.append('date_time', '') // 上传图片类型，发现图片
        this.isShowTrue = false;
        uploadMaterialsPic(formData).then(function (res) {

          if(res.data.errcode==1){
            _this.$message({
              message: '上传图片失败，请重新上传',
              type: 'warning'
            });
            return false;
          } else {
            var obj = {};
            obj['type'] = _this.type;
            obj.value = res.data.data;
            _this.ruleForm.pic = res.data.data.pic_name;
            _this.isShowTrue = true;
            return true;
          }

        }).catch(function (err) {
          _this.isShowTrue = true;
          console.log(err);
        })
      },
      getContent (id){
        var _this = this;
        getDetailBanner({id: id}).then(function (res) {
          _this.isActivity = res.data.data.infor_type
          _this.ruleForm.type = res.data.data.type;
          _this.ruleForm.infor_type = res.data.data.infor_type;
          _this.ruleForm.title = res.data.data.title;
          _this.goods_name = res.data.data.subject.title;
          _this.pic = res.data.data.subject.pic;
          _this.ruleForm.pic = res.data.data.pic.pic_name;
          _this.src = res.data.data.pic.pic_url;
        }).catch(function (err) {
          console.log(err)
        })
      },
      addFind (type) {
        console.log('type',type)
        this.dialogFormVisible = true;
        this.nowChoosedRow = '';
        this.currentRow = '';
        this.getData(type);
      },
      handleSizeChange (val) {
        this.params.number = val
        this.getData(type)
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.getData(type)
      },
      handleCurrentChange2 (val) {
        console.log('ddd',val);
        if (val != null){
          this.currentRow = val
          if (this.currentRow.title){
            this.nowChoosedRow = this.currentRow.title
          } else {
            this.nowChoosedRow = this.currentRow.goods_name
          }
          console.log('val222',val);
        }

      },
      search (type) {
        this.getData(type)
      },
      getData (type) {
        var _this = this
        var typeName = ''
        // 类型不同，传的接口也不同，变量也不同
        if (type == 'goods') {
          // console.log('class_id,surper_calssid,page,number,key_word')
          typeName = getGoodsList

          if (this.params.type == '') {
            delete this.params.type;
          }
          if (this.params.tag_id == '') {
            delete this.params.tag_id;
          }
          this.params.class_id = 0
          this.params.super_calssid = 0
        }
        if (type == 'activity') {
          // console.log('class_id,surper_calssid,page,number,key_word')
          typeName = getActivityList

          if (this.params.type == '') {
            delete this.params.type;
          }
          if (this.params.tag_id == '') {
            delete this.params.tag_id;
          }

          this.params.class_id = 0
          this.params.super_calssid = 0
        }
        if (type == 'article') {
          // console.log('type,tag_id,page,number,key_word')
          typeName = getCollegeMaterialList

          if (this.params.class_id == '') {
              delete this.params.class_id;
          }
          if (this.params.super_calssid == '') {
            delete this.params.super_calssid;
          }
          this.params.type = 'material'
          this.params.tag_id = 0
        }
        typeName(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data.data
          _this.total_count = parseInt(res.data.data.count)
        }).catch(function (err) {
          console.log(err)
        })
      },
      commit (typeCommit) {
        console.log('typeCommit',typeCommit)
        this.dialogFormVisible = false;
        // console.log('this.currentRow',this.currentRow)
        // 商品弹框确定的时候，类型不同，返回的标题字段也不同，这里确定goods_name的值和subject_id的值
        if (typeCommit == 'activity'){
          this.goods_name = this.currentRow.goods_name
        } else {
          this.goods_name = this.currentRow.title
        }
        this.ruleForm.subject_id = this.currentRow.id
        this.pic = this.currentRow.pic
      },
      submitForm (formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.ruleForm.type == '') {
              _this.$message({
                message: '请选择位置',
                type: 'warning'
              });
              return;
            }
            if (_this.ruleForm.infor_type == '') {
              _this.$message({
                message: '请选择类型',
                type: 'warning'
              });
              return;
            }
            if (_this.goods_name == ''){
              this.$message({
                message: '请选择商品',
                type: 'warning'
              });
              return;
            }
            if (_this.ruleForm.pic == ''){
              this.$message({
                message: '请选择封面图',
                type: 'warning'
              });
              return;
            }

            console.log('this.ruleForm', this.ruleForm)

            var _this2 = _this;
            addTopBanner(_this.ruleForm).then(function (res) {
              _this2.$message({
                message: '提交成功',
                type: 'success'
              });
              _this2.$router.push('/bannerList')
              window.close();
            }).catch(function (err) {
              console.log(err)
            })
          }else{
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped>
  .table_pic img{
    height:80px;
  }
  .img-box{
    max-width:375px;
    height:180px;
    line-height:220px;
  }
  .img-box img{
    width:100%;
    height:auto;
  }
  .el-select{
    width:100%;
  }
</style>

