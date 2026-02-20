// pages/index/index.js - 首页
const app = getApp()
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')

Page({
  data: {
    hasUser: false,
    user: null,
    mbtiType: '',
  },

  onLoad() {
    this.checkUser()
  },

  onShow() {
    this.checkUser()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  checkUser() {
    let profile = storage.getUserProfile()
    if (!profile) {
      this.setData({ hasUser: false, user: null, mbtiType: '' })
      return
    }
    app.globalData.userProfile = profile
    this.setData({
      hasUser: true,
      user: profile,
      mbtiType: profile.mbtiType || '',
    })
  },

  /** 微信一键登录 / 完善信息 */
  onLogin() {
    wx.getUserProfile({
      desc: '用于展示头像与昵称',
      success: (res) => {
        const { nickName, avatarUrl } = res.userInfo
        let profile = storage.getUserProfile()
        if (!profile) {
          profile = storage.createUserProfile(nickName, avatarUrl)
        } else {
          profile.nickName = nickName
          profile.avatarUrl = avatarUrl
          storage.setUserProfile(profile)
        }
        app.globalData.userProfile = profile
        this.setData({ hasUser: true, user: profile, mbtiType: profile.mbtiType || '' })
        wx.showToast({ title: '登录成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '需要授权才能使用', icon: 'none' })
      },
    })
  },

  /** 去测试 */
  goTest() {
    wx.switchTab({ url: '/pages/test/test' })
  },

  /** 看结果（最近一次） */
  goResult() {
    const history = storage.getTestHistory()
    if (history.length === 0) {
      wx.showToast({ title: '请先完成测试', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/result/result?id=' + (history[0].id || '') + '&from=index',
    })
  },

  /** 情境记录 */
  goRecord() {
    wx.switchTab({ url: '/pages/record/record' })
  },

  /** 演化图表 */
  goCharts() {
    wx.navigateTo({ url: '/pages/charts/charts' })
  },

  /** 个人中心 */
  goProfile() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  formatDate(ts) {
    return ts ? util.formatTime(new Date(ts)) : ''
  },
})
