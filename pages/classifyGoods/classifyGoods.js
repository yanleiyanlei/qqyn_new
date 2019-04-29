//获取应用实例
const app = getApp();
const user = require("../../lib/js/user.js")
const util = require("../../utils/util.js")
// pages/classifyGoods/classifyGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    goods: [],
    second: [],
    mshow: "display:none",
    // oneType:"",
    twoType: "",
    active: "",
    xlactive: "",
    jgactive: "",
    xlOrder: 1,
    jgOrder: 1,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    classfyBtn: [{
        id: '1',
        name: '生态果蔬'
      },
      {
        id: '3',
        name: '米面粮油'
      },
      {
        id: '4',
        name: '肉禽蛋品'
      },
      {
        id: '108',
        name: '休闲零食'
      }
    ],
    classfyBtnActive: 0,
    cartList:[]
  },
  golaAdd: function() {
    wx.navigateTo({
      url: '/pages/laAdd/laAdd',
    })
  },
  close: function() {
    this.setData({
      mshow: "display:none"
    })
  },
  UserInfo: function(e) {
    this.setData({
      mshow: "display:none"
    })
    user.user(e);
  },
  /** 点击分类 */
  clickClassfy: function(e) {
    console.log(e.target.dataset.id, e.target.dataset.index);
    var locationcity = wx.getStorageSync("locationcity");
    if (locationcity) {
      var add = locationcity
    } else {
      var add = wx.getStorageSync("locationcity")
    }

    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    var data = {
      one_cat_id: id,
      city: add
    };
    var that = this;
    that.setData({
      classfyBtnActive: index,
      one_cat_id: id
    })
    this.updateList(add, id);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad", options);
    let _this=this;
    let locationcity = wx.getStorageSync("locationcity");
    /** 根据跳转过来的ID显示对应的分类 */
    let pid = options.pid;
    if (pid) {
      wx.setStorageSync("pid", pid);
    }
    this.setData({
      location: locationcity,
      one_cat_id: options.id,
      oneType: options.id
    })
    /** 根据跳转过来的ID显示对应的分类 */
    if (options.id) {
      for (var i = 0; i < this.data.classfyBtn.length; i++) {
        if (options.id === this.data.classfyBtn[i].id) {
          _this.setData({
            classfyBtnActive: i
          })
        }
      }
      this.updateList(locationcity, options.id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  updateList: function (city, one_cat_id) {
    //if (city != this.data.location || one_cat_id != this.data.one_cat_id) {
      //console.log(add+'onshow,改变了', this.data.location)
      var that = this;
      console.log(one_cat_id, city)
      var data = {
        one_cat_id: one_cat_id,
        city: city
      }
      util.request('/Applets/Index/classify_content', data).then(function (res) {
        if (res.seond_cat && res.goods) {
          console.log('success' ,res.goods)
          for(var i=0;i<res.goods.length;i++){
            if (res.goods[i].spec_name === null) {
              res.goods[i].spec_name = '';
            }
            res.goods[i].goods_name = res.goods[i].goods_name+res.goods[i].spec_name;
            if (res.goods[i].goods_name.length>26){
              res.goods[i].goods_name = res.goods[i].goods_name.substring(0,26)+'...'
            }
          }
          that.setData({
            second: res.seond_cat,
            goods: res.goods
          })
          // 获取购物车列表
          that.getCartList();
        } else {
          that.setData({
            second: res.seond_cat,
            goods: ''
          })
        }
      })
    //}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var locationcity = wx.getStorageSync("locationcity");
    var add;
    if (locationcity) {
      add = locationcity
    } else {
      add = wx.getStorageSync("locationcity")
    }
    if(add != this.data.location){
      //console.log(add+'onshow,改变了', this.data.location)
      this.updateList(add, this.data.one_cat_id);
    }
    this.setData({
      location: add
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
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var url = currentPage.route
    var options = currentPage.options
    console.log(url)
    console.log(options)
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    return {
      title: '【青青优农】追求原始的味道',
      path: '/pages/classifyGoods/classifyGoods?id=' + options.id + '&pid=' + uid,
      imageUrl: '',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {

      }
    }
  },
  // 点击二级分类=============
  second: function(e) {
    let that = this;
    let data = {
      one_cat_id: that.data.oneType,
      two_cat_id: that.data.twoType
    }
    let req = util.request("/Applets/Index/timesort", data);
    req.then(
      function (res) {
        console.log("获取购物车列表", res)
        wx.navigateTo({
          url: '../secondGoods/secondGoods?page=2&oneType=' + that.data.oneType + '&twoType=' + e.currentTarget.dataset.secondid
        })
      },
      function (err){
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    )
  },
  // 更新商品列表
  updateCartState: function () {
    console.log("updateCartState");
    let domArr = this.selectAllComponents('.goodsItem');
    domArr.forEach(function (v, k) {
      v.init();
    })
  },
  // 获取购物车列表
  getCartList: function () {
    let _this = this; 
    let uid = wx.getStorageSync("userinfo").uid;
    let data = {
      member_id: uid,
      seller_id: 1,
    }
    let req = util.request("/Applets/Cart/ajaxCartList", data);
    req.then(
      function (res) {
        console.log("获取购物车列表", res)
        _this.setData({
          cartList: res.cartList
        });
        _this.updateCartState();
      }
    )
  }
})