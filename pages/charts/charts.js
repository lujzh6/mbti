// pages/charts/charts.js - 演化图表：7/30天趋势、雷达对比
const storage = require('../../utils/storage.js')
const { PERSONALITIES } = require('../../data/personalities.js')

Page({
  data: {
    range: '7',
    rangeIndex: 0,
    testHistory: [],
    dailyRecords: [],
    initialType: '',
    initialRadar: [],
    trendData: { EI: [], SN: [], TF: [], JP: [] },
    insight: '',
    sceneMood: [], // 场景-心情用于热力
  },

  onLoad() {
    this.loadData()
  },

  loadData() {
    const history = storage.getTestHistory()
    const records = storage.getDailyRecords()
    const profile = storage.getUserProfile()
    const initialType = (profile && profile.mbtiType) || ''
    let initialRadar = [0, 0, 0, 0]
    if (history.length > 0) {
      const last = history[0]
      if (last.radar) initialRadar = last.radar
    }
    const range = this.data.range || '7'
    const days = parseInt(range, 10)
    const cut = Date.now() - days * 24 * 60 * 60 * 1000
    const recentRecords = records.filter((r) => (r.createdAt || 0) >= cut)
    const trendData = { EI: [], SN: [], TF: [], JP: [] }
    const dates = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toDateString())
    }
    dates.forEach((dateStr) => {
      const dayRecords = recentRecords.filter((r) => (r.date || '').indexOf(dateStr) > -1 || (r.createdAt && new Date(r.createdAt).toDateString() === dateStr))
      let EI = 6, SN = 6, TF = 6, JP = 6
      dayRecords.forEach((r) => {
        if (r.dimCounts) {
          const d = r.dimCounts
          if (d.EI) EI = (d.EI.E || 0) - (d.EI.I || 0) + 6
          if (d.SN) SN = (d.SN.S || 0) - (d.SN.N || 0) + 6
          if (d.TF) TF = (d.TF.T || 0) - (d.TF.F || 0) + 6
          if (d.JP) JP = (d.JP.J || 0) - (d.JP.P || 0) + 6
        }
      })
      trendData.EI.push(EI)
      trendData.SN.push(SN)
      trendData.TF.push(TF)
      trendData.JP.push(JP)
    })
    const sceneMood = recentRecords.map((r) => ({ scene: r.scene, mood: r.mood || 5 }))
    let insight = '继续记录情境，维度趋势会更清晰。'
    if (recentRecords.length >= 3) {
      insight = '近期记录已有多条，可在下方查看各维度变化趋势。'
    }
    if (history.length > 0) {
      insight = '你的初始类型为 ' + (initialType || '未测') + '，下方为基于情境记录的维度波动。'
    }
    this.setData({
      testHistory: history,
      dailyRecords: recentRecords,
      initialType,
      initialRadar,
      trendData,
      insight,
      sceneMood,
    })
  },

  onRangeChange(e) {
    const idx = parseInt(e.detail.value, 10)
    this.setData({ range: idx === 1 ? '30' : '7', rangeIndex: idx })
    this.loadData()
  },

  setRange(e) {
    const range = e.currentTarget.dataset.range || '7'
    this.setData({ range })
    this.loadData()
  },

  exportPdf() {
    wx.showToast({ title: '导出PDF为付费功能，敬请期待', icon: 'none' })
  },
})
