//app.js
App({
  data: {

  },
  onShow: function(options) {
    // console.log(options)
    var shareTickets = options.shareTicket;

  },
   onLaunch: function(res) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
    

  },
  // getUserDataToken: function () {
  //   var that = this;
  //   //获取用户缓存token 此token是服务器作为用户唯一验证的标识，具体请看后端代码
  //   var utoken = wx.getStorageSync("utoken");
  //   wx.login({
  //     success: function (res) {
  //       var code = res.code;
  //       that.globalData.code = code;
  //       wx.getUserInfo({
  //         success: function (res) {
  //           wx.request({
  //             //用户登陆URL地址，请根据自已项目修改
  //             url: 'http://ss.bjzzdk.com/index.php/Applets/Login/userAuthSlogin',
  //             method: "POST",
  //             data: {
  //               utoken: utoken,
  //               code: code,
  //               encryptedData: res.encryptedData,
  //               iv: res.iv
  //             },
  //             fail: function (res) {


  //             },
  //             success: function (res) {
  //               //console.log(res)
  //               var utoken = res.data.utoken;
  //               //设置用户缓存
  //               wx.setStorageSync("utoken", utoken);
  //               wx.setStorageSync("userinfo", res.data.userinfo);
  //             }
  //           })
  //         },
  //         fail:function(){
  //           console.log("用户拒绝")
  //           wx.showModal({
  //             title: '提示',
  //             content: '您未授权登陆,无法正常商城购物,点击确定重新获取授权。',
  //             success: function (res) {
  //               if (res.confirm) {
  //                 wx.openSetting({
  //                   success: (res) => {
  //                     if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
  //                       wx.getUserInfo({
  //                         success: function (res) {
  //                           wx.request({
  //                             //用户登陆URL地址，请根据自已项目修改
  //                             url: 'http://ss.bjzzdk.com/index.php/Applets/Login/userAuthSlogin',
  //                             method: "POST",
  //                             data: {
  //                               utoken: utoken,
  //                               code: code,
  //                               encryptedData: res.encryptedData,
  //                               iv: res.iv
  //                             },
  //                             fail: function (res) {


  //                             },
  //                             success: function (res) {
  //                               //console.log(res)
  //                               var utoken = res.data.utoken;
  //                               //设置用户缓存
  //                               wx.setStorageSync("utoken", utoken);
  //                               wx.setStorageSync("userinfo", res.data.userinfo);
  //                             }
  //                           })
  //                         }
  //                       })
  //                     }
  //                   }, fail: function (res) {

  //                   }
  //                 })

  //               }
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  globalData: {
    userInfo: null,
    code: "1",
    location: "北京",
    //Murl: "https://m.7710mall.com/index.php"
    Murl: "https://www.7710mall.com/index.php"
  }
})