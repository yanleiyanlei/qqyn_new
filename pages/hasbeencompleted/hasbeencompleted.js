const app = getApp();
var user = require("../../lib/js/user.js")

Page({
  data: {
    aaaa:false,
    markers: [{
      title:'青青优农生鲜超市(西红门店)',
      iconPath:'/image/hasbeencompleted/icon_signin_line.png',
      id:0,
      latitude:39.790306,
      longitude:116.339646,
      width:25,
      height:25,
      zIndex:9999,
      callout:{
        content:'青青优农生鲜超市(西红门店)',
        display:'ALWAYS',
        color:'#ff712b',
        textAlign:'center'
      },
    }],
    
   
    regionchange(e) {
      console.log(e.type)
    },
    markertap(e) {
      console.log(e.markerId)
    },
    controltap(e) {
      console.log(e.controlId)
    },
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  pagesm2() {
    wx.redirectTo({
      url: '../m-step2/m-step2',
    })
  },

  click: function (e) {
    wx.openLocation({
      latitude: 39.790306,
      longitude: 116.339646,
      scale: 18,
      name: '青青优农生鲜超市(西红门店)',
      address: '北京市大兴区宏旭路244号一层'
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
    // var code_info = JSON.parse(options.code_info);
    // console.log(code_info)
    var code_info_price = options.code_info_price
    var code_info_num = options.code_info_num
    var code_info_man = options.code_info_man
    var team_id = options.team_id
    console.log(options)
    this.setData({
      rice_rand: rice_rand,
      code_info_price: code_info_price,
      code_info_num: code_info_num,
      code_info_man: code_info_man,

    })
    var that = this;
    wx.request({
      url: app.globalData.Murl + '/Applets/Active/create_detail',
      data: { team_id: team_id, member_id: wx.getStorageSync("userinfo").uid },
      method: 'post',
      success: function (res) {
        console.log(res)
        var kk = parseInt(res.data.info.step_people_num) - res.data.info.member_info.length;
        console.log(kk)
        var klist = [];
        if (kk != 0) {
          for (var i = 0; i < kk; i++) {
            klist.push(1)
          }
        }
        that.setData({
          actInfo: res.data.info,
          people_step: res.data.people_step,
          teamMember: res.data.info.member_info,
          ac_id: res.data.info.step_id,
          klist: klist,
          rice_rand: res.data.info.rice_rand,
          code_info: res.data.info.code_info,
          price:res.data.info.code_info[0].price
        })
        console.log(res.data.info.code_info[0].price)
        
      }
    })
  }
})