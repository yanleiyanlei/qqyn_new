// pages/checkAdd/checkAdd.js

var QQMapWX = require('../../lib/js/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: '5UPBZ-OQLKD-AE44M-HBYKJ-32WLH-2JBKT' //密钥
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    city: "北京市"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  locationadd: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(ress) {

            //console.log(ress);
            that.setData({
              city: ress.result.address_component.province
            });
            // getApp().globalData.location = ress.result.address_component.province;
            // getApp().globalData.location = "上海";
           
          }
        })

      },
    })
  },

  bindRegionChange: function(e) {
    this.setData({
      city: e.detail.value[1]
    })
  },

  save: function() {
    wx.setStorageSync("locationcity", this.data.city);
    wx.setStorageSync("locationid", "");
    wx.setStorageSync("locationadd", "");
    wx.navigateBack({
      delta: 2
    })
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