Page({
  data: {
    imgUrls: [
      '/image/books/book1.png',
      '/image/books/book2.png',
      '/image/books/book3.png'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    newest: [],
    lastedList: [],
    hidden: true,
    array: ['小说', '戏剧', '古典文学', '情感'],
    tempFilePaths: [],
    uoloadImg: "",
    tempFilePaths: [],
    index: 0
  },
  onPullDownRefresh(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // complete
    var that = this
    //获取最新的书籍
    wx.request({
      url: 'https://jihangyu.cn/book/getBookByTag/lasted',
      success(res) {
        if (res.data.code == 200) {
          var lastedList = res.data.data
          for (var i = 0; i < lastedList.length; i++) {
            lastedList[i].bImg = 'http://p4a0xyee4.bkt.clouddn.com/' + lastedList[i].bImg.split(",")[0]
          }
          console.log(lastedList)
          that.setData({
            lastedList: lastedList
          })
      
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        } else {
       
          wx.showToast({
            title: res.data.msg,
          })
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      }
    })
    
  },
  close(){
    this.setData({
      hidden:true
    })
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var user_token = wx.getStorageSync("user_token")
        that.setData({
          tempFilePaths: tempFilePaths
        })

      }
    })
  },
  formSubmit: function (e) {
    var that = this
    var user_token = wx.getStorageSync("user_token")
    var formData = e.detail.value
    formData.bType = this.data.array[formData.bType]
    if (formData.bName && formData.bAuthor && formData.bPrice && formData.bPublisher && formData.bType) {
      wx.request({
        url: 'https://jihangyu.cn/book/addBook',
        header: {
          'content-type': 'application/form-data', // 默认值
          'user-token': user_token
        },
        data: formData,
        method: "POST",
        success(res) {
          if (res.data.code == 200) {
            var bookId = res.data.data
            if (that.data.tempFilePaths[0]) {
              wx.uploadFile({
                url: 'https://jihangyu.cn/book/upload', //仅为示例，非真实的接口地址
                filePath: that.data.tempFilePaths[0],
                name: 'file',
                formData: {
                  id: parseInt(bookId)
                },
                header: {
                  'user-token': user_token
                },
                method: "post",
                success: function (res) {
                  var data = JSON.parse(res.data)
                  if (data.code == 200) {
                    wx.showToast({
                      title: '添加成功',
                    })
                    that.setData({
                      hidden: true
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                    })

                  }

                }
              })
            } else {
              wx.showToast({
                title: '请上传封面',
              })
            }

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
    } else {
      wx.showToast({
        title: '必填信息不能为空',
      })
    }



  },
  formReset() {
    this.setData({
      tempFilePaths: []
    })
  },
  addBook() {
    this.setData({
      hidden: false
    })

  },
  onLoad() {
    var that = this
    //获取最新的书籍
    wx.request({
      url: 'https://jihangyu.cn/book/getBookByTag/lasted',
      success(res) {
        if (res.data.code == 200) {
          var lastedList = res.data.data
          for (var i = 0; i < lastedList.length; i++) {
            lastedList[i].bImg = 'http://p4a0xyee4.bkt.clouddn.com/' + lastedList[i].bImg.split(",")[0]
          }
          console.log(lastedList)
          that.setData({
            lastedList: lastedList
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  }



})