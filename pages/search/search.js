// pages/search/search.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots: [],
    location:'',
    city:''
  },
  // 清楚最近搜索======
  clear: function () {
    var that = this;
    // wx.clearStorage();
    wx.setStorage({
      key: "hots",
      data: []
    })
    that.setData({ hots: [] })

  },
  // 热门搜索事件=======
  hotsearch: function (e) {
    console.log("hotsearch", e.currentTarget.dataset.name);
    let value = e.currentTarget.dataset.name;
    this.requestPro(value)
  },
  searchbtn: function () {
    // let value = this.data.searchValue;
    this.requestPro(this.data.searchValue);
  },
  searchValue: function (e) {
    //console.log(e.detail.value)
    this.setData({ searchValue: e.detail.value })
  },
  search: function (e) {
    this.requestPro(e.detail.value);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取本地搜索历史
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        that.setData({ hots: res.data })
      }
    })
    // 热门搜索
    wx.request({
      url: app.globalData.Murl+'/Applets/Index/hot_search',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({ hot_seaech: res.data })
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
    let that=this;
    let location = wx.getStorageSync("locationcity");
    this.setData({
      location:location
    });
    // 获取本地搜索历史
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        that.setData({ hots: res.data })
      }
    })
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
  //请求数据
  requestPro:function(value){
    let _this = this;
    if (value == "") {
      wx.showToast({
        title: '内容不能为空哦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 更新搜索历史
      this.updateHistory(value);
      let city = _this.data.location;
      console.log("city",city);
      wx.request({
        url: app.globalData.Murl + '/Applets/Index/search_goods',
        data: { txt: value, city: city},
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("search_goods",res);
          //status:状态值。
          let status = res.data.status;
          let goods_ids = res.data.goods_ids
          console.log("requestPro", res)
          if (status == 1 && goods_ids!="") {
            wx.navigateTo({
              url: '../secondGoods/secondGoods?page=1&goodsid=' + res.data.goods_ids + '&txt=' + value,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            console.log("搜索不到商品，推荐商品：" + res.data.goods_ids);
            wx.navigateTo({
              url: '../searchnull/searchnull?goodsid=' + res.data.goods_ids,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
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
  //更新搜索历史
  updateHistory:function(value){
    console.log("updateHistory",value);
    let _this=this;
    if(!value) return;
    // 获取一下最近搜索
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        _this.setData({ hots: res.data })
      }
    });
    // 新存贮本地最近搜索
    _this.data.hots.push(value)

    let nhots = new Set(_this.data.hots)
    let hotarr = []
    for (let item of nhots.keys()) {
      hotarr.push(item)
    }
    //console.log(arr)
    wx.setStorage({
      key: "hots",
      data: hotarr
    })
  }
})