<template>
  <div>
    <el-dropdown trigger="click" @command="handleCommand">
      <i class="el-icon-s-tools"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="switch">{{ canModifyUi }}</el-dropdown-item>
        <el-dropdown-item command="save">保存界面</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="收货地址" :visible.sync="jsEdiorVisible">
      <vue-json-editor
        class="json-editor"
        v-model="json"
        lang="zh"
        :show-btns="true"
        :expandedOnStart="true"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      >
        ></vue-json-editor
      >
      <button type="button" @click="resetJson">reset</button>
    </el-dialog>
  </div>
</template>

<script>
import { getDesc, addDesc, delDesc, saveDesc } from '@/api/erp/desc'
import { mapGetters } from 'vuex'
import vueJsonEditor from 'vue-json-editor'
export default {
  components: {
    vueJsonEditor
  },
  data() {
    return {
      jsEdiorVisible: false,
      json: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userDesc',
      'labelDesc'
      // ...
    ]),

    canModifyUi() {
      if (this.$store.getters.canModifyUI) {
        return '关闭定制'
      } else {
        return '开启定制'
      }
    }
  },
  methods: {
    onJsonChange(value) {},
    onJsonSave(value) {
      this.$store.dispatch('desc/saveUserDesc', value)
      this.$store.dispatch('desc/makeLabel', value)
    },
    onError(value) {
      console.log('value:', value)
    },
    resetJson() {
      this.json = this.userDesc
    },
    handleCommand(c) {
      if (c === 'switch') {
        this.jsEdiorVisible = true
      } else {
        saveDesc(this.name, this.userDesc).then((response) => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.open = false
          } else {
            this.msgError(response.msg)
          }
        })
        saveDesc('label', this.labelDesc).then((response) => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.open = false
          } else {
            this.msgError(response.msg)
          }
        })
      }
    }
  },
  created() {
    this.json = this.userDesc
  }
}
</script>

<style>
.jsoneditor-vue {
  width: 100%;
  height: 600px;
}
</style>