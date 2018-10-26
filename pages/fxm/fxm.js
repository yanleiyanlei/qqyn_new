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
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodName: options.goodname
    })
    // console.log(wx.getStorageSync("userinfo").nickName)
    that.setData({
      nickName: wx.getStorageSync("userinfo").nickName
    })

    const ctx = wx.createCanvasContext('myCanvas');
    var bgImgPath = '/image/hd/m_code_bg.png';
    // var basicprofile = '../../../image/basicprofile.png';
    //填充背景  
    ctx.setFillStyle('#ffffff');

    ctx.fillRect(1, 1, 375, 618);

    //绘制背景图 
    ctx.drawImage(bgImgPath, 0, 0, 375,529);

    //绘制标题  
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