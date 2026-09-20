/**
 * CardioOrigin - 心電図波形レンダラー (SVG Generator)
 * リアルな医療用ECGグリッドとQRS-T波形パスを生成
 */

export function generateEcgSvg(leadName, pattern = 'R', amplitude = 1.0, isSelected = false) {
  const width = 120;
  const height = 80;
  const baseline = 45; // 基線 Y座標
  const scaleY = 16; // 1mV あたりのピクセル高

  // QRS波形の幾何パスデータ定義
  let qrsPath = '';

  switch (pattern) {
    case 'R': // 高い単相性R波
      const rPeak = baseline - (scaleY * 2.2 * amplitude);
      qrsPath = `M 15 ${baseline} L 40 ${baseline} L 48 ${baseline + 2} L 55 ${rPeak} L 62 ${baseline + 4} L 68 ${baseline} L 85 ${baseline - 4} L 95 ${baseline} L 115 ${baseline}`;
      break;

    case 'Rs': // R波優位 + 小さなs波
      const rsR = baseline - (scaleY * 1.8 * Math.abs(amplitude));
      const rsS = baseline + (scaleY * 0.6);
      qrsPath = `M 15 ${baseline} L 40 ${baseline} L 48 ${baseline + 1} L 54 ${rsR} L 60 ${rsS} L 66 ${baseline} L 84 ${baseline - 3} L 95 ${baseline} L 115 ${baseline}`;
      break;

    case 'rS': // 小さなr波 + 深いS波
      const srR = baseline - (scaleY * 0.5);
      const srS = baseline + (scaleY * 2.0 * Math.abs(amplitude));
      qrsPath = `M 15 ${baseline} L 42 ${baseline} L 48 ${srR} L 54 ${baseline} L 60 ${srS} L 68 ${baseline} L 86 ${baseline - 5} L 96 ${baseline} L 115 ${baseline}`;
      break;

    case 'QS': // 単相性深いQS波
      const qsBottom = baseline + (scaleY * 2.2 * Math.abs(amplitude));
      qrsPath = `M 15 ${baseline} L 42 ${baseline} L 48 ${baseline - 1} L 58 ${qsBottom} L 68 ${baseline} L 84 ${baseline - 4} L 96 ${baseline} L 115 ${baseline}`;
      break;

    case 'qR': // 小さなq波 + 高いR波
      const qrQ = baseline + (scaleY * 0.4);
      const qrR = baseline - (scaleY * 2.0 * Math.abs(amplitude));
      qrsPath = `M 15 ${baseline} L 42 ${baseline} L 46 ${qrQ} L 55 ${qrR} L 64 ${baseline + 2} L 68 ${baseline} L 85 ${baseline - 3} L 96 ${baseline} L 115 ${baseline}`;
      break;

    case 'rsR': // 右脚ブロック型 (うさぎの耳)
      const r1 = baseline - (scaleY * 0.7);
      const s1 = baseline + (scaleY * 0.5);
      const r2 = baseline - (scaleY * 1.9 * Math.abs(amplitude));
      qrsPath = `M 15 ${baseline} L 40 ${baseline} L 45 ${r1} L 50 ${s1} L 58 ${r2} L 66 ${baseline + 2} L 70 ${baseline} L 85 ${baseline - 4} L 96 ${baseline} L 115 ${baseline}`;
      break;

    case 'Notched_R': // ノッチを伴う幅広いR波
      const nPeak1 = baseline - (scaleY * 1.8 * Math.abs(amplitude));
      const nNotch = baseline - (scaleY * 1.4 * Math.abs(amplitude));
      const nPeak2 = baseline - (scaleY * 2.0 * Math.abs(amplitude));
      qrsPath = `M 15 ${baseline} L 36 ${baseline} L 46 ${nPeak1} L 50 ${nNotch} L 56 ${nPeak2} L 66 ${baseline + 3} L 72 ${baseline} L 88 ${baseline - 4} L 98 ${baseline} L 115 ${baseline}`;
      break;

    default:
      qrsPath = `M 15 ${baseline} L 45 ${baseline} L 55 ${baseline - 25} L 65 ${baseline + 10} L 70 ${baseline} L 88 ${baseline - 5} L 98 ${baseline} L 115 ${baseline}`;
      break;
  }

  // グリッド線の生成（5mm大マス、1mm小マス）
  return `
    <svg class="ecg-lead-svg ${isSelected ? 'selected' : ''}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ecg-small-grid" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(20, 184, 166, 0.08)" stroke-width="0.5"/>
        </pattern>
        <pattern id="ecg-large-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="url(#ecg-small-grid)"/>
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(20, 184, 166, 0.18)" stroke-width="0.9"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="#0a101d" />
      <rect width="${width}" height="${height}" fill="url(#ecg-large-grid)" />
      
      <!-- 基線ガイドライン -->
      <line x1="0" y1="${baseline}" x2="${width}" y2="${baseline}" stroke="rgba(56, 189, 248, 0.2)" stroke-dasharray="2 2" stroke-width="0.6"/>

      <!-- ECG波形パス -->
      <path d="${qrsPath}" fill="none" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="ecg-wave-path" />

      <!-- 誘導ラベル -->
      <text x="8" y="18" fill="#38bdf8" font-family="'Plus Jakarta Sans', monospace, sans-serif" font-size="11" font-weight="700" letter-spacing="0.5">${leadName}</text>
      <!-- パターンタグ -->
      <text x="${width - 8}" y="18" text-anchor="end" fill="#94a3b8" font-family="sans-serif" font-size="9" font-weight="600">${pattern}</text>
    </svg>
  `;
}
