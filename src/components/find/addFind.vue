<template>
  <div>
    <common-header :title="'发现'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标   题">
            <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="简   介">
            <el-input type="textarea" autosize v-model="ruleForm.dis" placeholder="请输入简介" clearable></el-input>
          </el-form-item>
          <el-form-item label="商   品">
            <div style="text-align: left;margin: 0 auto 0px;">
              <el-button type="primary" @click="addFind" size="small">选择商品</el-button>
            </div>
            <div style="text-align: left;">
              <p>商品名称：{{goods_name}}</p>
              <img width="100%" :src="pic" alt="" style="min-width: 200px;width: 20%;box-shadow: transparent;">
            </div>
          </el-form-item>
          <!--<el-form-item label="图 片（300*300）" prop="pic" >
            <div style="width: 90%;text-align: left;">
              <div v-show=" src==''" class="add-img img-box" @click="uploadInput()">
                <i class="el-icon-picture-outline"></i>
              </div>
              <div class="img-box" @click="uploadInput()" v-show="src!=''">
                <img :src="src" alt="" ref="img">
              </div>
              <input type="file" ref="file"  v-on:change="upload()" hidden>
            </div>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
          </el-form-item>
        </el-form>
      </div>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <div class="header_search" style="margin-bottom: 10px;">
          <el-row>
            <el-col :span="8">
              <el-input v-model="params.key_word" placeholder="商品名搜索"></el-input>
            </el-col>
            <!--<el-col :span="5" :offset="1">
              <div class="block">
                <el-cascader clearable placeholder="请选择分类"
                             :options="options"
                             v-model="selectedOptions"
                             @change="handleChange">
                </el-cascader>
              </div>
            </el-col>-->
            <el-col :span="10" :offset="1" style="text-align: left;">
              <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()">搜索</el-button>
            </el-col>
          </el-row>
        </div>
        <p class="clearfix" style="margin-bottom: 10px;"><span class="fl">当前选中商品为：{{nowChoosedRow}}</span><span
          class="fr" style="color:red">注：点击某行任意位置，即可选中某行</span></p>
        <el-table :data="tableData" highlight-current-row @current-change="handleCurrentChange2" max-height="450"
                  style="width: 100%;" border v-loading="loading">
          <el-table-column type="index" label="#" width="100%"></el-table-column>
          <el-table-column prop="goods_name" label="商品名"></el-table-column>
          <el-table-column prop="pic" label="图片" style="text-align: center;" min-width="120">
            <template slot-scope="scope">
              <img :src="scope.row.pic" class="table_pic"/>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作说明">
           <template scope="scope">
              <el-radio class="radio" v-model="radio" :label='scope.$index'>选项</el-radio>
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
  import {getClassfiy, getGoodsList, addGoods, getDetailFindinfo} from '../../api/index'

  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        nowChoosedRow: '',
        choosedId: '',
        dialogFormVisible: false,
        formLabelWidth: '240px',
        dialogTitle: '',
        goods_name: '',
        pic: '',
        radio: '',
        currentRow: null,
        date_time: '',
        loading: false,
        tableData: [],
        currentPage1: 1,
        total_count: 0,
        params: {
          key_word: '',
          page: 1,
          number: 10,
          class_id: 0,
          super_calssid: 0
        },
        ruleForm: {
          id: '',
          title: '',
          dis: '',
          subject_id: '',
//        pics: '',
//        pic_times: '',
          token: ''
        },
//      file: '',
//      src: ''
      }
    },
    created () {
      this.title2 = this.$route.query.title
      var date = new Date()
      this.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.ruleForm.id = this.$route.query.id
      this.ruleForm.token = window.sessionStorage.getItem('session')
      if (this.ruleForm.id != 0) {
        this.getContent(this.ruleForm.id);
      }
    },
    methods: {
      /* uploadInput () {
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
       formData.append('date_time', this.date_time);
       formData.append('type', 'poster')  //上传图片类型，发现图片

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
       _this.ruleForm.pics = res.data.data.pic_name;
       return true;
       }

       }).catch(function (err) {
       console.log(err);
       })
       },*/
      handleSizeChange (val) {
        this.params.number = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.getData()
      },
      handleCurrentChange2 (val) {
        this.currentRow = val
        this.nowChoosedRow = this.currentRow.goods_name
        this.$message({
          message: '选中' + this.currentRow.goods_name,
          type: 'success'
        });
      },
      /* handleChange (value) {
       this.params.class_id = value[1]
       this.params.super_calssid = value[0]
       },*/
      getContent (id){
        var _this = this;
        getDetailFindinfo({id: id}).then(function (res) {
          _this.ruleForm.title = res.data.data.title;
          _this.ruleForm.dis = res.data.data.dis;
          _this.ruleForm.subject_id = res.data.data.subject_id;
          _this.goods_name = res.data.data.goods_name;
//        _this.ruleForm.pics = res.data.data.pics[0].pic_name;
//        _this.src = res.data.data.pics[0].pic_url;
          _this.pic = res.data.data.goods_pic;
        }).catch(function (err) {
          console.log(err)
        })
      },
      /* getorgan () {
       var _this = this
       getClassfiy().then(function (res) {
       for (var i = 0; i < res.data.data.length; i++) {
       var obj = {
       value: res.data.data[i].id,
       label: res.data.data[i].name,
       children: []
       }
       _this.options.push(obj)
       for (var j = 0; j < res.data.data[i].subs.length; j++) {
       var obj2 = {
       value: res.data.data[i].subs[j].id,
       label: res.data.data[i].subs[j].name
       }
       obj.children.push(obj2)
       }
       }
       }).catch(function (err) {
       console.log(err)
       })
       },*/
      search () {
        this.getData()
      },
      getData () {
        var _this = this
        if (this.selectedOptions == '') {
          this.params.number = 10
          this.params.class_id = 0
          this.params.super_calssid = 0
        }
        getGoodsList(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data.data
          _this.total_count = parseInt(res.data.data.count)
        }).catch(function (err) {
          console.log(err)
        })
      },
      addFind () {
        this.dialogFormVisible = true;
        this.dialogTitle = '商品'
        this.getData()
      },
      commit () {
        console.log('this.currentRow', this.currentRow)
        if (this.currentRow == null) {
          this.$message({
            message: '请选择商品',
            type: 'warning'
          });
          return;
        }

        this.dialogFormVisible = false;
        this.goods_name = this.currentRow.goods_name
        this.pic = this.currentRow.pic
        this.ruleForm.subject_id = this.currentRow.id
      },
      submitForm (formName) {

        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.ruleForm.title == '') {
              _this.$message({
                message: '请输入标题',
                type: 'warning'
              });
              return;
            }
            if (_this.ruleForm.dis == '') {
              _this.$message({
                message: '请输入简介',
                type: 'warning'
              });
              return;
            }
            if (_this.goods_name == '') {
              this.$message({
                message: '请选择商品',
                type: 'warning'
              });
              return;
            }

//          if (_this.ruleForm.pics == ''){
//            this.$message({
//              message: '请选择图片',
//              type: 'warning'
//            });
//            return;
//          }

//          this.ruleForm.pic_times = ''+ this.date_time;
            console.log('this.ruleForm', this.ruleForm)
            var _this2 = _this;
            addGoods(_this.ruleForm).then(function (res) {
              _this2.$message({
                message: '提交成功',
                type: 'success'
              });

              _this2.$router.push('/find')
              window.close();

            }).catch(function (err) {
              console.log(err)
            })
          } else {
            console.log('error submit!!')
            return false;
          }
        });
      }
    },
    beforeRouteEnter(to, from, next){
      console.log('我是第三个页面的beforeRouteEnter方法')
      next()
    }
  }
</script>
<style scoped>
  .table_pic {
    width: auto;
    height: 80px;
  }
</style>
