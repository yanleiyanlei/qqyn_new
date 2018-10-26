const app = getApp();
Page({
  data: {
    loadText: '加载更多',
    duanziInfo: [],
    centerdui:"display:none",
    cssasd:"height:150rpx",
    heigjhs: "height:366rpx",
    contenter:"立即兑换",
    statu:''
  },
  getdata: function(uid) {
    var that=this;
    wx.request({
      url: app.globalData.Murl + "/Applets/Active/mem_rice",
      data: { member_id: uid },
      method: "post",
      success: function (res) {
        console.log(res);
        console.log(res.data);
        var data = res.data;
        var head_pic = data.head_pic;
        var rice_list = data.rice_list;
        if (rice_list.length <= 3) {
          that.setData({
            cssasd: 'height:auto',
            loacjte: "display:none",
          })
        } else {
          that.setData({

          })
        }
        if (data.rice_rank.length <= 3) {
          that.setData({
            heigjhs: 'height:auto',
            loacjtes: "display:none"
          })
        }
        that.setData({
          head_pic: head_pic,
          data: data,
          rice_list: data.rice_list,
        })

      },
      fail: function (res) {
        //console.log(res)
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })
        wx.showToast({
          title: res.data.data,
          icon: "none",
          duration: 1000
        })
      },
      complete: function () {

      }
    })
  },
  onLoad(options){
    var that=this;
    var member_id=options.uid;
    console.log(member_id);
    var uid = wx.getStorageSync("userinfo").uid;
    console.log(uid);
    that.setData({
      member_id: member_id,
      uid:uid
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var h = 23 - date.getHours();
    var m = 59 - date.getMinutes();
    var s = 59 - date.getSeconds();
    var gap = h * 60 * 60 + m * 60 + s;
    setInterval(
      function () {
        gap--;
        var h1 = parseInt(gap / 60 / 60);
        var m1 = parseInt(gap / 60) % 60;
        var s1 = gap % 60;
        if (h1 < 10) {
          h1 = "0" + h1;
        }
        if (m1 < 10) {
          m1 = "0" + m1;
        }
        if (s1 < 10) {
          s1 = "0" + s1;
        }
        that.setData({
          h1: h1,
          m1: m1,
          s1: s1
        })

      }

      , 1000)
      //小程序拼大米个人中心接口
     //主banner活动假数据
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/step_detail',
      method: "post",
      success: function (res) {
        console.log(res)
        if (res.data.is_sale == 1) {//活动下架
          that.setData({
            soldout: true
          })
        } else {
          that.setData({
            soldout: false
          })
        }
        that.setData({
          total_num: res.data.total_num,
        })
      }
    })

     //调用页面数据
    this.getdata(member_id);
  },
  //排名查看更多
  setLoadings(){
    var that = this
    var uid = wx.getStorageSync("userinfo").uid;
    wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
      duration: 200
    })  
    that.setData({
      loading: true,
      heigjhs: 'height:auto',
      loacjtes: "display:none",
      loading: false,
    })
  },
  //最新获取查看更多
  setLoading(){
    var that = this
    var uid = wx.getStorageSync("userinfo").uid;
    wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
      duration: 200
    })  
  
    that.setData({
         
          loading: true,
          cssasd: 'height:350rpx;overflow-y:auto',
          loacjte: "display:none",
        loading: false,
    })
  
  },
  //立即兑换
  goduihua(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var uid = wx.getStorageSync("userinfo").uid;
    console.log(uid);
    wx.request({
      url: app.globalData.Murl + "/Applets/Active/rice_coupon",
      data: { 
           member_id: uid,
           id:id,
         },
      method: "post",
      success: function (res) {
        console.log(res);
        var statu=res.data;
       // console.log(that.data.statu);
        if (statu.status==-1){
          wx.showToast({
            title: statu.msg,
            icon: "none",
            duration: 1000
          })
        } else if (statu.status == -2){
          wx.showToast({
            title: statu.msg,
            icon: "none",
            duration: 1000
          })
        } else if (statu.status == 1) {
          wx.showToast({
            title: statu.msg,
            icon: "none",
            duration: 1000
          })
          that.setData({
            cons:"去下单"
          })
          that.getdata(uid);
        } else if (statu.status == 0) {
          wx.showToast({
            title: statu.msg,
            icon: "none",
            duration: 1000
          })
        }
      },
      fail: function (res) {
        //console.log(res)
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          duration: 1000
        })
        wx.showToast({
          title: res.data.data,
          icon: "none",
          duration: 1000
        })
      },
      complete: function () {

      }
    })
  },
  //跳到拼步数首页
  gomstep(){
    wx.navigateTo({
      url: '/pages/m-step/m-step'
    })
  },
  //qu下单
  goduihuas(){
    wx.navigateTo({
      url: '/pages/m-coupon/m-coupon'
    })
  },
  //跳到微分销
  gowfx(){
   wx.navigateTo({
     url: '/pages/goout/goout',
   })
  },
  //去兑换
  jumpTo(){
     this.setData({
       centerdui:"display:block"
     })
  },
  offs(){
    this.setData({
      centerdui: "display:none"
    })
  },
  //跳转到首页
  goindex(){
    wx.switchTab({
      url: '/pages/index/index',   
    })
  },
  //跳到他人的个人中心页面
  gopersonal(e){
    var uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../personalcenter/personalcenter?uid='+uid
    })
  }
})