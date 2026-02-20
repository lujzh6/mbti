// pages/result/result.js - 测试结果报告（丰富色彩版）
const { PERSONALITIES, getGroupByType } = require('../../data/personalities.js')
const storage = require('../../utils/storage.js')

Page({
  data: {
    type: '',
    name: '',
    nameEn: '',
    color: '#7C3AED',
    colorLight: '#EDE9FE',
    colorMid: '#C4B5FD',
    groupColor: '#5B21B6',
    groupLight: '#EDE9FE',
    groupName: '',
    emoji: '',
    role: '',
    motto: '',
    desc: '',
    strengths: [],
    blindSpots: [],
    careers: [],
    radar: [0, 0, 0, 0],
    radarLabels: ['E', 'S', 'T', 'J'],
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
    const g = getGroupByType(type)

    this.setData({
      type,
      name: p.name,
      nameEn: p.nameEn,
      color: p.color,
      colorLight: p.colorLight,
      colorMid: p.colorMid || p.colorLight,
      groupColor: g ? g.color : p.color,
      groupLight: g ? g.colorLight : p.colorLight,
      groupName: g ? g.name : '',
      emoji: p.emoji,
      role: p.role,
      motto: p.motto,
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
    const count = 4
    const dimColors = ['#7C3AED', '#059669', '#D97706', '#2563EB']

    // Background grid
    ctx.setStrokeStyle('rgba(0,0,0,0.06)')
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

    // Axis lines with dimension colors
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      ctx.setStrokeStyle(dimColors[i])
      ctx.setGlobalAlpha(0.3)
      ctx.setLineWidth(2)
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.lineTo(center + R * Math.cos(angle), center + R * Math.sin(angle))
      ctx.stroke()
    }
    ctx.setGlobalAlpha(1)

    // Data area
    const values = radar.slice(0, 4).map((v) => (v / max) * R)
    ctx.setFillStyle(this.data.color + '35')
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

    // Dots at vertices
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      const x = center + values[i] * Math.cos(angle)
      const y = center + values[i] * Math.sin(angle)
      ctx.setFillStyle(dimColors[i])
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
    }

    ctx.draw()
  },

  onShareAppMessage() {
    return {
      title: '我的MBTI是' + this.data.type + ' - ' + this.data.name + '，一起来探索人格吧',
      path: '/pages/index/index',
    }
  },

  savePoster() {
    wx.showLoading({ title: '生成中...' })
    const ctx = wx.createCanvasContext('posterCanvas', this)
    const width = 600
    const height = 900

    // Hero gradient background
    const grd = ctx.createLinearGradient(0, 0, width, 280)
    grd.addColorStop(0, this.data.color)
    grd.addColorStop(1, this.data.groupColor)
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, width, 280)

    ctx.setFillStyle('#fff')
    ctx.setFontSize(64)
    ctx.fillText(this.data.type, 40, 140)
    ctx.setFontSize(32)
    ctx.fillText(this.data.name + ' / ' + this.data.role, 40, 190)
    ctx.setFontSize(20)
    ctx.fillText(this.data.groupName, 40, 230)

    ctx.setFillStyle(this.data.colorLight)
    ctx.fillRect(0, 280, width, height - 280)

    ctx.setFillStyle(this.data.color)
    ctx.setFontSize(22)
    const desc = this.data.desc.slice(0, 80) + '...'
    ctx.fillText(desc, 40, 340, width - 80)

    ctx.setFillStyle('#666')
    ctx.setFontSize(20)
    ctx.fillText('MBTI 人格探索 - ' + new Date().toLocaleDateString(), 40, 860)

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
  },

  goCharts() { wx.navigateTo({ url: '/pages/charts/charts' }) },
  goHome() { wx.navigateTo({ url: '/pages/index/index' }) },
})
