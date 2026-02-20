/**
 * 本地存储键与读写封装
 * 用户档案、测试进度、测试历史、情境记录
 */

const KEYS = {
  USER_PROFILE: 'mbti_user_profile',
  TEST_PROGRESS: 'mbti_test_progress',
  TEST_HISTORY: 'mbti_test_history',
  DAILY_RECORDS: 'mbti_daily_records',
  SETTINGS: 'mbti_settings',
}

/**
 * 生成本地唯一 ID（无后端时模拟 openid）
 */
function generateOpenId() {
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 10)
  return 'local_' + t + '_' + r
}

/**
 * 用户档案
 * @typedef {Object} UserProfile
 * @property {string} openid
 * @property {string} nickName
 * @property {string} avatarUrl
 * @property {string} [mbtiType]
 * @property {number} createdAt
 */

function getUserProfile() {
  return wx.getStorageSync(KEYS.USER_PROFILE) || null
}

function setUserProfile(profile) {
  wx.setStorageSync(KEYS.USER_PROFILE, profile)
}

function createUserProfile(nickName, avatarUrl) {
  const openid = generateOpenId()
  const profile = {
    openid,
    nickName: nickName || 'MBTI探索者',
    avatarUrl: avatarUrl || '',
    mbtiType: '',
    createdAt: Date.now(),
  }
  setUserProfile(profile)
  return profile
}

/**
 * 测试进度（未提交的答题）
 */
function getTestProgress() {
  return wx.getStorageSync(KEYS.TEST_PROGRESS) || null
}

function setTestProgress(progress) {
  wx.setStorageSync(KEYS.TEST_PROGRESS, progress)
}

function clearTestProgress() {
  wx.removeStorageSync(KEYS.TEST_PROGRESS)
}

/**
 * 测试历史（每次提交一条）
 */
function getTestHistory() {
  return wx.getStorageSync(KEYS.TEST_HISTORY) || []
}

function addTestHistory(record) {
  const list = getTestHistory()
  list.unshift({
    ...record,
    id: 't_' + Date.now(),
    createdAt: Date.now(),
  })
  wx.setStorageSync(KEYS.TEST_HISTORY, list.slice(0, 50))
}

/**
 * 情境记录
 */
function getDailyRecords() {
  return wx.getStorageSync(KEYS.DAILY_RECORDS) || []
}

function addDailyRecord(record) {
  const list = getDailyRecords()
  list.unshift({
    ...record,
    id: 'r_' + Date.now(),
    createdAt: Date.now(),
  })
  wx.setStorageSync(KEYS.DAILY_RECORDS, list)
}

function setDailyRecords(list) {
  wx.setStorageSync(KEYS.DAILY_RECORDS, list)
}

/**
 * 设置（通知、隐私等）
 */
function getSettings() {
  return wx.getStorageSync(KEYS.SETTINGS) || { notify: true, privacy: true }
}

function setSettings(settings) {
  wx.setStorageSync(KEYS.SETTINGS, { ...getSettings(), ...settings })
}

module.exports = {
  KEYS,
  generateOpenId,
  getUserProfile,
  setUserProfile,
  createUserProfile,
  getTestProgress,
  setTestProgress,
  clearTestProgress,
  getTestHistory,
  addTestHistory,
  getDailyRecords,
  addDailyRecord,
  setDailyRecords,
  getSettings,
  setSettings,
}
