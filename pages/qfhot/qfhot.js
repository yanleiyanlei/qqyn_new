//获取应用实例
const app = getApp();
const user = require("../../lib/js/user.js");
const util = require('../../utils/util.js');
// pages/qfhot/qfhot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    goods:[],
    mshow:"display:none"
  },
  close: function () {
    this.setData({
      mshow: "display:none"
    })
  },
  UserInfo: function (e) {
    this.setData({
      mshow: "display:none"
    })
    user.user(e);
  },
  /**
   * 生命周期函数--监听页面加载========
   */
  onLoad: function (options) {
    let _this = this;
    // 获取购物车列表
    this.getCartlist();
    //青粉推荐banner及青粉商品==============
    let req = util.request('/Applets/Index/hot_goods');
    req.then(
      function(res){
        console.log("onload",res)
        _this.setData({
          banner: res.img,
          goods: res.goods
        })
      },
      function(err){
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    )
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
  
  },
  //是否获取用户信息
  // onCartTap: function (options) {
  //   // console.log('onCartTap',options);
  //   this.setData({
  //     mshow: "display:block"
  //   })
  // },
  updateCartState: function () {
    console.log("updateCartState");
    let domArr = this.selectAllComponents('.item');
    domArr.forEach(function (v, k) {
      v.init();
    })
  },
  //获取购物车列表
  getCartlist: function () {
    let _this = this;
    let uid = wx.getStorageSync("userinfo").uid;
    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function (res) {
        console.log("getCartlist", res)
        _this.setData({
          cartList: res.data.cartList
        })
        let domArr = _this.selectAllComponents('.item');
        domArr.forEach(function (v, k) {
          v.init();
        })
      }
    })
  }
})