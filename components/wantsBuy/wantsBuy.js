// pages/wantsBuy/wantsBuy.js
const app = getApp();
var util = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    dataTitle: {
      type: Object,
      value: {
        name: '',
        showTip: '',
      }
    },
    listData: {
      type: Number,
      value: ''
    },
    ztId: {
      type: Number,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: [],
    cartlist:[],
    special:[]
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // this.getwantsBuy();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
    created() {
    },
    ready() {
      this.getwantsBuy();
    }
  },
  methods: {
    getwantsBuy: function () {
      var that = this;
      var url = '';
      console.log(that.data.listData)
      if (!that.data.listData) {
        var data = {
          one_cat_id: 1
        };
        var res = util.request('/Applets/Index/getEveryoneBuyList', data, "post", "");
        res.then(function (data) {
          // console.log(data)
          var arr = [];
          if (data.data) {
            for (var i = 0; i < 6; i++) {
              if (data.data[i].spec_name === null) {
                data.data[i].spec_name = '';
              }
              data.data[i].goods_name = data.data[i].goods_name + data.data[i].spec_name;

              arr.push(data.data[i])
            }
            that.setData({
              goods: arr
            })
          }
        })
      } else if(that.data.listData == 2) {
        var dataDay = {
          id: that.data.ztId
        };
        var req = util.request('/Applets/Index/getThemeById', dataDay, "post", "");
        req.then(function (res) {
          console.log(res)
          that.setData({
            special: res.data
          })
        })
    } else if (that.data.listData == 4) {
      var data = {
        id: that.data.ztId
      };
      var req = util.request('/Applets/Index/getTwoClassGoodListById', data,"post", "")
      req.then(function (res) {
        console.log(222, res)
        that.setData({
          special: res.data
        })
      })
    }
      
    },
    // 添加购物车=================

    cart: function(e) {
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
        var city = wx.getStorageSync("locationcity");
        if (spec_key != null) {
          wx.request({
            url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
            data: {
              member_id: uid, //会员ID
              goods_id: goods_id, //商品ID
              goods_num: 1, //商品数量
              spec_key: spec_key,
              city:city
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
                var changeCarList = 22;
                that.triggerEvent('changeCarList', changeCarList)
                // 重新更新购物车数据表
                const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
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
              if (res.data.status == 10) {
                //by yan.lei 一键代发执行跳转
                wx.navigateTo({
                  url: '../theorder/theorder?goods_id=' + goods_id + '&num=1' + '&spec_key=' + spec_key + '&page=' + 1,
                  success: function (res) {
                    console.log(res)
                  },
                  fail: function (res) {
                    console.log(res)
                  },
                  complete: function (res) {
                    console.log(res)
                  },
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
        }else{
          wx.showToast({
            title: '添加商品失败！',
            icon: 'none',
            duration: 2000
          })
        }
      }

    },
    // 商品跳转详情
    goodsDetails: function(e) {
      console.log(e)
      var uid = wx.getStorageSync("userinfo").uid;
      var goods_id = e.currentTarget.dataset.goodsid;
      var spec_key = e.currentTarget.dataset.key;
      console.log(spec_key, goods_id, uid)
      if (spec_key != null){
        wx.navigateTo({
          url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        wx.showToast({
          title: '请求商品失败！',
          icon: 'none',
          duration: 2000
        })
      }
    }
  } 
}) 