<template>
  <el-row type="flex" justify="start" align="top" :gutter="1">
    <el-col :span="8">
      <el-select
        ref="elselect"
        filterable
        :filter-method="filterOption"
        clearable
        default-first-option
        @focus="onFocus"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <el-option v-for="item in showOptions" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-input v-model="ebaTel" class="eba_tel">
        <template slot="prepend">电话</template>
      </el-input>
    </el-col>
    <el-col :span="8">
      <el-input v-model="ebaAddress" class="eba_address">
        <template slot="prepend">地址</template>
      </el-input>
    </el-col>
    <el-col :span="8">
      <el-input v-model="ebaSq" class="eba_ebasq" :disabled="true">
        <template slot="prepend">数期</template>
      </el-input>
    </el-col>
  </el-row>
  
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'EbaSelect',
  props: {
    prop: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showOptions: [],
      ebaTel: '',
      ebaAddress: '',
      ebaSq: ''
    }
  },
  computed: {
    ...mapGetters([
      'getOpt'
      // ...
    ]),
    docName: {
      get() {
        return 'eba'
      }
    },
    eba: {
      get() {
        return this.docOptions?.find((item) => item.id === this.inputVal)
      }
    },
    ebaSqName: {
      get() {
        return this.getOpt('ebasq')?.find((item) => item.id === this.eba?.ebasq_id)?.name ?? ''
      }
    },
    docOptions: {
      get() {
        return this.getOpt(this.docName)
      }
    },
    inputVal: {
      get() {
        return this.$attrs?.value
      }
    }
  },
  watch: {
    inputVal: {
      handler(newVal, oldVal) {
        this.ebaAddress = this.eba?.address
        this.ebaTel = this.eba?.tel
        this.ebaSq = this.ebaSqName
        if (
          newVal !== oldVal &&
          this.showOptions.findIndex((obj) => obj.id === this.inputVal) === -1
        ) {
          this.updateOptions()
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    filterOption(query) {
      if (query !== '') {
        const q = query.toLowerCase()
        this.showOptions = this.docOptions
          .filter((item) => {
            return (
              item?.no?.toLowerCase().includes(q) ||
              item?.name?.toLowerCase().includes(q) ||
              item?.py?.toLowerCase().includes(q)
            )
          })
          ?.slice(0, 10)
      } else {
        this.showOptions = this.docOptions?.slice(0, 10)
      }
    },
    onFocus() {
      if (!this.showOptions || this.showOptions.length === 0) {
        this.updateOptions()
      }
    },
    updateOptions() {
      if (!this.prop) {
        return
      }
      // this.docOptions = this.getOpt(dicName)
      if (!this.docOptions) {
        return
      }
      const idx = this.docOptions.findIndex((obj) => obj.id === this.inputVal)
      if (idx === -1) {
        this.showOptions = this.docOptions.slice(0, 10)
        return
      }

      const len = this.docOptions.length
      if (len >= 10) {
        const begIdx = idx + 10 < len ? idx : Math.max(len - 10, 0)
        this.showOptions = this.docOptions?.slice(begIdx, begIdx + 10)
      } else {
        this.showOptions = this.docOptions
      }
    }
  }
}
</script>

<style>
.el-input-group__prepend {
  font-weight: 700;
  font-size: 14px;
  color: #606266;
  background: none;
  border: none;
}
</style>