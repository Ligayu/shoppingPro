<template>
  <view
    v-if="goods"
    class="goods_detail"
  >
    <!-- 1.0 轮播图  开始-->
    <view class="swiper_wrap">
      <swiper
        autoplay
        circular
        indicator-dots=""
      >
        <swiper-item
          v-for="item in goods.pics"
          :key="item.pics_id"
          @click="previewImage(item.pics_mid_url)"
        >
          <image
            :src="item.pics_mid_url"
            mode="aspectFit"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- 1.0 轮播图  结束-->

    <!-- 2.0 价格 开始 -->
    <view class="price">
      ￥{{goods.goods_price}}
    </view>
    <!-- 2.0 价格 结束 -->

    <!-- 3.0 商品的名称 开始 -->
    <view class="goods_info">
      <view class="goods_name">{{goods.goods_name+goods.goods_name}}</view>
      <view class="goods_collect">
        <view class="iconfont icon-shoucang"></view>
        <view>收藏</view>
      </view>
    </view>
    <!-- 3.0 商品的名称 结束 -->

    <!-- 4.0 图文详情 开始 -->
    <view class="goods_details">
      <view class="details_title">图文详情</view>
      <view class="details_content">
        <rich-text :nodes="goods.gsdht"></rich-text>
      </view>

    </view>
    <!-- 4.0 图文详情 结束 -->

    <!-- 5.0 底部工具栏 开始 -->
    <view class="btm_tool">
      <!-- <view class="btm_item">
        <view class="iconfont icon-kefu"></view>
        <view>客服</view>
      </view> -->
      <view class="btm_item">
        <view class="iconfont icon-kefu"></view>
        <view>客服</view>
        <button open-type="contact">contact</button>
      </view>
      <view class="btm_item">
        <view class="iconfont icon-yixianshi-"></view>
        <view>分享</view>
        <button open-type="share">share</button>
      </view>
      <navigator open-type="switchTab" class="btm_item" url="/pages/cart/index" >
        <view class="iconfont icon-gouwuche"></view>
        <view>购物车</view>
      </navigator>
      <view
        class="btm_item"
        @click="goodsAdd"
      >
        加入购物车
      </view>
      <view class="btm_item">
        立即购买
      </view>
    </view>
    <!-- 5.0 底部工具栏 结束 -->

  </view>
</template>

<script>
/* 
1 给轮播图绑定点击事件
  1 wx.previewImage
  2 传递两个参数
    current: 现在就要放大显示的图片的路径
    urls: 所有的即将要滑动预览的图片路径  

2 完成 "客服功能"
  1 通过用户主动点击按钮来实现 <button open-type="contact" >contact</button> 

3 加入购物车功能
  1 获取缓存中的历史数据 (可能有真实的数组 也可能 没有 默认值 "" [] )   返回的类型都是数组
  2 判断 当前商品是否存在于 数组中
    1 不存在
      表示第一次购买 在数组中 添加一个新元素-商品
    2 存在于
      表示多次购买,  需要找到数组中的元素 修改它属性 购买数量属性 自增 
  3 把修改后的数组 重新添加到 缓存中 


 */

export default {
  onLoad(options) {
    this.getDetail(options.id || "31816");
  },
  data() {
    return {
      goods: null
    };
  },
  methods: {
    // 获取商品的详情数据
    async getDetail(id) {
      const res = await this.request({
        url: "/goods/detail",
        data: { goods_id: id }
      });
      this.goods = res;
      this.goods.gsdht=this.goods.goods_introduce.replace(/\.webp/g,".jpg");
  
    },
    // 点击轮播图的事件 放大预览
    previewImage(current) {
      //urls: 所有的即将要滑动预览的图片路径的数组
      const urls = this.goods.pics.map(v => v.pics_mid_url);
      console.log(urls);
      
      uni.previewImage({
        current, //当前查看的图片
        urls  //预览图的数组
      });
    },
    // 加入购物车
    goodsAdd() {
      // 1 先获取缓存中的数据 返回类型都是数组
      const carts = uni.getStorageSync("carts") || [];
      // 2 判断商品是否已经存在数组中
      const index = carts.findIndex(
        goods => goods.goods_id === this.goods.goods_id
      );
      if (index === -1) {
        // 没有购买过该商品
        this.goods.count = 1;
        // 属性为了方便我们在下一个页面购物车页面的使用
        this.goods.checked=true;

        carts.push(this.goods);
      } else {
        // 找到了
        carts[index].count++;
      }

      // 3 需要将 数组 重新存入缓存中
      uni.setStorageSync("carts", carts);

      uni.showToast({
        title: "加入成功",
        mask: true
      }); 
    }
  }
};
</script>

<style lang="scss" >
.swiper_wrap {
  swiper {
    //  400 * 400
    height: 78vw;
    // height: 750rpx;
    text-align: center;
    swiper-item {
      padding: 50rpx;
    }
  }
}
.price {
  padding: 20rpx 10rpx;
  color: $theme-color;
  font-size: 32rpx;
  font-weight: 600;
}

.goods_info {
  padding: 15rpx;
  border-top: 1rpx solid #eee;
  border-bottom: 1rpx solid #eee;
  display: flex;
  .goods_name {
    flex: 1;
    color: #000;
    font-size: 30rpx;
    // 拆散单词
    word-break: break-all;
    padding: 0 10rpx;

    @include ellipsis(2);
  }
  .goods_collect {
    padding: 0 20rpx;
    text-align: center;
    border-left: 1rpx solid #666;
    .iconfont {
    }
    view {
    }
  }
}

.goods_details {
  .details_title {
    padding: 20rpx;
    color: $theme-color;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.btm_tool {
  background-color: #fff;
  position: fixed;
  border-top: 1px solid #666;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  .btm_item {
    padding: 10rpx 0;
    text-align: center;
    flex: 1;
    position: relative;
    .iconfont {
      font-size: 28rpx;
    }
    button {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
  }
  .btm_item:nth-last-child(-n + 2) {
    flex: 2;
    background-color: #ffa500;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
  }
  .btm_item:last-child {
    background-color: $theme-color;
  }
}

.goods_detail {
  padding-bottom: 92rpx;
}
</style>