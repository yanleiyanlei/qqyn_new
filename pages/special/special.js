// pages/special/special.js
const app = getApp();
var user = require("../../lib/js/user.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mshow: "display:none",
    id:'',    //专题id
    uid:'',  //用户id
    banner: [], //顶部bannertu
    goods: [], //商品
    mshow: "display:none", //是否显示授权
    cartList: [], //购物车
    imgurl: "http://ss.bjzzdk.com/Public/Uploads/", //照片需要加个域名
    bannerimgurl: "http://ss.bjzzdk.com", //banner图片域名
    isPhone: false
  },
  //获取手机号信息
  getPhoneNumber(e) {
    let that = this;
    if (e.detail.iv) {
      let uid = wx.getStorageSync("userinfo").uid;
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/getPhone',
        method: "POST",
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          member_id: uid
        },
        success: function (res) {
          console.log("getPhoneNumber", res)
          if (res.data.status == 1) {
            wx.showTabBar({})
            app.globalData.isPhone = true;
            that.setData({
              isPhone: false
            })
          }
        }
      })
    }
  },
  //判断是否注册手机号了
  hasPhone: function () {
    let that = this;
    let uid = wx.getStorageSync("userinfo").uid;
    if (uid) {
      wx.request({
        //用户登陆URL地址，请根据自已项目修改
        url: app.globalData.Murl + '/Applets/Login/isPhone',
        method: "POST",
        data: {
          member_id: uid
        },
        success: function (ress) {
          console.log(ress.message);
          if (ress.data.status == 1) {
            that.setData({
              isPhone: true
            })
          } else {
            app.globalData.isPhone = true;
            that.setData({
              isPhone: false
            });
            wx.showTabBar({});
          }
        }
      })
    }
  },
  UserInfo: function (e) {
    console.log(e);
    if (e.detail.iv) {
      this.setData({
        mshow: "display:none"
      })
    }
    user.user(e, this.isPhoneFun);
  },
  isPhoneFun: function (obj) {
    let that = this;
    console.log('isPhoneFun', obj);
    if (obj.data.status == 1) {
      that.setData({
        mshow: "display:none",
        isPhone: true
      })
    } else {
      that.initPage();
    }
  },
  // 拒绝授权
  close: function() {
    this.setData({
      myshow: "display:none"
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
  // 分享送券
  deliverCoupon(type) {  
    let comeFrom = type == 'login' ? 'a' : 'b';
    //
    wx.request({
      url: app.globalData.Murl + '/Applets/Zt/ztcoupon', //请求地址
      data: { //请求参数
        zt_id: this.data.id,
        member_id: this.data.uid,
        from: comeFrom
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 1) {
          wx.showModal({
            // title: '提示',
            content: '恭喜您获得199减100优惠券！',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  getCartList(){
    let _this = this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Cart/ajaxCartList", //请求地址
      data: { //请求参数
        member_id: this.data.uid, //用户id
        seller_id: 1
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data.cartList)
        _this.setData({
          cartList: res.data.cartList //请求成功更新购物车数据
        })
      }
    })
  },
  getPageData(){
    let _this=this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Zt/index', //请求地址
      data: {
        id: this.data.id
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (Array.isArray(res.data.goods)) {
          res.data.goods.forEach(element => {
            element.thumbnails = _this.data.imgurl + element.medium_img;
          });
        }
        _this.setData({
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
  initPage(){
    let uid = wx.getStorageSync("userinfo").uid; //获取用户id
    this.setData({
      uid:uid
    })
    // 获取购物车列表
    this.getCartList();
    // 获取商品列表  及banner图片
    this.getPageData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this; //将  this赋值给 that
    this.setData({
      id: options.id
    });
    var uid = wx.getStorageSync("userinfo").uid; //获取用户id
    if (!uid) {
      that.setData({
        mshow: "display:block"
      })
    }else{
      this.initPage();
    }
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
    // if (!app.globalData.isPhone) {
    //   this.hasPhone();
    // }
    this.deliverCoupon('login');
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
    this.deliverCoupon('share');
  }
})