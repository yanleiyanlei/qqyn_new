const app = getApp()

Page({
  data: {
    datalist: [],
  },
  //页面跳转
  mcouponru() {
    wx.redirectTo({
      url: '../m-coupon-rule/m-coupon-rule',
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })

  },
  //页面跳转
  dealts(e) {
    console.log(123213);
    wx.redirectTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.id,
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) },
      complete: function (res) { console.log(res) },
    })


  },
  nodisid:function(){
    let pagess = getCurrentPages();//当前页面
    let prevPages = pagess[pagess.length - 2];//上一页面
    prevPages.setData({        //直接给上移页面赋值
      dis_id: 'null',
    });
    wx.navigateBack({       //返回上一页
      delta: 1
    })
  },
  usercous(e) {
    var dis_id = e.currentTarget.dataset.id;
    console.log(dis_id);

    let pagess = getCurrentPages();//当前页面
    let prevPages = pagess[pagess.length - 2];//上一页面
    prevPages.setData({        //直接给上移页面赋值
      dis_id: e.currentTarget.dataset.id,
    });
    console.log(prevPages.data.dis_id);
    wx.navigateBack({       //返回上一页
      delta: 1
    })
    /* wx.redirectTo({
           url: '../theorder/theorder?dis_id='+dis_id+'&page='+this.data.page+'&goods_id='+this.data.goods_id+'&spec_key='+this.data.spec_key+'&num='+this.data.num,
          success: function(res) {console.log(res)},
          fail: function(res) {console.log(res)},
          complete: function(res) {console.log(res)},
        })*/

  },
  onLoad: function (options) {
    console.log(options.num)
    var _this = this;
    _this.setData({
      page: options.page,
      goods_id: options.goods_id,
      spec_key: options.spec_key,
      num: options.num,
    })
   //获取uid
    var uid = wx.getStorageSync("userinfo").uid;
    wx.request({
      url: app.globalData.Murl + '/Applets/Cart/coupons2',
      data: { member_id: uid, cp: options.cp },
      method: "post",
      success: function (res) {

        console.log(res.data);
        var datalist = res.data.select;

        _this.setData({
          datalist: datalist,
        })
      }
    })
  }
})