const app = getApp();
var user = require("../../lib/js/user.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "好友"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  UserInfo: function(e) {
    user.user(e)
  },
  onLoad: function(options) {
    console.log(wx.getStorageSync("userinfo").avatarUrl)
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/User/goods_share',
      data: {
        member_id: wx.getStorageSync("userinfo").uid,
        goods_id: options.goods_id
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        console.log(res.data.status == 1)
        if (res.data.status == 1) {
          that.setData({
            goodname: res.data.goods_name,
            goodprice: res.data.goods_price,
            goodurl: res.data.goods_img,
            mm: res.data.code
          })
          var goodurl = res.data.goods_img;
          var mm = res.data.code;
          // var tx=res.data.head_pic;
          that.setData({
            nickName: wx.getStorageSync("userinfo").nickName
          })
          const ctx = wx.createCanvasContext('myCanvas');
          //填充背景  
          ctx.setFillStyle('#ffffff');
          ctx.fillRect(0, 0, 352, 462.5);
          //绘制背景图 
          //绘制标题  
          ctx.setFontSize(13);
          ctx.setFillStyle('#434343');
          ctx.fillText(that.data.nickName + '分享给你一个商品', 62.5, 40);
          ctx.setFontSize(15);
          ctx.setFillStyle('#434343');
          ctx.fillText('' + that.data.goodname, 36, 380);
          ctx.setFontSize(19);
          ctx.setFillStyle('#ff712b');
          ctx.fillText('￥' + that.data.goodprice, 36, 410);

          ctx.setFontSize(13);
          ctx.setFillStyle('#999999');
          ctx.fillText('长按识别二维码访问', 36, 435);
          console.log(5555)

          wx.downloadFile({
            url: that.data.goodurl,
            success: function(res) {
              ctx.drawImage(res.tempFilePath, 36, 70, 280, 280);
              wx.downloadFile({
                url: that.data.mm,
                success: function(res) {
                  ctx.drawImage(res.tempFilePath, 250, 363, 80, 80);
                  ctx.draw();
                  ctx.stroke();
                }
              })
            }
          })

          // wx.downloadFile({
          //   url: tx,
          //   success: function (res) {
          //     ctx.drawImage(res.tempFilePath, 15, 15, 40, 40);
          //     wx.downloadFile({
          //       url: that.data.goodurl,
          //       success: function (res) {
          //         ctx.drawImage(res.tempFilePath, 36, 70, 280, 280);
          //         wx.downloadFile({
          //           url: that.data.mm,
          //           success: function (res) {
          //             ctx.drawImage(res.tempFilePath, 250, 363, 80, 80);
          //             ctx.draw();
          //             ctx.stroke();
          //           }
          //         })
          //       }
          //     })
          //   }
          // })
        }
      }
    })



  },
  savetup: function() {
    console.log(8888)
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 352,
      height: 462.5,
      destWidth: 704,
      destHeight: 925,
      canvasId: 'myCanvas',
      success: function(res) {
        //调取小程序当中获取图片  

        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.setStorageSync('photo', true);
            wx.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，去发圈噻~',
              showCancel: false,
              confirmText: '好哒',
              confirmColor: '#72B9C3',
              success: function(res) {
                if (res1.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          },
          fail: function(err) {
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                  console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  wx.setStorageSync('photo', true);
                } else {
                  console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  wx.setStorageSync('photo', "no");
                }
              }
            })

          }
        })
        // console.log(wx.getStorageSync('photo'))
        // if(wx.getStorageSync('photo')=="no"){
        //   wx.openSetting({
        //     success(settingdata) {
        //       console.log(settingdata)
        //       if (settingdata.authSetting['scope.writePhotosAlbum']) {
        //         console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
        //         wx.setStorageSync('photo', true);
        //       } else {
        //         console.log('获取权限失败，给出不给权限就无法正常使用的提示')
        //         wx.setStorageSync('photo', "no");
        //       }
        //     }
        //   })
        // }
      },
      fail: function(res) {



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