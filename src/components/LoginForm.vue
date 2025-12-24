<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户登录"
    width="500px"
    center
    @close="handleDialogClose"
  >
    <div class="login-type-selector">
      <el-radio-group v-model="loginType" size="small">
        <el-radio label="user">普通用户</el-radio>
        <el-radio label="admin">管理员</el-radio>
      </el-radio-group>
    </div>
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 用户名密码登录 -->
      <el-tab-pane label="用户名密码登录" name="password">
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              clearable
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
            <el-link type="primary" :underline="false" style="float: right;">
              忘记密码？
            </el-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%;">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 手机号验证码登录 -->
      <el-tab-pane label="手机号验证码登录" name="code">
        <el-form ref="codeFormRef" :model="codeForm" :rules="codeRules" label-width="80px">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="codeForm.phone"
              placeholder="请输入手机号"
              prefix-icon="el-icon-phone"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-row :gutter="10">
              <el-col :span="16">
                <el-input
                  v-model="codeForm.code"
                  placeholder="请输入验证码"
                  prefix-icon="el-icon-chat-dot-round"
                  clearable
                ></el-input>
              </el-col>
              <el-col :span="8">
                <el-button
                  type="primary"
                  :disabled="countdown > 0"
                  @click="handleSendCode"
                  :loading="sendingCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCodeLogin" :loading="loading" style="width: 100%;">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { login, sendCode } from '../api/auth';

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['login-success', 'close']);

// 登录表单状态
const dialogVisible = ref(props.visible);

// 监听props.visible的变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

// 监听对话框关闭事件
const handleDialogClose = () => {
  resetForm();
  emit('close', false);
};

// 激活的标签页
const activeTab = ref('password');

// 登录类型：user-普通用户，admin-管理员
const loginType = ref('user');

// 加载状态
const loading = ref(false);
const sendingCode = ref(false);

// 倒计时
const countdown = ref(0);
let countdownTimer = null;

// 表单引用
const loginFormRef = ref(null);
const codeFormRef = ref(null);

// 用户名密码登录表单
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// 手机号验证码登录表单
const codeForm = reactive({
  phone: '',
  code: ''
});

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
});

const codeRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: ['blur', 'input'] },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号', trigger: ['blur', 'input'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度为 6 个字符', trigger: 'blur' }
  ]
});

// 重置表单
const resetForm = () => {
  loginForm.username = '';
  loginForm.password = '';
  loginForm.rememberMe = false;
  codeForm.phone = '';
  codeForm.code = '';
  activeTab.value = 'password';
};

// 处理用户名密码登录
const handleLogin = () => {
  // 验证表单
  if (!loginFormRef.value) return;
  console.log('开始用户名密码登录');
  loginFormRef.value.validate((valid) => {
    console.log('表单验证结果:', valid);
    if (valid) {
      loading.value = true;
      // 准备登录数据
      // 根据登录类型设置不同的认证类型
      const authType = loginType.value === 'admin' ? 'adminPasswordAuth' : 'passwordAuth';
      const loginData = {
        username: loginForm.username,
        password: loginForm.password,
        authType: authType
      };
      console.log('登录数据准备完成:', loginData);
      
      // 调用登录API
      login(loginData)
        .then((response) => {
          // 登录成功，保存token和用户信息
          console.log('登录成功，响应数据:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          // 如果选择记住我，可以保存更多信息
          if (loginForm.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('username', loginForm.username);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('username');
          }
          // 关闭对话框
          dialogVisible.value = false;
          // 显示成功消息
          ElMessage.success('登录成功');
          // 触发登录成功事件
          emit('login-success', response);
        })
        .catch((error) => {
          console.error('登录失败详情:', error);
          // 打印更详细的错误信息
          if (error.response) {
            console.error('响应状态码:', error.response.status);
            console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
            console.error('响应头:', JSON.stringify(error.response.headers, null, 2));
          }
          const errorMsg = error.response?.data?.message || error.message || '请检查用户名和密码';
          ElMessage.error('登录失败：' + errorMsg);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

// 处理发送验证码
const handleSendCode = () => {
  console.log('handleSendCode 函数被调用');
  console.log('当前手机号:', codeForm.phone);
  
  // 手动验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!codeForm.phone) {
    console.log('手机号为空');
    ElMessage.error('请输入手机号');
    return;
  }
  if (!phoneRegex.test(codeForm.phone)) {
    console.log('手机号格式不正确');
    ElMessage.error('请输入有效的11位手机号');
    return;
  }
  
  console.log('手机号验证通过，准备发送请求');
  
  sendingCode.value = true;
  // 直接调用发送验证码API，不使用validateField
  console.log('调用sendCode函数，手机号:', codeForm.phone);
  sendCode(codeForm.phone)
    .then(() => {
      console.log('发送验证码成功');
      ElMessage.success('验证码发送成功');
      // 开始倒计时
      countdown.value = 60;
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }, 1000);
    })
    .catch((error) => {
      console.error('发送验证码失败详情:', error);
      console.error('发送验证码失败详情（JSON）:', JSON.stringify(error, null, 2));
      const errorMsg = error.response?.data?.message || error.message || '请稍后重试';
      ElMessage.error('验证码发送失败：' + errorMsg);
    })
    .finally(() => {
      console.log('发送验证码请求完成');
      sendingCode.value = false;
    });
};

// 处理手机号验证码登录
const handleCodeLogin = () => {
  // 验证表单
  if (!codeFormRef.value) return;
  console.log('开始手机号验证码登录');
  codeFormRef.value.validate((valid) => {
    console.log('表单验证结果:', valid);
    if (valid) {
      loading.value = true;
      // 调用登录API
      // 根据登录类型设置不同的认证类型
      const authType = loginType.value === 'admin' ? 'adminVerificationCodeAuth' : 'verificationCodeAuth';
      login({
        phone: codeForm.phone,
        code: codeForm.code,
        authType: authType
      })
        .then((response) => {
          // 登录成功，保存token和用户信息
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          // 关闭对话框
          dialogVisible.value = false;
          // 显示成功消息
          ElMessage.success('登录成功');
          // 触发登录成功事件
          emit('login-success', response);
        })
        .catch((error) => {
          console.error('手机号验证码登录失败详情:', error);
          const errorMsg = error.response?.data?.message || error.message || '请检查验证码是否正确';
          ElMessage.error('登录失败：' + errorMsg);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>