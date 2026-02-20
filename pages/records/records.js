// pages/records/records.js - 情境记录列表
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')

const SCENE_NAMES = { work: '工作', study: '学习', social: '社交', family: '家庭', alone: '独处' }

Page({
  data: {
    list: [],
  },

  onLoad() {
    this.loadList()
  },

  onShow() {
    this.loadList()
  },

  loadList() {
    const list = storage.getDailyRecords()
    this.setData({
      list: list.map((r) => ({
        ...r,
        sceneName: SCENE_NAMES[r.scene] || r.scene,
        dateStr: r.date || (r.createdAt ? util.formatTime(new Date(r.createdAt)).split(' ')[0] : ''),
      })),
    })
  },

  goRecord() {
    wx.navigateTo({ url: '/pages/record/record' })
  },

  goCharts() {
    wx.navigateTo({ url: '/pages/charts/charts' })
  },
})
