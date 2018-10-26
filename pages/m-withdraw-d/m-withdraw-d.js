const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  tab: function (e) {
    var tab = e.currentTarget.dataset.sta
    this.setData({
      active: tab
    })
    if (tab == 0) {
      this.setData({
        list: this.data.list1
      })
    } else if (tab == 1) {
      this.setData({
        list: this.data.list2
      })
    } else if (tab == 2) {
      this.setData({
        list: this.data.list3
      })
    } else if (tab == 3) {
      this.setData({
        list: this.data.list4
      })
    }

  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/User/cash_dec',
      data: { member_id: wx.getStorageSync("userinfo").uid },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.setData({
          list1: res.data.all,
          list2: res.data.review,
          list3: res.data.pend_money,
          list4: res.data.success,
          list: res.data.all
        })

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