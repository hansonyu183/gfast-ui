<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pageName: '',
      desc: {}
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getPageDesc'
      // ...
    ]),
    pageDesc() {
      const desc = this.getPageDesc(this.pageName)
      return desc ?? this.desc
    }
  },
  created() {
  },
  methods: {}
}
</script>