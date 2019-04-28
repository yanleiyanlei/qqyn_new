//获取应用实例 
const app = getApp();
const user = require("../../lib/js/user.js");
const request = require('../../utils/util.js');
// pages/secondGoods/secondGoods.js 
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    goods: [],
    second: [],
    oneType: "",
    twoType: "",
    active: "",
    xlactive: "",
    jgactive: "",
    xlOrder: 1,
    jgOrder: 1,
    mshow: "display:none",
    show: "display:none",
    location: '',
    options: {},
    pid: '',
    page: '',
    txt: '',
    goods_ids: ''
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
    user.user(e)
  },
  onCartTap:function(options){
    // console.log('onCartTap',options);
    this.setData({
      mshow: "display:block"
    })
  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    // var pid = options.pid;
    console.log("onload", options)
    let that = this;
    let goods_ids = options.goodsid;
    let location = wx.getStorageSync("locationcity");
    this.setData({
      options: options,
      goods_ids: goods_ids,
      location: location
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
    let that = this;
    let location = wx.getStorageSync("locationcity");
    // let goods_ids = options.goodsid;
    // 获取购物车列表 
    that.getCartList();
    //是否需要重新请求 ids
    if (location!=that.data.location){
      that.reqGoodsid(location);
      that.setData({
        location: location
      });
      return;
    }
    // 请求商品列表
    that.reqGoods();
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
      path: 'pages/secondGoods/secondGoods?page=' + options.page + '&oneType=' + options.oneType + '&twoType=' + options.twoType + '&pid=' + uid,
      imageUrl: '',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        // 分享失败 
        //console.log(res) 
      }
    }
  },

  // 最新商品查询 
  newgoods: function() {
    if(this.data.active) return;
    let that = this;
    let city = wx.getStorageSync("locationcity");
    let url = '/Applets/Index/timesort';
    let data={
      one_cat_id: that.data.oneType,
      two_cat_id: that.data.twoType,
      ids: that.data.options.goodsid
    }
    let req = request.request(url,data);
    req.then(
      function(res){
        console.log(res);
        that.setData({
          active: "active",
          xlactive: "",
          jgactive: "",
          goods: res
        })
        that.updateCartState();
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

  //销量排行 
  saleN: function(e) {
    let that = this;
    let url;
    let data={
      one_cat_id: that.data.oneType,
      two_cat_id: that.data.twoType,
      ids: that.data.options.goodsid
    }
    let order = e.currentTarget.dataset.order;
    if (order == 1) {
      url = '/Applets/Index/xiaoxia';
    } else if (order == 2){
      url = '/Applets/Index/xiaoshang';
    }
    let req = request.request(url, data);
    req.then(
      function (res) {
        console.log(res);
        if(order==1){
          that.setData({
            active: "",
            jgactive: "",
            xlactive: "xlactive1",
            goods: res,
            xlOrder: 2
          });
        }else{
          that.setData({
            active: "",
            jgactive: "",
            xlactive: "xlactive2",
            goods: res,
            xlOrder: 1
          })
        }
        that.updateCartState();
      },
      function (err) {
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    )
  },
  //价格排序 
  priceN: function(e) {
    let that = this;
    let url;
    let data = {
      one_cat_id: that.data.oneType,
      two_cat_id: that.data.twoType,
      ids: that.data.options.goodsid
    }
    let order = e.currentTarget.dataset.order;
    console.log("priceN",order)
    if (order == 1) {
      url = '/Applets/Index/priceshang';
    } else if (order == 2) {
      url = '/Applets/Index/pricexia';
    }
    let req = request.request(url, data);
    req.then(
      function (res) {
        console.log(res);
        if (order == 1) {
          that.setData({
            active: "",
            xlactive: "",
            jgactive: "jgactive1",
            goods: res,
            jgOrder: 2
          })
        } else {
          that.setData({
            active: "",
            xlactive: "",
            jgactive: "jgactive2",
            goods: res,
            jgOrder: 1
          })
        }
        that.updateCartState();
      },
      function (err) {
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    )
  },
  // 筛选按钮点击 
  sxClick: function() {
    var that = this;
    that.setData({
      sxactive: "sxactive",
      show: "show"
    })
  },
  // 取消筛选 
  cancel: function() {
    var that = this;
    that.setData({
      sxactive: "",
      show: "",
      hsactive: "",
      sactive: ""
    })
  },
  // 新品上市点击 
  ngoods: function() {
    var that = this;
    that.setData({
      hactive: "",
      sactive: "sactive",
      sxID: "新品"
    })
  },
  //热销产品点击 
  hgoods: function() {
    var that = this;
    that.setData({
      hactive: "hactive",
      sactive: "",
      sxID: "热销"
    })
  },
  //确定筛选事件 
  confirm: function() {

    let that = this;
    let url = '/Applets/Index/screen';
    let data = {
      one_cat_id: that.data.oneType,
      two_cat_id: that.data.twoType,
      ids: that.data.options.goodsid,
      state: that.data.sxID
    }

    that.setData({
      sxactive: "",
      jgactive: "",
      show: "",
      hsactive: "",
      sactive: ""
    })

    let req = request.request(url, data);
    req.then(
      function (res) {
        console.log(res);
        that.setData({
          active: "",
          xlactive: "",
          goods: res
        })
        that.updateCartState();
      },
      function (err) {
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    )
  },
  updateCartState:function(){
    console.log("updateCartState");
    let domArr = this.selectAllComponents('.item');
    domArr.forEach(function (v, k) {
      v.init();
    })
  },
  getCartList:function(){
    let _this=this;
    // 获取购物车列表 
    let uid = wx.getStorageSync("userinfo").uid;
    let data = {
      member_id: uid,
      seller_id: 1,
    }
    let req = request.request("/Applets/Cart/ajaxCartList", data);
    req.then(
      function (res) {
        console.log("获取购物车列表", res)
        _this.setData({
          cartList: res.cartList
        })
      }
    )
  },
  reqGoodsid:function(str){
    let that=this;
    let data={
      txt: that.data.options.txt,
      city: str
    }
    let req = request.request("/Applets/Index/search_goods", data);
    req.then(
      function (res) {
        if(res.status){
          that.setData({
            goods_ids: res.goods_ids
          })
          that.reqGoods();
        }else{
          console.log("搜索不到商品，推荐商品：" + res.goods_ids);
          wx.redirectTo({
            url: '../searchnull/searchnull?goodsid=' + res.goods_ids,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    )
  },
  reqGoods:function(){
    let that=this;
    let options = that.data.options;
    let reqSon;
    // 判断从哪个页面进来的 
    if (options.page == 1) {
      console.log("reqGoods-goods_ids", that.data.goods_ids)
      reqSon = request.request('/Applets/Index/search_list', { ids: that.data.goods_ids });
    } else if (options.page == 2) {
      reqSon = request.request('/Applets/Index/classify_content', { two_cat_id: options.twoType, city: that.data.location });
    };
    reqSon.then(
      function (res) {
        console.log("reqSon", res)
        let goods = res.goods ? res.goods : res
        that.setData({
          goods: goods
        });
        that.updateCartState();
      },
      function (err) {
        wx.showLoading({
          title: '网络连接失败！',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    )
  }
})