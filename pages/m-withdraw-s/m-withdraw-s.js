const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:" ", //类型 1=微信  3=余额
    money:" ", //提现金额
    number: " " //提款人微信账号

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    var money = options.money;
    var path= options.path;
    var number = options.number;
    _this.setData({
      money:money,
      path:path,
      number: number
    })
    // wx.request({
    //   url: app.globalData.Murl + '/Applets/User/Cashwithdrawal',
    //   data: {
    //     id: id
    //   },
    //   method: 'post',
    //   success: function(res) {
    //     console.log(res)
    //     that.setData({
    //       money: res.data.withdrawal_money,
    //       path: res.data.withdrawal_path
    //     })
    //   }
    // })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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