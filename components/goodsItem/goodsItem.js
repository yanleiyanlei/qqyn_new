// components/goodsItem/goodsItem.js
//获取应用实例 
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataObj:{
      type:Object,
      default:{}
    },
    cartlist: {
      type: Array,
      default: []
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isCart:false,
    goodsNum:0
  },
  /**
   * 组件的生命周期
   */
  lifetimes:{
    attached() {
      // 在组件在视图层布局完成后执行
      this.init();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init:function(){
      this.initData(this.data.dataObj.goods_id, this.data.cartlist);
    },
    initData:function(str,arr){
      let _this = this;
      console.log("goodsItem-str"+str,arr)
      arr.forEach(function (v, k) {
        if (v.goods_id == str) {
          _this.setData({
            isCart: true,
            goodsNum: v.goods_num
          })
        }
      })
    },
    // 添加购物车================= 
    cart: function (e) {
      let that = this;
      let uid = wx.getStorageSync("userinfo").uid;
      let goods_id = this.data.dataObj.goods_id;
      let spec_key = this.data.dataObj.spec_key;
      console.log("添加购物车-spec_key", spec_key)
      if (!uid) {
        this.triggerEvent('cartTap', uid);
      } else if (spec_key == null){
        wx.showToast({
          title: "添加商品失败！",
          icon: 'none',
          duration: 2000
        })
      }else { 
        console.log("添加购物车", e.currentTarget); 
        wx.request({
          url: app.globalData.Murl + '/Applets/Cart/ajaxAddcart/',
          data: {
            member_id: uid, //会员ID 
            goods_id: goods_id, //商品ID 
            goods_num: 1, //商品数量 
            spec_key: spec_key
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值 
          },
          success: function (res) {
            console.log("success",res.data) 
            var txt = res.data.msg
            var num = res.data.thisGoodsNum
            e.currentTarget.dataset.num = num
            //console.log(e.currentTarget.dataset.num) 
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
                  that.initData(that.data.dataObj.goods_id, res.data.cartList);
                }
              })

            }
            if (res.data.status == 10) {
              //by yan.lei 一键代发执行跳转 
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
    // 商品跳转详情 
    goodsDetails: function () {
      let goods_id = this.data.dataObj.goods_id;
      let spec_key = this.data.dataObj.spec_key;
      if (!spec_key || !goods_id){
        wx.showToast({
          title: "请求商品失败！",
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.navigateTo({
        url: '../details/details?goodsid=' + goods_id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
    }
  }
})
