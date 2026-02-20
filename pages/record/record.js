// pages/record/record.js - 情境记录（每日打卡）
const storage = require('../../utils/storage.js')

const SCENES = [
  { id: 'work', name: '工作' },
  { id: 'study', name: '学习' },
  { id: 'social', name: '社交' },
  { id: 'family', name: '家庭' },
  { id: 'alone', name: '独处' },
]

const TAGS = {
  energy: [
    { id: 'talk', name: '与人交流', dim: 'EI', side: 'E' },
    { id: 'think', name: '独自思考', dim: 'EI', side: 'I' },
  ],
  info: [
    { id: 'detail', name: '关注细节', dim: 'SN', side: 'S' },
    { id: 'whole', name: '关注整体', dim: 'SN', side: 'N' },
  ],
  decision: [
    { id: 'logic', name: '逻辑分析', dim: 'TF', side: 'T' },
    { id: 'feel', name: '情感考量', dim: 'TF', side: 'F' },
  ],
  life: [
    { id: 'plan', name: '计划有序', dim: 'JP', side: 'J' },
    { id: 'flex', name: '灵活随性', dim: 'JP', side: 'P' },
  ],
}

Page({
  data: {
    sceneIndex: 0,
    scene: '',
    mood: 5,
    selectedTags: [],
    reflect: '',
    scenes: SCENES,
    tagGroups: [
      { key: 'energy', title: '能量来源', tags: TAGS.energy },
      { key: 'info', title: '信息处理', tags: TAGS.info },
      { key: 'decision', title: '决策方式', tags: TAGS.decision },
      { key: 'life', title: '生活态度', tags: TAGS.life },
    ],
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onSceneChange(e) {
    const idx = parseInt(e.detail.value, 10)
    this.setData({ sceneIndex: idx, scene: SCENES[idx].id })
  },

  onSceneTap(e) {
    const idx = parseInt(e.currentTarget.dataset.index, 10)
    this.setData({ sceneIndex: idx, scene: SCENES[idx].id })
  },

  onMoodChange(e) {
    this.setData({ mood: parseInt(e.detail.value, 10) })
  },

  toggleTag(e) {
    const id = e.currentTarget.dataset.id
    let selected = this.data.selectedTags
    if (selected.indexOf(id) > -1) {
      selected = selected.filter((t) => t !== id)
    } else {
      selected = selected.concat(id)
    }
    this.setData({ selectedTags: selected })
  },

  onReflectInput(e) {
    this.setData({ reflect: e.detail.value })
  },

  submit() {
    const { sceneIndex, mood, selectedTags, reflect } = this.data
    const scene = SCENES[sceneIndex] ? SCENES[sceneIndex].id : ''
    if (!scene) {
      wx.showToast({ title: '请选择今日场景', icon: 'none' })
      return
    }
    const tagList = this.data.tagGroups.flatMap((g) => g.tags)
    const dimCounts = { EI: { E: 0, I: 0 }, SN: { S: 0, N: 0 }, TF: { T: 0, F: 0 }, JP: { J: 0, P: 0 } }
    selectedTags.forEach((tid) => {
      const t = tagList.find((x) => x.id === tid)
      if (t) dimCounts[t.dim][t.side]++
    })
    storage.addDailyRecord({
      scene,
      mood,
      tags: selectedTags,
      reflect: reflect.trim(),
      dimCounts,
      date: new Date().toDateString(),
    })
    wx.showToast({ title: '记录成功', icon: 'success' })
    this.setData({ sceneIndex: 0, scene: '', mood: 5, selectedTags: [], reflect: '' })
    setTimeout(() => wx.navigateTo({ url: '/pages/records/records' }), 800)
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/records/records' })
  },
})
