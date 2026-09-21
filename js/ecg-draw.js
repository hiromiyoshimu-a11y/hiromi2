/**
 * CardioOrigin - 心電図波形レンダラー (SVG Generator)
 * リアルな医療用ECGグリッドとQRS-T波形パスを生成（枠外見切れ防止・完全オートフィット仕様）
 */

export function generateEcgSvg(leadName, pattern = 'R', amplitude = 1.0, isSelected = false, showLabels = true, gain = 1.0, leadAngle = '') {
  const width = 150;
  const height = 96;
  // ラベル表示時は上部テキスト領域を避けてY=56、非表示時(マトリックス)は完全中央Y=48
  const baseline = showLabels ? 56 : 48;

  // 感度倍率 (標準: 1.0, 拡大: 1.5, 倍感度: 2.0, 半感度: 0.5)
  const currentGain = (typeof gain === 'number' && gain > 0) ? gain : 1.0;
  const rawAmp = Math.abs(amplitude) || 1.0;
  const effectiveAmp = rawAmp * currentGain;

  // 上方向の安全限界（showLabels時はY=19まで、非表示時はY=8まで）
  const maxUp = showLabels ? 37 : 40;
  // 下方向の安全限界（下端Y=90まで）
  const maxDown = showLabels ? 34 : 40;

  // 臨床的に自然な波高計算関数（基準: 1.0mVで約21px、高電位2.0mVで約32px、上限付近で滑らかにソフトサチュレーション）
  const calcHeight = (factor, maxLimit) => {
    // ターゲット電位高
    const target = factor * (effectiveAmp * 19.5 + 2.5);
    // 代数型ソフトサチュレーション（枠を超えない滑らかなクランプ）
    const sat = (maxLimit * target) / (maxLimit * 0.82 + target * 0.45);
    return Math.max(7, Math.min(maxLimit, sat));
  };

  const getH_up = (factor = 1.0) => calcHeight(factor, maxUp);
  const getH_down = (factor = 1.0) => calcHeight(factor, maxDown);

  // QRS波形の幾何パスデータ定義
  let qrsPath = '';

  switch (pattern) {
    case 'R': { // 高い単相性R波
      const rPeak = baseline - getH_up(1.12);
      qrsPath = `M 12 ${baseline} L 44 ${baseline} L 53 ${baseline + 2} L 62 ${rPeak} L 71 ${baseline + 3} L 78 ${baseline} L 98 ${baseline - 4} L 112 ${baseline} L 138 ${baseline}`;
      break;
    }

    case 'Rs': { // R波優位 + 小さなs波
      const rsR = baseline - getH_up(1.0);
      const rsS = baseline + Math.min(16, getH_down(0.35));
      qrsPath = `M 12 ${baseline} L 44 ${baseline} L 53 ${baseline + 1} L 61 ${rsR} L 69 ${rsS} L 76 ${baseline} L 98 ${baseline - 4} L 112 ${baseline} L 138 ${baseline}`;
      break;
    }

    case 'rS': { // 小さなr波 + 深いS波
      const srR = baseline - Math.min(10, getH_up(0.35));
      const srS = baseline + getH_down(1.05);
      qrsPath = `M 12 ${baseline} L 46 ${baseline} L 52 ${srR} L 59 ${baseline} L 68 ${srS} L 76 ${baseline} L 98 ${baseline - 4} L 112 ${baseline} L 138 ${baseline}`;
      break;
    }

    case 'QS': { // 単相性深いQS波
      const qsBottom = baseline + getH_down(1.1);
      qrsPath = `M 12 ${baseline} L 46 ${baseline} L 52 ${baseline - 1} L 64 ${qsBottom} L 75 ${baseline} L 96 ${baseline - 4} L 110 ${baseline} L 138 ${baseline}`;
      break;
    }

    case 'qR': { // 小さなq波 + 高いR波
      const qrQ = baseline + Math.min(8, getH_down(0.3));
      const qrR = baseline - getH_up(1.08);
      qrsPath = `M 12 ${baseline} L 46 ${baseline} L 51 ${qrQ} L 61 ${qrR} L 70 ${baseline + 2} L 76 ${baseline} L 98 ${baseline - 4} L 112 ${baseline} L 138 ${baseline}`;
      break;
    }

    case 'rsR': { // 右脚ブロック型 (うさぎの耳 / 二峰性)
      const r1 = baseline - Math.min(16, getH_up(0.55));
      const s1 = baseline + Math.min(9, getH_down(0.3));
      const r2 = baseline - getH_up(1.05);
      qrsPath = `M 12 ${baseline} L 44 ${baseline} L 50 ${r1} L 56 ${s1} L 64 ${r2} L 72 ${baseline + 2} L 78 ${baseline} L 98 ${baseline - 4} L 112 ${baseline} L 138 ${baseline}`;
      break;
    }

    case 'Notched_R': { // ノッチを伴う幅広いR波
      const nPeak1 = baseline - getH_up(0.92);
      const nNotch = baseline - getH_up(0.68);
      const nPeak2 = baseline - getH_up(1.05);
      qrsPath = `M 12 ${baseline} L 40 ${baseline} L 51 ${nPeak1} L 57 ${nNotch} L 63 ${nPeak2} L 73 ${baseline + 3} L 79 ${baseline} L 99 ${baseline - 4} L 113 ${baseline} L 138 ${baseline}`;
      break;
    }

    default:
      qrsPath = `M 12 ${baseline} L 50 ${baseline} L 61 ${baseline - 22} L 72 ${baseline + 10} L 78 ${baseline} L 98 ${baseline - 4} L 112 ${baseline} L 138 ${baseline}`;
      break;
  }

  // 医療用心電図方眼紙グリッド（5mm大マス、1mm小マス）
  return `
    <svg class="ecg-lead-svg ${isSelected ? 'selected' : ''}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="ecg-small-grid" width="7.5" height="7.5" patternUnits="userSpaceOnUse">
          <path d="M 7.5 0 L 0 0 0 7.5" fill="none" stroke="rgba(20, 184, 166, 0.08)" stroke-width="0.5"/>
        </pattern>
        <pattern id="ecg-large-grid" width="37.5" height="37.5" patternUnits="userSpaceOnUse">
          <rect width="37.5" height="37.5" fill="url(#ecg-small-grid)"/>
          <path d="M 37.5 0 L 0 0 0 37.5" fill="none" stroke="rgba(20, 184, 166, 0.18)" stroke-width="0.9"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="#080e1a" />
      <rect width="${width}" height="${height}" fill="url(#ecg-large-grid)" />
      
      <!-- 基線ガイドライン -->
      <line x1="0" y1="${baseline}" x2="${width}" y2="${baseline}" stroke="rgba(56, 189, 248, 0.22)" stroke-dasharray="2 2" stroke-width="0.6"/>

      <!-- ECG波形パス（エメラルドグリーン） -->
      <path d="${qrsPath}" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="ecg-wave-path" />

      ${showLabels ? `
        <!-- 誘導ラベル (左上) -->
        <text x="8" y="16" fill="#38bdf8" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="11" font-weight="800" letter-spacing="0.3">${leadName}${leadAngle ? ` <tspan font-size="8.5" fill="#38bdf8" opacity="0.75" font-weight="600">${leadAngle}</tspan>` : ''}</text>
        <!-- パターンタグ (右上) -->
        <text x="${width - 8}" y="16" text-anchor="end" fill="#94a3b8" font-family="-apple-system, sans-serif" font-size="9" font-weight="600">${pattern}</text>
      ` : ''}
    </svg>
  `;
}
