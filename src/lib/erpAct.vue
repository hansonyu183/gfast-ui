<template >
  <el-row type="flex" justify="start" align="top" :gutter="1">
    <el-col :span="20">
      <el-row type="flex" justify="start" align="top" :gutter="1">
        <el-tooltip
          v-show="dataId>1"
          class="item"
          effect="dark"
          content="前单"
          placement="top-start"
        >
          <el-button icon="el-icon-arrow-left" @click="onAction('pre')" />
        </el-tooltip>
        <el-tooltip
          v-show="dataId<datas.length"
          class="item"
          effect="dark"
          content="后单"
          placement="top-start"
        >
          <el-button icon="el-icon-arrow-right" @click="onAction('next')"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="菜单" placement="top-start">
          <el-button icon="el-icon-caret-bottom" @click="onAction('openMenu')"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="打印" placement="top-start">
          <el-button type="warning" icon="el-icon-printer" @click="onAction('print')"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
          <el-button type="primary" icon="el-icon-plus" @click="onAction('add')"></el-button>
        </el-tooltip>
        <el-tooltip
          v-if="nextAct"
          class="item"
          effect="dark"
          :content="nextAct.name"
          placement="top-start"
        >
          <el-button type="success" :icon="nextAct.icon" @click="onAction(nextAct.act)" />
        </el-tooltip>
        <el-tooltip
          :v-if="undoAct"
          class="item"
          effect="dark"
          :content="'反' + stateLabel"
          placement="top-start"
        >
          <el-button type="danger" icon="el-icon-refresh-left" @click="onAction(undoAct.act)" />
        </el-tooltip>
      </el-row>
    </el-col>
    <el-col :span="4">
      <el-button type="danger" round plain disabled>{{ '已' + stateLabel }}</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ErpAct',
  components: {},
  props: {
    actType: '', //doc/vou
    datas:{
      type:Array,
      default:[{id:0}]
    },
    dataId:0,
  },
  data() {
    return {
      vouState: '',
      dataLength:this.datas.length
    }
  },
  computed: {
    ...mapGetters([
      'vState',
      'dState'
      // ...
    ]),
    nextAct: function () {
      let stat = []
      if (this.actType === 'doc') {
        stat = this.dState
      } else {
        stat = this.vState
      }
      const st = stat.find((obj) => obj.id == this.stateId)
      return stat.find((obj) => obj.id == st.next_id)
    },
    undoAct: function () {
      let stat = []
      if (this.actType === 'doc') {
        stat = this.dState
      } else {
        stat = this.vState
      }
      const st = stat.find((obj) => obj.id == this.stateId)
      return stat.find((obj) => obj.id == st.undo_id)
    },
    stateLabel: function () {
      let stat = []
      if (this.actType === 'doc') {
        stat = this.dState
      } else {
        stat = this.vState
      }
      const st = stat.find((obj) => obj.id == this.stateId)
      return st.name
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onAction(act) {
      // this.vouState = 'f'
      this.$emit('action', act)
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 10px;
}
</style>