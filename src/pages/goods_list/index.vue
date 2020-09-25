<template>
  <view>
    <search-bar></search-bar>
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      style-type="text"
      active-color="#eb4450"
      class="aaaa"
    ></uni-segmented-control>
    <view class="content">
      <view v-if="current === 0">
        <navigator
          :data-index="index"
          v-for="(item, index) in goodsList"
          :key="item.goods_id"
          :url="'/pages/goods_detail/index?id=' + item.goods_id"
        >
          <view class="goods_img">
            <image
              mode="widthFix"
              :src="
                item.goods_small_logo ||
                'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1197362953,3835376075&fm=26&gp=0.jpg'
              "
            ></image>
          </view>
          <view class="goods_info">
            <view class="goods_name"
              >{{ item.goods_name }}{{ item.goods_name }}</view
            >
            <view class="goods_price">￥{{ item.goods_price }}</view>
          </view>
        </navigator>
      </view>
      <view v-if="current === 1"> 选项卡2的内容 </view>
      <view v-if="current === 2"> 选项卡3的内容 </view>
    </view>
  </view>
</template>
<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import SearchBar from "@/components/SearchBar";
export default {
  components: { uniSegmentedControl, SearchBar },
  data() {
    return {
      items: ["综合", "销量", "价格"],
      current: 0,
      params: {
        // 查询关键字  模糊查询的暂时用不到
        query: "",
        // 分类商品的id
        cid: "",
        // 页码 请求第几页
        pagenum: 1,
        // 页容量 每一页要几条数据
        pagesize: 10,
      },
      // 商品数据
      goodsList: [],
      // 总页数
      totalPages: 1,
    };
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    // 获取商品列表
    async getList(isReflesh = false) {
      // 把参数都放入data中即可
      const res = await this.request({
        url: "/goods/search",
        data: this.params,
      });

      if (isReflesh) {
        // 要清空数据
        this.goodsList = res.goods;
      } else {
        // 不要清空
        // 数组应该是做拼接 加载下一页数据
        this.goodsList = [...this.goodsList, ...res.goods]; //用concat进行拼接也行
      }

      // 计算总页数
      this.totalPages = Math.ceil(res.total / this.params.pagesize);

      // 数据回来了 结束下拉
      // uni.stopPullDownRefresh();

      return Promise.resolve(); //返回成功的内容
    },
  },
  onLoad(options) {
    const id = options.id || 5;
    this.params.cid = id;

    this.getList();
  },
  // 页面下拉动作
  async onPullDownRefresh() {
    uni.showToast({
      title: "刷新成功",
      icon: "none",
    });
    this.params.pagenum = 1; //页面重置为第一页
    // 需要清空数据
    await this.getList(true);
    uni.stopPullDownRefresh();
  },
  // 滚动条触底
  onReachBottom() {
    // 判断有没有下一页数据
    if (this.params.pagenum >= this.totalPages) {
      // 没有下一页
      // console.log("没有下一页  不要再滑!!!!");
      // uni.showToast
      uni.showToast({
        title: "没有下一页了",
        // success 才是默认值
        icon: "none",
      });
    } else {
      // 下一页
      this.params.pagenum++;
      this.getList();
    }
  },
};
</script>

<style lang="scss" >
.content {
  navigator {
    display: flex;
    border-bottom: 1rpx solid #ccc;
    padding: 20rpx 0;
    .goods_img {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        width: 80%;
      }
    }
    .goods_info {
      flex: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .goods_name {
        @include ellipsis(2);
      }
      .goods_price {
        color: $theme-color;
      }
    }
  }
}
</style>