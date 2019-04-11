const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 是否为空对象
function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

// 检测授权状态
function checkSettingStatu(cb) {
  var that = this;
  // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
  wx.getSetting({
    success: function success(res) {
      console.log(res.authSetting);
      var authSetting = res.authSetting;
      if (util.isEmptyObject(authSetting)) {
        console.log('首次授权');
      } else {
        console.log('不是第一次授权', authSetting);
        // 没有授权的提醒
        if (authSetting['scope.userInfo'] === false) {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用阅读记录功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    console.log('openSetting success', res.authSetting);
                  }
                });
              }
            }
          })
        }
      }
    }
  });
}


function request(url, data, method = "POST", header = "application/json;charset=UTF-8") {
  wx.showLoading({
    title: '加载中',
  })
  return new Promise(function(resolve, reject) {
    wx.request({
      url: app.globalData.Murl + url,
      data: data,
      method: method,
      header: {
        'Content-Type': header
      },
      success:function(res){
        wx.hideLoading();
        resolve(res.data);
      },
      fail:function(err){
        wx.showToast({
          icon: 'loading',
          title: "网络错误！",
          duration: 2000
        })
        reject(err.data)
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  isEmptyObject: isEmptyObject,
  checkSettingStatu: checkSettingStatu,
  request: request
}