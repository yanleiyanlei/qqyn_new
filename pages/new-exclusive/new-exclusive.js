const app = getApp();
var util = require('../../utils/util.js')
var user = require("../../lib/js/user.js")
Page({
  data: {
    flag: true,
    mshow:'display:none'
  },
  showMask: function() {
    this.setData({
      flag: false
    })
  },
  closeMask: function() {
    this.setData({
      flag: true,
    })
  },
  onLoad: function() {
    var that = this;
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        
        if (util.isEmptyObject(authSetting)) {
          console.log('首次授权');
          that.setData({
            mshow: "display:block"
          })
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用阅读记录功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                    }
                  });
                }
              }
            })
          }
        }
      }
    });
  },
  UserInfo: function (e) {
    this.setData({
      mshow: "display:none"
    })
    user.user(e)
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;
    //     var utoken = wx.getStorageSync("utoken");
    //     wx.request({
    //       //用户登陆URL地址，请根据自已项目修改
    //       url: app.globalData.Murl+'/Applets/Login/userAuthSlogin',
    //       method: "POST",
    //       data: {
    //         utoken: utoken,
    //         code: code,
    //         encryptedData: e.detail.encryptedData,
    //         iv: e.detail.iv
    //       },
    //       fail: function (res) {
    //       },
    //       success: function (res) {
    //         var utoken = res.data.utoken;
    //         //设置用户缓存
    //         wx.setStorageSync("utoken", utoken);
    //         wx.setStorageSync("userinfo", res.data.userinfo);
    //         //console.log("允许");
    //       }
    //     })
    //   }
    // })
  },
  getQuan:  function() {
    var uid = wx.getStorageSync("userinfo").uid;
    console.log(uid)
    var member_id = uid;
    wx.request({
      url: app.globalData.Murl +'/Applets/Lq/qudao',
      data: {
        member_id
      },
      method: "post",
      success: function(res) {
        console.log(res.data.status)
        // console.log(123)
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 1500,
            complete: function() {
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/m-coupon/m-coupon',
                })
              }, 1500);

            }
          })

        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 1500,
            complete: function() {
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 1500);

            }
          })

        }
      },
      fail: function() {}
    })

  },
  // gowx: function() {
  //   wx.switchTab({
  //     url: '/pages/bution/bution',
  //   })
  // }
});