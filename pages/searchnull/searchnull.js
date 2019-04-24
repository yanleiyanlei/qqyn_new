//获取应用实例
const app = getApp()
// pages/searchnull/searchnull.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList:[],  //购物车列表
    goods:[],     //推荐商品
    hots:[]       //最近搜索
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload",options);
    let _this=this;
    // 获取购物车列表
    this.getCartlist();
    //获取推荐商品列表
    this.getRecommend(options);
    // 获取一下最近搜索
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        console.log(res)
        _this.setData({ hots: res.data })
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
    // 获取购物车列表
    this.getCartlist();
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
  /**
   * 搜索
   */
  searchbtn: function () {
    var _this = this;
    if (_this.data.searchValue == "") {
      wx.showToast({
        title: '内容不能为空哦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 新存贮本地最近搜索
      _this.data.hots.push(_this.data.searchValue)
      //console.log(arr)
      wx.setStorage({
        key: "hots",
        data: _this.data.hots
      })
      wx.showLoading({
        title: '搜索商品',
      })
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/search_goods',
        data: { txt: _this.data.searchValue },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //status:状态值。
          wx.hideLoading()
          var status = res.data.status
          //console.log(res.data.status)
          //data
          console.log(res.data)
          if (status == 1) {
            wx.navigateTo({
              url: '../secondGoods/secondGoods?page=1&goodsid=' + res.data.goods_ids,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (status == 0) {
            wx.hideLoading();
            wx.showToast({
              title: '没有找到相关产品~',
              icon: 'none',
              duration: 2000
            })
            //console.log(e.detail.value)
          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '没有找到相关产品~',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  searchValue: function (e) {
    //console.log(e.detail.value)
    var _this = this;
    _this.setData({ searchValue: e.detail.value })
    //console.log(_this.data.searchValue)
  },
  //是否获取用户信息
  // onCartTap: function (options) {
  //   // console.log('onCartTap',options);
  //   this.setData({
  //     mshow: "display:block"
  //   })
  // },
  //获取购物车列表
  getCartlist:function(){
    let _this=this;
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
        console.log("getCartlist",res)
        _this.setData({
          cartList: res.data.cartList
        })
        let domArr=_this.selectAllComponents('.item');
        domArr.forEach(function(v,k){
          v.init();
        })
      }
    })
  },
  //获取推荐列表
  getRecommend:function(options){
    console.log("getRecommend", options.goodsid)
    if (!options.goodsid) return;
    let _this=this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/search_rec',
      data: { ids: options.goodsid },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //status:状态值。
        // var status = res.data.status
        _this.setData({ goods: res.data })
        console.log("getRecommend", res.data)
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
})