// pages/index/index.js - 首页
const app = getApp()
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const { PERSONALITIES, GROUPS, getGroupByType } = require('../../data/personalities.js')

Page({
  data: {
    hasUser: false,
    user: null,
    mbtiType: '',
    userTypeName: '',
    userColor: '#7C3AED',
    userMotto: '',
    groups: [],
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
      this.setData({ hasUser: false, user: null, mbtiType: '', userTypeName: '', userColor: '#7C3AED', userMotto: '' })
      return
    }
    app.globalData.userProfile = profile
    const type = profile.mbtiType || ''
    const p = type ? PERSONALITIES[type] : null
    const group = type ? getGroupByType(type) : null
    this.setData({
      hasUser: true,
      user: profile,
      mbtiType: type,
      userTypeName: p ? p.name : '',
      userColor: p ? p.color : '#7C3AED',
      userMotto: p ? p.motto : '',
    })
  },

  /** 微信登录 */
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
        this.checkUser()
        wx.showToast({ title: '登录成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '需要授权才能使用', icon: 'none' })
      },
    })
  },

  goTest() { wx.switchTab({ url: '/pages/test/test' }) },

  goResult() {
    const history = storage.getTestHistory()
    if (history.length === 0) {
      wx.showToast({ title: '请先完成测试', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/result/result?id=' + (history[0].id || '') + '&from=index' })
  },

  goRecord() { wx.switchTab({ url: '/pages/record/record' }) },

  goCharts() { wx.navigateTo({ url: '/pages/charts/charts' }) },

  goProfile() { wx.switchTab({ url: '/pages/profile/profile' }) },

  goGroupDetail(e) {
    // Future: navigate to group detail page
    const group = e.currentTarget.dataset.group
    wx.showToast({ title: GROUPS[group] ? GROUPS[group].name : group, icon: 'none' })
  },
})
