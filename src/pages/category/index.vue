<template>
  <view class="category">
    <search-bar></search-bar>
    <view class="main">
      <view class="left">
        <view
          :class="['item',activeIndex===index?'active':'']"
          @click="menuClick(index)"
          v-for="(item,index) in leftMenus"
          :key="index"
        >{{item}}</view>
      </view>
      <!-- right 是滚动容器 -->
      <scroll-view
        class="right"
        scroll-y
        :scroll-top="scrollTop"
      >
        <view
          class="product_group"
          v-for="item in rightProductList"
          :key="item.cat_id"
        >
          <view class="product_title">
            <text>/</text>
            <text>{{item.cat_name}}</text>
            <text>/</text>
          </view>
          <view class="product_content">
            <navigator
              v-for="item2 in item.children"
              :key="item2.cat_id"
              :url="'/pages/goods_list/index?id='+item2.cat_id"
            >
              <image
                :src="item2.cat_icon"
                mode="widthFix"
              ></image>
              <view>{{item2.cat_name}}</view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template> 

<script>
/* 
1 获取分类页面的数据 
2 渲染页面
3 点击标题 切换对应的数据!!! 
	1 给左侧标题绑定点击事件
		1 获取对应的索引 控制 标题的激活选中
	2 控制右边的商品的内容的切换显示 
4 关于data中的数据
	1 data中的数据 有两个作用
		1 页面渲染要使用
		2 全局变量  
5 点击左侧菜单 希望右侧的内容 的 滚动条的滚动位置 0 
  0  jq的案例的时候 可能会碰到过     scrollTop
  1  微信小程序中组件 scroll-view 
6 添加一个缓存效果  h5 本地存储有关系  
  1 页面一打开的时候判断本地存储中有没有数据
    1 有数据 不要发送新请求了 而是 使用缓存的数据
    2 没有数据 再发送请求  继续正常的业务 
      1 需要将接口数据 存储到 本地缓存中 

  2 h5 本地存储
    1 不管存入的是什么类似 都会被转化为 字符串类型
    2 使用微信小程序的本地存储  存入的是什么类型 那么就是什么类型 
  3 还存在问题 ??? 
    1 用户无法去看新商品了 
      用户没有清除 缓存的话  一辈子都没有办法买新商品了!!!
    2 加一个时间好了  
    3 解决方案
      1 存储数据的时候 存一个对象 { 时间:存储数据的当下的时间,数组:商品数组 }
      2 当页面打开了 判断
        1 先判断有没有缓存数据
          1 如果有 缓存数据 再去判断 数据有没有过期
              再去使用缓存数据  否则 发送新请求
        2 发送新的请求判断
          1 没有数据 
          2 数据过期了 


 
 */
import SearchBar from "@/components/SearchBar";

// 当前页面中 全局变量  接口的数据
let allDatas = [];

export default {
  components: { SearchBar },
  data() {
    return {
      // 接口的返回数据 一大堆数据 好多
      categoryList: [],
      // 左侧的标题数组 简单
      leftMenus: [],
      // 选中的标题的索引
      activeIndex: 0,
      // 右侧 商品的内容  关联到 选中了的大标题
      rightProductList: [],
      // 右侧容器滚动的距离
      scrollTop: 0
    };
  },
  onLoad() {
    // 1 判断缓存中有没有数据 缓存的默认值是一个空字符串 (h5的缓存默认是 null  )
    const category = uni.getStorageSync("category") || null;
    if (category) {
      // 有值  判断数据有没有过期 过期时间 自定义 1 分钟  =60s = 60* 1000
      if (Date.now() - category.time > 60 * 1000) {
        // 过期了 重新发送请求 
        this.getCategoryList();
      } else {
        // 数据没有过期
        allDatas = category.list;
        // 左侧的标题数组 ["大家电","海外购"]
        this.leftMenus = allDatas.map(v => v.cat_name);
        // 大家电对应的商品数据 数组
        this.rightProductList = allDatas[0].children;
      }
    } else {
      // 没有值
      this.getCategoryList();
    }
  },
  methods: {
    // 左侧标题的点击事件
    menuClick(index) {
      // console.log(index);
      // 标题颜色的切换选中
      this.activeIndex = index;
      this.rightProductList = allDatas[index].children;
      //  应国外友人的要求 要优化的

      // 设置右侧scroll-view的 滚动距离为 0
      // 变化前和变化后都为0
      // 所以不起作用
      // 1 原生的小程序不起作用
      // 2 是uni-app的内置的虚拟dom 发现两个值都一样 都没有重新设置回去

      // 前后两个值不相等的时候 这个属性是生效的!!
      // 怎能办 ?
      // Math.random() 0 - 1
      this.scrollTop = Math.random() / 1000;
    },
    // 获取接口的数据
    getCategoryList() {
      this
        .request({
          url: "/categories"
        })
        .then(res => {
          allDatas = res;

          // 将数据存储到本地缓存中
          uni.setStorageSync("category", { time: Date.now(), list: allDatas });

          // 左侧的标题数组 ["大家电","海外购"]
          this.leftMenus = allDatas.map(v => v.cat_name);
          // 大家电对应的商品数据 数组
          this.rightProductList = allDatas[0].children;
        });
    }
  }
};
</script>

<style lang="scss">
.category {
  /* 在小程序中 100vh 等于 写标签可以控制的区域(不包括顶部 标题区域 不包括 底部的tabbar区域 ) */
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.left {
  width: 200rpx;
  overflow: auto;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
  }
  .active {
    color: $theme-color;
    border-left: 4rpx solid $theme-color;
  }
}
.right {
  flex: 1;
  // overflow: auto; 使用了scroll-view标签后 不用添加  overflow: auto
}

.product_group {
  .product_title {
    height: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    text:nth-child(2) {
      color: #000;
      margin: 0 15rpx;
    }
  }

  .product_content {
    display: flex;
    flex-wrap: wrap;
    navigator {
      width: 33.33%;
      text-align: center;
      image {
        width: 60%;
        // width: 110rpx;
        // height: 110rpx;
        // background-color: #ccc;
      }
      view {
      }
    }
  }
}
</style>
