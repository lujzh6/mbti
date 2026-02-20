// pages/test/test.js - MBTI 48 题测试
const { getAllQuestionsShuffled } = require('../../data/questions.js')
const storage = require('../../utils/storage.js')
const mbtiUtil = require('../../utils/mbti.js')

Page({
  data: {
    questions: [],
    currentIndex: 0,
    answers: {},
    progress: 0,
    startTime: 0,
    questionTimes: {}, // 每题开始时间，用于统计答题时间
  },

  onLoad() {
    let progress = storage.getTestProgress()
    if (progress && progress.questions && progress.questions.length > 0) {
      this.setData({
        questions: progress.questions,
        currentIndex: progress.currentIndex,
        answers: progress.answers || {},
        startTime: progress.startTime || Date.now(),
        questionTimes: progress.questionTimes || {},
      })
      this.updateProgress()
      return
    }
    const questions = getAllQuestionsShuffled()
    this.setData({
      questions,
      currentIndex: 0,
      answers: {},
      startTime: Date.now(),
      questionTimes: { [questions[0].id]: Date.now() },
    })
    this.updateProgress()
  },

  onUnload() {
    this.saveProgress()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  onHide() {
    this.saveProgress()
  },

  updateProgress() {
    const total = this.data.questions.length
    const done = Object.keys(this.data.answers).length
    const progress = total ? Math.round((done / total) * 100) : 0
    this.setData({ progress })
  },

  saveProgress() {
    const { questions, currentIndex, answers, startTime, questionTimes } = this.data
    if (!questions || questions.length === 0) return
    storage.setTestProgress({
      questions,
      currentIndex,
      answers,
      startTime,
      questionTimes: questionTimes || {},
    })
  },

  choose(e) {
    const id = e.currentTarget.dataset.id
    const choice = e.currentTarget.dataset.choice
    const answers = { ...this.data.answers, [id]: choice }
    const questionTimes = { ...this.data.questionTimes }
    const now = Date.now()
    questionTimes[id] = questionTimes[id] || now

    let nextIndex = this.data.currentIndex + 1
    if (nextIndex >= this.data.questions.length) {
      nextIndex = this.data.questions.length - 1
    }
    const nextQ = this.data.questions[nextIndex]
    if (nextQ) questionTimes[nextQ.id] = now

    this.setData({
      answers,
      currentIndex: nextIndex,
      questionTimes,
    })
    this.updateProgress()

    if (Object.keys(answers).length >= this.data.questions.length) {
      this.submit(answers)
    }
  },

  prev() {
    if (this.data.currentIndex <= 0) return
    this.setData({ currentIndex: this.data.currentIndex - 1 })
  },

  next() {
    if (this.data.currentIndex >= this.data.questions.length - 1) return
    this.setData({ currentIndex: this.data.currentIndex + 1 })
  },

  submit(answers) {
    const ans = answers || this.data.answers
    if (Object.keys(ans).length < this.data.questions.length) {
      wx.showToast({ title: '请完成全部题目', icon: 'none' })
      return
    }
    const scores = mbtiUtil.scoreAnswers(this.data.questions, ans)
    const type = mbtiUtil.getTypeFromScores(scores)
    const radar = mbtiUtil.getRadarScores(scores)
    const dimensionScores = mbtiUtil.getDimensionScoresForCharts(scores)
    const totalTime = Math.round((Date.now() - this.data.startTime) / 1000)

    storage.clearTestProgress()
    storage.addTestHistory({
      type,
      scores: dimensionScores,
      radar,
      totalTime,
      questionTimes: this.data.questionTimes,
    })
    const profile = storage.getUserProfile()
    if (profile) {
      profile.mbtiType = type
      storage.setUserProfile(profile)
    }
    wx.redirectTo({
      url: '/pages/result/result?type=' + type + '&from=test',
    })
  },

  submitManual() {
    this.submit(this.data.answers)
  },
})
