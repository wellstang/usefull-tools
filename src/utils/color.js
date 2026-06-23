/** 颜色工具函数 — 被颜色格式转换、配色方案生成器、图片取色器共享 */

export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

export function rgbToHsb(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return { h, s: Math.round(max === 0 ? 0 : (d / max) * 100), b: Math.round(max * 100) }
}

/** 从主色生成 10 级色阶（50~950） */
export function generatePalette(hex) {
  const { h, s } = rgbToHsl(...Object.values(hexToRgb(hex)))
  const stops = [97, 93, 86, 75, 62, 50, 40, 32, 24, 16]
  return stops.map((l, i) => {
    const { r, g, b } = hslToRgb(h, Math.min(s, 90), l)
    return { label: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900][i], hex: rgbToHex(r, g, b) }
  })
}

/** 从 Canvas ImageData 提取主色（简化中位切割） */
export function extractColors(imageData, count = 8) {
  const data = imageData.data
  const pixels = []
  for (let i = 0; i < data.length; i += 4 * 10) {
    if (data[i + 3] < 128) continue
    pixels.push([data[i], data[i + 1], data[i + 2]])
  }
  if (pixels.length === 0) return []

  // 简单量化：将颜色映射到 6 位精度桶
  const buckets = {}
  pixels.forEach(([r, g, b]) => {
    const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`
    buckets[key] = (buckets[key] || 0) + 1
  })

  return Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number)
      return rgbToHex(r, g, b)
    })
}
