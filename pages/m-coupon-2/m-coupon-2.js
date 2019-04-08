const app = getApp();
Page({
  data: {
    flag: true,
    flag1: true,
  },
  showMask: function () {
    this.setData({ flag: false })
  },
  closeMask: function () {
    this.setData({ flag: true, flag1: true, })
  },


  onLoad: function(options) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        var latitude2 = 39.784670
        var longitude2 = 116.332980
        var rad1 = latitude * Math.PI / 180.0;
        var rad2 = latitude2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = longitude * Math.PI / 180.0 - longitude2 * Math.PI / 180.0;
        var r = 6378137;
        var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
        distance = distance * 6378.137; //地球半径
        distance = Math.ceil(distance * 10000) / 10000 * 1000;
        this.setData({
          latitude: latitude,
          longitude: longitude,
          distance: distance
        })
        if (distance < 2000) {
          this.setData({
            flag: false,
            flag1: false,
          })
        }
      }

    })
  },
  gowx: function() {
    wx.switchTab({
      url: '/pages/bution/bution',
    })
  }
});