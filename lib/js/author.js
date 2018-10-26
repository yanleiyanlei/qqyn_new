//log文件引用的授权登录
const app = getApp()
 function author() {
    var that = this;
    //获取用户缓存token 此token是服务器作为用户唯一验证的标识，具体请看后端代码
    var utoken = wx.getStorageSync("utoken");
    wx.login({
      success: function (res) {
        console.log(res.code)
        var code = res.code;
        app.globalData.code = code;
        wx.getUserInfo({
          success: function (res) {
            //console.log("用户同意授权")
           // console.log(res)
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
          },
          fail:function(){
            console.log("用户拒绝")
            wx.showModal({
              title: '提示',
              content: '您未授权登陆,无法正常商城购物,点击确定重新获取授权。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                        wx.getUserInfo({
                          success: function (res) {
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
                              success: function (res) {
                                console.log(res)
                                var utoken = res.data.utoken;
                                //设置用户缓存
                                wx.setStorageSync("utoken", utoken);
                                wx.setStorageSync("userinfo", res.data.userinfo);
                              }
                            })
                          }
                        })
                      }
                    }, fail: function (res) {
                      console.log(111)


                    }
                  })

                }
              }
            })






          }
        })
      }
    })
  }

  module.exports.author = author;