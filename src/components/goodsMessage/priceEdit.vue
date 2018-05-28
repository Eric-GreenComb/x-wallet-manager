<template>
  <div>
    <common-header :title="'商品管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'编辑价格'"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="names" label="规格"></el-table-column>
        <el-table-column prop="goods_code" label="编号"></el-table-column>
        <el-table-column prop="bar_code" label="商品条码"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="original_price" label="销售价格"></el-table-column>
        <el-table-column prop="purchase_price" label="进货价格"></el-table-column>
        <el-table-column prop="promotion_price" label="优惠价格"></el-table-column>
        <el-table-column prop="integral" label="积分"></el-table-column>
        <el-table-column prop="interest_rate" label="毛利率"></el-table-column>
        <el-table-column prop="pr_integral" label="促销积分"></el-table-column>
        <el-table-column prop="pr_rate" label="促销毛利率"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px"
                       @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线
            </el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px"
                       @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线
            </el-button>
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑
            </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item v-for="(item,index) in list" :label="item.propName" style="text-align: left;">
            <template v-for="value in item.values">
              <input type="radio" :name="value.valueId" :value="value.valueId" v-model="choosed[index].value">
              <span>{{value.name}}</span>
            </template>
          </el-form-item>
          <el-form-item label="编  号" prop="goods_code">
            <el-input v-model="ruleForm.goods_code" placeholder="请输入编号"></el-input>
          </el-form-item>
          <el-form-item label="商品条码" prop="bar_code">
            <el-input v-model="ruleForm.bar_code" placeholder="请输入商品条码"></el-input>
          </el-form-item>
          <el-form-item label="库  存" prop="stock">
            <el-input v-model="ruleForm.stock" placeholder="请输入库存"></el-input>
          </el-form-item>
          <el-form-item label="销售价格" prop="original_price">
            <el-input v-model="ruleForm.original_price" placeholder="请输入销售价格"></el-input>
          </el-form-item>
          <el-form-item label="进货价格" prop="purchase_price">
            <el-input v-model="ruleForm.purchase_price" placeholder="请输入进货价格"></el-input>
          </el-form-item>

          <el-form-item label="积 分" prop="integral">
            <el-input v-model="ruleForm.integral" placeholder="请输入积分"></el-input>
          </el-form-item>
          <el-form-item label="毛 利 率" prop="interest_rate">
            <el-input v-model="ruleForm.interest_rate" placeholder="请输入毛利率"></el-input>
          </el-form-item>
          <el-form-item label="促销价格" prop="promotion_price">
            <el-input v-model="ruleForm.promotion_price" placeholder="请输入促销价格"></el-input>
          </el-form-item>
          <el-form-item label="促销积分" prop="pr_integral">
            <el-input v-model="ruleForm.pr_integral" placeholder="请输入促销积分"></el-input>
          </el-form-item>
          <el-form-item label="促销毛利率" prop="pr_rate">
            <el-input v-model="ruleForm.pr_rate" placeholder="请输入促销毛利率"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {
    getGoodsPricesize,
    getSizeList,
    addGoodsPricesize,
    getDetailPricesize,
    deleteCommonWithType
  } from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        loading: true,
        isDasabled: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogTitle: '',
        successMsg: '',
        errorMsg: '',
        tableData: [],
        list: [],
        choosed: [],
        params: {
          goods_id: ''
        },
        ruleForm: {// 编辑的弹框展示
          token: '',
          id: '', // 新建为0
          names: '红色 32G',
          goods_id: 1,
          original_price: 60, // 销售价
          stock: 0,
          promotion_price: 20, // 促销价格
          integral: 10,
          pvs: '1:1;2:5',
          interest_rate: 0.35, // 毛利率
          purchase_price: 0, // 进价
          goods_code: 0, // 商品代码
          bar_code: 0, // 商品条码
          pr_integral: 0, // 促销积分
          pr_rate: 0 // 促销毛利率
        },
        params3: { // table表格数据展示
          id: '',
          token: '',
          table: 'goods_price'
        },
        ruleForm2: {// 编辑的弹框提交修改
          name: '',
          sex: '',
          time: ''
        },
        rules: {// 验证规则
          names: [
            {required: true, message: '请输入规格', trigger: 'blur'}
          ],
          goods_code: [
            {required: true, message: '请输入编号', trigger: 'blur'}
          ],
          bar_code: [
            {required: true, message: '请输入商品条码', trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '请输入库存', trigger: 'blur'}
          ],
         /* promotion_price: [
            {required: true, message: '请输入优惠价格', trigger: 'blur'}
          ],*/
          purchase_price: [
            {required: true, message: '请输入进货价格', trigger: 'blur'}
          ],
          original_price: [
            {required: true, message: '请输入销售价格', trigger: 'blur'}
          ],
          integral: [
            {required: true, message: '请输入积分', trigger: 'blur'}
          ],
          interest_rate: [
            {required: true, message: '请输入毛利率', trigger: 'blur'}
          ]
          /*pr_integral: [
            {required: true, message: '请输入促销积分', trigger: 'blur'}
          ],
          pr_rate: [
            {required: true, message: '请输入促销毛利率', trigger: 'blur'}
          ]*/
        }
      }
    },
    created () { // 一进页面就执行方法
      this.params.goods_id = this.$route.query.id
      this.ruleForm.token = window.sessionStorage.getItem('session')
      this.params3.token = window.sessionStorage.getItem('session')
      this.getData()
      var _this = this;
      getSizeList({goods_id: this.$route.query.id}).then(function (res) {
        console.log('res', res.data.data)
        _this.list = res.data.data;
        var _this2 = _this;
        _this.list.forEach(function (item) {
//          console.log('item',item)
          var obj = {
            'value': item.values[0].valueId,
            'name': item.propName,
            'propId': item.propId
          };
          _this2.choosed.push(obj);
//          console.log('_this2.choosed',_this2.choosed);
        })
      }).catch(function (err) {
        console.log(err)
      })
    },
    methods: {
      handleSizeChange (val) {
        this.params.page_size = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.start = val
        this.getData()
      },
      getData () {
        var _this = this
        getGoodsPricesize(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data
        }).catch(function (err) {
          console.log(err)
        })
      },
      /*getClass (id){
       var _this = this;
       getSizeList({goods_id:id}).then(function (res) {
       //          _this.list = res.data.data;
       }).catch(function (err) {
       console.log(err)
       })
       },*/
      add () {
        this.ruleForm.goods_code = ''
        this.ruleForm.stock = ''
        this.ruleForm.original_price = ''
        this.ruleForm.purchase_price = ''
        this.ruleForm.promotion_price = ''
        this.ruleForm.integral = ''
        this.ruleForm.interest_rate = ''
        this.ruleForm.pr_integral = ''
        this.ruleForm.pr_rate = ''
        this.ruleForm.names = ''
        this.ruleForm.pvs = ''
        this.ruleForm.bar_code = ''
        this.dialogTitle = '添加'
        this.dialogFormVisible = true
        this.ruleForm.id = 0
        this.ruleForm.goods_id = this.$route.query.id
      },
      getContent (id, id2) {
        var _this = this
        getDetailPricesize({id: id}).then(function (res) {
          _this.ruleForm = res.data.data
          _this.ruleForm.id = id2
          var arr = res.data.data.pvs.split(';')
          var xx = [] // 后台返回结果拼装完成后的
          for (var i = 0; i < arr.length; i++) {
            var newobj = {
              propId: (arr[i].split(':'))[0],
              valueId: (arr[i].split(':'))[1]
            }
            xx.push(newobj)
          }
          console.log('xx', xx)

          for (var i = 0; i < _this.list.length; i++) {
            // 循环判断是否还有某个规格，规格id是否一致，一致则取到读取的id
            if (xx[i].propId == _this.list[i].propId) {
              _this.choosed[i].value = xx[i].valueId
              console.log('_this.choosed[i', _this.choosed[i].value)
            }
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.errorMsg
          })
        })
      },
      isUpRow (is_show, id) {
        var _this = this
        this.params3.id = id
        if (is_show == 0) {
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
      editRow (id) {
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.ruleForm.id = id
        this.getContent(id, this.ruleForm.id)
        this.ruleForm.goods_id = this.$route.query.id
        console.log('this.rule', this.ruleForm)
      },
      commit (formName) {
        this.ruleForm.pvs = ''
        this.ruleForm.names = ''
        var _this = this

        for (var i = 0; i < this.choosed.length; i++) {

          if (this.choosed[i].propId == this.list[i].propId) {

            for (var j = 0; j < this.list[i].values.length; j++) {

              if (this.choosed[i].value == this.list[i].values[j].valueId) {
                this.ruleForm.names += this.list[i].values[j].name + ' '
              }
            }
          }
        }

        console.log('choose_ok', _this.choosed)
        for (var i = 0; i < this.choosed.length; i++) {
          this.ruleForm.pvs += this.choosed[i].propId + ':' + this.choosed[i].value + ';'
        }
        this.ruleForm.pvs = this.ruleForm.pvs.substring(0, this.ruleForm.pvs.length - 1)

        console.log('this.ruleForm', this.ruleForm)
        this.ruleForm.token = window.sessionStorage.getItem('session')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.pvs != '') {
              addGoodsPricesize(_this.ruleForm).then(function (res) {
                if (res.data.errcode == 0) {
                  _this.$message({
                    message: '成功',
                    type: 'success'
                  })
                  _this.getData()
                } else {
                  _this.$message({
                    message: '失败',
                    type: 'warning'
                  })
                }
                _this.getData()
              }).catch(function (err) {
                console.log(err)
              })
              this.dialogFormVisible = false
            } else {
              this.$message({
                type: 'error',
                message: '请先编辑规格，再来编辑价格哦!'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
    /*beforeRouteLeave (to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true // 让 A 缓存，即不刷新
      next()
    }*/
  }
</script>
<style scoped>
  .el-input, .el-select {
    width: 90%;
  }

  .table_pic {
    width: auto;
    height: 50px;
  }

  input {
    margin-left: 5%;
  }

</style>
