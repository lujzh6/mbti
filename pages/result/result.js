// pages/result/result.js - 测试结果报告
const { PERSONALITIES } = require('../../data/personalities.js')
const storage = require('../../utils/storage.js')

Page({
  data: {
    type: '',
    name: '',
    color: '#667eea',
    desc: '',
    strengths: [],
    blindSpots: [],
    careers: [],
    radar: [0, 0, 0, 0],
    radarLabels: ['外向 E', '实感 S', '思考 T', '判断 J'],
  },

  onLoad(options) {
    let type = (options && options.type) || ''
    const id = (options && options.id) || ''

    if (!type && id) {
      const list = storage.getTestHistory()
      const item = list.find((r) => r.id === id)
      if (item) {
        type = item.type
        this.setData({ radar: item.radar || [0, 0, 0, 0] })
      }
    }

    if (!type) {
      const profile = storage.getUserProfile()
      type = (profile && profile.mbtiType) || 'INFP'
    }
    const p = PERSONALITIES[type] || PERSONALITIES.INFP
    this.setData({
      type,
      name: p.name,
      color: p.color,
      desc: p.desc,
      strengths: p.strengths || [],
      blindSpots: p.blindSpots || [],
      careers: p.careers || [],
    })
    if (!this.data.radar || this.data.radar.every((x) => x === 0)) {
      const list = storage.getTestHistory()
      const last = list.find((r) => r.type === type)
      if (last && last.radar) this.setData({ radar: last.radar })
    }
  },

  onReady() {
    this.drawRadar()
  },

  drawRadar() {
    const radar = this.data.radar
    if (!radar || radar.length < 4) return
    const ctx = wx.createCanvasContext('radarCanvas', this)
    const size = 320
    const center = size / 2
    const R = center - 30
    const max = 12
    const labels = ['E', 'S', 'T', 'J']
    const count = 4
    // 背景网格
    ctx.setStrokeStyle('rgba(0,0,0,0.08)')
    ctx.setLineWidth(1)
    for (let r = 1; r <= 3; r++) {
      ctx.beginPath()
      for (let i = 0; i <= count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2
        const x = center + (R * r / 3) * Math.cos(angle)
        const y = center + (R * r / 3) * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }
    // 轴线
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.lineTo(center + R * Math.cos(angle), center + R * Math.sin(angle))
      ctx.stroke()
    }
    // 数据区域
    const values = radar.slice(0, 4).map((v) => (v / max) * R)
    ctx.setFillStyle('rgba(102, 126, 234, 0.35)')
    ctx.setStrokeStyle(this.data.color)
    ctx.setLineWidth(2)
    ctx.beginPath()
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      const x = center + values[i] * Math.cos(angle)
      const y = center + values[i] * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.draw()
  },

  onShareAppMessage() {
    return {
      title: '我的MBTI是' + this.data.type + ' · ' + this.data.name + '，一起来探索人格吧',
      path: '/pages/index/index',
    }
  },

  savePoster() {
    wx.showLoading({ title: '生成中...' })
    const query = wx.createSelectorQuery().in(this)
    query.select('#result-card').boundingClientRect()
    query.exec((res) => {
      if (!res || !res[0]) {
        wx.hideLoading()
        wx.showToast({ title: '请稍后重试', icon: 'none' })
        return
      }
      const ctx = wx.createCanvasContext('posterCanvas', this)
      const d = res[0]
      const width = 600
      const height = 900
      ctx.setFillStyle(this.data.color)
      ctx.fillRect(0, 0, width, 280)
      ctx.setFillStyle('#fff')
      ctx.setFontSize(48)
      ctx.fillText(this.data.type, 40, 120)
      ctx.setFontSize(32)
      ctx.fillText(this.data.name, 40, 170)
      ctx.setFillStyle('#333')
      ctx.setFontSize(26)
      const desc = this.data.desc.slice(0, 80) + '...'
      ctx.fillText(desc, 40, 240, width - 80)
      ctx.setFillStyle('#f5f5f5')
      ctx.fillRect(0, 300, width, height - 300)
      ctx.setFillStyle('#333')
      ctx.setFontSize(24)
      ctx.fillText('MBTI人格探索 · 生成于 ' + new Date().toLocaleDateString(), 40, 860)
      ctx.draw(false, () => {
        wx.hideLoading()
        wx.canvasToTempFilePath({
          canvasId: 'posterCanvas',
          success: (r) => {
            wx.saveImageToPhotosAlbum({
              filePath: r.tempFilePath,
              success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
              fail: () => wx.showToast({ title: '需要相册权限', icon: 'none' }),
            })
          },
          fail: () => wx.showToast({ title: '生成失败', icon: 'none' }),
        }, this)
      })
    })
  },

  goCharts() {
    wx.navigateTo({ url: '/pages/charts/charts' })
  },

  goHome() {
    wx.navigateTo({ url: '/pages/index/index' })
  },
})
