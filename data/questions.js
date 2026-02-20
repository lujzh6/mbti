/**
 * MBTI 48 题精简版 - 本土化表述，二选一强制选择
 * 每题格式：{ id, dimension, side, textA, textB }
 * dimension: 'EI'|'SN'|'TF'|'JP', side: 'L'|'R' 表示选 A 得 L 侧、选 B 得 R 侧（E/I 等）
 */
const EI = [
  { id: 'EI1', dimension: 'EI', side: 'E', icon: '🎉', textA: '周末我更愿意约朋友出门玩', textB: '周末我更愿意在家休息或独自做喜欢的事' },
  { id: 'EI2', dimension: 'EI', side: 'I', icon: '💬', textA: '聚会时我常主动找很多人聊天', textB: '聚会时我更喜欢和少数几个人深聊' },
  { id: 'EI3', dimension: 'EI', side: 'E', icon: '⚡', textA: '与人相处一整天后我通常还有劲', textB: '与人相处一整天后我常需要独处恢复精力' },
  { id: 'EI4', dimension: 'EI', side: 'I', icon: '🤔', textA: '我习惯先想清楚再开口', textB: '我习惯边说话边理清思路' },
  { id: 'EI5', dimension: 'EI', side: 'E', icon: '👋', textA: '认识新朋友让我觉得兴奋', textB: '认识新朋友让我有点累，需要适应' },
  { id: 'EI6', dimension: 'EI', side: 'I', icon: '📚', textA: '我更喜欢一个人安静地做事', textB: '我更喜欢有人一起做事、有互动' },
  { id: 'EI7', dimension: 'EI', side: 'E', icon: '🗣️', textA: '憋着不说会让我难受，想赶紧找人说说', textB: '很多事我更愿意自己消化，不必都说出来' },
  { id: 'EI8', dimension: 'EI', side: 'I', icon: '💡', textA: '独处时我更容易专注、有灵感', textB: '和大家一起时我更容易来劲、有灵感' },
  { id: 'EI9', dimension: 'EI', side: 'E', icon: '🎊', textA: '我朋友不少，喜欢热闹', textB: '我朋友不多但关系很深' },
  { id: 'EI10', dimension: 'EI', side: 'I', icon: '🧘', textA: '长时间没人打扰我会很自在', textB: '长时间没人交流我会有点闷' },
  { id: 'EI11', dimension: 'EI', side: 'E', icon: '✋', textA: '开会时我经常主动发言', textB: '开会时我多数在听，想好再说' },
  { id: 'EI12', dimension: 'EI', side: 'I', icon: '📝', textA: '做事前我更喜欢先独自理清步骤', textB: '做事前我更喜欢先和人讨论一下' },
]

const SN = [
  { id: 'SN1', dimension: 'SN', side: 'S', icon: '👁️', textA: '我更相信眼前看到的、能验证的事实', textB: '我更关注背后的规律和可能性' },
  { id: 'SN2', dimension: 'SN', side: 'N', icon: '🔮', textA: '做决定时我更依赖具体经验和例子', textB: '做决定时我更依赖直觉和整体感觉' },
  { id: 'SN3', dimension: 'SN', side: 'S', icon: '📋', textA: '我更喜欢步骤清晰、可执行性强的计划', textB: '我更喜欢有想象空间、可灵活调整的方向' },
  { id: 'SN4', dimension: 'SN', side: 'N', icon: '🔍', textA: '聊天时我常会注意到细节（比如对方穿着、环境）', textB: '聊天时我常会联想到含义、动机、未来' },
  { id: 'SN5', dimension: 'SN', side: 'S', icon: '📖', textA: '学东西时一步步来、多练几遍我更踏实', textB: '学东西时先搞懂整体框架我更顺' },
  { id: 'SN6', dimension: 'SN', side: 'N', icon: '🚀', textA: '我更在意「现在能做成什么样」', textB: '我更在意「以后能变成什么样」' },
  { id: 'SN7', dimension: 'SN', side: 'S', icon: '⏰', textA: '描述事情时我习惯按时间、顺序说', textB: '描述事情时我习惯先讲重点、再补细节' },
  { id: 'SN8', dimension: 'SN', side: 'N', icon: '✨', textA: '别人说我「想得比较实际」', textB: '别人说我「想法比较天马行空」' },
  { id: 'SN9', dimension: 'SN', side: 'S', icon: '📊', textA: '我更喜欢明确、可量化的目标', textB: '我更喜欢有弹性、可发挥的空间' },
  { id: 'SN10', dimension: 'SN', side: 'N', icon: '💭', textA: '回忆过去时，具体画面和细节更清晰', textB: '回忆过去时，当时的感受和意义更清晰' },
  { id: 'SN11', dimension: 'SN', side: 'S', icon: '🔧', textA: '我更擅长把现有资源用好、落实执行', textB: '我更擅长想新点子、找新可能' },
  { id: 'SN12', dimension: 'SN', side: 'N', icon: '🎨', textA: '我做事偏「先做起来再调整」', textB: '我做事偏「先想清楚再动手」' },
]

const TF = [
  { id: 'TF1', dimension: 'TF', side: 'T', icon: '⚖️', textA: '做决定时，对错和逻辑更重要', textB: '做决定时，对大家感受的影响更重要' },
  { id: 'TF2', dimension: 'TF', side: 'F', icon: '💚', textA: '争论时我更在意把道理讲清楚', textB: '争论时我更在意别伤和气、照顾感受' },
  { id: 'TF3', dimension: 'TF', side: 'T', icon: '🧠', textA: '别人说我「比较讲理、客观」', textB: '别人说我「比较体贴、重感情」' },
  { id: 'TF4', dimension: 'TF', side: 'F', icon: '🤗', textA: '批评别人时我会直接指出问题', textB: '批评别人时我会先考虑对方能不能接受' },
  { id: 'TF5', dimension: 'TF', side: 'T', icon: '📈', textA: '团队里我更看重效率、结果', textB: '团队里我更看重氛围、大家是否开心' },
  { id: 'TF6', dimension: 'TF', side: 'F', icon: '💝', textA: '选工作时，发展空间和待遇优先', textB: '选工作时，价值观和意义感优先' },
  { id: 'TF7', dimension: 'TF', side: 'T', icon: '🔬', textA: '遇到矛盾我习惯分析原因、找解决办法', textB: '遇到矛盾我习惯先安抚情绪、再谈事情' },
  { id: 'TF8', dimension: 'TF', side: 'F', icon: '💔', textA: '我很少因为别人一句话难受很久', textB: '别人一句重话可能会影响我很久' },
  { id: 'TF9', dimension: 'TF', side: 'T', icon: '📐', textA: '评价一件事时，我更看逻辑是否成立', textB: '评价一件事时，我更看是否合乎人情' },
  { id: 'TF10', dimension: 'TF', side: 'F', icon: '🤝', textA: '我做事时不太容易被人情左右', textB: '我做事时经常要考虑关系和人缘' },
  { id: 'TF11', dimension: 'TF', side: 'T', icon: '📢', textA: '讲真话比照顾情绪更重要', textB: '有些场合需要先照顾情绪再谈真话' },
  { id: 'TF12', dimension: 'TF', side: 'F', icon: '💕', textA: '我更喜欢「对事不对人」的讨论', textB: '我总觉得事和人分不开，会一起考虑' },
]

const JP = [
  { id: 'JP1', dimension: 'JP', side: 'J', icon: '📅', textA: '我习惯提前列好计划再行动', textB: '我习惯边做边看、随时调整' },
  { id: 'JP2', dimension: 'JP', side: 'P', icon: '⏳', textA: '截止日期能让我更专注', textB: '截止日期常让我感到压力、想拖' },
  { id: 'JP3', dimension: 'JP', side: 'J', icon: '🎒', textA: '出门前我会想好要带什么、先做什么', textB: '出门前我经常临时决定、说走就走' },
  { id: 'JP4', dimension: 'JP', side: 'P', icon: '🎲', textA: '我更喜欢日程清晰、有条理', textB: '我更喜欢保留弹性、随机应变' },
  { id: 'JP5', dimension: 'JP', side: 'J', icon: '✅', textA: '事情做完、打勾清掉会让我很满足', textB: '事情一直有新变化会让我更有劲' },
  { id: 'JP6', dimension: 'JP', side: 'P', icon: '🎪', textA: '别人说我「很有计划、靠谱」', textB: '别人说我「很灵活、点子多」' },
  { id: 'JP7', dimension: 'JP', side: 'J', icon: '⏰', textA: '我倾向于早做准备，避免最后一刻赶', textB: '我倾向于在截止前效率最高' },
  { id: 'JP8', dimension: 'JP', side: 'P', icon: '🔄', textA: '做决定时我比较快，定了就执行', textB: '做决定时我常想多留几个选项' },
  { id: 'JP9', dimension: 'JP', side: 'J', icon: '📦', textA: '书桌/桌面整齐让我更安心', textB: '书桌/桌面乱一点我也可以接受' },
  { id: 'JP10', dimension: 'JP', side: 'P', icon: '🌈', textA: '我更喜欢「按流程来」', textB: '我更喜欢「看情况来」' },
  { id: 'JP11', dimension: 'JP', side: 'J', icon: '🗓️', textA: '周末我也喜欢大致有个安排', textB: '周末我更想完全放松、不排计划' },
  { id: 'JP12', dimension: 'JP', side: 'P', icon: '🎯', textA: '目标定下来我就想一步步完成', textB: '目标可以随着进行中再调整' },
]

/**
 * 合并所有题目并打乱顺序（避免模式化作答）
 */
function getAllQuestionsShuffled() {
  const all = [...EI, ...SN, ...TF, ...JP]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

module.exports = {
  EI,
  SN,
  TF,
  JP,
  getAllQuestionsShuffled,
}
