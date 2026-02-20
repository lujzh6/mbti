// pages/profile/profile.js - 个人中心
const app = getApp()
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const { PERSONALITIES } = require('../../data/personalities.js')

Page({
  data: {
    user: null,
    testHistory: [],
    recordsCount: 0,
    notify: true,
    privacy: true,
  },

  onLoad() {
    this.load()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    this.load()
  },

  load() {
    let profile = storage.getUserProfile()
    if (!profile) {
      profile = { nickName: '', avatarUrl: '', mbtiType: '', createdAt: 0 }
    }
    app.globalData.userProfile = profile
    const history = storage.getTestHistory().slice(0, 10)
    const records = storage.getDailyRecords()
    const settings = storage.getSettings()
    const testHistory = history.map((h) => ({
      ...h,
      dateStr: this.formatDate(h.createdAt),
      typeName: (PERSONALITIES[h.type] && PERSONALITIES[h.type].name) || h.type,
    }))
    this.setData({
      user: {
        ...profile,
        dateStr: this.formatDate(profile.createdAt),
        typeName: profile.mbtiType ? ((PERSONALITIES[profile.mbtiType] && PERSONALITIES[profile.mbtiType].name) || profile.mbtiType) : '',
      },
      testHistory,
      recordsCount: records.length,
      notify: settings.notify !== false,
      privacy: settings.privacy !== false,
    })
  },

  onLogin() {
    wx.getUserProfile({
      desc: '用于展示头像与昵称',
      success: (res) => {
        const { nickName, avatarUrl } = res.userInfo
        let profile = storage.getUserProfile()
        if (!profile) profile = storage.createUserProfile(nickName, avatarUrl)
        else {
          profile.nickName = nickName
          profile.avatarUrl = avatarUrl
          storage.setUserProfile(profile)
        }
        app.globalData.userProfile = profile
        this.load()
        wx.showToast({ title: '更新成功', icon: 'success' })
      },
    })
  },

  goTest() {
    wx.navigateTo({ url: '/pages/test/test' })
  },

  goResult(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/result/result?id=' + id })
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/records/records' })
  },

  goCharts() {
    wx.navigateTo({ url: '/pages/charts/charts' })
  },

  toggleNotify(e) {
    const v = e.detail.value
    storage.setSettings({ notify: v })
    this.setData({ notify: v })
  },

  togglePrivacy(e) {
    const v = e.detail.value
    storage.setSettings({ privacy: v })
    this.setData({ privacy: v })
  },

  payEntry() {
    wx.showToast({ title: '付费功能敬请期待', icon: 'none' })
  },

  formatDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  },
})
