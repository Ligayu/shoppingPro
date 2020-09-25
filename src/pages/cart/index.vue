<template>
  <view class="content">
    <view class="address">
      <view class="address_info" v-if="address.userName">
        <view class="address_name_wrap">
          <text>{{ address.userName }}</text>
          <text>{{ address.telNumber }}</text>
        </view>
        <view class="address_detail">{{ detail }}</view>
      </view>
      <button v-else @click="chooseAddress">获取收货地址</button>
    </view>

    <view class="cart">
      <view class="cart_title">购物车</view>
      <view class="cart_content">
        <view
          class="cart_item"
          v-for="(item, index) in carts"
          :key="item.goods_id"
        >
          <!-- 1 复选框 -->
          <checkbox-group @change="cartChange(index)">
            <checkbox :checked="item.checked"></checkbox>
          </checkbox-group>
          <!-- 2 图片 -->
          <view class="goods_img">
            <image mode="widthFix" :src="item.goods_small_logo"></image>
          </view>
          <!-- 3 商品信息 -->
          <view class="goods_info">
            <view class="goods_name">{{ item.goods_name }}</view>
            <view class="goods_price_wrap">
              <view class="goods_price">￥{{ item.goods_price }}</view>
              <view class="edit_wrap">
                <view @click="updateNum(-1, index)" class="update">-</view>
                <view class="val">{{ item.count }}</view>
                <view @click="updateNum(1, index)" class="update">+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="cart_tool">
      <checkbox-group @change="handleAllCheck" class="all_chk_wrap">
        <checkbox :checked="allChecked">全选</checkbox>
      </checkbox-group>
      <view class="all_price_wrap">
        <view class="all_price_row1"
          >合计: <text>￥{{ allPrice }}</text>
        </view>
        <view>包含运费</view>
      </view>
      <view class="all_order" @click="goPay"> 结算({{ allCates }}) </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      address: {},
      // 购物车商品数据
      carts: [],
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
        success: (result) => {
          this.address = result;
          wx.setStorageSync("address", this.address);
        },
        fail: () => {},
        complete: () => {},
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
          success: (result) => {
            //  console.log(result);
            if (result.confirm) {
              // 用户点击了删除
              // 对数组中的某一个元素执行删除
              this.carts.splice(index, 1);
            }
          },
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
          icon: "none",
        });
      }
    },
    // 点击全选
    handleAllCheck() {
      const checked = !this.allChecked;
      this.carts.forEach((cart) => (cart.checked = checked));
    },
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
      return this.carts.filter((cart) => cart.checked).length;
    },
    // 全选
    allChecked() {
      // 要求购物车中的每一个商品的都选中 全选=true
      // every 当空数组调用这个方法的时候 那么它的返回值是true

      if (this.carts.length === 0) return false;
      return this.carts.every((cart) => cart.checked);
    },
    // 总的价格
    allPrice() {
      // 要求 计算选中了的商品的   单价 * 数量  叠加
      // 用 forEach  我们是比较好理解
      // 用 reduce 专门用来计算 总数
      let sum = 0;
      this.carts.forEach((cart) => {
        if (cart.checked) {
          sum += cart.goods_price * cart.count;
        }
      });
      return sum;

      // return  this.carts.reduce((beforeSum,cart)=>cart.checked&&(beforeSum+cart.goods_price*cart.count),0)
    },
  },
  watch: {
    carts: {
      deep: true,
      handler(newCarts) {
        uni.setStorageSync("carts", newCarts);
      },
    },
  },
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
