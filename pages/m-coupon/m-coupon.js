const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    coupon: [],
    active: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  tab: function (e) {
    var active = e.currentTarget.dataset.sta;
    var that = this;

    if (active == 1) {
      wx.request({
        url: app.globalData.Murl+'/Applets/User/coupon',
        data: { member_id: that.data.uid, seller_id: 1 },
        method: 'post',
        success: function (res) {
          that.setData({
            coupon: res.data.coupon_one,
            active: active
          })
        }
      })
    } else if (active == 2) {
      wx.request({
        url: app.globalData.Murl+'/Applets/User/used_coupon',
        data: { member_id: that.data.uid, seller_id: 1 },
        method: 'post',
        success: function (res) {
          console.log(res)
          that.setData({
            coupon: res.data.coupon,
            active: active
          })
        }
      })
    } else if (active == 3) {
      wx.request({
        url: app.globalData.Murl+'/Applets/User/end_coupon',
        data: { member_id: that.data.uid, seller_id: 1 },
        method: 'post',
        success: function (res) {
          console.log(res)
          that.setData({
            coupon: res.data.coupon,
            active: active
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      uid: wx.getStorageSync("userinfo").uid
    })
    var that = this;
    console.log(that.data.uid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/coupon',
      data: { member_id: that.data.uid, seller_id: 1 },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.setData({
          coupon: res.data.coupon_one
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast();
        }, 1000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})