//页面授权登录的方法
var app = getApp();
function user(e,func) {
  wx.login({
    success: function (res) {
      var code = res.code;
      var utoken = wx.getStorageSync("utoken");
      var pid = wx.getStorageSync("pid");
      console.log(code);
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
          console.log("允许");

          isPhone(func, res);
        }
      })
    }
  })
}
function isPhone(func, res){
  //判断用户是否已经绑定手机号
  wx.request({
    //用户登陆URL地址，请根据自已项目修改
    url: app.globalData.Murl + '/Applets/Login/isPhone',
    method: "POST",
    data: {
      member_id: res.data.userinfo.uid
    },
    success: function (ress) {
      // console.log(res)
      //if (ress.data.status === 1) {
      func(ress)
      //}
    }
  })
}

module.exports = {
  user: user
}