<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Country } from '@/types/api'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const searchQuery = ref('')

// 常用国家列表
const commonCountries: Country[] = [
  { code: 'CN', name: '中国', dialCode: '+86' },
  { code: 'HK', name: '中国香港', dialCode: '+852' },
  { code: 'TW', name: '中国台湾', dialCode: '+886' },
  { code: 'US', name: '美国', dialCode: '+1' },
  { code: 'JP', name: '日本', dialCode: '+81' },
  { code: 'KR', name: '韩国', dialCode: '+82' }
]

// 所有国家列表
const allCountries: Country[] = [
  ...commonCountries,
  { code: 'GB', name: '英国', dialCode: '+44' },
  { code: 'DE', name: '德国', dialCode: '+49' },
  { code: 'FR', name: '法国', dialCode: '+33' },
  { code: 'IT', name: '意大利', dialCode: '+39' },
  { code: 'RU', name: '俄罗斯', dialCode: '+7' },
  { code: 'SG', name: '新加坡', dialCode: '+65' },
  { code: 'MY', name: '马来西亚', dialCode: '+60' },
  { code: 'TH', name: '泰国', dialCode: '+66' },
  { code: 'VN', name: '越南', dialCode: '+84' },
  { code: 'PH', name: '菲律宾', dialCode: '+63' },
  { code: 'ID', name: '印度尼西亚', dialCode: '+62' },
  { code: 'IN', name: '印度', dialCode: '+91' },
  { code: 'AU', name: '澳大利亚', dialCode: '+61' },
  { code: 'NZ', name: '新西兰', dialCode: '+64' },
  { code: 'CA', name: '加拿大', dialCode: '+1' }
]

const filteredCountries = computed(() => {
  if (!searchQuery.value) return allCountries
  const query = searchQuery.value.toLowerCase()
  return allCountries.filter(country => 
    country.name.toLowerCase().includes(query) || 
    country.dialCode.includes(query) ||
    country.code.toLowerCase().includes(query)
  )
})

const handleSelect = (dialCode: string) => {
  emit('update:modelValue', dialCode)
}
</script>

<template>
  <el-popover
    placement="bottom-start"
    :width="300"
    trigger="click"
  >
    <template #reference>
      <el-input
        :model-value="modelValue"
        readonly
        class="country-select"
      >
        <template #prefix>
          <el-icon><Location /></el-icon>
        </template>
      </el-input>
    </template>

    <div class="country-popover">
      <el-input
        v-model="searchQuery"
        placeholder="搜索国家/地区"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="country-list">
        <template v-if="!searchQuery">
          <div class="country-section">
            <div class="section-title">常用</div>
            <div
              v-for="country in commonCountries"
              :key="country.code"
              class="country-item"
              @click="handleSelect(country.dialCode)"
            >
              <span class="country-name">{{ country.name }}</span>
              <span class="country-code">{{ country.dialCode }}</span>
            </div>
          </div>
          <el-divider />
        </template>

        <div class="country-section">
          <div class="section-title" v-if="!searchQuery">所有国家/地区</div>
          <div
            v-for="country in filteredCountries"
            :key="country.code"
            class="country-item"
            @click="handleSelect(country.dialCode)"
          >
            <span class="country-name">{{ country.name }}</span>
            <span class="country-code">{{ country.dialCode }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style lang="scss" scoped>
.country-select {
  width: 120px;

  :deep(.el-input__wrapper) {
    cursor: pointer;
  }
}

.country-popover {
  .country-list {
    margin-top: 12px;
    max-height: 300px;
    overflow-y: auto;
  }

  .country-section {
    .section-title {
      padding: 8px;
      color: #909399;
      font-size: 12px;
    }

    .country-item {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }

      .country-name {
        font-size: 14px;
      }

      .country-code {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}
</style>