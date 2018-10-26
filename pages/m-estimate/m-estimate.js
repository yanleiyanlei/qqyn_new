const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    active: 0,
    imgLength: 0,
    uid: "",
    gid: "",
    goodid: "",
    num: '',
    orderinfo: {},
    level: [['icon-chaping1', 'icon-chaping'], ['icon-weibiaoti1', 'icon-zhongping'], ['icon-haoping1', 'icon-haoping']],
    levelDis: ['icon-chaping1', 'icon-weibiaoti1', 'icon-haoping1'],
    hp: '',
    tip: "提交",
    flag2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active: options.cla,
      gid: options.gid,
      uid: wx.getStorageSync("userinfo").uid,
      num: options.num,
      typp: "",
      Nadd: true,
      flag: false,
      goodid: options.goodid
    })
    var that = this;
    wx.request({
      url: app.globalData.Murl+'/Applets/User/m_estimate',
      data: { order_id: that.data.gid, member_id: that.data.uid },
      method: "post",
      success: function (res) {
        console.log(res)
        that.setData({
          orderinfo: res.data[0]
        })
      },
      fail:function(){
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
    wx.request({
      url: app.globalData.Murl+'/Applets/User/find_estimate',
      data: { goods_id: that.data.goodid, order_number: that.data.num },
      method: "post",
      success: function (res) {

        console.log(res.data)
        if (res.data == 3) {//追加评论
          that.flag = true;
          that.setData({
            typp: 1,
            Nadd: false,
            flag: true
          })
        } else if (res.data == 1) {//已评价过了
          that.setData({
            flag: false,
            tip: "已评价过了"
          })
        } else if (res.data == 0) {
          that.setData({
            flag: true
          })
        }

      }
    })


  },
  level: function (e) {
    var level = e.currentTarget.dataset.level;
    if (level == 3) {
      this.setData({
        hp: 3,
        levelDis: [this.data.level[0][0], this.data.level[1][0], this.data.level[2][1]]
      })
    } else if (level == 2) {
      this.setData({
        hp: 2,
        levelDis: [this.data.level[0][0], this.data.level[1][1], this.data.level[2][0]]
      })
    } else if (level == 1) {
      this.setData({
        hp: 2,
        levelDis: [this.data.level[0][1], this.data.level[1][0], this.data.level[2][0]]
      })
    }
  },
  formSubmit: function (e) {
    var de = e.detail.value;

    var obj = { member_id: this.data.uid, is_check: de.is_check, reviews_text: de.reviews_text, goods_id: de.goods_id, order_number: de.order_number, order_time: de.order_time, hp: de.hp }

    var that = this;
    console.log(obj)
    if (that.data.flag) {
      if (that.data.hp != "" || that.data.typp == 1) {
        var l = that.data.imgList.length;
        if (l == 0) {
          wx.request({
            url: app.globalData.Murl+'/Applets/User/add_estimate',
            data: obj,
            method: "post",
            success: function (res) {
              console.log(res)
              if (res.data.status == 1) {//评价成功
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.hideToast();
                  wx.navigateTo({
                    url: '/pages/m-order/m-order?sta=' + that.data.active,
                  })
                }, 1000)
              } else if (res.data.status == 0){
                wx.showToast({
                  title: res.data.msg,
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
                title: "系统繁忙",
                icon: 'none',
                duration: 1000
              })
              setTimeout(function () {
                wx.hideToast();
              }, 1000)
            }
          })

        } else {

          var success=0
          for (var i = 0; i < l; i++) {
            wx.uploadFile({
              url: app.globalData.Murl+'/Applets/User/add_estimate',
              filePath: that.data.imgList[i],
              name: 'file',
              header: { 'content-type': 'multipart/form-data' },
              formData: obj,
              success: function (res) {
                success++
                console.log(res)
                var sta=JSON.parse(res.data)
                if (sta.status == 1) {
                  that.setData({
                    flag2: true
                  })
                } else if (sta.status == 0) {

                }
              },
              fail: function () {
                wx.showToast({
                  title: "系统繁忙",
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.hideToast();
                }, 1000)
              },
              complete:function(){
                if(success == l){
                  wx.showToast({
                    title: "评价成功",
                    icon: 'none',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.hideToast();
                    wx.navigateTo({
                      url: '/pages/m-order/m-order?sta=' + that.data.active,
                    })

                  }, 1000)
                }else{
                  wx.showToast({
                    title: '系统繁忙',
                    icon: 'none',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.hideToast();
                  }, 1000)
                }
              }
            })
          }
        }
        


      } else {
        wx.showToast({
          title: "请选择评价等级",
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }

    }

  },
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imgL = that.data.imgList
        imgL.push(res.tempFilePaths[0])
        that.setData({
          imgList: imgL,
          imgLength: imgL.length
        })

      }
    })
  },
  qxImg: function (e) {
    var imgsrc = e.currentTarget.dataset.imgsrc;
    var imgL = this.data.imgList;
    var i = imgL.indexOf(imgsrc);

    imgL.splice(i, 1)
    this.setData({
      imgList: imgL,
      imgLength: imgL.length
    })
  }


})
