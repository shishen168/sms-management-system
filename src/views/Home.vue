<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleRegister = () => {
  router.push('/register')
}

const handleLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1>欢迎使用企业级短信管理平台</h1>
        <p class="subtitle">精准、可靠的企业短信解决方案</p>
        
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon><Message /></el-icon>
            </div>
            <span>快速发送</span>
            <p>高效率的短信发送服务</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon><Lock /></el-icon>
            </div>
            <span>安全可靠</span>
            <p>数据加密，安全保障</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon><Monitor /></el-icon>
            </div>
            <span>实时监控</span>
            <p>发送状态实时追踪</p>
          </div>
        </div>

        <div class="action-buttons">
          <el-button 
            type="primary" 
            size="large" 
            class="register-btn"
            @click="handleRegister"
          >
            立即注册
          </el-button>
          <el-button 
            size="large" 
            class="login-btn"
            @click="handleLogin"
          >
            登录账号
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  .hero-section {
    text-align: center;
    color: white;
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 20px;
    
    h1 {
      font-size: 3.2em;
      margin-bottom: 20px;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .subtitle {
      font-size: 1.6em;
      margin-bottom: 60px;
      opacity: 0.9;
    }

    .feature-list {
      display: flex;
      justify-content: center;
      gap: 60px;
      margin-bottom: 60px;

      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .feature-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, background-color 0.3s ease;

          .el-icon {
            font-size: 40px;
            color: white;
          }

          &:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.3);
          }
        }

        span {
          font-size: 20px;
          font-weight: 500;
        }

        p {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }
      }
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      
      .el-button {
        padding: 12px 40px;
        font-size: 18px;
        border-radius: 8px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        height: auto;
        
        &.register-btn {
          background: white;
          border-color: white;
          color: #1890ff;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }
        }
        
        &.login-btn {
          border: 2px solid white;
          color: white;
          background: transparent;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home-container {
    .hero-section {
      h1 {
        font-size: 2.2em;
      }
      
      .subtitle {
        font-size: 1.2em;
        margin-bottom: 40px;
      }
      
      .feature-list {
        flex-direction: column;
        gap: 30px;
        margin-bottom: 40px;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 15px;
        
        .el-button {
          width: 100%;
          padding: 10px 20px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>