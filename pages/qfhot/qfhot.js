//获取应用实例
const app = getApp();
var user = require("../../lib/js/user.js")
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
  // 添加购物车=================
  cart: function (e) {
    var that = this;
    var uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      that.setData({
        mshow: "display:block"
      })
    } else {
      var uid = wx.getStorageSync("userinfo").uid;
      var goods_id = e.currentTarget.dataset.goodsid;
      var spec_key = e.currentTarget.dataset.key;
      //console.log(uid)
      wx.request({
        url: app.globalData.Murl+'/Applets/Cart/ajaxAddcart/',
        data: {
          member_id: uid,//会员ID
          goods_id: goods_id, //商品ID
          goods_num: 1, //商品数量
          spec_key: spec_key
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          // console.log(res.data)
          var txt = res.data.msg
          var num = res.data.thisGoodsNum
          e.currentTarget.dataset.num = num
          //console.log(e.currentTarget.dataset.num)
          wx.showToast({
            title: txt,
            icon: 'none',
            duration: 2000
          })
          if (res.data.status == 1) {
            // 重新更新购物车数据表
            const shopusr = app.globalData.Murl+"/Applets/Cart/ajaxCartList";
            wx.request({
              url: shopusr,
              data: {
                member_id: uid,
                seller_id: 1,
              },
              method: "POST",
              success: function (res) {
                //console.log(res.data.cartList)

                that.setData({
                  cartList: res.data.cartList
                })

              }
            })

          }

        },
        fail: function (res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)

        }
      })
    }

  },
  // 商品跳转详情======================
  goodsDetails: function (e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  /**
   * 生命周期函数--监听页面加载========
   */
  onLoad: function (options) {

    var that = this;
    // 获取购物车列表
    var uid = wx.getStorageSync("userinfo").uid;
    const shopusr = app.globalData.Murl+"/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.cartList)

        that.setData({
          cartList: res.data.cartList
        })

      }
    })
    //青粉推荐banner及青粉商品==============
    wx.request({
      url: app.globalData.Murl+'/Applets/Index/hot_goods',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res)
        //that.data.list.push(listcont)  
        that.setData({ banner: res.data.img })
        that.setData({ goods: res.data.goods })
        //console.log(that.data.imgUrls)

      },
      fail: function (res) {
        wx.showLoading({
          title: '网络连接失败！',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

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