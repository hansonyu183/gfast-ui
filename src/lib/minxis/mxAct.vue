<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    id: 0,
    preId: 0,
    nextId: 0,
    stateId: 0
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      stateStore: 'state',
      act: 'act'
      // ...
    }),
    curId: {
      get() {
        return this.id
      },
      set(newVal) {
        this.$emit('update:id', newVal)
      }
    },
    state: function () {
      return this.stateStore.find((obj) => obj.id == this.stateId)
    },
    nextAct: function () {
      return this.act.find((obj) => obj.id == this.state?.next_act_id)
    },
    unAct: function () {
      return this.act.find((obj) => obj.id == this.state?.un_act_id)
    },
    canAct: function () {
      const candoIds = this.state.can_act_id.toString().split(',')
      let acts = []
      this.act.filter((v) => {
        const s = v.id.toString()
        if (candoIds.includes(s)) {
          acts.push(v)
        }
      })
      return acts
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onAction(act) {
      // this.vouState = 'f'
      if (act === 'pre') {
        this.curId = this.preId
      }
      if (act === 'next') {
        this.curId = this.nextId
      }
      if (act === 'add') {
        this.curId = 0
      }
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