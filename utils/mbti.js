/**
 * MBTI 计分与类型计算
 * 答案格式：{ questionId: 'A'|'B' }，A 对应题目 textA 的维度侧，B 对应 textB
 * 题目中 side 表示选「第一项」时的倾向；选第二项则为另一侧
 */

const DIMENSIONS = [
  { key: 'EI', left: 'E', right: 'I' },
  { key: 'SN', left: 'S', right: 'N' },
  { key: 'TF', left: 'T', right: 'F' },
  { key: 'JP', left: 'J', right: 'P' },
]

/**
 * 根据题目列表和答案计算各维度得分（每侧 0-12）
 * @param {Array} questions - 题目列表，每题含 id, dimension, side
 * @param {Object} answers - { [questionId]: 'A' | 'B' }
 * @returns {Object} - { EI: { E: number, I: number }, ... }
 */
function scoreAnswers(questions, answers) {
  const counts = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  }
  for (const q of questions) {
    const choice = answers[q.id]
    if (choice !== 'A' && choice !== 'B') continue
    const dim = q.dimension
    const side = q.side
    if (choice === 'A') {
      counts[dim][side] = (counts[dim][side] || 0) + 1
    } else {
      const other = dim === 'EI' ? (side === 'E' ? 'I' : 'E') :
        dim === 'SN' ? (side === 'S' ? 'N' : 'S') :
          dim === 'TF' ? (side === 'T' ? 'F' : 'T') : (side === 'J' ? 'P' : 'J')
      counts[dim][other] = (counts[dim][other] || 0) + 1
    }
  }
  return counts
}

/**
 * 根据计分得到四字母类型（每维度 >6 取该侧，否则取另一侧）
 */
function getTypeFromScores(scores) {
  let type = ''
  for (const { key, left, right } of DIMENSIONS) {
    const L = scores[key][left] || 0
    const R = scores[key][right] || 0
    type += L > 6 ? left : (R > 6 ? right : left)
  }
  return type
}

/**
 * 各维度 0-12 的得分，用于雷达图（归一化到 0-1 或 0-12 均可）
 * 返回 [E, S, T, J] 对应四条轴（取「第一字母」侧得分）
 */
function getRadarScores(scores) {
  return [
    scores.EI.E || 0,
    scores.SN.S || 0,
    scores.TF.T || 0,
    scores.JP.J || 0,
  ]
}

/**
 * 各维度「倾向侧」得分（用于趋势图等）
 * 返回 { EI: number(0-12), SN: number, TF: number, JP: number }，值为「左侧」得分
 */
function getDimensionScoresForCharts(scores) {
  return {
    EI: scores.EI.E || 0,
    SN: scores.SN.S || 0,
    TF: scores.TF.T || 0,
    JP: scores.JP.J || 0,
  }
}

module.exports = {
  DIMENSIONS,
  scoreAnswers,
  getTypeFromScores,
  getRadarScores,
  getDimensionScoresForCharts,
}
