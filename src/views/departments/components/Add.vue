<template>
  <div>
    <!--@close：在点击关闭的X按钮时执行，同时在visible对应的值为false时也会执行-->
    <el-dialog :title="{add:'新增部门',edit:'编辑部门'}[mode]" width="500px" :visible.sync="isShow" @close="closeEvent">
      <!--表单验证
    基本需求:必填、长度1~50
    1. el-form 绑定model，rules,ref
    2. el-form-item prop
    3. rules:{
        prop对应的值:[
        {required:true,message:"错误信息",trigger:"change"},
        {min:1,max:50,message:"请输入1~50字符",trigger:"change"},
        {validator:(rule,value,callback)=>{
            value:当前验证项的值
            callback:正常通过,callback(),失败 callback(new Error('错误信息'))},trigger:"change/blur"
        },
        ]
    }
    全局表单验证
    1.el-form ref
    2.this,$refs.ref值.validate(result)=>{result:true:验证通过,false:验证失败})

-->
      <el-form ref="form" label-width="100px" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model.trim="form.name" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model.trim="form.code" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!--
          1.定义api
          2.导入
          3.调用
              获取焦点时调用接口
          -->
          <el-select v-model="form.manager" @focus="focusEvent">
            <el-option v-for="i in managerList" :key="i.id" :label="i.username" :value="i.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button @click="cancelEvent">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { sysUserSimple, companyDepartmentPost, companyDepartmentPut } from '@/api/departments'
export default {
  props: {
    initList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mode: '', // ‘add’:新增 'edit'：编辑
      isShow: false,
      managerList: [],
      form: {
        name: '', // string	非必须		部门名称
        code: '', // string 非必须		部门编码，同级部门不可重复
        manager: '', // string	非必须		负责人名称
        introduce: '', // string	非必须		介绍
        pid: '' // string	非必须		父级部门ID
      },
      item: '', // 当前点击项数据
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 50, message: '请输入1~50个字符', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              // 自定义表单验证:【新增场景】
              let resultArr = []
              if (this.mode === 'add') {
                // 当前点击项的子兄弟节点不能有同名的
                // 有所有的树形列表数据,通过点击项的id找出他的子集，判断是否能和当前输入项重名
                // 1.找出点击项的子集，initList:原始列表数据，当前点击项数据item
                resultArr = this.initList.filter(i => {
                  if (i.pid === this.item.id) {
                    return true
                  }
                })
              } else if (this.mode === 'edit') {
                /* 【编辑场景】
                 * 验证当前点击项的兄弟部门，并排除自己的部门名，不可重复
                 *  */
                resultArr = this.initList.filter(i => {
                  if (i.pid === this.item.pid && i.id !== this.item.id) {
                    return true
                  }
                })
              }
              // 判断是否重名
              // some:数组中只要有一个项return true，他的返回值就是true
              // 返回值（boolean）= 数组.some(item=>{return boolean},只要有一个项为true，他的返回值就是true)
              const bol = resultArr.some(i => {
                return i.name === value // value是当前input框的值
              })
              // bol为true有重名，不能让验证通过，false没有重名
              bol ? callback(new Error('请不要输入重复的部门名:' + value)) : callback()
            }
          }
        ], // string	非必须		部门名称
        code: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 50, message: '请输入1~50个字符', trigger: 'change' },
          { // 所有项进行code对比m,不可重复
            validator: (rule, value, callback) => {
              // 新增
              let bol = false
              if (this.mode === 'add') {
                bol = this.initList.some(i => {
                  return i.code === value
                })
              } else if (this.mode === 'edit') {
                // 编辑
                bol = this.initList.some(i => {
                  // 当前点击项的id和所输入的部门编码的id相同时重复
                  return i.code === value && i.id !== this.item.id
                })
              }
              bol ? callback(new Error('请不要输入重复code编码：' + value)) : callback()
            }
          }
        ], // string 非必须		部门编码，同级部门不可重复
        manager: [
          { required: true, message: '必填', trigger: 'change' }
        ], // string	非必须		负责人名称
        introduce: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 50, message: '请输入1~50个字符', trigger: 'change' }
        ], // string	非必须		介绍
        pid: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 50, message: '请输入1~50个字符', trigger: 'change' }
        ] // string	非必须		父级部门ID
      }
    }
  },
  watch: {
    /* 侦听器：某个值的change事件
    *   watch:{
    *   需要侦听的字段名不要加this
    *   "需要侦听的字段名":{
    *     handler(newVal,oldVal){
    *       newVal:当前值
    *       oldVal:修改上一刻的值
    *     },
    *     deep:true,
    *     immediate:true 定义时就立刻执行handler，没改变就执行
    *   }
    * }
    *
    * */
    // isShow: {
    //   handler(newVal) {
    //     if (!newVal) {
    //       // 1.重置表单数据为初始值
    //       // 2.移除校验结果
    //       this.$refs.form.resetFields()
    //     }
    //   }
    // }
  },
  mounted() {
    // 触发兄弟组件事件监听
    this.$bus.$on('addEvent', (show, item, mode) => {
      this.isShow = show
      this.item = item
      this.mode = mode
      //  深拷贝(中断和以前的联系) JSON.parse(JSON.stringify(对象))，缺点:function/undefined  会受到影响
      // 只有编辑时需要复制form
      if (mode === 'edit') { this.form = JSON.parse(JSON.stringify(item)) }
    })
  },
  beforeDestroy() {
    // 事件监听销毁
    this.$bus.$off('addEvent')
  },
  methods: {
    // 取消事件
    cancelEvent() {
      this.isShow = false
    },
    // 获取员工列表
    async focusEvent() {
      if (this.managerList.length === 0) {
        const res = await sysUserSimple()
        this.managerList = res.data
      }
    },
    // 确定点击
    submit() {
      this.$refs.form.validate(async(result) => {
        if (result) {
          if (this.mode === 'add') {
            this.form.pid = this.item.id
            await companyDepartmentPost(this.form)
            this.$message.success('添加成功')
          } else if (this.mode === 'edit') {
            await companyDepartmentPut(this.form)
            this.$message.success('编辑成功')
          }
          this.isShow = false
          // 刷新父级列表数据，触发父级方法
          this.$emit('getData')
        }
      })
    },
    // 关闭时的回调
    closeEvent() {
      // 重置表单数据为初始化数据【表单第一次渲染时的数据】，清除表单验证
      this.$refs.form.resetFields()
      // 手动重置数据
      this.form = {
        name: '', // string	非必须		部门名称
        code: '', // string 非必须		部门编码，同级部门不可重复
        manager: '', // string	非必须		负责人名称
        introduce: '', // string	非必须		介绍
        pid: '' // string	非必须		父级部门ID
      }
    }
  }
}
</script>

<style scoped>

</style>
