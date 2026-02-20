// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: '#A8A29E',
    selectedColor: '#4F46E5',
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
      },
      {
        pagePath: '/pages/test/test',
        text: '测试',
      },
      {
        pagePath: '/pages/record/record',
        text: '记录',
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
      },
    ],
  },
  attached() {
    // 延迟执行，确保页面已加载
    setTimeout(() => {
      this.setSelected()
    }, 100)
  },
  methods: {
    setSelected() {
      const pages = getCurrentPages()
      if (!pages || pages.length === 0) {
        return
      }
      const currentPage = pages[pages.length - 1]
      if (!currentPage || !currentPage.route) {
        return
      }
      const url = currentPage.route
      const selected = this.data.list.findIndex((item) => item.pagePath === '/' + url)
      if (selected !== -1) {
        this.setData({ selected })
      }
    },
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const index = parseInt(data.index, 10)
      this.setData({ selected: index })
      // 使用 switchTab 跳转到 tabBar 页面
      wx.switchTab({
        url: url,
        fail: (err) => {
          console.error('switchTab failed:', err)
          // 如果 switchTab 失败，尝试使用 reLaunch
          wx.reLaunch({ url: url })
        },
      })
    },
  },
})
