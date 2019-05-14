Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{},
    info:{},
    formData:{},
    bookInfo:{}
  },
  hadnle(e){
    var id=e.currentTarget.id
    var formData=this.data.formData
    formData.pass=id
    console.log(formData)
    var user_token = wx.getStorageSync("user_token")
    wx.request({
      url: 'https://jihangyu.cn/message/sendMyReply',
      header: {
        'user-token': user_token
      },
      data: formData,
      method: "POST",
      success(res) {
        if (res.data.code == 200) {
         wx.showToast({
           title: '处理成功',
         })
         if (id == '1') {//orderBook
           wx.request({
             url: 'https://jihangyu.cn/ub/orderBook',
             header: {
               'user-token': user_token,
               "Content-Type": "application/x-www-form-urlencoded", // 默认值
             },
             data: { 
               bId: formData.bid,
               userId: formData.fromUid
             },
             method: "POST",
             success(res) {
               if (res.data.code == 200) {
                 console.log(res.data)
                 wx.showModal({
                   title: 'test',
                   content: '',
                 })
               } else if (res.data.code == 508) {
                 app.login()
                 wx.showToast({
                   title: '正在重新登录',
                   icon: "loading"
                 })
               } else {
                 console.log(res.data)
                 wx.showToast({
                   title: res.data.msg,
                 })
               }
             },
             fail: function (res) {
               console.log(res);
             }
           })
         }

        } else if (res.data.code == 508) {
          app.login()
          wx.showToast({
            title: '正在重新登录',
            icon: "loading"
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var dataList=options.id.split(";")
    var data = {
      'bid': dataList[0],
      'fromUid': dataList[1],
      'toUid': dataList[2],
      'id': dataList[3]
    }
    this.setData({
      formData:data
    })

    //获取书本信息
    wx.request({
      url: 'https://jihangyu.cn/book/getBookById/' + data.bid,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      success(res) {
       if(res.data.code=200){
         that.setData({
           bookInfo:res.data.data
         })
       }
      }, fail() {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })

    //获取用户信息
    wx.request({
      url: 'https://jihangyu.cn/user/getUser',
      data:{
        openid: data.fromUid
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded',
      },
      method:'post',
      success(res){
          that.setData({
            info:res.data.data
          })
      },fail(){
      wx.showToast({
        title: '服务器错误',
        icon:'none'
      })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    wx.stopPullDownRefresh()
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