// pages/classify/classify.js
var app=getApp();
const request = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenLoading: true,
    comeForm:'tab',
    key:'',
    location: '',
    tabBarId:'',
    currentIndex:-1,
    uniqueIndex:0,
    class_list:[],
    recommend_list:[],
    goodsList:[],
    cartList:[],       //购物车列表
    reqData:{},
    uniqueImgClass:[
      'unique-icon-hot',
      'unique-icon-fresh'
    ],
    uniqueClass:[
      'unique-hot',
      'unique-fresh'
    ],
    uniqueIcon:[
      '../../image/new/icon-hot.png',
      '../../image/new/icon-fresh.png',
      '../../image/new/icon-hot-active.png',
      '../../image/new/icon-fresh-active.png'
    ]
  },
  //检测从首页icon二级跳转过来
  // getClassifyId: function () {
  //   var id = app.globalData.tabBarId;
  //   if (id) {
  //     this.class_list.forEach(function (item, index) {
  //       if (id === item.id) {
  //         that.setData({
  //           currentIndex: index,
  //           uniqueIndex: -1,
  //         })
  //         console.log('index', index);
  //       }
  //     })
  //     // this.reqGoods(id);
  //   }
  // },
  //获取分类列表
  getClassList(){
    let _this=this;
    let reqClass = request.request("/Applets/Index/getClassificationList");
    reqClass.then(
      function(res){
        console.log("getClassList-res",res);
        _this.setData({
          class_list: res.data.class_list,
          recommend_list:res.data.recommend_list
        })
        let location = wx.getStorageSync("locationcity");
        if (location != _this.data.location) {
          this.setData({
            location: location
          });
          if (_this.data.currentIndex == -1) return;
          _this.reqGoods(_this.data.class_list[_this.data.currentIndex].id);
        } else if (app.globalData.tabBarId!=''){
          let obj={};
          obj.id = app.globalData.tabBarId;
          app.globalData.tabBarId = '';
          _this.data.class_list.forEach(function (item, index) {
            // console.log(item,index)
            if (item.id == obj.id) {
              obj.index=index;
            }
          });
          _this.onCellClick(obj);
        } 
        // else if (_this.data.currentIndex!=-1){

        // }
        else{
          _this.onUniqueClick(res.data.recommend_list[0].id);
        }

        //获取传过来的tabBarId

      },
      function(err){
        console.log("getClassList-err", err);
      }
    )
  },
  // 获取购物车列表
  getCartList: function () {
    let _this = this;
    let uid = wx.getStorageSync("userinfo").uid;
    let data = {
      member_id: uid,
      seller_id: 1
    }
    let req = request.request("/Applets/Cart/ajaxCartList", data);
    req.then(
      function (res) {
        console.log("获取购物车列表", res)
        _this.setData({
          cartList: res.cartList
        });
        // _this.updateCartState();
      }
    )
  },
  onCellClick(event){
    console.log("onCellClick",event);
    let cellIndex,id;
    if(event.index){
      cellIndex = event.index;
      id = event.id;
    }else{
      cellIndex = event.currentTarget.dataset.index;
      id = event.currentTarget.dataset.id;
    }
    if (this.currentIndex == cellIndex) return;
    this.setData({
      uniqueIndex: -1,
      currentIndex: cellIndex
    });
    this.reqGoods(id);
  },
  onUniqueClick(event){
    console.log("onUniqueClick", event);
    if(!event.currentTarget){
      this.setData({
        currentIndex: -1,
        uniqueIndex: 0,
        key: "uniq0"
      });
      this.reqUnique(event);
      return;
    }
    let uniqueIndex = event.currentTarget.dataset.index;
    if (this.uniqueIndex == uniqueIndex) return;
    this.setData({
      currentIndex:-1,
      uniqueIndex: event.currentTarget.dataset.index,
      key: "uniq" + event.currentTarget.dataset.index
    });
    this.reqUnique(event.currentTarget.dataset.id);
  },
  reqGoods(goodsId){
    let _this=this;
    let data={
      two_cat_id: goodsId,
      city:this.data.location
    };
    let reqGoods = request.request('/Applets/Index/classify_content', data);
    reqGoods.then(
      function(res){
        console.log("reqGoods-res", res);
        _this.setData({
          goodsList:res.goods
        });
        _this.setData({
          uniqueIndex: -1,
          key: 'sw' + goodsId
        }) 
      },
      function(err){

      }
    )
  },
  reqUnique(goodsId) {
    let _this = this;
    let data = {
      id: goodsId
    };
    let reqGoods = request.request('/Applets/Index/getRecommendGoodsListById', data);
    reqGoods.then(
      function (res) {
        console.log("reqUnique-res", res);
        _this.setData({
          goodsList: res.data[0]
        });
      },
      function (err) {

      }
    )
  },
  // 添加购物车=================
  onAddCart: function (e) {
    let goods = e.currentTarget.dataset.goods;
    console.log('cart', e);
    //预售商品 不可加入购物车
    if (goods.is_sale == 1) {
      wx.showToast({
        title: '商品暂未开售',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let that = this;
    // var city = "哈尔滨";
    let city = this.data.location;
    let uid = wx.getStorageSync("userinfo").uid;
    if (!uid) {
      that.setData({
        mshow: "display:block"
      })
    } else {
      if (!goods.spec_key) {
        wx.showToast({
          title: "没有设置规格",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      //console.log(uid)
      wx.request({
        url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
        data: {
          member_id: uid, //会员ID
          goods_id: goods.goods_id, //商品ID
          goods_num: 1, //商品数量
          spec_key: goods.spec_key,
          city: city
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var txt = res.data.msg
          wx.showToast({
            title: txt,
            icon: 'none',
            duration: 2000
          })
          if (res.data.status == 1) {
            // 重新更新购物车数据表
            const shopusr = app.globalData.Murl + "/Applets/Cart/ajaxCartList";
            wx.request({
              url: shopusr,
              data: {
                member_id: uid,
                seller_id: 1,
              },
              method: "POST",
              success: function (res) {
                //console.log(res.data.cartList)
                that.setData({
                  cartList: res.data.cartList
                })

              }
            })

          } else if (res.data.status == 10) { //by yan.lei 一键代发执行跳转
            wx.navigateTo({
              url: '../theorder/theorder?goods_id=' + goods_id + '&num=1' + '&spec_key=' + spec_key + '&page=' + 1,
              success: function (res) {
                console.log(res)
              },
              fail: function (res) {
                console.log(res)
              },
              complete: function (res) {
                console.log(res)
              },
            })
          }

        },
        fail: function (res) {
          wx.showLoading({
            title: '网络连接失败！',
          })

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)

        }
      })
    }

  },
  // 商品跳转详情================
  goodsDetails: function (e) {
    //console.log(e.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../details/details?goodsid=' + e.currentTarget.dataset.goodsid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let location = wx.getStorageSync("locationcity");
    this.setData({
      location: location
      // tabBarId:app.globalData.tabBarId
    });
    // _this.getCartList();
    // _this.getClassList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onready===========");
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let location = wx.getStorageSync("locationcity");
    console.log("classify-show-comefrom",this.data.comeForm)
    if (this.data.comeForm=="detail"){
      this.setData({
        comeForm:'tab'
      })
      return;
    }
    // 获取购物车列表 
    this.getCartList();
    this.getClassList();
    // //是否需要重新请求 ids
    // if (location != this.data.location) {
    //   this.setData({
    //     location: location
    //   });
    //   if (this.data.currentIndex == -1) return;
    //   this.reqGoods(this.data.class_list[this.data.currentIndex].id);
    // } else if (app.globalData.tabBarId!=''){
    //   console.log('onshow-tabBarId', app.globalData.tabBarId);
    //   let obj={};
    //   obj.id = app.globalData.tabBarId;
    //   app.globalData.tabBarId='';
    //   this.class_list.forEach(function(v,k){
    //     if(v.id==obj.id){
    //       obj.index=k;
    //     }
    //   });
    //   this.onCellClick(obj);
    // }
    // console.log(app.globalData.tabBarId);
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
    var userinfo = wx.getStorageSync("userinfo");
    var uid = userinfo.uid;
    return {
      title: '【青青优农】追求原始的味道',
      path: '/pages/classify/classify?pid=' + uid,
      imageUrl: '',
      success: function (res) {
        console.log(res)
        // console.log
        // wx.getShareInfo({
        //   shareTicket: res.shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   },
        //   fail: function (res) { console.log(res) },
        //   complete: function (res) { console.log(res) }
        // })
      },
      fail: function (res) {
        // 分享失败
        //console.log(res)
      }
    }
  }
})