<template>
  <div class="py-3">
    <div class="d-flex mx-3 mb-3">
      <b-button variant="success" size="sm" class="mr-auto" :to="{ name: 'Macro' }">
        開始使用
      </b-button>

      <b-form-input v-model.lazy="delay" class="mr-2" style="width: 70px;" size="sm" placeholder="毫秒" @change="saveDelay" />
      <b-button variant="info" size="sm" @click="add">
        新增
      </b-button>
    </div>

    <b-table v-if="dataList.length > 0" striped borderless :items="dataList" :fields="fields">
      <template v-slot:cell(selected)="row">
        <div class="d-flex align-items-center">
          <b-form-checkbox v-model="row.item.selected" @change="save" />
        </div>
      </template>
      <template v-slot:cell(name)="row">
        <b-form-input v-model.lazy="row.item.name" size="sm" placeholder="請輸入名稱" @change="save" />
      </template>
      <template v-slot:cell(macro)="row">
        <div class="d-flex align-items-center">
          <b-button variant="info" size="sm" class="flex-shrink-0 mr-2" @click="openMacroModal(row.item.uuid)">
            設定
          </b-button>
          <b-button variant="danger" size="sm" class="flex-shrink-0 mr-3" @click="remove(row.item.uuid)">
            刪除
          </b-button>

          <div class="d-flex align-items-center font-weight-bold">
            <span v-if="row.item.macro.length">
              {{ getMacroLabel(row.item.macro) }}
            </span>
            <span v-else>
              尚未設定
            </span>
          </div>
        </div>
      </template>
    </b-table>
    <div v-else class="h3 text-secondary text-center my-5">
      <b-icon icon="exclamation-circle" />
      尚未設定任何快捷鍵
    </div>

    <b-modal id="macroModal" hide-header hide-footer centered no-close-on-backdrop>
      <p class="h5 text-center">
        請輸入快捷鍵
      </p>
      <p class="modal-label my-3">
        {{ macroLabel }}
      </p>
      <div class="d-flex justify-content-end">
        <b-button variant="secondary" class="mr-2" @click="closeMacroModal">
          取消
        </b-button>
        <b-button variant="info" @click="setMacro">
          確認
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import getuuid from '@/common/getuuid'
import keyTable from '@/common/keyTable'

export default {
  name: 'Home',
  data () {
    return {
      dataList: [],
      delay: '',
      fields: [
        {
          key: 'selected',
          label: '啟用',
          class: 'table-width-auto',
          tdClass: 'align-middle'
        },
        {
          key: 'name',
          label: '名稱',
          class: 'table-width-auto table-name'
        },
        {
          key: 'macro',
          label: '快捷鍵',
          tdClass: 'align-middle'
        }
      ],

      isInputting: false,
      comboNum: 0,
      comboIndex: 0,
      macroModal: {
        uuid: '',
        macro: []
      }
    }
  },
  computed: {
    macroLabel () {
      return this.macroModal.macro.reduce((acc, current) => {
        return `${acc} ${current.join('+')}`
      }, '')
    }
  },
  mounted () {
    this.init()

    window.addEventListener('keydown', this.updateGroupData)
    window.addEventListener('keyup', this.updateMacroData)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.updateGroupData)
    window.removeEventListener('keyup', this.updateMacroData)
  },
  methods: {
    init () {
      const data = window.localStorage.getItem('dataList')
      if (data) this.dataList = JSON.parse(data)

      let delay = window.localStorage.getItem('delay')
      if (delay === null) {
        delay = 500
        window.localStorage.setItem('delay', delay)
      }
      this.delay = delay
    },
    updateGroupData (e) {
      e.preventDefault()
      if (!this.isInputting) return

      const key = keyTable[e.code]
      if (key === undefined) return

      const data = this.macroModal.macro[this.comboIndex]
      if (Array.isArray(data) && data.indexOf(key) !== -1) return
      this.comboNum += 1
      if (this.macroModal.macro[this.comboIndex] === undefined) {
        this.macroModal.macro.push([key])
      } else {
        this.macroModal.macro[this.comboIndex].push(key)
      }
    },
    updateMacroData (e) {
      if (!this.isInputting) return

      const key = keyTable[e.code]
      if (key === undefined) return

      this.comboNum -= 1
      if (this.comboNum === 0) {
        this.comboIndex += 1
      }
    },
    getMacroLabel (data) {
      return data.reduce((acc, current) => {
        return `${acc} ${current.join('+')}`
      }, '')
    },

    add () {
      this.dataList.push({
        uuid: getuuid(),
        selected: true,
        name: `Macro${this.dataList.length + 1}`,
        macro: []
      })
      this.save()
    },
    save () {
      const data = JSON.stringify(this.dataList)
      window.localStorage.setItem('dataList', data)
    },
    saveDelay () {
      window.localStorage.setItem('delay', this.delay)
    },

    remove (uuid) {
      this.dataList = this.dataList.filter(item => item.uuid !== uuid)
      this.save()
    },
    openMacroModal (uuid) {
      this.macroModal.uuid = uuid
      this.macroModal.macro = []
      this.isInputting = true
      this.comboNum = 0
      this.comboIndex = 0
      this.$bvModal.show('macroModal')
    },
    closeMacroModal () {
      this.isInputting = false
      this.$bvModal.hide('macroModal')
    },
    setMacro () {
      const data = this.dataList.find(item => item.uuid === this.macroModal.uuid)
      if (data) {
        data.macro = this.macroModal.macro
      }
      this.closeMacroModal()
      this.save()
    }
  }
}
</script>

<style lang="scss">
  .table-width-auto {
    width: 10px;
    white-space: nowrap;
  }

  .table-name {
    width: 200px;
  }

  .modal-label {
    min-height: 1.5rem;
    font-weight: bold;
  }
</style>
