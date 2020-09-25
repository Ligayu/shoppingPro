/* 
1 发送前显示等待中 
2 请求回来了 关闭等待中 
3 封装公共的url 
 */


//  接口的公共的前缀
const BaseURL = "https://api-hmugo-web.itheima.net/api/public/v1";

const request = (config) => {
  uni.showLoading({
    title: "加载中",
    mask: true
  });
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      url: BaseURL + config.url,
      success: (result) => {
        // console.log(result);
        if (result.statusCode === 200 && result.data.meta.status === 200) {
          // result.statusCode 表示网络没有问题
          // result.data.meta.status 表示 后台接收到了请求 也返回了正确的数据  
          resolve(result.data.message);
        } else {
          reject(result);
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  })
}

const requestAll = async (arr) => {
  uni.showLoading({
    title: "加载中",
    mask: true
  });
  await Promise.all(arr);
  uni.hideLoading();

  return Promise.resolve();  //返回响应成功的数据
}

export default {
  request,
  requestAll
}
