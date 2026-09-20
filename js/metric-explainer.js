/**
 * CardioOrigin - 精密鑑別指標の図解＆詳細解説モジュール
 * V2S/V3R比、V2 Transition Ratio、MDI、QRS幅・ノッチのSVG図解と臨床解説
 */

export const METRIC_EXPLANATIONS = {
  v2s_v3r: {
    id: 'v2s_v3r',
    title: 'V2S / V3R 振幅比 (V2S/V3R Index)',
    subtitle: '洞調律心電図が不要で、PVC単独で測定できる流出路（RVOT vs LVOT）鑑別の最重要指標',
    authorRef: 'Yoshida K, et al. Circulation. 2011',
    formula: 'V2S / V3R 比 = (PVCの V2 誘導 S波振幅 [mV]) ÷ (PVCの V3 誘導 R波振幅 [mV])',
    cutoffText: '比率 ≤ 1.5 ➔ LVOT 起源 / 比率 > 1.5 ➔ RVOT 起源',
    performance: '感度 89%、特異度 94%',
    svgDiagram: `
      <svg viewBox="0 0 540 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diag-grid-1" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <!-- 背景グリッド -->
        <rect width="540" height="220" fill="#080e1a" rx="10"/>
        <rect width="540" height="220" fill="url(#diag-grid-1)" rx="10"/>

        <!-- V2 誘導パネル -->
        <g transform="translate(30, 20)">
          <rect width="220" height="180" fill="#0f172a" stroke="rgba(56, 189, 248, 0.2)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">Lead V2 (S波の深さを測定)</text>
          
          <!-- 基線 -->
          <line x1="20" y1="80" x2="200" y2="80" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          
          <!-- 波形 (深いS波) -->
          <path d="M 20 80 L 60 80 L 70 65 L 85 160 L 105 80 L 130 90 L 160 80 L 200 80" 
                fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- S波振幅測定矢印 -->
          <line x1="120" y1="80" x2="120" y2="160" stroke="#f43f5e" stroke-width="2" marker-end="url(#arrow)"/>
          <path d="M 115 80 L 125 80 M 115 160 L 125 160" stroke="#f43f5e" stroke-width="2"/>
          <text x="132" y="125" fill="#f43f5e" font-size="12" font-weight="800">V2 S波振幅</text>
          <text x="132" y="142" fill="#94a3b8" font-size="10">(基線〜谷底)</text>
        </g>

        <!-- V3 誘導パネル -->
        <g transform="translate(290, 20)">
          <rect width="220" height="180" fill="#0f172a" stroke="rgba(56, 189, 248, 0.2)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">Lead V3 (R波の高さを測定)</text>
          
          <!-- 基線 -->
          <line x1="20" y1="130" x2="200" y2="130" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          
          <!-- 波形 (高いR波) -->
          <path d="M 20 130 L 60 130 L 75 40 L 95 145 L 115 130 L 145 120 L 170 130 L 200 130" 
                fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- R波振幅測定矢印 -->
          <line x1="125" y1="130" x2="125" y2="40" stroke="#38bdf8" stroke-width="2"/>
          <path d="M 120 130 L 130 130 M 120 40 L 130 40" stroke="#38bdf8" stroke-width="2"/>
          <text x="136" y="85" fill="#38bdf8" font-size="12" font-weight="800">V3 R波振幅</text>
          <text x="136" y="102" fill="#94a3b8" font-size="10">(基線〜頂点)</text>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜこの比率が有効なのか？（解剖学的メカニズム）',
        text: '解剖学的に左室流出路（LVOT）は大動脈弁直下にあり、右室流出路（RVOT）の「後方かつ右側寄り」に位置します。そのため、LVOTから興奮が発生すると、前胸部電極（V2, V3）に向かって早期に前向きの電気ベクトルが生じます。結果として、LVOT起源ではV2のS波が浅くなり、V3のR波が急激に高くなるため、S/R比は小さくなります（≤ 1.5）。逆にRVOT起源では興奮が電極から遠ざかるため、V2のS波が非常に深く、V3のR波立ち上がりが遅くなり、比率が大きくなります（> 1.5）。'
      },
      {
        title: '臨床現場での測定手順',
        text: '① PVC心電図のV2誘導で基線からS波の最下点までの振幅（mVまたはmm）を測定。\n② V3誘導で基線からR波の頂点までの振幅（mVまたはmm）を測定。\n③ V2のS振幅をV3のR振幅で割り算します。1.5以下なら左心系アプローチ（大動脈弁逆行性）の準備が推奨されます。'
      }
    ]
  },

  v2_ratio: {
    id: 'v2_ratio',
    title: 'V2 Transition Ratio (V2 移行比率)',
    subtitle: '胸部誘導の移行帯が「V3」にある境界例を完璧に鑑別する金科玉条の基準',
    authorRef: 'Betensky BP, et al. J Cardiovasc Electrophysiol. 2011',
    formula: 'V2 Transition Ratio = (PVC時の V2 R / [R+S]) ÷ (洞調律時の V2 R / [R+S])',
    cutoffText: '比率 ≥ 0.6 ➔ LVOT 起源 / 比率 < 0.6 ➔ RVOT 起源',
    performance: '感度 95%、特異度 100%（V3移行例において）',
    svgDiagram: `
      <svg viewBox="0 0 540 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="220" fill="#080e1a" rx="10"/>
        
        <!-- 洞調律 V2 -->
        <g transform="translate(30, 20)">
          <rect width="220" height="180" fill="#0f172a" stroke="rgba(255,255,255,0.1)" rx="8"/>
          <text x="14" y="24" fill="#94a3b8" font-size="12" font-weight="700">① 洞調律の V2 誘導 (SR)</text>
          
          <!-- 基線 -->
          <line x1="20" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          <!-- 洞調律 QRS (小r + 深いS) -->
          <path d="M 20 100 L 50 100 L 60 90 L 70 80 L 80 150 L 95 100 L 120 90 L 150 100 L 200 100" 
                fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
          
          <text x="110" y="70" fill="#94a3b8" font-size="11" font-weight="600">R波比率 = R/(R+S)</text>
          <text x="110" y="90" fill="#38bdf8" font-size="13" font-weight="800">分母: SR (例: 0.18)</text>
        </g>

        <!-- PVC V2 -->
        <g transform="translate(290, 20)">
          <rect width="220" height="180" fill="#0f172a" stroke="rgba(16, 185, 129, 0.3)" rx="8"/>
          <text x="14" y="24" fill="#34d399" font-size="12" font-weight="700">② PVC時の V2 誘導 (PVC)</text>
          
          <!-- 基線 -->
          <line x1="20" y1="110" x2="200" y2="110" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          <!-- PVC QRS (幅広R波 + S波) -->
          <path d="M 20 110 L 50 110 L 65 40 L 85 150 L 105 110 L 140 125 L 175 110 L 200 110" 
                fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linejoin="round"/>
          
          <text x="110" y="65" fill="#34d399" font-size="11" font-weight="600">R波比率 = R/(R+S)</text>
          <text x="110" y="85" fill="#10b981" font-size="13" font-weight="800">分子: PVC (例: 0.35)</text>
          <text x="110" y="145" fill="#fbbf24" font-size="11" font-weight="700">比 = 0.35/0.18 = 1.94 (≥0.6)</text>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜV2 Transition Ratioが必要なのか？',
        text: '流出路期外収縮の約25%は移行帯が「V3」に生じます。V1-V2ならLVOT、V4以降ならRVOTと断定できますが、V3移行例は形態だけでは誤診率が約30%に達します。Betenskyらは、患者固有の心臓回転（Clockwise / Counter-clockwise rotation）による影響をキャンセルするため、「洞調律時のV2波形」を標準化の基準として用いる手法を開発しました。'
      },
      {
        title: '臨床判定のポイント',
        text: 'PVC時のV2におけるR波比率が、洞調律時の60%以上（≥ 0.6）維持されていれば、左室流出路（LCC, RCC, LV Summit）起源であると極めて高い特異度（100%）で診断できます。'
      }
    ]
  },

  mdi: {
    id: 'mdi',
    title: 'MDI (Maximum Deflection Index / 最大偏位指数)',
    subtitle: '左室最上部・冠静脈洞近傍の「心外膜側 (LV Summit)」起源を同定する指標',
    authorRef: 'Daniels DV, et al. Heart Rhythm. 2009',
    formula: 'MDI = (QRS開始から最短の最大頂点までの時間 [ms]) ÷ (全体のQRS幅 [ms])',
    cutoffText: 'MDI ≥ 0.55 ➔ LV Summit / 心外膜側起源 / MDI < 0.55 ➔ 心内膜側起源',
    performance: '感度 91%、特異度 89%',
    svgDiagram: `
      <svg viewBox="0 0 540 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="220" fill="#080e1a" rx="10"/>
        
        <g transform="translate(40, 20)">
          <rect width="460" height="180" fill="#0f172a" stroke="rgba(245, 158, 11, 0.3)" rx="8"/>
          <text x="20" y="25" fill="#f59e0b" font-size="12" font-weight="700">心外膜起源特有の「立ち上がり鈍化 (Pseudo-delta波)」と MDI</text>

          <!-- 基線 -->
          <line x1="30" y1="130" x2="430" y2="130" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>

          <!-- 心外膜波形: 立ち上がりが非常にゆっくり (偽デルタ波) -->
          <path d="M 30 130 L 80 130 C 110 128, 140 115, 180 35 L 220 150 L 250 130 L 300 145 L 360 130 L 430 130" 
                fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>

          <!-- QRS onset 点 -->
          <circle cx="80" cy="130" r="4" fill="#38bdf8"/>
          <text x="50" y="150" fill="#38bdf8" font-size="10" font-weight="700">QRS Onset</text>

          <!-- Peak 点 -->
          <circle cx="180" cy="35" r="4" fill="#f43f5e"/>
          <text x="180" y="25" text-anchor="middle" fill="#f43f5e" font-size="11" font-weight="800">Peak (最大偏位点)</text>

          <!-- QRS Offset 点 -->
          <circle cx="250" cy="130" r="4" fill="#38bdf8"/>
          <text x="235" y="150" fill="#38bdf8" font-size="10" font-weight="700">QRS Offset</text>

          <!-- MDI区間矢印 -->
          <line x1="80" y1="165" x2="180" y2="165" stroke="#f43f5e" stroke-width="2"/>
          <path d="M 80 160 L 80 170 M 180 160 L 180 170" stroke="#f43f5e" stroke-width="2"/>
          <text x="130" y="180" text-anchor="middle" fill="#f43f5e" font-size="11" font-weight="700">Peak時間 (≥95ms)</text>

          <!-- 全体QRS幅矢印 -->
          <line x1="80" y1="105" x2="250" y2="105" stroke="#38bdf8" stroke-width="2"/>
          <path d="M 80 100 L 80 110 M 250 100 L 250 110" stroke="#38bdf8" stroke-width="2"/>
          <text x="165" y="100" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">全体QRS幅 (170ms)</text>

          <text x="280" y="65" fill="#fbbf24" font-size="13" font-weight="800">MDI = 95 / 170 = 0.56 (≥0.55)</text>
          <text x="280" y="85" fill="#94a3b8" font-size="10">➔ 心外膜側 (LV Summit) を強く示唆</text>
        </g>
      </svg>
    `,
    details: [
      {
        title: '心外膜起源で立ち上がりが遅くなる理由',
        text: '心臓の刺激伝導系（ヒス・プルキンエ線維網）はすべて「心内膜側」に張り巡らされています。心外膜側（LV Summitや冠静脈洞内）で発生した電気興奮は、伝導の遅い作業心筋層を心外膜から心内膜へゆっくり通過し、内膜側のプルキンエ網に到達して初めて両室へ急速に広がります。このため、初期興奮が極めて緩やか（Pseudo-delta波 ≥ 34ms）になり、最大ピークに達するまでの時間が全QRS幅の半分以上（MDI ≥ 0.55）を占めます。'
      },
      {
        title: 'カテーテルアブレーション時の重要性',
        text: 'MDI陽性例では通常の心内膜側通電では不成功となる可能性が高く、大心静脈（GCV/AIV）経由のマッピングや心外膜穿刺、あるいは冠動脈造影による前下行枝・回旋枝との距離評価が不可欠となります。'
      }
    ]
  },

  qrs_duration: {
    id: 'qrs_duration',
    title: 'QRS幅 (Duration) と ノッチ (Notching)',
    subtitle: '心筋伝播速度から中隔側 vs 自由壁側、特殊心筋（束枝）を判別する指標',
    authorRef: 'Tada H, et al. Circulation. 2005 / Good E, et al. 2008',
    formula: '12誘導心電図において最も早い開始点から最も遅い終了点までの時間 (ms)',
    cutoffText: 'シャープ (<130ms): プルキンエ束枝 / 中等度 (130-145ms): 中隔 / 幅広 (>150ms)+ノッチ: 自由壁・乳頭筋',
    performance: '自由壁鑑別特異度 88%',
    svgDiagram: `
      <svg viewBox="0 0 540 220" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="220" fill="#080e1a" rx="10"/>
        
        <!-- シャープ波形 (中隔/プルキンエ) -->
        <g transform="translate(30, 20)">
          <rect width="220" height="180" fill="#0f172a" stroke="rgba(56, 189, 248, 0.2)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">中隔側 / 束枝 (シャープ)</text>
          
          <line x1="20" y1="120" x2="200" y2="120" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          <!-- シャープな立ち上がり、ノッチなし -->
          <path d="M 20 120 L 70 120 L 90 40 L 110 140 L 125 120 L 155 110 L 200 120" 
                fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round"/>
          
          <text x="120" y="65" fill="#38bdf8" font-size="11" font-weight="700">QRS幅: 120-135ms</text>
          <text x="120" y="85" fill="#94a3b8" font-size="10">・立ち上がり急峻 (RS短)</text>
          <text x="120" y="100" fill="#94a3b8" font-size="10">・両室へ均等伝播</text>
        </g>

        <!-- 幅広・ノッチ波形 (自由壁/乳頭筋) -->
        <g transform="translate(290, 20)">
          <rect width="220" height="180" fill="#0f172a" stroke="rgba(244, 63, 94, 0.3)" rx="8"/>
          <text x="14" y="24" fill="#f43f5e" font-size="12" font-weight="700">自由壁 / 乳頭筋 (幅広＋ノッチ)</text>
          
          <line x1="20" y1="120" x2="200" y2="120" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          <!-- ノッチ付き幅広波形 -->
          <path d="M 20 120 L 55 120 L 75 60 L 85 75 L 105 35 L 135 150 L 155 120 L 200 120" 
                fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linejoin="round"/>
          
          <!-- ノッチ矢印 -->
          <line x1="90" y1="95" x2="85" y2="78" stroke="#fbbf24" stroke-width="1.8"/>
          <text x="95" y="105" fill="#fbbf24" font-size="10" font-weight="700">ノッチ (刻み目)</text>

          <text x="120" y="65" fill="#f43f5e" font-size="11" font-weight="700">QRS幅: >150-160ms</text>
          <text x="120" y="85" fill="#94a3b8" font-size="10">・伝播距離が長く遅延</text>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜ自由壁起源ではノッチが生じるのか？',
        text: '中隔側起源の興奮は左右両室の伝導系へほぼ同時に到達するため、短時間で興奮が完了します。一方、RVOT自由壁起源では、まず右室自由壁を興奮させた後、中隔を越えて左室全体を興奮させるまでに大きな時間差（非同期）が生じます。この右室興奮から左室興奮への移行部が下壁誘導において明瞭な「ノッチ（刻み目）」として現れます。'
      },
      {
        title: '心室壁の厚さと安全性への直結',
        text: 'RVOT中隔は筋肉が厚く安全に通電できますが、RVOT自由壁は紙のように薄い（2〜3mm）ため、幅広QRS＋ノッチを認めた場合は、カテーテル接触圧（コンタクトフォース）過剰による心穿孔・心タンポナーデを厳重に予防する必要があります。'
      }
    ]
  }
};
