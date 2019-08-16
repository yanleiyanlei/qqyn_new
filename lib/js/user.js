//页面授权登录的方法
var app = getApp();
function user(e,func) {
  wx.login({
    success: function (res) {
      var code = res.code;
      var utoken = wx.getStorageSync("utoken");
      var pid = wx.getStorageSync("pid");
      console.log(code);
      wx.getUserInfo({
        success: function (res) {
          //console.log("用户同意授权")
          // console.log(res)
          /*
          wx.request({
            //用户登陆URL地址，请根据自已项目修改
            url: 'https://m.7710mall.com/index.php/Applets/Login/userAuthSlogin',
            method: "POST",
            data: {
              utoken: utoken,
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv
            },
            fail: function (res) {


            },
            success: function (res) {
              //console.log(res)
              var utoken = res.data.utoken;
              //设置用户缓存
              wx.setStorageSync("utoken", utoken);
              wx.setStorageSync("userinfo", res.data.userinfo);
            }
          })
        */
          wx.request({
            //用户登陆URL地址，请根据自已项目修改
            url: app.globalData.Murl + '/Applets/Login/userAuthSlogin',
            method: "POST",
            data: {
              utoken: utoken,
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv,
              pid: pid
            },
            success: function (res) {
              var utoken = res.data.utoken;
              console.log(res);
              //设置用户缓存
              wx.setStorageSync("utoken", utoken);
              wx.setStorageSync("userinfo", res.data.userinfo);
              //console.log("允许");
              //    app.globalData.source
              //console.log(wx.getStorageSync("userinfo").uid);
              if (app.globalData.source != '') {
                wx.request({
                  url: app.globalData.Murl +'/Applets/Index/xcx_cou',
                  method:'post',
                  data:{
                    member_id:wx.getStorageSync("userinfo").uid
                  },
                  success:function(res){
                    console.log(res)
                    wx.showToast({
                      title: res.data.msg, 
                      duration: 1500,
                      success:function(){

                        if (res.data.status == 1) {
                          wx.switchTab({
                            url: '/pages/my/my'
                          })
                        }else{
                          return;
                        }
                      }
                    })
                  }
                })
              }
              isPhone(func, res);
            }
          })
        },
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
      console.log(ress)
      //if (ress.data.status === 1) {
      func(ress)
      //}
    }
  })
}

module.exports = {
  user: user
}