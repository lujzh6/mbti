// pages/profile/profile.js - 个人中心（丰富色彩版）
const app = getApp()
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const { PERSONALITIES } = require('../../data/personalities.js')

Page({
  data: {
    user: null,
    userColor: '#7C3AED',
    userColorLight: '#EDE9FE',
    userColorMid: '#C4B5FD',
    userEmoji: '',
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

    const p = profile.mbtiType ? PERSONALITIES[profile.mbtiType] : null

    const history = storage.getTestHistory().slice(0, 10)
    const records = storage.getDailyRecords()
    const settings = storage.getSettings()

    const testHistory = history.map((h) => {
      const hp = PERSONALITIES[h.type]
      return {
        ...h,
        dateStr: this.formatDate(h.createdAt),
        typeName: hp ? hp.name : h.type,
        color: hp ? hp.color : '#7C3AED',
        colorLight: hp ? hp.colorLight : '#EDE9FE',
      }
    })

    this.setData({
      user: {
        ...profile,
        dateStr: this.formatDate(profile.createdAt),
        typeName: p ? p.name : '',
      },
      userColor: p ? p.color : '#7C3AED',
      userColorLight: p ? p.colorLight : '#EDE9FE',
      userColorMid: p ? (p.colorMid || p.colorLight) : '#C4B5FD',
      userEmoji: p ? p.emoji : '',
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

  goTest() { wx.navigateTo({ url: '/pages/test/test' }) },
  goResult(e) { wx.navigateTo({ url: '/pages/result/result?id=' + e.currentTarget.dataset.id }) },
  goRecords() { wx.navigateTo({ url: '/pages/records/records' }) },
  goCharts() { wx.navigateTo({ url: '/pages/charts/charts' }) },

  toggleNotify(e) { storage.setSettings({ notify: e.detail.value }); this.setData({ notify: e.detail.value }) },
  togglePrivacy(e) { storage.setSettings({ privacy: e.detail.value }); this.setData({ privacy: e.detail.value }) },

  payEntry() { wx.showToast({ title: '付费功能敬请期待', icon: 'none' }) },

  formatDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  },
})
