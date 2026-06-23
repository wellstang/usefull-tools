/** 文本统计工具函数 — 被文本统计分析器（运营）和文本统计（生活）共享 */

export function countChars(text) {
  return {
    total: text.length,
    noSpace: text.replace(/\s/g, '').length,
  }
}

export function countChinese(text) {
  return (text.match(/[\u4e00-\u9fa5]/g) || []).length
}

export function countWords(text) {
  const en = (text.match(/\b[a-zA-Z']+\b/g) || []).length
  const zh = countChinese(text)
  return { en, zh, total: en + zh }
}

export function countLines(text) {
  if (!text) return 0
  return text.split('\n').length
}

export function countParagraphs(text) {
  if (!text.trim()) return 0
  return text.split(/\n\s*\n/).filter(p => p.trim()).length || 1
}

/** 返回出现频率最高的 N 个词 */
export function getKeywordFrequency(text, n = 10) {
  const words = text
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1)

  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }))
}
