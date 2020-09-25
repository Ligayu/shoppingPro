<template>
  <view class="search_bar">
    <navigator>搜索</navigator>
  </view>
</template>

<script>
export default {};
</script>

<style lang="scss" >
.search_bar {
  /* 
  45px 
  rpx 750 
  vw vh 

  设计稿的宽度 375px  

  小程序中 把所有的宽度的屏幕 看成了750rpx
  375px =  750rpx
  1px = 2rpx 
  45px = 90rpx
   */
  height: 90rpx;
  background-color: $theme-color;
  padding: 15rpx;
  navigator {
    background-color: #fff;
    height: 100%;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  
  }
}
</style>