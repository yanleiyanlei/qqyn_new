// pages/giftCard/giftCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataTitle: {
      name: "",
      showTip: false,
    },
    listData:4,
    ztId: '',
    isRotate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      ztId: id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //监听滚动距离
  onPageScroll: function (e) {
    if (e.scrollTop > 150) {
      //改变
      this.setData({
        isRotate: true
      })
    } else {
      //正常
      this.setData({
        isRotate: false
      })
    }
  },
  //返回顶部
  goBack: function () {
    console.log(this.data.isRotate)
    if (this.data.isRotate) {
      //旋转
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
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