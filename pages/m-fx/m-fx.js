
var app = getApp();
var user = require("../../lib/js/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    mshow: "display:none",
    msg:'',
    tt:"display:none",
    more:"display:none",
    pop_msg:[],
    end_time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    var timer = setInterval(function () {
      var userInfo = wx.getStorageSync("userinfo"); 
      if (userInfo.uid) {
        clearInterval(timer)

        that.setData({
          uid: wx.getStorageSync("userinfo").uid,
          mshow: "display:none"
        })
        console.log(that.data.uid)
        wx.request({
          url: app.globalData.Murl+'/Applets/User/share_info',
          data: {member_id:that.data.uid},
          method:"post",
          success:function(res){
              console.log(res.data)
              if(res.data.status==1){
                that.setData({
                  msg: res.data.msg
                })
              }else{
                // that.setData({
                //   msg: "分享3个微信群,您可获得59元减30元优惠券"
                // })
                setTimeout(function(){
                  wx.showToast({
                    title: '系统繁忙',
                    icon: 'none',
                    duration: 1000
                  })
                  wx.switchTab({
                    url: '/pages/index/index',
                  })

                },1000)
              
              }
              
          }
        })


      } else {
        that.setData({
          mshow: "display:block"
        })
      }
    }, 1000)
  },
  UserInfo: function (e) {
   user.user(e)
  },
  close:function(){
    this.setData({
       tt:"display:none"
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
    var that = this;
    // console.log(that.data.id)
    return {
      title: '天然有机食材，这种好事我第一个想到的就是你。',
      path: '/pages/m-fx/m-fx',
      imageUrl: '',
      success: function (res) {
        //console.log(111)
        //console.log(res)
        var shareTickets = res.shareTickets[0];
        wx.login({
          success: function (res) {
            //console.log(shareTickets)
            var code = res.code;
            wx.getShareInfo({
              shareTicket: shareTickets,
              success: function (res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
                // console.log(res)
                // console.log(code)
                wx.request({
                  url: app.globalData.Murl+'/Applets/Login/jiemi',
                  data: { encryptedData: encryptedData, iv: iv, code: code },
                  method: "post",
                  success: function (res) {
                    var openGId = res.data.openGId;
                    // console.log(res.data.openGId)
                    //console.log(that.data.uid)
                    wx.request({
                      url: app.globalData.Murl+'/Applets/User/share_wx',
                      data: { member_id: that.data.uid, opengid: openGId},
                      method:'post',
                      success:function(res){
                        console.log(res)
                        var sta = res.data.status
                        if(sta==-1){
                          wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                            duration:1000
                          })
                        }else if(sta==1){
                          that.setData({
                            msg:res.data.msg
                          })
                          var pop = res.data.pop;
                          if(pop){
                            
                            that.setData({
                              tt:"display:block",
                              pop_msg: res.data.pop_msg,
                              end_time: res.data.end_time
                            })

                          }
                        }else if(sta==0){
                          wx.showToast({
                            title: res.data.msg,
                            icon: none,
                            duration: 1000
                          })
                        } 
                      }
                    })
                  }
                })
              },
              fail: function (res) { console.log(res) },
              complete: function (res) { }
            })



          }
        })
        // console.log

      },
      fail: function (res) {
        // 分享失败
        //console.log(res)
        // wx.showToast({
        //   title: '系统繁忙',
        //   icon:'none',
        //   duration:1000
        // })
      }
    }
  }
})