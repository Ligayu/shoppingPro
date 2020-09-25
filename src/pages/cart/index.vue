<template>
  <view class="content">
    <view class="address">
      <view
        class="address_info"
        v-if="address.userName"
      >
        <view class="address_name_wrap">
          <text>{{address.userName}}</text>
          <text>{{address.telNumber}}</text>
        </view>
        <view class="address_detail">{{detail}}</view>
      </view>
      <button
        v-else
        @click="chooseAddress"
      >获取收货地址</button>
    </view>

    <view class="cart">
      <view class="cart_title">购物车</view>
      <view class="cart_content">
        <view
          class="cart_item"
          v-for="(item,index) in  carts"
          :key="item.goods_id"
        >
          <!-- 1 复选框 -->
          <checkbox-group @change="cartChange(index)">
            <checkbox :checked="item.checked"></checkbox>
          </checkbox-group>
          <!-- 2 图片 -->
          <view class="goods_img">
            <image
              mode="widthFix"
              :src="item.goods_small_logo"
            ></image>
          </view>
          <!-- 3 商品信息 -->
          <view class="goods_info">
            <view class="goods_name">{{item.goods_name}}</view>
            <view class="goods_price_wrap">
              <view class="goods_price">￥{{item.goods_price}}</view>
              <view class="edit_wrap">
                <view
                  @click="updateNum(-1,index)"
                  class="update"
                >-</view>
                <view class="val">{{item.count}}</view>
                <view
                  @click="updateNum(1,index)"
                  class="update"
                >+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="cart_tool">
      <checkbox-group  @change="handleAllCheck"  class="all_chk_wrap">
        <checkbox :checked="allChecked">全选</checkbox>
      </checkbox-group>
      <view class="all_price_wrap">
        <view class="all_price_row1">合计: <text>￥{{allPrice}}</text> </view>
        <view>包含运费</view>
      </view>
      <view
        class="all_order"
        @click="goPay"
      >
        结算({{allCates}})
      </view>
    </view>
  </view>
</template>

<script>
/* 
1 实现 获取用户的收货地址功能
2 学习 复选框 和 数字编辑 两个组件 
3 为了方便的实现页面的复选框选中和 计算一些商品数据
	在上一个页面(商品详情页面)  新增商品的时候 再新增一个属性 选中属性 
4 经过分析 "全选" "总价格" "总结算" 都根据购物车的数据来计算  应该在 computed中来添加
  这三个变量 
5 实现 商品的 复选框 切换功能
  1 绑定事件
  2 将当前的商品的选中状态做 取反  本质是修改 购物车数组中的元素的 checked属性
  3 将 修改后的  购物车大数组 重新存入到 缓存中    对购物车数据 使用 watch即可
6 数量编辑
7 数量编辑 中  删除操作
  1 如何判断当前要进行的是一个删除操作
    1 当前的数量是1 而且 用户点击的是 "-"  表示想要删除
8 修改bug
  1 知道 数组的every 当数组为空的时候 它也是返回 true computed中做了处理
  2  onLoad  的生命周期的理解 
    1 页面加载完毕了会触发一次 
    2 购物车页面没有被卸载掉 肯定不会触发新的onLoad的 
  3 如何解决:
    0 基础够扎实!!! 
    1 onShow - 更好 
    2 (没有那么好)在跳转到购物车页面的时候 可以使用 navigator的 reLaunch 关闭所有页面再跳转
      让我们的购物车页面 先关闭=先卸载 
      10 个超连接 都是跳转到购物车 
  4 将收货地址存入到 缓存中
9 解决bug 
  1 对出现bug的现象 要无比清楚和了解  (思考一下 这个东西!!!!)
  2 感受到了 技术的关键字 
    1 有线索
    2 查文档和写代码去验证 动手能力 
    3 加深对技术的了解 生命周期的了解 
  3 思考 解决方法 
10 第一个优化
  1 首页中  修改request
  2 在商品详情页面中 iphone手机无法查看图文详情!!!  (后台问题 )
    1 暂时通过自己的能力 处理 方便我们自己开发 
    2 真实的情况 是后台去修改 图文详情里面的图片格式!!!
11 点击结算
  1 判断有没有收货地址
  2 判断有没有需要选购的商品 
12 点击全选
  1 获取当前的全选状态
  2 给全选状态做取反 变量 
  3 让购物车数组中所有的商品的选中状态 等于  变量
 */

export default {
  data() {
    return {
      address: {},
      // 购物车商品数据
      carts: []
    };
  },
  // 页面加载完毕
  // onLoad() {
  //   console.log("onLoad");
  //   this.carts = uni.getStorageSync("carts") || [];
  // },
  // 页面被显示
  onShow() {
    this.carts = uni.getStorageSync("carts") || [];
    this.address = uni.getStorageSync("address") || {};
  },
  // 页面隐藏
  onHide() {
    console.log("页面隐藏");
  },
  // 页面被卸载
  onUnload() {
    console.log("页面被卸载");
  },
  methods: {
    // 点击按钮 获取收货地址
    chooseAddress() {
      uni.chooseAddress({
        success: result => {
          this.address = result;
          wx.setStorageSync("address", this.address);
        },
        fail: () => {},
        complete: () => {}
      });
    },
    // 商品的复选框选中事件
    cartChange(index) {
      // 选中状态 取反
      this.carts[index].checked = !this.carts[index].checked;
    },
    // 点击修改数量 按钮
    updateNum(unit, index) {
      // 判断当前用户是否要删除数据
      if (unit === -1 && this.carts[index].count === 1) {
        // 满足了要删除的条件
        uni.showModal({
          title: "提示",
          content: "您是否舍得删除?😶",
          success: result => {
            //  console.log(result);
            if (result.confirm) {
              // 用户点击了删除
              // 对数组中的某一个元素执行删除
              this.carts.splice(index, 1);
            }
          }
          //  complete(){
          //  success
          // fail 触发 也会触发  complete
          //  }
        });
      } else {
        this.carts[index].count += unit;
      }
    },
    // 点击结算按钮
    goPay() {
      // 判断是否合法
      // 判断用户勾选了的商品的数组的长度
      if (this.address.userName && this.allCates) {
        // 可以跳转
        uni.navigateTo({ url: "/pages/pay/index" });
      } else {
        uni.showToast({
          title: "您还没有选中商品或者收货地址",
          icon: "none"
        });
      }
    },
    // 点击全选 
    handleAllCheck(){
      const checked=!this.allChecked;
      this.carts.forEach(cart=>cart.checked=checked);
    }
  },
  computed: {
    // 计算收货详细地址
    detail() {
      return (
        this.address.provinceName +
        this.address.cityName +
        this.address.countyName +
        this.address.detailInfo
      );
    },
    // 总的结算数   种类 而 不是数量
    // 京东的 结算 算的是  数量

    // 淘宝的 结算 算的是  种类
    allCates() {
      // 获取到了 勾选了的 商品的种类
      return this.carts.filter(cart => cart.checked).length;
    },
    // 全选
    allChecked() {
      // 要求购物车中的每一个商品的都选中 全选=true
      // every 当空数组调用这个方法的时候 那么它的返回值是true

      if (this.carts.length === 0) return false;
      return this.carts.every(cart => cart.checked);
    },
    // 总的价格
    allPrice() {
      // 要求 计算选中了的商品的   单价 * 数量  叠加
      // 用 forEach  我们是比较好理解
      // 用 reduce 专门用来计算 总数
      let sum = 0;
      this.carts.forEach(cart => {
        if (cart.checked) {
          sum += cart.goods_price * cart.count;
        }
      });
      return sum;

      // return  this.carts.reduce((beforeSum,cart)=>cart.checked&&(beforeSum+cart.goods_price*cart.count),0)
    }
  },
  watch: {
    // 为什么这个代码 在后续的改变中不能出现
    // 有同学 说 只能监控到 表层的
    // 简单类型 和 引用类型  指向改变
    // 1 => 2
    // 引用类型  这些变量 存其实是一个地址而已
    // carts.a=123 carts.b=123
    // cart=123;
    // 复杂数据做监控的时候  deep属性
    carts: {
      deep: true,
      handler(newCarts) {
        uni.setStorageSync("carts", newCarts);
      }
    }
  }
};
</script>

<style lang="scss" >
.address {
  padding: 20px;
  button {
    color: $theme-color;
    // currentColor css 内置的属性 等于字体颜色
    border: 1rpx solid currentColor;
    background-color: #fff;
    width: 80%;
    font-size: 28rpx;
  }
  .address_info {
    color: #000;
    .address_name_wrap {
      display: flex;
      justify-content: space-between;
    }
  
  }
}

.cart {
  .cart_title {
    padding: 20px;
    color: $theme-color;
    border-top: 1rpx solid currentColor;
    border-bottom: 1rpx solid currentColor;
    font-size: 32rpx;
  }

  .cart_content {
    .cart_item {
      border-bottom: 1rpx solid #ccc;
      padding: 10rpx;
      display: flex;
      checkbox-group {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      
      }

      .goods_img {
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;

        image {
          width: 70%;
        }
      }

      .goods_info {
        flex: 4;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .goods_name {
          @include ellipsis(2);
        }

        .goods_price_wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .goods_price {
            font-size: 30rpx;
            color: $theme-color;
          }

          .edit_wrap {
            display: flex;
            .update {
              width: 60rpx;
              height: 60rpx;
              border: 1rpx solid #ccc;
              color: #666;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .val {
              width: 60rpx;
              height: 60rpx;
              color: #666;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
.cart_tool {
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: 1rpx solid #ccc;
  width: 100%;
  height: 90rpx;
  display: flex;
  .all_chk_wrap {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
   
  }

  .all_price_wrap {
    flex: 4;
    text-align: right;
    padding: 5rpx 10rpx;
    .all_price_row1 {
      text {
        font-weight: 600;
        color: $theme-color;
        font-size: 30rpx;
      }
    }

  }

  .all_order {
    flex: 2;
    background-color: $theme-color;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 34rpx;
    font-weight: 600;
  }
}
.content {
  padding-bottom: 90rpx;
}
</style>
