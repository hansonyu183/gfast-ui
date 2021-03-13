<script>
export default {
  props: {
    desc: {
      type: Object
    },
    value: {
      type: Object
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          return
        }
        let val = {}
        for (const tb of this.desc.items) {
          val[tb.name] = undefined
        }
        this.$emit('input', val)
      },
      immediate: true
    }
  }
}
</script>
