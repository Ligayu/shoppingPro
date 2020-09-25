<template>
  <view>
<!-- 
contact	打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息，具体说明	1.1.0
  1 用户使用了小程序 点击了客服按钮 
    1 当前用户 直接通过 微信   和 我们客服(小程序的后台可以指定的一些人 ) 聊天  


share	触发用户转发，使用前建议先阅读使用指引	1.2.0 

getPhoneNumber	获取用户手机号，可以从bindgetphonenumber回调中获取到用户信息，具体说明	1.2.0

getUserInfo	获取用户信息，可以从bindgetuserinfo回调中获取到用户信息	1.3.0

launchApp	打开APP，可以通过app-parameter属性设定向APP传的参数具体说明	1.9.5
  在小程序中 唤醒另外的app 
  打开拼多多
  打开京东 
  
openSetting	打开授权设置页	2.0.7
feedback	打开“意见反馈”页面，用户可提交反馈内容并上传日志，开发者可以登录小程序管理后台后进入左侧菜单“客服反馈”页面获取到反馈内容	2.1.0
 -->

<button open-type="contact" >contact</button>
<button open-type="share" >share</button>
<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >getPhoneNumber</button>
<button open-type="getUserInfo" @getuserinfo="getUserinfo" >getUserInfo</button>
<button open-type="launchApp" >launchApp</button>
<button open-type="openSetting" >openSetting</button>
<button open-type="feedback" >feedback</button>







  </view>
</template>

<script>
export default {
  methods:{
    // 获取用户的手机号码
    getPhoneNumber(e){
      console.log(e);
    },
    // 获取用户信息
    getUserinfo(e){
      console.log(e);
    }
  }
}
</script>

<style>

</style>