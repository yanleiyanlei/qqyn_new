var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta:3,
    bill:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = wx.getStorageSync("userinfo").uid;
    that.setData({
      uid: uid
    });
    wx.request({
      url: app.globalData.Murl+'/Applets/User/top_up',
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        that.setData({
          remain: res.data.member_money
        })
      }
    })
    wx.request({
      url:app.globalData.Murl+'/Applets/User/Bankwithdrawal',
      data: { member_id: uid, itunes_status :3},
      method:"post",
      success:function(res){
        console.log(res)
        that.setData({
          bill: res.data.select
        })
      }
    })
  },
  tab:function(e){
    var sta=e.currentTarget.dataset.sta;
    console.log(sta)
    this.setData({
      sta:sta
    })
    var that=this;
    console.log(sta)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/Bankwithdrawal',
      data: { member_id:that.data.uid, itunes_status: sta},
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          bill: res.data.select
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