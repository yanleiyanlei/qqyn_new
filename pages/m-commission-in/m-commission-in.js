const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  tip:function(){
    console.log(9999)
     var tip=this.data.tip;
     console.log(tip)
     if(tip==true){
       this.setData({
         tip:false
       })
     }else{
       this.setData({
         tip: true
       })
     }
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/User/Cashbank',
      data: { member_id: wx.getStorageSync("userinfo").uid },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.setData({
          info:res.data.select,
          man:res.data.s
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
