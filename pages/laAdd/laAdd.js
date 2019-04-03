// pages/laAdd/laAdd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addlist: [],
    activeid: ""
  },
  checkloca: function(e) {
    var id = e.currentTarget.dataset.id; //获取id
    var city = e.currentTarget.dataset.city; //获取城市
    var add = e.currentTarget.dataset.add; //获取地址
    var sheng = e.currentTarget.dataset.sheng; //获取省
    var shi = e.currentTarget.dataset.shi; //获取市
    var qu = e.currentTarget.dataset.qu; //获取区
    var lastadd = sheng + shi + qu + add
    wx.setStorageSync("locationcity", city);
    wx.setStorageSync("locationid", id);
    wx.setStorageSync("locationadd", lastadd);
    wx.navigateBack({
      data: 1
    })
  },
  gocheckAdd: function() {
    wx.navigateTo({
      url: '/pages/checkAdd/checkAdd',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var activeid = wx.getStorageSync("locationid");
    this.setData({
      activeid: activeid
    })
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
    var _this = this;
    let idt = wx.getStorageSync("locationid");
    var uid = wx.getStorageSync("userinfo").uid;
    wx.request({
      url: app.globalData.Murl + '/Applets/User/m_address2',
      method: "POST",
      data: {
        member_id: uid //会员ID
      },
      success: function(res) {
        let data1 = res.data.select;
        // let data2 = data1.indexOf(id)
        let data3;
        for (let item in data1) {
          if (data1[item].id == idt) {
            data3 = data1[item];
            data1.splice(item, 1)
          }
        }
        if (data3) {
          data1.unshift(data3);
        }

        console.log(data3)
        console.log(data1)
        _this.setData({
          addlist: data1
        })
      }
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