const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid: "",
    uid: '',
    active: 0,
    orderList: [],
    orderNum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      oid: options.oid,
      active: options.cla,
      uid: wx.getStorageSync("userinfo").uid
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl+'/Applets/User/m_estimate_list',
      data: { member_id: that.data.uid, show_id: that.data.oid },
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          orderNum: res.data.order_number,
          orderList: res.data.order_list
        })
      },
      fail:function(){
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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