// pages/special/special.js
const app = getApp();
var user = require("../../lib/js/user.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner: [], //顶部bannertu
    goods: [], //商品
    mshow: "display:none", //是否显示授权
    cartList: [], //购物车
    imgurl: "http://ss.bjzzdk.com/Public/Uploads/", //照片需要加个域名
    bannerimgurl: "http://ss.bjzzdk.com" //banner图片域名
  },

  // 确认是否授权
  UserInfo: function(e) {
    this.setData({
      mshow: "display:none"
    })
    user.user(e);
  },
  // 拒绝授权
  close: function() {
    this.setData({
      myshow: "display:none"
    })
  },
  
  // 添加购物车

  cart: function(e) {
    var that = this; //赋值that= this
    var uid = wx.getStorageSync("userinfo").uid; //获取用户id



    if (!uid) { //判断用户是否授权登录
      that.setData({
        mshow: "display:block"
      })
    } else {
      var uid = wx.getStorageSync("userinfo").uid; //获取用户id
      var goodsid = e.currentTarget.dataset.goodsid; //获取添加商品id
      var spec_key = e.currentTarget.dataset.key; //商品规格
      console.log(uid);
      console.log(goodsid);
      console.log(spec_key);
      //提交添加商品请求
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
        data: {
          member_id: uid, //用户id
          goods_id: goodsid, //商品id
          goods_num: 1, //商品数目
          spec_key: spec_key //商品规格
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          var txt = res.data.msg; //商品添加情况
          var num = res.data.thisGoodsNum; //购物车中商品的数量
          e.currentTarget.dataset.num = num;
          //使用微信自带弹窗站式是否添加进购物车
          wx.showToast({
            title: txt,
            icon: 'none',
            duration: 2000
          });
          if (res.data.status == 1) { //更新购物车数据
            wx.request({
              url: app.globalData.Murl + '/Applets/Cart/ajaxCartList',
              data: {
                member_id: uid,
                seller_id: 1
              },
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function(res) { //请求成功更新购物车数据
                console.log(res.data.cartList);
                that.setData({
                  cartList: res.data.cartList
                })
              }
            })
          }
        }
      })
    }
  },

  //商品跳转到详情页
  goodsDetails: function(e) {
    var goodsid = e.currentTarget.dataset.goodsid; //获取商品id
    wx.navigateTo({ //跳转到详情页
      url: '../details/details?goodsid=' + goodsid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  //点击banner领取优惠券
  lingquyouhuiquan:function(e) {
    var uid = wx.getStorageSync('userinfo').uid
    console.log(uid)
    wx.request({
      url: app.globalData.Murl + "/Applets/Lq/lq", //请求地址
      data: { //请求参数
        member_id: uid, //用户id
        fm: 0
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res)
        wx.showToast({
          title: res.data.data,
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this; //将  this赋值给 that
    var uid = wx.getStorageSync("userinfo").uid; //获取用户id
    //获取购物车数据
    wx.request({
      url: app.globalData.Murl + "/Applets/Cart/ajaxCartList", //请求地址
      data: { //请求参数
        member_id: uid, //用户id
        seller_id: 1
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data.cartList)
        that.setData({
          cartList: res.data.cartList //请求成功更新购物车数据
        })
      }
    })

    //获取商品列表  及banner图片
    wx.request({
      url: app.globalData.Murl + '/Applets/Zt/index', //请求地址
      data: {
        id: options.id
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          banner: res.data.img, //请求成功更新banner图片
          goods: res.data.goods //请求成功更新goods商品列表
        })
      },
      fail: function(res) {
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
      }
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