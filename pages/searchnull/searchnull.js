//获取应用实例
const app = getApp()
// pages/searchnull/searchnull.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 添加购物车=================
  cart: function (e) {
    var _this = this;
    // 判断用户是否授权
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    var code = app.globalData.code
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '提示',
            content: '您未授权登陆，点击确定授权登陆，方便购物。',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                      wx.getUserInfo({
                        success: function (res) {
                          var utoken = wx.getStorageSync("utoken");
                          wx.request({
                            //用户登陆URL地址，请根据自已项目修改
                            url: app.globalData.Murl+'/Applets/Login/userAuthSlogin',
                            method: "POST",
                            data: {
                              utoken: utoken,
                              code: code,
                              encryptedData: res.encryptedData,
                              iv: res.iv
                            },
                            fail: function (res) {


                            },
                            success: function (res) {
                              console.log(res)
                              var utoken = res.data.utoken;
                              //设置用户缓存
                              wx.setStorageSync("utoken", utoken);
                              wx.setStorageSync("userinfo", res.data.userinfo);
                            }
                          })


                        }
                      })
                    }
                  }, fail: function (res) {

                  }
                })

              }
            }
          })
        } else {

          var uid = wx.getStorageSync("userinfo").uid;
          var goods_id = e.currentTarget.dataset.goodsid;
          var spec_key = e.currentTarget.dataset.key;
          console.log(uid)
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
              console.log(res.data)
              var txt = res.data.msg
              var num = res.data.thisGoodsNum
              e.currentTarget.dataset.num = num
              console.log(e.currentTarget.dataset.num)
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
                    console.log(res.data.cartList)

                    _this.setData({
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
      }
    })


    //



  },
  // 商品跳转详情
  goodsDetails: function (e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
        title: '能容不能为空哦~',
        icon: 'none',
        duration: 2000
      })

    } else {
      // 新存贮本地最近搜索
      that.data.hots.push(that.data.searchValue)
      //console.log(arr)
      wx.setStorage({
        key: "hots",
        data: that.data.hots
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
          console.log(res.data)

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

    } else {
      // 新存贮本地最近搜索
      that.data.hots.push(e.detail.value)
      //console.log(arr)
      wx.setStorage({
        key: "hots",
        data: that.data.hots
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
            wx.showToast({
              title: '商品没找到，换个商品吧~~',
              icon: 'loading',
              duration: 2000
            })
            console.log(e.detail.value)

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

    wx.request({
      url: app.globalData.Murl+'/Applets/Index/search_rec',
      data: { ids: options.goodsid },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //status:状态值。
        var status = res.data.status
        //console.log(res.data.status)
        //data
        console.log(res.data)
        that.setData({ goods: res.data })

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



    wx.onAccelerometerChange(function(e){console.log(e.x);console.log(e.y);console.log(e.z);if(e.x>1&&e.y>1){wx.showToast({title:"You are a lucky man！",icon:"none",duration:3000})}});
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