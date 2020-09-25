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
          v-for="(item,index) in goodsList"
          :key="item.goods_id"
          :url="'/pages/goods_detail/index?id='+item.goods_id"
        >
          <view class="goods_img">
            <image
              mode="widthFix"
              :src="item.goods_small_logo||'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1197362953,3835376075&fm=26&gp=0.jpg'"
            ></image>
          </view>
          <view class="goods_info">
            <view class="goods_name">{{item.goods_name}}{{item.goods_name}}</view>
            <view class="goods_price">￥{{item.goods_price}}</view>
          </view>
        </navigator>
      </view>
      <view v-if="current === 1">
        选项卡2的内容
      </view>
      <view v-if="current === 2">
        选项卡3的内容
      </view>
    </view>
  </view>
</template>
<script>
/* 
1 事件
  1 页面的上拉加载下一页
  2 页面下拉刷新   
  3 关键 
    1 需要开启配置 页面配置文件中  enablePullDownRefresh
    2 触发事件 (页面的生命周期事件) onPullDownRefresh
    3 页面上拉  onReachBottom 


2 上拉加载下一页
  1 触发页面上拉事件
  2 一定有下一页数据吗 ? 
    判断还有没有下一页 ?  ( 公式 当前的页码 pagenum 页容量 pagesize  总条数(后台返回 ) )
    当前的页数 和 总页数 对比即可 
      总页数 =  总条数 / 页容量 
                10 /  5 =  2
                15 /  5 =  3
                16 /  5 =  4
                Math.ceil(16 /  5)=4 


    1 有
    2 没有 弹出窗口提示即可
  3 有下一页数据
    1 页码 递增  1 -> 2 -> 3 
    2 重新发送请求获取下一页的数据 
    3 数据回来了 数组应该是做 新旧数据的拼接   

3 页面的下拉刷新
  1 能够触发事件  onPullDownRefresh
  2 真实的数据 页面应该如何变化  才会感觉起来 像主动点击刷新按钮
    1 重新加载它就可以   getList()
      1 假设用户 先 加载了好多个下一页 此时 pagenum=10
      2 直接调用  getList() 
        1 直接获取 第10页的数据
        2 数据回来了 页面数组做了一个拼接 
    2 正确的处理
      1 页面设置为 1 
      2 旧的页面数据数组要清空掉  

    3 优化一下 
      1 当接口数据回来了 马上停止掉 下拉刷新框的显示   uni.stopPullDownRefresh()
      2 刷新页面的时候 页面 闪了一下
        1 为什么页面会闪一下 this.goodsList=[]  清空 
      3 当请求回来了 再清空旧的数据 
        不是每一次的请求回来 都需要清空数据
          0 只是需要加一个 判断即可
          1 上拉加载下一页数据的时候 拼接旧数据
          2 下拉刷新的时候 才需要 清空旧数据

 */

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
        pagesize: 10
      },
      // 商品数据
      goodsList: [],
      // 总页数
      totalPages: 1
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
        data: this.params
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
      this.totalPages = Math.ceil(
        res.total / this.params.pagesize
      );

      // 数据回来了 结束下拉
      // uni.stopPullDownRefresh();

      return Promise.resolve(); //返回成功的内容
    }
  },
  onLoad(options) {
    const id = options.id || 5;
    this.params.cid = id;

    this.getList();
  },
  // 页面下拉动作
  async onPullDownRefresh() { 
    uni.showToast({
      title:"刷新成功",
      icon:"none"
    })
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
        icon: "none"
      });
    } else {
      // 下一页
      this.params.pagenum++;
      this.getList();
    }
  }
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