
<script>
import { debounce } from '@/utils'
export default {
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    filters: {
      type: Object,
      default: function () {
        return {
          //id: [0],
          //name:['name']
        }
      }
    }
  },
  data() {
    return {
      search: '',
      searchData: [],
      filterData: [],
      pageNum: 0,
      pageSize: 10
    }
  },
  computed: {
    pageCount: function () {
      return this.searchData?.length ?? 0
    },
    pageData() {
      if (this.searchData) {
        let pd = this.searchData.slice(
          (this.pageNum - 1) * this.pageSize,
          this.pageNum * this.pageSize - 1
        )
        return pd
      } else return []
    }
  },
  watch: {
    filters: {
      handler(newVal) {
        if (newVal && newVal !== null) {
          this.filterData = this.value.filter((item) => {
            let pass = true
            for (const key in newVal) {
              if (Object.hasOwnProperty.call(newVal, key)) {
                const el = newVal[key]
                const tp = Object.prototype.toString.call(el)
                if (tp === '[object Array]') {
                  if (el?.length > 0) {
                    pass = pass && el.includes(item[key])
                  }
                } else {
                  if (el) {
                    pass = pass && el == item[key]
                  }
                }

                if (!pass) {
                  break
                }
              }
            }
            return pass
          })
          this.search = ''
          this.searchData = this.filterData
        }
      },
      // immediate如果为true 代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      // 初始化立即执行，这样我们就可以在created中去掉某些预先请求接口了
      //immediate: true,
      deep: true // 如果是对象要深度监听
    },

    value: {
      handler(newVal) {
        this.searchData = newVal
        this.filterData = newVal
      },
      immediate: true
    }
  },
  methods: {
    filterDoc: debounce(function () {
      if (this.search !== '') {
        let s = this.search.toLowerCase()
        this.searchData = this.filterData.filter((item) => {
          return (
            item.no.toLowerCase().includes(s) ||
            item.name.toLowerCase().includes(s) ||
            item.py.toLowerCase().includes(s)
          )
        })
      } else {
        this.searchData = this.filterData
      }
    }, 300),
    
  }
}
</script>
