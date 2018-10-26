const app = getApp()

//logs.js
var util = require('../../utils/util.js')
var author = require("../../lib/js/author.js");
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    author.author();
    // https://devework.com/weixin-weapp-auth-failed.html
    var that = this;
    //调用应用实例的方法获取全局数据
    // that.getUserInfo(function (userInfo) {
    //     //更新用户数据
    //     that.setData({
    //         userInfo: userInfo
    //     })
    // });

    
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  checkSettingStatu:function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
        success: function success(res) {
            console.log(res.authSetting);
            var authSetting = res.authSetting;
            if (util.isEmptyObject(authSetting)) {
                console.log('首次授权');
            } else {
                console.log('不是第一次授权', authSetting);
                // 没有授权的提醒
                if (authSetting['scope.userInfo'] === false) {
                    wx.showModal({
                        title: '用户未授权',
                        content: '如需正常商城购物，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.openSetting({
                                    success: function success(res) {   
                                        console.log('openSetting success', res.authSetting);
                                    }
                                });
                            }else{
                                console.log(1)
                            }
                        }
                    })
                }else if(authSetting['scope.userInfo']){
                    console.log("授权成功")
                    setTimeout(function(){
                        console.log(wx.getStorageSync("utoken"))

                    },500)
                   
                }
            }
        }
    });
  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //this.checkSettingStatu();
    
 

  },
})
