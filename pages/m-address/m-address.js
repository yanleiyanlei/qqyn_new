const app=getApp();
Page({
  data:{
    iskong:false,
    address: [],
    uid:''
  },
  onLoad:function(){
    var userInfo = wx.getStorageSync("userinfo");
    var uid = userInfo.uid;
    this.setData({
      uid: uid 
    })
   // console.log(uid)
    var that=this;
    wx.request({
      url:app.globalData.Murl+"/Applets/User/m_address1",
      data:{member_id:uid},
      method:"post",
      success:function(res){
          //console.log(res.data);
          that.setData({
            iskong:res.data.status,
            address:res.data.select
          })
          
      },
      fail:function(res){
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
      complete:function(){

      }
    })
  },
  onUnload: function () {
    // wx.navigateBack({
    //   delta:2
    // })
  },
  edit:function(event){
    var id=event.currentTarget.dataset.id;
    var aid = event.currentTarget.dataset.aid;
    
    wx.redirectTo({
      url: '/pages/changeAddress/changeAddress?aid='+aid,
    })
    
  },
  delete:function(event){
    var id=event.currentTarget.dataset.id;
    var aid = event.currentTarget.dataset.aid;
    var that=this;
    wx.showModal({
      title: '删除',
      content: '确定要删除地址信息？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.Murl+"/Applets/User/DelAddress",
            data: { address_id: aid },
            method: "post",
            success: function (res) {
               if(res.data.status){
                 wx.showToast({
                   title: '成功',
                   icon: 'success',
                   duration: 1000
                 })
                 setTimeout(function () {
                   wx.hideToast()
                  //  wx.redirectTo({
                  //    url: 'm-address'
                  //  })
                 }, 1000)
                 wx.request({
                   url: app.globalData.Murl+"/Applets/User/m_address1",
                   data: { member_id: that.data.uid },
                   method: "post",
                   success: function (res) {
                     //console.log(res.data);
                     that.setData({
                       iskong: res.data.status,
                       address: res.data.select
                     })

                   },
                   fail: function (res) {
                     //console.log(res)
                   },
                   complete: function () {

                   }
                 })
             

               }else{
                 wx.showToast({
                   title: '系统繁忙',
                   icon: 'none',
                   duration: 1000
                 })
                 setTimeout(function () {
                   wx.hideLoading()
                 }, 1000)
               }

            }

          })
        } else if (res.cancel) {
          
        }
      },
      fail:function(){
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
      }
    })
   
  },
  defaltAddress:function(event){
    var flag=event.currentTarget.dataset.defalt;
    var id = event.currentTarget.dataset.id;
    var aid = event.currentTarget.dataset.aid;
    var that=this;
    wx.request({
      url: app.globalData.Murl+'/Applets/User/SaveKey',
      data: { member_id: id, id:aid},
      method:"post",
      success:function(res){
        if (res.data.result==1){
          // wx.redirectTo({
          //   url: 'm-address'
          // })
          wx.request({
            url: app.globalData.Murl+"/Applets/User/m_address1",
            data: { member_id: that.data.uid },
            method: "post",
            success: function (res) {
             // console.log(res.data);
              that.setData({
                iskong: res.data.status,
                address: res.data.select
              })

            },
            fail: function (res) {
              //console.log(res)
            },
            complete: function () {

            }
          })
        } else if (res.data.result == 0){
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.hideToast();
          }, 1000)
        } else if (res.data.result == 2) {
          wx.showToast({
            title: '当前地址是默认地址',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.hideToast();
          }, 1000)
        }
      },
      fail:function(){
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
      }
    })
     
  }
})