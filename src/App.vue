<script setup>
import { ref } from 'vue'

// 模拟商品数据
const products = [
  {
    id: 1,
    title: 'MacBook Pro 2021',
    price: 8999,
    originalPrice: 11999,
    image: 'https://picsum.photos/id/1/400/300',
    category: '电子产品',
    location: '北京',
    publishTime: '2小时前'
  },
  {
    id: 2,
    title: 'Nike Air Max运动鞋',
    price: 399,
    originalPrice: 899,
    image: 'https://picsum.photos/id/2/400/300',
    category: '服饰鞋包',
    location: '上海',
    publishTime: '5小时前'
  },
  {
    id: 3,
    title: '索尼 PlayStation 5',
    price: 3299,
    originalPrice: 3899,
    image: 'https://picsum.photos/id/3/400/300',
    category: '电子产品',
    location: '广州',
    publishTime: '1天前'
  },
  {
    id: 4,
    title: '宜家书桌',
    price: 499,
    originalPrice: 799,
    image: 'https://picsum.photos/id/4/400/300',
    category: '家具',
    location: '深圳',
    publishTime: '3天前'
  },
  {
    id: 5,
    title: 'iPhone 13 Pro',
    price: 5999,
    originalPrice: 7999,
    image: 'https://picsum.photos/id/5/400/300',
    category: '电子产品',
    location: '成都',
    publishTime: '1周前'
  },
  {
    id: 6,
    title: '小米空气净化器',
    price: 599,
    originalPrice: 899,
    image: 'https://picsum.photos/id/6/400/300',
    category: '家用电器',
    location: '杭州',
    publishTime: '2周前'
  }
]

// 分类数据
const categories = [
  { name: '电子产品', icon: 'el-icon-mobile' },
  { name: '服饰鞋包', icon: 'el-icon-suitcase' },
  { name: '家具', icon: 'el-icon-home' },
  { name: '家用电器', icon: 'el-icon-monitor' },
  { name: '图书音像', icon: 'el-icon-document' },
  { name: '运动户外', icon: 'el-icon-dish' },
  { name: '美妆护肤', icon: 'el-icon-goods' },
  { name: '更多分类', icon: 'el-icon-menu' }
]

// 搜索关键词
const searchKeyword = ref('')

// 搜索方法
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
  // 这里可以添加搜索逻辑
}

// 切换到发布商品页面
const goToPublish = () => {
  console.log('跳转到发布商品页面')
  // 这里可以添加跳转逻辑
}
</script>

<template>
  <div class="app">
    <!-- 导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>U-Circle二手交易</h1>
        </div>
        <div class="search-box">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索你想要的宝贝" 
            prefix-icon="el-icon-search"
            @keyup.enter="handleSearch"
          ></el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <div class="nav-actions">
          <el-button type="default" icon="el-icon-user">登录</el-button>
          <el-button type="default" icon="el-icon-register">注册</el-button>
          <el-button type="success" icon="el-icon-upload" @click="goToPublish">发布</el-button>
          <el-button type="default" icon="el-icon-shopping-cart">
            <span>购物车</span>
          </el-button>
        </div>
      </div>
    </header>

    <!-- 分类导航 -->
    <nav class="category-nav">
      <div class="category-content">
        <el-row :gutter="20">
          <el-col :span="3" v-for="(category, index) in categories" :key="index">
            <div class="category-item">
              <el-icon :size="24"><component :is="category.icon" /></el-icon>
              <span>{{ category.name }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </nav>

    <!-- 轮播图 -->
    <section class="banner">
      <el-carousel height="360px" indicator-position="outside">
        <el-carousel-item v-for="item in 4" :key="item">
          <img :src="`https://picsum.photos/id/${item + 10}/1200/360`" alt="轮播图" style="width: 100%; height: 100%; object-fit: cover;">
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 热门推荐 -->
      <section class="hot-section">
        <div class="section-header">
          <h2>热门推荐</h2>
          <a href="#" class="more">查看更多 <el-icon><arrow-right /></el-icon></a>
        </div>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
            <el-card class="product-card" :body-style="{ padding: '0px' }">
              <div class="product-image">
                <img :src="product.image" alt="商品图片" style="width: 100%; height: 200px; object-fit: cover;">
              </div>
              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <div class="product-meta">
                  <span class="product-location">{{ product.location }}</span>
                  <span class="product-time">{{ product.publishTime }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <!-- 分类商品 -->
      <section class="category-section">
        <div class="section-header">
          <h2>电子产品</h2>
          <a href="#" class="more">查看更多 <el-icon><arrow-right /></el-icon></a>
        </div>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="12" :md="8" :lg="6" v-for="(product, index) in products.filter(p => p.category === '电子产品').slice(0, 4)" :key="product.id">
            <el-card class="product-card" :body-style="{ padding: '0px' }">
              <div class="product-image">
                <img :src="product.image" alt="商品图片" style="width: 100%; height: 200px; object-fit: cover;">
              </div>
              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <div class="product-meta">
                  <span class="product-location">{{ product.location }}</span>
                  <span class="product-time">{{ product.publishTime }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <ul>
            <li><a href="#">公司介绍</a></li>
            <li><a href="#">联系方式</a></li>
            <li><a href="#">招贤纳士</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>帮助中心</h3>
          <ul>
            <li><a href="#">购物指南</a></li>
            <li><a href="#">支付方式</a></li>
            <li><a href="#">售后服务</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>关注我们</h3>
          <ul>
            <li><a href="#">微信公众号</a></li>
            <li><a href="#">微博</a></li>
            <li><a href="#">抖音</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>客服热线</h3>
          <p class="phone">400-123-4567</p>
          <p class="time">周一至周日 9:00-21:00</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 U-Circle二手交易平台 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

/* 头部导航 */
.header {
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  width: 1200px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  font-size: 24px;
  color: #409EFF;
  margin: 0;
}

.search-box {
  display: flex;
  width: 500px;
}

.search-box .el-input {
  flex: 1;
}

.search-box .el-button {
  margin-left: 10px;
}

.nav-actions {
  display: flex;
  gap: 10px;
}

/* 分类导航 */
.category-nav {
  background-color: #fff;
  margin-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.category-content {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  color: #409EFF;
}

.category-item span {
  margin-top: 8px;
  font-size: 14px;
}

/* 轮播图 */
.banner {
  width: 1200px;
  margin: 20px auto;
}

/* 主内容区 */
.main-content {
  width: 1200px;
  margin: 0 auto 40px;
}

.hot-section,
.category-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  font-size: 20px;
  margin: 0;
}

.section-header .more {
  color: #909399;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.section-header .more:hover {
  color: #409EFF;
}

/* 商品卡片 */
.product-card {
  transition: all 0.3s;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 16px;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: normal;
}

.product-price {
  margin-bottom: 8px;
}

.current-price {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
  margin-right: 8px;
}

.original-price {
  color: #909399;
  font-size: 14px;
  text-decoration: line-through;
}

.product-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  justify-content: space-between;
}

/* 页脚 */
.footer {
  background-color: #333;
  color: #fff;
  padding: 40px 0 20px;
}

.footer-content {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.footer-section {
  flex: 1;
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #fff;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #409EFF;
}

.phone {
  font-size: 24px;
  margin-bottom: 10px;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #444;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-content,
  .category-content,
  .banner,
  .main-content,
  .footer-content {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .nav-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
