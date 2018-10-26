//页面授权登录的方法
var app = getApp();
function user(e) {

  wx.login({
    success: function (res) {
      var code = res.code;
      var utoken = wx.getStorageSync("utoken");
      var pid = wx.getStorageSync("pid");
      console.log(pid);
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/userAuthSlogin',
        method: "POST",
        data: {
          utoken: utoken,
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          pid: pid
        },
        success: function (res) {
          var utoken = res.data.utoken;
          console.log(res);
          //设置用户缓存
          wx.setStorageSync("utoken", utoken);
          wx.setStorageSync("userinfo", res.data.userinfo);
          //console.log("允许");
        }
      })
    }
  })
}

module.exports = {
  user: user
}