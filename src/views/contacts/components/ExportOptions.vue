<script setup lang="ts">
import { ref } from 'vue'
import { useContactStore } from '@/store/modules/contact'
import { useContactGroupStore } from '@/store/modules/contactGroup'

const contactStore = useContactStore()
const groupStore = useContactGroupStore()

const exportOptions = ref({
  format: 'xlsx',
  scope: 'all',
  groupId: undefined as number | undefined,
  includeFields: ['name', 'phone', 'email', 'tags', 'note'],
  dateRange: [] as string[]
})

const handleExport = async () => {
  await contactStore.exportContacts({
    ...exportOptions.value,
    dateRange: exportOptions.value.dateRange.length === 2 
      ? {
          start: exportOptions.value.dateRange[0],
          end: exportOptions.value.dateRange[1]
        }
      : undefined
  })
}
</script>

<template>
  <div class="export-options">
    <el-form label-width="100px">
      <el-form-item label="导出格式">
        <el-radio-group v-model="exportOptions.format">
          <el-radio label="xlsx">Excel</el-radio>
          <el-radio label="csv">CSV</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="导出范围">
        <el-radio-group v-model="exportOptions.scope">
          <el-radio label="all">全部联系人</el-radio>
          <el-radio label="group">指定分组</el-radio>
          <el-radio label="filtered">当前筛选结果</el-radio>
          <el-radio label="selected">已选择的联系人</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择分组" v-if="exportOptions.scope === 'group'">
        <el-select
          v-model="exportOptions.groupId"
          placeholder="请选择分组"
        >
          <el-option
            v-for="group in groupStore.groups"
            :key="group.id"
            :label="`${group.name} (${group.contactCount})`"
            :value="group.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="导出字段">
        <el-checkbox-group v-model="exportOptions.includeFields">
          <el-checkbox label="name">姓名</el-checkbox>
          <el-checkbox label="phone">电话</el-checkbox>
          <el-checkbox label="email">邮箱</el-checkbox>
          <el-checkbox label="tags">标签</el-checkbox>
          <el-checkbox label="note">备注</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="时间范围">
        <el-date-picker
          v-model="exportOptions.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleExport"
          :disabled="
            exportOptions.scope === 'group' && !exportOptions.groupId ||
            exportOptions.includeFields.length === 0
          "
        >
          开始导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.export-options {
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>