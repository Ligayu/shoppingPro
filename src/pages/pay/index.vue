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
      <view class="cart_title">结算</view>
      <view class="cart_content">
        <view
          class="cart_item"
          v-for="item in  carts"
          :key="item.goods_id"
        >
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
                <view class="val"> X {{item.count}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="cart_tool">
      <view class="all_price_wrap">
        <view class="all_price_row1">合计: <text>￥{{allPrice}}</text> </view>
        <view>包含运费</view>
      </view>
      <view class="all_order">
        支付({{allCates}})
        <button
          open-type="getUserInfo"
          @getuserinfo="getUserInfo"
        >获取token</button>
      </view>
    </view>
  </view>
</template>

<script>
/* 
1 点击支付按钮
2 创建订单 
  1 获取用户信息 button  getUserinfo 中 获取
  2 

 */
export default {
  data() {
    return {
      address: {},
      // 购物车商品数据
      carts: []
    };
  },
  onShow() {
    const carts = uni.getStorageSync("carts") || [];
    // 支付页面只需要显示 用户勾选了的商品即可
    this.carts = carts.filter(v => v.checked);
    this.address = uni.getStorageSync("address") || {};
  },

  methods: {
    // 点击 支付按钮
    //给button的open-type属性为getUserInfo获取用户信息，可以从bindgetuserinfo回调中获取到用户信息
    async getUserInfo(e) {
      // 获取参数
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 获取code
      //调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。
      //用户数据的加解密通讯需要依赖会话密钥完成
      const { code } = (await uni.login())[1];
      // 获取后台要求的token
      const { token } = await this.request({
        url: "/users/wxlogin",
        data: { encryptedData, rawData, iv, signature, code },
        method: "POST"
      });

      // 创建订单要的请求头参数
      const header = {
        Authorization: token
      };

      // 创建订单要的请求体参数
      const orderData = {
        // 总价格
        order_price: this.allPrice,
        // 收货地址
        consignee_addr: this.detail,
        // 订单数组
        goods: this.carts.map(cart => ({
          goods_id: cart.goods_id,
          goods_number: cart.count,
          goods_price: cart.goods_price
        }))
      };

      // 执行创建订单 order_number 订单编号
      const { order_number } = await this.request({
        url: "/my/orders/create",
        method: "post",
        data: orderData,
        header  //前面获取的请求头
      });

      // 发送订单编号  获取支付的参数
      const { pay } = await this.request({
        url: "/my/orders/req_unifiedorder",
        header,
        data: { order_number },
        method: "post"
      });

      // 发送pay支付参数 完成调起 微信支付!!!
      await uni.requestPayment(pay);

      // 查询订单状态
      const res = await this.request({
        url: "/my/orders/chkOrder",
        data: { order_number },
        header,
        method: "post"
      });

      uni.showToast({ title: "支付成功" });
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
    position: relative;
    button {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0;
    }
  }
}
.content {
  padding-bottom: 90rpx;
}
</style>
