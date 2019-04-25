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
    let that = this;
    let txt = options.txt;
    let page = options.page;
    let goodsid = options.goodsid;
    // let options = options;
    // console.log(options)
    this.setData({
      txt: txt,
      page: page,
      options: options
    })
    // 获取购物车列表 
    var uid = wx.getStorageSync("userinfo").uid;
    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function(res) {
        console.log(res.data.cartList)
        that.setData({
          cartList: res.data.cartList
        })
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
    let that = this;
    let location = wx.getStorageSync("locationcity");
    let txt = that.data.txt;
    that.setData({
      location: location
    })
    wx.request({
      url: app.globalData.Murl + '/Applets/Index/search_goods',
      data: {
        txt: that.data.txt,
        city: location
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success: function(res) {
        //status:状态值。 
        var status = res.data.status
        that.setData({
          goods_ids: res.data.goods_ids
        })
        var options = that.data.options
        // 判断从哪个页面进来的 
        if (options.page == 1) {
          // 从搜索页面过来 
          that.setData({
            goodsid: options.goodsid
          })
          wx.request({
            url: app.globalData.Murl + '/Applets/Index/search_list',
            data: {
              ids: that.data.goods_ids
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值 
            },
            success: function(res) {
              console.log(res)
              that.setData({
                goods: res.data
              })
              if (res.data.length < 3) {
                that.setData({
                  mstyle: "padding-bottom:550rpx"
                })
              }
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
        } else if (options.page == 2) {
          that.setData({
            oneType: options.oneType,
            twoType: options.twoType
          })
          // 从分类页面过来 
          wx.request({
            url: app.globalData.Murl + '/Applets/Index/classify_content',
            data: {
              two_cat_id: options.twoType
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值 
            },
            success: function(res) {
              console.log(res)

              that.setData({
                goods: res.data.goods
              })

              if (res.data.goods.length < 3) {
                that.setData({
                  mstyle: "padding-bottom:550rpx"
                })
              }
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
        }
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

    // 获取购物车列表 
    // var location = app.globalData.location; 
    // that.setData({ 
    //   location: location 
    // }) 
    var uid = wx.getStorageSync("userinfo").uid;
    const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
    wx.request({
      url: shopusr,
      data: {
        member_id: uid,
        seller_id: 1,
      },
      method: "POST",
      success: function(res) {
        console.log(res.data.cartList)
        that.setData({
          cartList: res.data.cartList
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
      ids: that.data.goods_ids
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
      ids: that.data.goods_ids
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
      ids: that.data.goods_ids
    }
    let order = e.currentTarget.dataset.order;
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
            jgOrder: 2
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
      ids: that.data.goods_ids,
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

    wx.request({
      url: app.globalData.Murl + '/Applets/Index/screen',
      data: {
        one_cat_id: that.data.oneType,
        two_cat_id: that.data.twoType,
        ids: that.data.goods_ids,
        state: that.data.sxID
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值 
      },
      success: function (res) {

        that.setData({
          active: "",
          xlactive: "",
          goods: res.data
        })
        that.updateCartState();
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
  updateCartState:function(){
    let domArr = this.selectAllComponents('.item');
    domArr.forEach(function (v, k) {
      v.init();
    })
  }
})