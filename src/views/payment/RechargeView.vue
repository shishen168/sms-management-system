<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePaymentStore } from '@/store/modules/payment'
import PackageList from './components/PackageList.vue'
import PaymentForm from './components/PaymentForm.vue'
import TransactionHistory from './components/TransactionHistory.vue'

const paymentStore = usePaymentStore()
const activeTab = ref('recharge')

onMounted(() => {
  paymentStore.fetchBalance()
  paymentStore.fetchPackages()
})
</script>

<template>
  <div class="recharge-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="balance-card">
          <template #header>
            <div class="card-header">
              <span>账户余额</span>
              <el-button type="primary" @click="activeTab = 'recharge'">
                立即充值
              </el-button>
            </div>
          </template>
          
          <div class="balance-info">
            <div class="amount">
              <span class="currency">{{ paymentStore.currency }}</span>
              <span class="value">{{ paymentStore.balance.toFixed(2) }}</span>
            </div>
            <div class="frozen" v-if="paymentStore.frozen > 0">
              冻结金额: {{ paymentStore.frozen.toFixed(2) }}
            </div>
          </div>
        </el-card>

        <el-card class="main-card">
          <template #header>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="充值" name="recharge">
                <PackageList />
                <PaymentForm />
              </el-tab-pane>
              <el-tab-pane label="交易记录" name="history">
                <TransactionHistory />
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="help-card">
          <template #header>
            <div class="card-header">
              <span>充值说明</span>
            </div>
          </template>
          
          <div class="help-content">
            <h4>支持的支付方式</h4>
            <ul>
              <li>USDT-TRC20</li>
              <li>支付宝</li>
              <li>微信支付</li>
            </ul>

            <h4>充值说明</h4>
            <ol>
              <li>最低充值金额为10元</li>
              <li>USDT充值实时到账</li>
              <li>支付成功后若余额未更新，请刷新页面</li>
            </ol>

            <h4>注意事项</h4>
            <p>如遇充值问题，请联系客服处理</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.recharge-container {
  padding: 20px;

  .balance-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .balance-info {
      text-align: center;

      .amount {
        .currency {
          font-size: 16px;
          margin-right: 4px;
        }

        .value {
          font-size: 32px;
          font-weight: bold;
          color: #409EFF;
        }
      }

      .frozen {
        margin-top: 8px;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .help-card {
    .help-content {
      h4 {
        margin: 16px 0 8px;
        color: #303133;
        
        &:first-child {
          margin-top: 0;
        }
      }

      ul, ol {
        margin: 8px 0;
        padding-left: 20px;
        color: #606266;
      }

      p {
        margin: 8px 0;
        color: #909399;
      }
    }
  }
}
</style>