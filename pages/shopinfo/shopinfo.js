const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onUnload:function(){
    app.globalData.store=1;
    console.log(33333)
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      uid: wx.getStorageSync("userinfo").uid
    })
    wx.request({
      url: app.globalData.Murl + '/Applets/User/extension',
      data: {
        member_id: wx.getStorageSync("userinfo").uid
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        that.setData({
          info: res.data
        })
      }
    })
  },
  //提交表单前进行正则验证
  formSubmit: function(e) {
    var vv = e.detail.value;
    console.log(vv)
    if (vv.shop_intro == "") {
      wx.showToast({
        title: '小店简介不能为空',
        icon: 'none',
        duration: 2000
      })
    }
    if (vv.my_phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
    }
   
    if (vv.my_phone != "" && vv.shop_intro != "") {
      wx.request({
        url: app.globalData.Murl + '/Applets/User/add_extension',
        data: vv,
        method: 'post',
        success: function(res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          if (res.data.status == 1) {
            app.globalData.store = 1;
            setTimeout(function() {
              wx.switchTab({
                url: '/pages/index/index',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  //console.log(page)
                  if (page == undefined || page == null) { return; }
                  page.onLoad();
                }
              })
            }, 2000)
          }

        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})