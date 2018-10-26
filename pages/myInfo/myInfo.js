// pages/myInfo/myInfo.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: "",
    date: "0",
    uid: '',
    year: "",
    sex: 1,
    info: {},
    imgSrc: "",
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dd = Date.parse(new Date());
    var year = new Date(dd)
    //console.log(this.data.sex)
    var uid = wx.getStorageSync("userinfo").uid;
    this.setData({
      uid: uid,
      year: year
    })
    var that = this;
    console.log(wx.getStorageSync("userinfo").uid)
    wx.request({
      url: app.globalData.Murl+'/Applets/User/myinfo',
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        console.log(res.data)
        that.setData({
          info: res.data,
          region: res.data.address_content,
          sex: res.data.sex,
          date: res.data.birthday,
          imgSrc: res.data.head_pic
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
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths[0])
        that.setData({
          imgSrc: res.tempFilePaths[0],
          flag: true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value

    })
  },
  sex: function (e) {
    var sex = e.currentTarget.dataset.sex;
    console.log(sex)
    if (sex == 2) {
      this.setData({
        sex: 2
      })
    } else if (sex == 1) {
      this.setData({
        sex: 1
      })
    }
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    var obj = e.detail.value;
    var that = this;
    var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if (obj.phone != "") {
      if (!regPhone.exec(obj.phone)) {
        wx.showToast({
          title: "手机号码格式错误",
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)

      }
    }
    if (that.data.flag) {
      if (obj.phone && obj.sex && obj.birthday) {


        if (regPhone.exec(obj.phone)) {
          wx.uploadFile({
            url: app.globalData.Murl+"/Applets/User/savemyinfo",
            filePath: that.data.imgSrc,
            name: 'file',
            header: { 'content-type': 'multipart/form-data' },
            formData: obj,
            success: function (res) {
              console.log(JSON.parse(res.data))
              var sta = JSON.parse(res.data);
              if (sta.status == 1) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.hideToast();
                  wx.switchTab({
                    url: '/pages/my/my',
                    success: function (e) {
                      var page = getCurrentPages().pop();
                      //console.log(page)
                      if (page == undefined || page == null) { return; }
                      page.onLoad();
                    }
                  })
                }, 1000)
              } else if (sta.status == 0) {
                wx.showToast({
                  title: '系统繁忙',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.hideToast();

                }, 1000)
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
        }
      }else{
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 1000
        })


      }
    } else {
      if (obj.phone && obj.sex && obj.birthday) {
        if (regPhone.exec(obj.phone)) {
          wx.request({
            url: app.globalData.Murl+'/Applets/User/savemyinfo',
            data: obj,
            method: 'post',
            success: function (res) {
              console.log(res)
              if (res.data.status == 1) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.hideToast();
                  wx.switchTab({
                    url: '/pages/my/my',
                    success: function (e) {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) { return; }
                      page.onLoad();
                    }
                  })
                }, 1000)
              } else if (res.data.status == 0) {
                wx.showToast({
                  title: '系统繁忙',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.hideToast();

                }, 1000)
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
        }
      } else {
        wx.showToast({
          title: '请将信息填写完整',
          icon: 'none',
          duration: 1000
        })
      }
    }

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
