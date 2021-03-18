<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    id: 0,
    preId: 0,
    nextId: 0,
    stateId: 0,
    dataType: ''
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
    authAct: {
      get() {
        return this.auth.find((obj) => obj.type === '*' || obj.type === this.dataType)
      }
    },
    curId: {
      get() {
        return this.id
      },
      set(newVal) {
        this.$emit('update:id', newVal)
      }
    },

    state: function () {
      let stateId=this.stateId
      if(stateId===undefined || stateId===null){
        stateId=0
      }
      return this.stateStore.find((obj) => obj.id == stateId)
    },
    nextAct: function () {
      const act = this.act.find((obj) => obj.id == this.state?.next_act_id)
      if (!act || this.authAct.act_ids === '*') {
        return act
      }
      if (this.authAct.act_ids.indexOf(act.id) === -1) {
        return null
      }
      return act
    },
    unAct: function () {
      const act = this.act.find((obj) => obj.id == this.state?.un_act_id)
      if (!act || this.authAct.act_ids === '*') {
        return act
      }
      if (this.authAct.act_ids.indexOf(act.id) === -1) {
        return null
      }
      return act
    },
    canAct: function () {
      const candoIds = this.state?.can_act_id.toString().split(',')
      if (!candoIds || candoIds.length === 0) {
        return []
      }
      let authCandoIds = []
      if (this.authAct.act_ids === '*') {
        authCandoIds = candoIds
      } else {
        authCandoIds = candoIds.filter((id) => this.authAct.act_ids.indexOf(id) !== -1)
      }
      let acts = []
      this.act.filter((v) => {
        const s = v.id.toString()
        if (authCandoIds.includes(s)) {
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
      if (act.no === 'pre') {
        this.curId = this.preId
      }
      if (act.no === 'next') {
        this.curId = this.nextId
      }
      if (act.no === 'add') {
        this.curId = 0
      }
      this.$emit('action', act)
    }
  }
}
</script>

