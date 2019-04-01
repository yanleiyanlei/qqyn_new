//获取腾讯地图应用实例
var QQMapWX = require('../../lib/js/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: '5UPBZ-OQLKD-AE44M-HBYKJ-32WLH-2JBKT' //密钥
})
// pages/search/search.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots: [],
    location:''

  },
  // 清楚最近搜索======
  clear: function () {
    var that = this;
    wx.clearStorage()
    that.setData({ hots: [] })

  },
  // 热门搜索事件=======
  hotsearch: function (e) {
    var that = this;
    //console.log(e.currentTarget.dataset.name)
    // 获取一下最近搜索
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        console.log(res)
        that.setData({ hots: res.data })
      }
    })

    // 新存贮本地最近搜索
    that.data.hots.push(e.currentTarget.dataset.name)
    console.log(that.data.hots)
    var nhots = new Set(that.data.hots)
    var hotarr = []
    for (let item of nhots.keys()) {
      //console.log(item);
      hotarr.push(item)
    }
    //console.log(arr)
    wx.setStorage({
      key: "hots",
      data: hotarr
    })
    var city = that.data.location
    wx.request({
      url: app.globalData.Murl+'/Applets/Index/search_goods',
      data: { txt: e.currentTarget.dataset.name ,city: city},
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //status:状态值。
        var status = res.data.status

        if (status == 1) {
          wx.navigateTo({
            url: '../secondGoods/secondGoods?page=1&goodsid=' + res.data.goods_ids + '&txt=' + e.currentTarget.dataset.name, 
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })


        } else if (status == 0) {
          wx.navigateTo({
            url: '../searchnull/searchnull?goodsid=' + res.data.goods_ids,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          //console.log(e.detail.value)

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



  },
  searchbtn: function () {
    var that = this;

    // 获取一下最近搜索
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        console.log(res)
        that.setData({ hots: res.data })
      }
    })




    if (that.data.searchValue == "") {
      wx.showToast({
        title: '内容不能为空哦~',
        icon: 'none',
        duration: 2000
      })

    } else if (that.data.searchValue == "巩建铄" || that.data.searchValue == "马丹丹" || that.data.searchValue == "赵晓阳") {
      wx.showToast({
        title: 'HELLO,WORLD!You are a lucky man！',
        icon: 'none',
        duration: 2000
      })

    } else {

      // 新存贮本地最近搜索
      that.data.hots.push(that.data.searchValue)
      //console.log(that.data.hots)
      var nhots = new Set(that.data.hots)
      var hotarr = []
      for (let item of nhots.keys()) {
        console.log(item);
        hotarr.push(item)
      }
      //console.log(arr)
      wx.setStorage({
        key: "hots",
        data: hotarr
      })



      wx.request({
        url: app.globalData.Murl+'/Applets/Index/search_goods',
        data: { txt: that.data.searchValue },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //status:状态值。
          var status = res.data.status
          //console.log(res.data.status)
          //data
          // var that = this 
          console.log(res)
          if (status == 1) {
            wx.navigateTo({
              url: '../secondGoods/secondGoods?page=1&goodsid=' + res.data.goods_ids + '&txt=' + that.data.searchValue,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else if (status == 0) {
            wx.navigateTo({
              url: '../searchnull/searchnull?goodsid=' + res.data.goods_ids,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            //console.log(e.detail.value)

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
  searchValue: function (e) {
    //console.log(e.detail.value)
    var that = this;
    that.setData({ searchValue: e.detail.value })
    //console.log(that.data.searchValue)

  },
  search: function (e) {
    var that = this;
    // 获取一下最近搜索
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        console.log(res)
        that.setData({ hots: res.data })
      }
    })
    if (e.detail.value == "") {
      wx.showToast({
        title: '能容不能为空哦~',
        icon: 'none',
        duration: 2000
      })

    } else if (e.detail.value == "巩建铄" || that.data.searchValue == "马丹丹" || that.data.searchValue == "赵晓阳") {
      wx.showToast({
        title: 'HELLO,WORLD!You are a lucky man！',
        icon: 'none',
        duration: 2000
      })

    } else {
      // 新存贮本地最近搜索
      // that.data.hots.push(e.detail.value)
      // //console.log(arr)
      // wx.setStorage({
      //   key: "hots",
      //   data: that.data.hots
      // })

      // 新存贮本地最近搜索
      that.data.hots.push(e.detail.value)
      //console.log(that.data.hots)
      var nhots = new Set(that.data.hots)
      var hotarr = []
      for (let item of nhots.keys()) {
        console.log(item);
        hotarr.push(item)
      }
      //console.log(arr)
      wx.setStorage({
        key: "hots",
        data: hotarr
      })


      wx.request({
        url: app.globalData.Murl+'/Applets/Index/search_goods',
        data: { txt: e.detail.value },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //status:状态值。
          var status = res.data.status
          //console.log(res.data.status)
          //data
          //console.log(res.data)

          if (status == 1) {
            wx.navigateTo({
              url: '../secondGoods/secondGoods?page=1&goodsid=' + res.data.goods_ids,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })


          } else if (status == 0) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var that = this;

    // 获取本地搜索历史
    wx.getStorage({
      key: 'hots',
      success: function (res) {
        console.log(res)
        //var hots = []
        //hots.push(res.data)
        that.setData({ hots: res.data })
        //console.log(that.data.hots)
      }
    })
    // 获取用户地点
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (ress) {
     
            console.log(ress);
            
            that.setData({
              location: ress.result.address_component.province
            });
            wx.setStorageSync("locationcity", ress.result.address_component.province);
            wx.setStorageSync("locationid", "");
            wx.setStorageSync("locationadd", "");
            // getApp().globalData.location = ress.result.address_component.province;
            // getApp().globalData.location = "上海";
          }
        })

      },
      fail: function () {
        //console.log("获取失败")
        wx.showModal({
          title: '提示',
          content: '您未授权访问位置，请点击确定授权，方便购物。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  //console.log(res)
                  if (res.authSetting["scope.userLocation"]) { ////如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'gcj02',
                      success: function (res) {
                        //console.log(res)
                        demo.reverseGeocoder({
                          location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                          },
                          success: function (ress) {

                            //console.log(ress);
                            that.setData({
                              location: ress.result.address_component.province
                            });
                            wx.setStorageSync("locationcity", ress.result.address_component.province)

                            // getApp().globalData.location = ress.result.address_component.province;
                            // getApp().globalData.location = "上海";

                          }
                        })
                      }

                    })
                  }
                },
                fail: function (res) {

                }
              })

            }
          }
        })

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