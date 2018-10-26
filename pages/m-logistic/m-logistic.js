const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    oid: "",
    logisticImg: "",
    logisticNum: "",
    expressName: "",
    expressNum: "",
    logistic: "",
    sta: false,
    lstart: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    // var uid=62;
    var that = this;
    var oid = options.oid;
    this.setData({
      uid: uid,
      oid: oid
    })
    console.log(uid)
    console.log(oid)
    wx.request({
      url: app.globalData.Murl + '/Applets/User/logistics',
      data: { member_id: uid, show_id: oid},
      method: "post",
      success: function (res) {
        console.log(res)
        // 顺风
        if (res.data.ordershow.courierservices == 2) {
          that.setData({
            express: 2
          })

          if (res.data.xml.Head == "OK") {
            if (res.data.xml.Body != "") {
              var l = res.data.xml.Body.RouteResponse.Route.length;
              if (res.data.xml.Body.RouteResponse.Route[l - 2]['@attributes'].opcode == 80) {
                that.setData({
                  sta: true
                })
              }
              that.setData({
                logisticImg: res.data.order[0].thumbnails,
                logisticNum: res.data.order_num,
                expressName: res.data.ordershow.express_name,
                expressNum: res.data.ordershow.couriernumber,
                logistic: res.data.xml.Body.RouteResponse.Route,
                lstart: true
              })
            } else {
              that.setData({
                logisticImg: res.data.order[0].thumbnails,
                logisticNum: res.data.order_num,
                expressName: res.data.ordershow.express_name,
                expressNum: res.data.ordershow.couriernumber,
                lstart: false
              })
            }

            //console.log(res.data.order[0].thumbnails)

          } else {
            that.setData({
              logisticImg: res.data.order[0].thumbnails,
              logisticNum: res.data.order_num,
              expressName: res.data.ordershow.express_name,
              expressNum: res.data.ordershow.couriernumber,

            })
          }


        }
       //万家康冷链
        if (res.data.ordershow.courierservices == 5) {
          that.setData({
            express: 5,
            logisticImg: res.data.order[0].thumbnails,
            logisticNum: res.data.order_num,
            expressNum: res.data.ordershow.express_name,
            sta: true
          })
          if (res.data.ordershow.orderstatus==1){
           that.setData({
             expressName: '待发货'
           })
          } else if (res.data.ordershow.orderstatus == 2){
            that.setData({
              expressName: '已由万家康冷链发货'
            })
          } else if (res.data.ordershow.orderstatus == 3){
            that.setData({
              expressName: '已完成'
            })
          }
        }

        // 中通
        if (res.data.ordershow.courierservices == 4) {
          that.setData({
            express: 4
          })
          console.log(9999)
          // console.log(res.data.xml.data[0])
          if (res.data.xml.data[0].traces.length>0) {
            that.setData({
              logisticImg: res.data.order[0].thumbnails,
              logisticNum: res.data.order_num,
              expressName: res.data.ordershow.express_name,
              expressNum: res.data.ordershow.couriernumber,
              logistic: res.data.xml.data[0].traces,
              lstart: true
            })

            var l = res.data.xml.data[0].traces.length - 1
            if (res.data.xml.data[0].traces[l].scanType == "SIGNED" || res.data.xml.data[0].traces[l].scanType == "签收") {

              that.setData({
                sta: true
              })
            }

          } else {
            that.setData({
              logisticImg: res.data.order[0].thumbnails,
              logisticNum: res.data.order_num,
              expressName: res.data.ordershow.express_name,
              expressNum: res.data.ordershow.couriernumber,
              lstart: false

            })
          }
        }
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