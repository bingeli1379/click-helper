<template>
  <div class="p-3">
    <b-button variant="success" class="w-100 mb-4" :to="{ name: 'Home' }">
      編輯快捷鍵
    </b-button>

    <b-form-row>
      <b-col v-for="item of filterDataList" :key="item.uuid" cols="6">
        <b-button variant="info" class="ellipsis w-100 mb-3" @click="trigger(item.macro)">
          {{ item.name }}
        </b-button>
      </b-col>
    </b-form-row>
  </div>
</template>

<script>
export default {
  name: 'Macro',
  data () {
    return {
      dataList: [],
      delay: window.localStorage.getItem('delay')
    }
  },
  computed: {
    filterDataList () {
      return this.dataList.filter(item => item.selected)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = window.localStorage.getItem('dataList')
      if (data) this.dataList = JSON.parse(data)
    },

    trigger (macro) {
      window.ipcRenderer.invoke('macro', macro, this.delay)
    }
  }
}
</script>

<style lang="scss">
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
