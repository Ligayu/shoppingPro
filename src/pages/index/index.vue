<template>
  <view>
    <!-- 1.0 搜索框 开始 -->
    <search-bar></search-bar>
    <!-- 1.0 搜索框 结束 -->
    <!-- 2.0 轮播图 开始 -->
    <swiper class="index_swiper" circular indicator-dots>
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator>
          <image :src="item.image_src" mode="widthFix"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 2.0 轮播图 结束 -->
    <!-- 3.0 导航 开始 -->
    <view class="nav">
      <navigator v-for="item in navList" :key="item.name">
        <image :src="item.image_src" mode="widthFix"></image>
      </navigator>
    </view>
    <!-- 3.0 导航 结束 -->

    <!-- 4.0 楼层 开始 -->
    <view class="floor">
      <view class="floor_group" v-for="(item, index) in floorList" :key="index">
        <!-- 标题 -->
        <view class="floor_title">
          <image :src="item.floor_title.image_src" mode="widthFix"></image>
        </view>
        <!-- 内容  -->
        <view class="floor_content">
          <navigator
            v-for="(item2, index2) in item.product_list"
            :key="item2.name"
          >
            <image
              :src="item2.image_src"
              :mode="index2 === 0 ? 'widthFix' : 'scaleToFill'"
            ></image>
          </navigator>
        </view>
      </view>
    </view>
    <!-- 4.0 楼层 结束 -->
  </view>
</template>

<script>
import SearchBar from "@/components/SearchBar";

export default {
  components: {
    SearchBar,
  },
  data() {
    return {
      swiperList: [],
      navList: [],
      floorList: [],
    };
  },

  async onLoad() {
    // uni.showLoading({
    //   title: "加载中",
    //   mask: true
    // });

    //  this.getSwiper(); // 花了5s
    //  this.getNav(); // 花了 10s
    //  this.getFloor(); // 花了 20s

    // Promise.all([this.getSwiper(), this.getNav(), this.getFloor()]).then(() => {
    //   uni.hideLoading();
    // });

    this.requestAll([this.getSwiper(), this.getNav(), this.getFloor()]);
  },
  methods: {
    // 获取轮播图  返回值都是promise
    getSwiper() {
      return this.request({
        url: "/home/swiperdata",
      }).then((res) => {
        const swiperList = res;
        this.swiperList = swiperList;
      });
    },
    // 获取首页导航 返回值都是promise
    getNav() {
      return this.request({
        url: "/home/catitems",
      }).then((res) => {
        this.navList = res;
      });
    },
    // 获取楼层数据 返回值都是promise
    getFloor() {
      return this.request({
        url: "/home/floordata",
      }).then((res) => {
        this.floorList = res;
      });
    },
  },
};
</script>

<style lang="scss" >
.index_swiper {
  height: 340rpx;
}
.nav {
  display: flex;
  navigator {
    flex: 1;
    padding: 30rpx;
  }
}

.floor {
  .floor_group {
    .floor_title {
    }

    .floor_content {
      overflow: hidden;
      navigator {
        float: left;
        width: 33.33%;
        border: 3rpx solid #fff;
        image {
        }
      }

      /* 后四个超链接 */
      navigator:nth-last-child(-n + 4) {
        /* 第一张图片的高 208px => 416rpx =>  一半 */
        height: 208rpx;
        image {
          // height: 416rpx;
          height: 100%;
        }
      }
    }
  }
}
</style>
