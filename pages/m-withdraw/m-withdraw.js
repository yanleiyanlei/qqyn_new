const app = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
        way: false,
        fee: 0
      },

      /**
       * 生命周期函数--监听页面加载
       */
      chooseWay: function() {
        this.setData({
          way: true
        })
      },
      closeWay: function() {
        this.setData({
          way: false
        })
      },
      way: function(e) {
        var way2 = e.currentTarget.dataset.way
        this.setData({
          way2: way2
        })
      },
      all: function() {
        this.setData({
          all: this.data.money,
          fee: (this.data.money * this.data.info.withdrawdesign_poundage / 100)
        })
      },
      allmoney: function(e) {
        var money = e.detail.value;

        this.setData({
          fee: (money * this.data.info.withdrawdesign_poundage / 100),
          all: money
        })
      },
      onLoad: function(options) {
        var that = this;
        that.setData({
          uid: wx.getStorageSync("userinfo").uid
        })
        wx.request({
          url: app.globalData.Murl + '/Applets/User/WeChatwithdrawa',
          data: {
            member_id: wx.getStorageSync("userinfo").uid
          },
          method: 'post',
          success: function(res) {
            console.log(res)
            that.setData({
              remain: res.data.select.ktxyj,
              info: res.data.selec,
              money: res.data.can_present
            })
          }
        })
      },
      formSubmit: function(e) {
        var flag = true;
        var vv = e.detail.value;
        console.log(vv)
        var that = this;



        if (vv.withdrawal_path == 1 || vv.withdrawal_path == 2) {
          if (vv.cash_account == "") {
            flag = false;
            wx.showToast({
              title: '提现账户不能为空',
              icon: 'none',
              duration: 2000
            })
          }
          if (vv.phone == "") {
            flag = false;
            wx.showToast({
              title: '收款人电话不能为空',
              icon: 'none',
              duration: 2000
            })
          }
          if (vv.payee == "") {
            flag = false;
            wx.showToast({
              title: '收款人姓名不能为空',
              icon: 'none',
              duration: 2000
            })
          }
        }
        if (vv.withdrawal_path == "") {
          flag = false;
          wx.showToast({
            title: '请选择提现方式',
            icon: 'none',
            duration: 2000
          })
        }
        var yu = vv.jine % 10
        if (yu != 0) {
          flag = false;
          wx.showToast({
            title: '提现金额为10的倍数',
            icon: 'none',
            duration: 2000
          })
        }
        if (parseFloat(vv.jine) < parseFloat(that.data.info.withdrawdesign_small) || parseFloat(vv.jine) > parseFloat(that.data.money) ){
            console.log(999)
            flag = false;
            wx.showToast({
              title: '提现金额数值错误',
              icon: 'none',
              duration: 2000
            })
          }
          if (vv.jine == "") {
            flag = false;
            wx.showToast({
              title: '提现金额不能为空',
              icon: 'none',
              duration: 2000
            })
          }

          if (flag) {
            wx.request({
              url: app.globalData.Murl + '/Applets/User/num',
              data: {
                member_id: wx.getStorageSync("userinfo").uid,
                cishu: that.data.info.withdrawdesign_num
              },
              method: "post",
              success: function(res) {
                console.log(res)
                if (res.data.status == 1) {
                  wx.request({
                    url: app.globalData.Murl + '/Applets/User/SaveCommission',
                    data: vv,
                    method: 'post',
                    success: function(res) {
                      console.log(res)
                      if (res.data.status == 1) {
                        wx.redirectTo({
                          url: '/pages/m-withdraw-s/m-withdraw-s?id=' + res.data.id,
                        })
                      } else if (res.data.status == 0) {
                        wx.showToast({
                          title: res.data.msg,
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                  })
                }
              }
            })
          }

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

          }
      })