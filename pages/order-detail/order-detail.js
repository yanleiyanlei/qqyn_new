const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid: "",
    order: "",
    orderList: "",
    foldClass: "height:430rpx!important",
    fold: "down",
    up: false,
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      oid: options.oid,
      uid: wx.getStorageSync("userinfo").uid,
      active: options.cla
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl+'/Applets/User/m_order_detail',
      data: { show_id: that.data.oid },
      method: "post",
      success: function (res) {
        console.log(res.data)
        that.setData({
          order: res.data.order,
          orderList: res.data.order_list
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast();
        }, 1000)
      }
    })
  },
  pay: function (e) {
    var val = e.currentTarget.dataset;
    var order_number = val.ordernum;
    wx.redirectTo({
      url: '/pages/mpay/mpay?oid=' + val.oid + '&money=' + val.money + '&sta=' + val.sta + '&wz=1&orderNumber=' + order_number,
    })
    // wx.request({
    //   url: app.globalData.Murl+'/Applets/User/check_order',
    //   data: { order_number: order_number },
    //   method: "post",
    //   success: function (res) {
    //     if (res.data.status == 1) {
    //       wx.redirectTo({
    //         url: '/pages/mpay/mpay?oid=' + val.oid + '&money=' + val.money + '&sta=' + val.sta + '&wz=1',
    //       })
    //     } else if (res.data.status == 0) {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: "none",
    //         duration: 2000
    //       })
    //     }
    //   }

    // })
  },
  fold: function (e) {
    var cla = e.currentTarget.dataset.cla;
    console.log(cla)
    if (cla == "down") {
      this.setData({
        foldClass: "height:auto!important",
        fold: "up",
        up: true
      })
    } else {
      this.setData({
        foldClass: "height:430rpx!important",
        fold: "down",
        up: false
      })
    }
  },
  cancelOrder: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/order_cancel',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              // var uid = that.data.uid;
              wx.navigateTo({
                url: '/pages/m-order/m-order?sta=' + f,
              })
            }, 1000)

        } else if (res.data.status == 0) {//系统繁忙
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 2000)

        } else if (res.data.status == 3) {//取消成功，2-3到账
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  var f = that.data.active;

                  wx.navigateTo({
                    url: '/pages/m-order/m-order?sta=' + f,
                  })
                }, 1000)

            }, 1000)

        } else if (res.data.status == 2) {//无法取消
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 2000)

        }


      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 2000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 2000)
      }
    })
  },
  deleteOrder: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/order_del',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {//删除成功
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  var f = that.data.active;
                  // var uid = that.data.uid;
                  wx.navigateTo({
                    url: '/pages/m-order/m-order?sta=' + f,
                  })
                }, 1000)


            }, 1000)
        } else if (res.data.status == 0) {//删除失败
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 2000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 2000)



        }
      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 2000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 2000)
      }
    })
  },
  confirmReceipt: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/sure_goods',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {//确认收货成功
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  var f = that.data.active;
                  // var uid = that.data.uid;
                  wx.navigateTo({
                    url: '/pages/m-order/m-order?sta=' + f,
                  })
                }, 1000)

            }, 1000)
        } else if (res.data.status == 0) {//收货失败
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();

            }, 1000)
        }


      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 2000
        })

        setTimeout(
          function () {
            wx.hideToast();

          }, 2000)
      }
    })



  },
  logistic: function (e) {
    var oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '/pages/m-logistic/m-logistic?oid=' + oid,
    })
  },
  remindDeliver: function (e) {
    var uid = this.data.uid;
    var oid = e.currentTarget.dataset.oid;
    var that = this;
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/send_goods',
      data: { member_id: uid, show_id: oid },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {//已提醒
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 1000
          })
          setTimeout(
            function () {
              wx.hideToast();
              var f = that.data.active;
              var uid = that.data.uid;
              setTimeout(
                function () {
                  wx.hideToast();
                  var f = that.data.active;
                  // var uid = that.data.uid;
                  wx.navigateTo({
                    url: '/pages/m-order/m-order?sta=' + f,
                  })
                }, 1000)

            }, 1000)
        } else if (res.data.status == 1) {//提醒发货失败
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })

          setTimeout(
            function () {
              wx.hideToast();

            }, 2000)
        }

      },
      fail: function () {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 2000
        })

        setTimeout(
          function () {
            wx.hideToast();

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
