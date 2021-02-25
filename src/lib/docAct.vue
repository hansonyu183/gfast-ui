<template >
  <el-row type="flex" justify="start" align="top" :gutter="1">
    <el-col :span="20">
      <el-row type="flex" justify="start" align="top" :gutter="1">
        <el-tooltip v-show="preId" class="item" effect="dark" content="前单" placement="top-start">
          <el-button icon="el-icon-arrow-left" @click="onAction('pre')" />
        </el-tooltip>
        <el-tooltip v-show="nextId" class="item" effect="dark" content="后单" placement="top-start">
          <el-button icon="el-icon-arrow-right" @click="onAction('next')"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="菜单" placement="top-start">
          <el-button icon="el-icon-caret-bottom" ></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="打印" placement="top-start">
          <el-button type="warning" icon="el-icon-printer" @click="onAction('print')"></el-button>
        </el-tooltip>

        <el-tooltip
          v-for="item in canAct"
          :key="item.id"
          class="item"
          effect="dark"
          :content="item.name"
          placement="top-start"
        >
          <el-button type="primary" :icon="item.icon" @click="onAction(item.no)" />
        </el-tooltip>
        <el-tooltip
          v-if="nextAct"
          class="item"
          effect="dark"
          :content="nextAct.name"
          placement="top-start"
        >
          <el-button type="success" :icon="nextAct.icon" @click="onAction(nextAct.no)" />
        </el-tooltip>
        <el-tooltip
          v-if="unAct"
          class="item"
          effect="dark"
          :content="unAct.name"
          placement="top-start"
        >
          <el-button type="danger" :icon="unAct.icon" @click="onAction(unAct.no)" />
        </el-tooltip>
      </el-row>
    </el-col>
    <el-col :span="4">
      <el-button type="danger" round plain disabled>{{ state.name }}</el-button>
    </el-col>
  </el-row>
</template>

<script>
import mxAct from './minxis/mxAct'

export default {
  name: 'DocAct',
  components: {},
  mixins: [mxAct],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style>
.el-row {
  margin-bottom: 10px;
}
</style>