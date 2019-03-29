const app = getApp();
var user = require("../../lib/js/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "好友",
    goodname:'',
    total_num:'',
    etime:'',
    stime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodName: options.goodname,
      stime:options.stime,
      etime:options.etime
    })
    // console.log(wx.getStorageSync("userinfo").nickName)
    that.setData({
      nickName: wx.getStorageSync("userinfo").nickName
    })
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/step_detail',
      method: "post",
      success: function (res) {
        that.setData({
          total_num: res.data.total_num,
        })
        console.log(res.data.total_num)
        if (res.data.step_rand) {
          that.setData({
            step_rand: res.data.step_rand,
            x: Math.floor(Math.random() * (res.data.step_rand.length - 1)),
          })
          // Math.floor(Math.random() * (res.data.step_rand.length - 1))
          if (that.data.x == 0) {
            that.setData({
              y: parseInt(that.data.step_rand.length) - 1
            })
          } else {
            that.setData({
              y: that.data.x - 1
            })
          }

        }

        if (res.data.is_sale == 1) {//活动下架
          that.setData({
            soldout: true
          })
        } else {
          that.setData({
            soldout: false
          })
        }
        
      // },
      // // complete: function () {
        
        const ctx = wx.createCanvasContext('myCanvas');
        var bgImgPath = '/image/hd/pyq.jpg';
        // var basicprofile = '../../../image/basicprofile.png';
        //填充背景  
        ctx.setFillStyle('#333333');

        ctx.fillRect(1, 1, 375, 618);

        //绘制背景图 
        ctx.drawImage(bgImgPath, 0, 0, 375, 529);

        //绘制标题  
        ctx.setFontSize(12);
        //ctx.font = "bold";
        ctx.setFillStyle('#333333');
        ctx.fillText('活动时间:', 108, 225);
        ctx.setFontSize(12);
        //ctx.font = "bold";
        ctx.setFillStyle('#333333');
        ctx.fillText(that.data.stime, 165, 225);
        ctx.setFontSize(12);
        //ctx.font = "bold";
        ctx.setFillStyle('#333333');
        ctx.fillText('-', 218, 225);
        ctx.setFontSize(12);
        //ctx.font = "bold";
        ctx.setFillStyle('#333333');
        ctx.fillText(that.data.etime, 223, 225);
        ctx.font = "bold 50px sans-serif";
        ctx.setFontSize(15);
        //ctx.font = "bold";
        ctx.setFillStyle('#31aacd');
        ctx.fillText('已有', 108, 255);
        ctx.setFontSize(17);
        ctx.font = "bold 17";
        ctx.setFillStyle('#ff5e00');
        console.log(that.data.total_num)
        ctx.fillText(that.data.total_num, 138, 255);
        ctx.setFontSize(15);
        ctx.setFillStyle('#31aacd');
        ctx.fillText('人参加活动', 188, 255);
        ctx.setFontSize(15);
        ctx.setFillStyle('#31aacd');
        ctx.fillText(' 活动期间内每个微信用户均可参与拼步数活动 ', 35, 285);
        ctx.setFontSize(15);
        ctx.setFillStyle('#31aacd');
        ctx.fillText(' 成功即可获得 ', 90, 315);
        ctx.setFontSize(17);
        ctx.setFillStyle('#ff5e00');
        ctx.fillText(that.data.goodName, 185, 315);
        ctx.setFontSize(12);
        ctx.setFillStyle('#60b032');
        // ctx.setTextAlign('center')
        ctx.fillText('长按小程序码', 105, 567);
        ctx.font = "bold 12";
        ctx.setFillStyle('#60b032');
        ctx.fillText('马上和' + that.data.nickName + '一起抢' + that.data.goodName, 105, 590);
       

        //绘制小程序码
        wx.downloadFile({
          url: options.fxcode,
          success: function (res) {
            that.setData({
              fxcode: res.tempFilePath
            })
            ctx.drawImage(res.tempFilePath, 20, 538, 70, 70);
            ctx.stroke()
            
          }
        })
         ctx.draw();
      }
      
    })
    
    // ctx.drawImage(that.data.fxcode,93,538,120,120);
    // ctx.stroke()
    // ctx.draw();
  },
  savetup: function () {
    console.log(8888)
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 618,
      destWidth: 750,
      destHeight: 1236,
      canvasId: 'myCanvas',
      success: function (res) {
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
              success: function (res) {
                if (res1.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          },
          fail: function (err) {  
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
      fail: function (res) {



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