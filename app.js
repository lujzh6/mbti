// app.js - MBTI人格探索
const storage = require('./utils/storage.js')

App({
  onLaunch() {
    // 微信登录获取 code（正式环境用 code 换 openid）
    wx.login({
      success: (res) => {
        if (res.code) {
          // 可在此将 res.code 发往后端换取 openid
          this.syncUserProfile()
        }
      },
    })
    this.syncUserProfile()
  },

  /**
   * 同步用户档案：无则不入库，由首页/个人中心触发创建；有则加载到 globalData
   */
  syncUserProfile() {
    const profile = storage.getUserProfile()
    this.globalData.userProfile = profile
  },

  globalData: {
    userProfile: null, // { openid, nickName, avatarUrl, mbtiType, createdAt }
  },
})
