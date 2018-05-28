<template>
  <div>
    <common-header :title="'团购'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker v-model="ruleForm.start_time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择开始时间" style="width:100%" auto-complete="off" ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker v-model="ruleForm.end_time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime"  placeholder="请选择结束时间" style="width:100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="成员人数" prop="start_quantity">
            <el-input v-model="ruleForm.start_quantity" placeholder="请输入成员人数" clearable></el-input>
          </el-form-item>
          <el-form-item label="商   品" prop="goods_id">
            <div style="text-align: left;margin: 0 auto 0px;">
              <el-button type="primary" @click="addFind" size="small">选择商品</el-button>
            </div>
            <div style="text-align: left;">
              <p>商品名称：{{goods_name}}</p>
              <img width="100%" :src="pic" alt="" style="min-width: 200px;width: 20%;box-shadow: transparent;">
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
          </el-form-item>
        </el-form>
      </div>
      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <!--<el-form style="" :model="ruleForm" ref="ruleForm" label-position="right" label-width="120px" class="demo-ruleForm"></el-form>-->
        <div class="header_search">
          <el-row>
            <el-col :span="8">
              <el-input v-model="params.key_word" placeholder="商品名搜索" clearable></el-input>
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
        <p class="clearfix" style="margin-bottom: 10px;"><span class="fl">当前选中商品为：{{nowChoosedRow}}</span><span class="fr" style="color:red">注：点击某行任意位置，即可选中某行</span></p>
        <el-table :data="tableData"  highlight-current-row @current-change="handleCurrentChange2" max-height="450" style="width: 100%;" border v-loading="loading">
          <el-table-column type="index" label="#" width="100%"></el-table-column>
          <el-table-column prop="goods_name" label="商品名"></el-table-column>
          <el-table-column prop="pic" label="图片" style="text-align: center;" max-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.pic" class="table_pic"/>
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
          <el-button type="primary" @click="commit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent,semi */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {getGoodsList, getClassfiy, addGroupActivity, getDetailActivityGoods} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        nowChoosedRow: '',
        choosedId: '',
        radio: '',
        currentRow: null,
        loading: false,
        goods_name: '',
        pic: '',
        ruleForm: {
          token: '',
          id: '',
          start_quantity: '',
          start_time: '',
          end_time: ''
        },
        tableData: [],
        currentPage1: 1,
        total_count: 0,
//        searchKey: '',
//        options: [],
        params: {
          key_word: '',
          page: 1,
          number: 10,
          class_id: 0,
          super_calssid: 0
        },
        dialogFormVisible: false,
        formLabelWidth: '240px',
        dialogTitle: '商品',
//        selectedOptions: [],
        rules: {
          start_time: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          end_time: [
            { required: true, message: '请选择结束时间', trigger: 'blur' }
          ],
          start_quantity: [
            { required: true, message: '请输入人员数量', trigger: 'blur' }
          ],
          goods_id: [
            { required: true, message: '请选择商品', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.title2 = this.$route.query.title;
      this.ruleForm.id = this.$route.query.id
      this.ruleForm.token = window.sessionStorage.getItem('session')
      if (this.ruleForm.id != 0){
         this.getContent(this.ruleForm.id);
      }
    },
    methods: {
      /*getorgan () {
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
      getContent (id){
        var _this = this;
        getDetailActivityGoods({id: id}).then(function (res) {
          _this.ruleForm.start_time = res.data.data.start_time;
          _this.ruleForm.end_time = res.data.data.end_time;
          _this.ruleForm.goods_id = res.data.data.goods_id;
          _this.ruleForm.start_quantity = res.data.data.start_quantity;
          _this.goods_name = res.data.data.goods_name;
          _this.pic = res.data.data.pics;
          _this.ruleForm.goods_id = res.data.data.goods_id;
        }).catch(function (err) {
          console.log(err)
        })
      },
      addFind () {
        this.dialogFormVisible = true;
//        this.getorgan();
        this.getData();
      },
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
          message: '选中'+ this.currentRow.goods_name,
          type: 'success'
        });
      },
      search () {
        this.getData()
      },
      /*handleChange (value) {
        this.params.class_id = value[1]
        this.params.super_calssid = value[0]
      },*/
      getData () {
        var _this = this
        /*if (this.selectedOptions ==''){
          this.params.number = 10
          this.params.class_id = 0
          this.params.super_calssid = 0
        }*/
        getGoodsList(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data.data
          _this.total_count = parseInt(res.data.data.count)
        }).catch(function (err) {
          console.log(err)
        })
      },
      commit () {
        console.log('this.currentRow',this.currentRow)
        if (this.currentRow == null){
          this.$message({
            message: '请选择商品',
            type: 'warning'
          });
          return;
        }
        this.dialogFormVisible = false;
        this.goods_name = this.currentRow.goods_name
        this.pic = this.currentRow.pic
        this.ruleForm.goods_id = this.currentRow.id
      },
      submitForm (formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (_this.ruleForm.start_time != '' && _this.ruleForm.end_time != '') {
              if (_this.ruleForm.start_time > _this.ruleForm.end_time) {
                _this.$message({
                  message: '开始时间不能大于结束时间',
                  type: 'warning'
                });
                return;
              }
            }
            if (_this.goods_name == ''){
              this.$message({
                message: '请选择商品',
                type: 'warning'
              });
              return;
            }
            console.log('this.ruleForm', this.ruleForm)

            var _this2 = _this;
            addGroupActivity(_this.ruleForm).then(function (res) {
              _this2.$message({
                message: '提交成功',
                type: 'success'
              });

              _this2.$router.push('/groupBuying')
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
    /*beforeRouteLeave (to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true; // 让 A 缓存，即不刷新
      next();
    }*/
  }
</script>
<style scoped>
  .table_pic{
    width: auto;
    height: 50px;
  }
</style>

