<template  >
  <el-row type="flex" justify="start" align="top" :gutter="1">
    <el-col :span="8">
      <el-row type="flex" justify="start" align="top" :gutter="1">
        <el-tooltip v-show="preId" class="item" effect="dark" content="前单" placement="top-start">
          <el-button icon="el-icon-arrow-left" @click="onAction({ no: 'pre' })" />
        </el-tooltip>
        <el-tooltip v-show="nextId" class="item" effect="dark" content="后单" placement="top-start">
          <el-button icon="el-icon-arrow-right" @click="onAction({ no: 'next' })"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="菜单" placement="top-start">
          <el-button icon="el-icon-caret-bottom"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="打印" placement="top-start">
          <el-button
            type="warning"
            icon="el-icon-printer"
            @click="onAction({ no: 'print' })"
          ></el-button>
        </el-tooltip>

        <el-tooltip
          v-for="item in canAct"
          :key="item.id"
          class="item"
          effect="dark"
          :content="item.name"
          placement="top-start"
        >
          <el-button type="primary" :icon="item.icon" @click="onAction(item)" />
        </el-tooltip>
        <el-tooltip
          v-if="nextAct"
          class="item"
          effect="dark"
          :content="nextAct.name"
          placement="top-start"
        >
          <el-button type="success" :icon="nextAct.icon" @click="onAction(nextAct)" />
        </el-tooltip>
        <el-tooltip
          v-if="unAct"
          class="item"
          effect="dark"
          :content="unAct.name"
          placement="top-start"
        >
          <el-button type="danger" :icon="unAct.icon" @click="onAction(unAct)" />
        </el-tooltip>
      </el-row>
    </el-col>
    <el-col :span="20">
      <slot></slot>
    </el-col>
    <el-col :span="2">
      <el-button v-if="state" type="danger" round plain disabled>{{ state.name }}</el-button>
    </el-col>
  </el-row>
</template>

<script>
import mxAct from './minxis/mxAct'
import { mapGetters } from 'vuex'

export default {
  name: 'VrAct',
  components: {},
  mixins: [mxAct],
  props: {
    value: {}
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      auth: 'authVr'
      // ...
    })
  },
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