<template >
  <el-row type="flex" justify="start" align="top" :gutter="1">
    <el-col :span="20">
      <el-row type="flex" justify="start" align="top" :gutter="1">
        <el-tooltip
          v-show="listIndex > 0"
          class="item"
          effect="dark"
          content="前单"
          placement="top-start"
        >
          <el-button icon="el-icon-arrow-left" @click="onAction('pre')" />
        </el-tooltip>
        <el-tooltip
          v-show="listIndex < list.length - 1"
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
      <el-button type="danger" round plain disabled>{{ stateLabel }}</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DocAct',
  components: {},
  props: {
    list: {
      type: Array,
      default: [{ id: 0, dstate_id: 0 }]
    },
    listIndex: 0
  },
  data() {
    return {
      curIdx: this.listIndex
    }
  },
  computed: {
    ...mapGetters({
      stateStore: 'dState'
      // ...
    }),
    docId: function () {
      return this.list[this.curIdx]?.id ?? 0
    },
    stateId: function () {
      return this.list[this.listIndex]?.dstate_id ?? 1000
    },
    state: function () {
      return this.stateStore.find((obj) => obj.id == this.stateId)
    },
    nextAct: function () {
      return this.stateStore.find((obj) => obj.id == this.state.next_id)
    },
    undoAct: function () {
      return this.stateStore.find((obj) => obj.id == this.state.undo_id)
    },
    stateLabel: function () {
      return this.state.name
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onAction(act) {
      // this.vouState = 'f'
      if (act === 'pre') {
        this.curIdx -= 1
        this.$emit('update:listIndex', this.curIdx)
      }
      if (act === 'next') {
        this.curIdx += 1
        this.$emit('update:listIndex', this.curIdx)
      }
      if (act === 'add') {
        this.curIdx = this.list.length
        this.$emit('update:listIndex', this.curIdx)
      }
      this.$emit('action', act, this.docId)
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 10px;
}
</style>