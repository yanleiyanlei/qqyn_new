Page({
  data: {

  },
  pagesm2() {
    wx.redirectTo({
      url: '../m-step2/m-step2',
    })
  },
  tiaocar: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },
  goshop(){
    wx.switchTab({
      url: '../index/index'
    });
  },
  onLoad: function (options) {
    var rice_rand = options.rice_rand;
    console.log(options)
    this.setData({
      rice_rand: rice_rand
    })
  }
})