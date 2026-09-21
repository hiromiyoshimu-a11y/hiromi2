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
      <svg viewBox="0 0 540 250" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="250" fill="#080e1a" rx="10"/>
        
        <g transform="translate(30, 15)">
          <rect width="480" height="220" fill="#0f172a" stroke="rgba(245, 158, 11, 0.35)" stroke-width="1.2" rx="8"/>
          <text x="20" y="25" fill="#f59e0b" font-size="12.5" font-weight="700">心外膜起源特有の「立ち上がり鈍化 (Pseudo-delta波)」と MDI</text>

          <!-- 基線 -->
          <line x1="30" y1="145" x2="450" y2="145" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>

          <!-- 心外膜波形: 立ち上がりが非常にゆっくり (偽デルタ波) -->
          <path d="M 30 145 L 80 145 C 110 143, 140 130, 180 50 L 220 165 L 250 145 L 300 160 L 360 145 L 450 145" 
                fill="none" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round"/>

          <!-- Peak 点 -->
          <circle cx="180" cy="50" r="4.5" fill="#f43f5e"/>
          <text x="180" y="36" text-anchor="middle" fill="#f43f5e" font-size="11" font-weight="800">Peak (最大偏位点)</text>

          <!-- QRS onset 点 -->
          <circle cx="80" cy="145" r="4" fill="#38bdf8"/>
          <text x="60" y="162" fill="#38bdf8" font-size="10.5" font-weight="700">QRS Onset</text>

          <!-- QRS Offset 点 -->
          <circle cx="250" cy="145" r="4" fill="#38bdf8"/>
          <text x="235" y="162" fill="#38bdf8" font-size="10.5" font-weight="700">QRS Offset</text>

          <!-- MDI (Peak時間) 矢印 -->
          <line x1="80" y1="185" x2="180" y2="185" stroke="#f43f5e" stroke-width="2"/>
          <path d="M 80 180 L 80 190 M 180 180 L 180 190" stroke="#f43f5e" stroke-width="2"/>
          <text x="130" y="202" text-anchor="middle" fill="#f43f5e" font-size="11" font-weight="700">Peak時間 (95ms)</text>

          <!-- 全体QRS幅 矢印 -->
          <line x1="80" y1="125" x2="250" y2="125" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 2"/>
          <text x="165" y="120" text-anchor="middle" fill="#38bdf8" font-size="10.5" font-weight="700">全QRS幅 (170ms)</text>

          <!-- 計算式＆判定結果インサイトカード (右側余白に配置) -->
          <g transform="translate(265, 50)">
            <rect width="200" height="95" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(251, 191, 36, 0.4)" stroke-width="1.2" rx="6"/>
            <text x="15" y="26" fill="#fbbf24" font-size="12" font-weight="800">MDI 計算値:</text>
            <text x="15" y="50" fill="#ffffff" font-size="14" font-weight="900">95 / 170 = <tspan fill="#f43f5e">0.56</tspan></text>
            <text x="15" y="74" fill="#34d399" font-size="11" font-weight="700">➔ 心外膜 (LV Summit) 陽性</text>
            <text x="15" y="88" fill="#94a3b8" font-size="9.5"> (カットオフ基準 MDI ≥ 0.55)</text>
          </g>
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
  },

  r_wave_duration_index: {
    id: 'r_wave_duration_index',
    title: 'R-wave duration index (b / a: R波幅比率)',
    subtitle: 'V1・V2誘導の初期R波幅がQRS全幅に占める割合。0.50 (50%) 以上で左冠尖 (LCC) を確定',
    authorRef: 'Ito S, et al. J Cardiovasc Electrophysiol. 2003;14:1280-1286',
    formula: 'R-wave duration index = (V1またはV2のR波幅 b [ms]) ÷ (全QRS幅 a [ms])',
    cutoffText: '比率 ≥ 0.50 (50%) ➔ 左冠尖 (LCC/左側起源) / 比率 < 0.50 (50%) ➔ 右室流出路 (RVOT/右側起源)',
    performance: '右側: 0.33 ± 0.11 vs 左側: 0.68 ± 0.22 (p < 0.001, カットオフ 0.50)',
    svgDiagram: `
      <svg viewBox="0 0 540 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="240" fill="#080e1a" rx="10"/>
        
        <!-- 左側: 波形計測パネル (b / a) -->
        <g transform="translate(25, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(56, 189, 248, 0.2)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">波形測定: R-wave duration index = b / a</text>
          
          <!-- 基線 -->
          <line x1="20" y1="95" x2="215" y2="95" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          
          <!-- 波形: 初期R波 + 深いS波 -->
          <path d="M 20 95 L 45 95 L 65 35 L 85 95 L 115 170 L 145 95 L 175 105 L 215 95" 
                fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- R波幅 b (45 to 85 = 40px) -->
          <line x1="45" y1="105" x2="85" y2="105" stroke="#f43f5e" stroke-width="2"/>
          <path d="M 45 100 L 45 110 M 85 100 L 85 110" stroke="#f43f5e" stroke-width="2"/>
          <text x="65" y="122" text-anchor="middle" fill="#f43f5e" font-size="12" font-weight="800">b (R波幅)</text>
          
          <!-- 全QRS幅 a (45 to 145 = 100px) -->
          <line x1="45" y1="180" x2="145" y2="180" stroke="#38bdf8" stroke-width="2"/>
          <path d="M 45 175 L 45 185 M 145 175 L 145 185" stroke="#38bdf8" stroke-width="2"/>
          <text x="95" y="195" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">a (全QRS幅)</text>
          
          <!-- 境界線マーカー -->
          <line x1="45" y1="30" x2="45" y2="185" stroke="rgba(255,255,255,0.2)" stroke-dasharray="2 2"/>
          <line x1="85" y1="30" x2="85" y2="115" stroke="rgba(255,255,255,0.2)" stroke-dasharray="2 2"/>
          <line x1="145" y1="30" x2="145" y2="185" stroke="rgba(255,255,255,0.2)" stroke-dasharray="2 2"/>
        </g>

        <!-- 右側: 散布図プロット (Ito et al. 2003 実データ再現) -->
        <g transform="translate(280, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(245, 158, 11, 0.25)" rx="8"/>
          <text x="14" y="24" fill="#f59e0b" font-size="12" font-weight="700">右側 (RVOT) vs 左側 (LCC) 分布</text>
          <text x="140" y="42" fill="#ec4899" font-size="11" font-weight="800">p &lt; 0.001</text>
          
          <!-- Y軸 -->
          <line x1="45" y1="50" x2="45" y2="170" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="20" y="55" fill="#94a3b8" font-size="10">1.0</text>
          <text x="20" y="110" fill="#f43f5e" font-size="10" font-weight="800">0.5</text>
          <text x="20" y="170" fill="#94a3b8" font-size="10">0.0</text>
          
          <!-- カットオフ 0.5 点線 (Y=110) -->
          <line x1="45" y1="110" x2="220" y2="110" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3"/>
          <circle cx="38" cy="110" r="10" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
          
          <!-- X軸 & ラベル -->
          <line x1="45" y1="170" x2="220" y2="170" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="95" y="188" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">右側 (RVOT)</text>
          <text x="175" y="188" text-anchor="middle" fill="#ec4899" font-size="11" font-weight="700">左側 (LCC)</text>
          
          <!-- 右側プロット (0.33 ± 0.11: Y=135付近に集中) -->
          <g fill="#38bdf8" opacity="0.85">
            <circle cx="85" cy="140" r="3"/><circle cx="92" cy="132" r="3"/><circle cx="100" cy="145" r="3"/>
            <circle cx="88" cy="125" r="3"/><circle cx="96" cy="138" r="3"/><circle cx="104" cy="130" r="3"/>
            <circle cx="90" cy="148" r="3"/><circle cx="98" cy="142" r="3"/><circle cx="86" cy="136" r="3"/>
            <circle cx="94" cy="122" r="3"/><circle cx="102" cy="150" r="3"/><circle cx="95" cy="135" r="3"/>
          </g>
          <text x="95" y="105" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="700">0.33±0.11</text>
          
          <!-- 左側プロット (0.68 ± 0.22: Y=75付近、0.5以上に集中) -->
          <g fill="#ec4899" opacity="0.85">
            <circle cx="165" cy="65" r="3"/><circle cx="172" cy="78" r="3"/><circle cx="180" cy="55" r="3"/>
            <circle cx="168" cy="85" r="3"/><circle cx="176" cy="70" r="3"/><circle cx="184" cy="90" r="3"/>
            <circle cx="170" cy="60" r="3"/><circle cx="178" cy="74" r="3"/><circle cx="186" cy="100" r="3"/>
            <circle cx="174" cy="50" r="3"/><circle cx="182" cy="82" r="3"/><circle cx="175" cy="68" r="3"/>
          </g>
          <text x="175" y="125" text-anchor="middle" fill="#ec4899" font-size="11" font-weight="700">0.68±0.22</text>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜR波の幅（duration）が左右鑑別の決め手になるのか？',
        text: '大動脈洞（特に左冠尖 LCC）は、右室流出路（RVOT）よりも解剖学的に左後方に位置します。LCCから発生した興奮は、発生直後から前胸部電極（V1, V2）へ向かって直接伝播するため、QRS初期に幅広く太いR波（R duration index ≥ 0.50）を形成します。一方、RVOT起源の興奮はV1, V2から遠ざかる方向へ進むため、初期R波は細く短時間（R duration index < 0.50）で終わり、直後に深いS波へと落ち込みます。'
      },
      {
        title: '臨床現場での測定手順（ミリ秒・ミリメートル）',
        text: '① 心電図のV1またはV2誘導において、QRS波の開始点からR波が基線へ戻る（またはS波へ移行する）までの水平時間 b（msまたはmm）を測定します。\n② 同一誘導における全体のQRS開始から終了までの全幅 a（msまたはmm）を測定します。\n③ b ÷ a を計算し、0.50（50%）以上であれば左冠尖（LCC）またはLVOT起源と診断します。'
      }
    ]
  },

  rs_amplitude_index: {
    id: 'rs_amplitude_index',
    title: 'R/S-wave amplitude index (c / d: R/S波高比率)',
    subtitle: 'V1・V2誘導のR波高 / S波深さ。0.30 (30%) 以上で左冠尖 (LCC) を確定',
    authorRef: 'Ito S, et al. J Cardiovasc Electrophysiol. 2003;14:1280-1286',
    formula: 'R/S-wave amplitude index = (V1またはV2のR波高 c [mV]) ÷ (S波深さ d [mV])',
    cutoffText: '比率 ≥ 0.30 (30%) ➔ 左冠尖 (LCC/左側起源) / 比率 < 0.30 (30%) ➔ 右室流出路 (RVOT/右側起源)',
    performance: '右側: 0.17 ± 0.11 vs 左側: 2.2 ± 2.1 (p < 0.001, カットオフ 0.30)',
    svgDiagram: `
      <svg viewBox="0 0 540 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="240" fill="#080e1a" rx="10"/>
        
        <!-- 左側: 波形計測パネル (c / d) -->
        <g transform="translate(25, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(56, 189, 248, 0.2)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">波形測定: R/S-wave amplitude index = c / d</text>
          
          <!-- 基線 -->
          <line x1="20" y1="95" x2="215" y2="95" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
          
          <!-- 波形 -->
          <path d="M 20 95 L 50 95 L 75 45 L 95 95 L 125 165 L 155 95 L 180 102 L 215 95" 
                fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          
          <!-- R波高 c (基線95 to 頂点45 = 50px) -->
          <line x1="75" y1="95" x2="75" y2="45" stroke="#f43f5e" stroke-width="2"/>
          <path d="M 70 95 L 80 95 M 70 45 L 80 45" stroke="#f43f5e" stroke-width="2"/>
          <text x="88" y="70" fill="#f43f5e" font-size="12" font-weight="800">c (R波高)</text>
          
          <!-- S波深さ d (基線95 to 谷底165 = 70px) -->
          <line x1="125" y1="95" x2="125" y2="165" stroke="#38bdf8" stroke-width="2"/>
          <path d="M 120 95 L 130 95 M 120 165 L 130 165" stroke="#38bdf8" stroke-width="2"/>
          <text x="135" y="135" fill="#38bdf8" font-size="11" font-weight="700">d (S波深さ)</text>
          
          <text x="115" y="192" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">比率 = c / d (例: 50/70 = 0.71 ≥ 0.30)</text>
        </g>

        <!-- 右側: 散布図プロット (Ito et al. 2003 実データ再現) -->
        <g transform="translate(280, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(245, 158, 11, 0.25)" rx="8"/>
          <text x="14" y="24" fill="#f59e0b" font-size="12" font-weight="700">右側 (RVOT) vs 左側 (LCC) 分布</text>
          <text x="140" y="42" fill="#ec4899" font-size="11" font-weight="800">p &lt; 0.001</text>
          
          <!-- Y軸 -->
          <line x1="45" y1="50" x2="45" y2="170" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="20" y="55" fill="#94a3b8" font-size="10">3.0</text>
          <text x="20" y="90" fill="#94a3b8" font-size="10">1.0</text>
          <text x="20" y="145" fill="#f43f5e" font-size="10" font-weight="800">0.3</text>
          <text x="20" y="170" fill="#94a3b8" font-size="10">0.0</text>
          
          <!-- カットオフ 0.3 点線 (Y=145) -->
          <line x1="45" y1="145" x2="220" y2="145" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3"/>
          <circle cx="38" cy="145" r="10" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
          
          <!-- X軸 & ラベル -->
          <line x1="45" y1="170" x2="220" y2="170" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="95" y="188" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="700">右側 (RVOT)</text>
          <text x="175" y="188" text-anchor="middle" fill="#ec4899" font-size="11" font-weight="700">左側 (LCC)</text>
          
          <!-- 右側プロット (0.17 ± 0.11: Y=155〜165に密集、ほぼ全例 < 0.3) -->
          <g fill="#38bdf8" opacity="0.85">
            <circle cx="82" cy="162" r="2.5"/><circle cx="88" cy="158" r="2.5"/><circle cx="94" cy="165" r="2.5"/>
            <circle cx="100" cy="154" r="2.5"/><circle cx="106" cy="160" r="2.5"/><circle cx="85" cy="152" r="2.5"/>
            <circle cx="91" cy="163" r="2.5"/><circle cx="97" cy="157" r="2.5"/><circle cx="103" cy="166" r="2.5"/>
            <circle cx="89" cy="149" r="2.5"/><circle cx="95" cy="153" r="2.5"/><circle cx="101" cy="161" r="2.5"/>
          </g>
          <text x="95" y="138" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="700">0.17±0.11</text>
          
          <!-- 左側プロット (2.2 ± 2.1: Y=60〜140に幅広く分布、多数が ≥ 0.3) -->
          <g fill="#ec4899" opacity="0.85">
            <circle cx="165" cy="60" r="3"/><circle cx="172" cy="75" r="3"/><circle cx="180" cy="95" r="3"/>
            <circle cx="168" cy="115" r="3"/><circle cx="176" cy="135" r="3"/><circle cx="184" cy="85" r="3"/>
            <circle cx="170" cy="100" r="3"/><circle cx="178" cy="125" r="3"/><circle cx="186" cy="70" r="3"/>
            <circle cx="174" cy="140" r="3"/><circle cx="182" cy="55" r="3"/><circle cx="175" cy="110" r="3"/>
          </g>
          <text x="175" y="48" text-anchor="middle" fill="#ec4899" font-size="11" font-weight="700">2.2±2.1</text>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜR波の振幅（波高）が左右鑑別で重要なのか？',
        text: 'RVOT起源では、発生部位が前胸部壁に近いため、初期のわずかなR波を除いて興奮の大半が電極から遠ざかる心室全体へ向かい、圧倒的に深いS波（負の電位）が記録されます（R/S比はわずか 0.17±0.11）。これに対し、左冠尖（LCC）起源では、左室側から中隔を貫通して前胸部電極へ向かう前向き起電力が持続するため、高いR波が形成され、S波に比べてR波の振幅比率が飛躍的に増大します（2.2±2.1、カットオフ 0.30）。'
      },
      {
        title: 'R duration index との併用による「偽陰性の克服」',
        text: 'R duration index（幅 ≥ 50%）と R/S amplitude index（波高 ≥ 30%）は互いに補完関係にあります。心臓の軽度の回転により幅が境界域（45〜50%）であっても、波高比率が30%を大きく超えていれば左室流出路（LCC）起源と確信を持って同定できます。'
      }
    ]
  },

  ito_criteria: {
    id: 'ito_criteria',
    title: 'Ito 流出路総合鑑別体系 (Ito et al. 2003)',
    subtitle: '胸部移行帯、I誘導s波の有無、II>III、aVL vs aVR Q波高、Rピーク前半、中隔90% vs 自由壁10%',
    authorRef: 'Ito S, et al. J Cardiovasc Electrophysiol. 2003;14:1280-1286',
    formula: '移行帯 + I誘導s波 + R幅比率(50%) + R/S波高比率(30%) + aVR/aVL Q波',
    cutoffText: '多角的な臨床心電図指標の一致度により、右側 (RVOT) vs 左側 (LCC) を90%以上の確度で確定',
    performance: '感度・特異度ともに 90%以上（流出路境界例を含む全体鑑別）',
    svgDiagram: `
      <svg viewBox="0 0 540 230" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="230" fill="#080e1a" rx="10"/>
        
        <!-- 右側起源 (RVOT中隔) パネル -->
        <g transform="translate(20, 20)">
          <rect width="240" height="190" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" rx="8"/>
          <rect width="240" height="28" fill="rgba(56, 189, 248, 0.15)" rx="8 8 0 0"/>
          <text x="12" y="19" fill="#38bdf8" font-size="12" font-weight="800">右側: RVOT中隔起源 (Rt. side)</text>
          
          <g transform="translate(12, 38)" font-size="10" fill="#e2e8f0">
            <text y="14" fill="#38bdf8" font-weight="700">① 胸部移行帯: <tspan fill="#ffffff">≥ V3 (V3〜V4多し)</tspan></text>
            <text y="34" fill="#38bdf8" font-weight="700">② I誘導に s波なし: <tspan fill="#22c55e" font-weight="800">64% (35/55例)</tspan></text>
            <text y="54" fill="#38bdf8" font-weight="700">③ R幅比率: <tspan fill="#ffffff">&lt; 50% (0.33±0.11)</tspan></text>
            <text y="74" fill="#38bdf8" font-weight="700">④ R/S波高比: <tspan fill="#ffffff">&lt; 30% (0.17±0.11)</tspan></text>
            <text y="94" fill="#38bdf8" font-weight="700">⑤ 下壁誘導: <tspan fill="#ffffff">II R波高 &gt; III R波高</tspan></text>
            <text y="114" fill="#38bdf8" font-weight="700">⑥ aVR vs aVL: <tspan fill="#ffffff">aVR Q開始が先行 / 大</tspan></text>
            <text y="134" fill="#fbbf24" font-weight="800">⑦ 下壁Rピーク: 前半に位置する</text>
          </g>
        </g>

        <!-- 左側起源 (左冠尖 LCC) パネル -->
        <g transform="translate(280, 20)">
          <rect width="240" height="190" fill="#0f172a" stroke="rgba(236, 72, 153, 0.3)" rx="8"/>
          <rect width="240" height="28" fill="rgba(236, 72, 153, 0.15)" rx="8 8 0 0"/>
          <text x="12" y="19" fill="#ec4899" font-size="12" font-weight="800">左側: 左冠尖 LCC 起源 (Lt. side)</text>
          
          <g transform="translate(12, 38)" font-size="10" fill="#e2e8f0">
            <text y="14" fill="#ec4899" font-weight="700">① 胸部移行帯: <tspan fill="#ffffff">早期 (&lt;V2が60%)</tspan></text>
            <text y="34" fill="#ec4899" font-weight="700">② I誘導に s波あり: <tspan fill="#f43f5e" font-weight="800">96% (24/25例)</tspan></text>
            <text y="54" fill="#ec4899" font-weight="700">③ R幅比率: <tspan fill="#ffffff">≥ 50% (0.68±0.22)</tspan></text>
            <text y="74" fill="#ec4899" font-weight="700">④ R/S波高比: <tspan fill="#ffffff">≥ 30% (2.2±2.1)</tspan></text>
            <text y="94" fill="#ec4899" font-weight="700">⑤ aVL Q波: <tspan fill="#ffffff">aVL Q波高 &gt;&gt; aVR Q波高</tspan></text>
            <text y="114" fill="#ec4899" font-weight="700">⑥ aVL形態: <tspan fill="#ffffff">深いQSパターンを形成</tspan></text>
            <text y="134" fill="#a855f7" font-weight="800">⑦ 通電前: 必ずCAGでLMT離れ確認</text>
          </g>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'I誘導の「s波なし（純R波）」が右室中隔を強く示唆する理由',
        text: '伊藤らの研究（JCE 2003）では、右室流出路（RVOT）中隔起源55例中35例（63.6%）でI誘導にs波を認めず単相性R波であったのに対し、左冠尖（LCC）起源25例中ではわずか1例（4.0%）しかs波なしは存在しませんでした（p < 0.001）。つまり、I誘導にs波が全くない場合は特異度96%で右側起源（RVOT中隔）と判断できます。'
      },
      {
        title: 'RVOT中隔 (90%) vs 自由壁 (10%) の鑑別ポイント',
        text: 'RVOT起源PVCの90%は中隔部から発生し、自由壁はわずか10%です。中隔起源はQRS幅が比較的シャープで、移行帯がV3-V4と早く、下壁誘導にノッチを認めません。一方、自由壁起源は心室筋伝播に時間を要するため、QRS幅が>150msと拡大し、移行帯が≥V4（V5以降）と遅延し、下壁誘導のR波下行脚に顕著なノッチを伴います。'
      }
    ]
  },

  lvepi_failure_criteria: {
    id: 'lvepi_failure_criteria',
    title: 'LSV(LCC)焼灼不成功・左室心外膜起源 (LVEpi-VT) 予測指標',
    subtitle: 'aVL/aVR Q波比 > 1.4 または V1 S波深さ > 1.2mV で左バルサルバ洞(LSV)からの通電不成功・心外膜側(GCV/LV Summit)を事前予測',
    authorRef: 'Ito S, et al. J Cardiovasc Electrophysiol. 2003;14:1280-1286',
    formula: '① (aVL Q波深さ) ÷ (aVR Q波深さ) > 1.4  または  ② V1 誘導の S波深さ > 1.2 mV (12mm)',
    cutoffText: 'Q比 > 1.4 または V1 S波 > 1.2mV ➔ LSV(LCC)からの焼灼不成功・心外膜側(LVEpi-VT)を強く示唆',
    performance: 'LCC通電不成功・心外膜起源同定 特異度 > 88%',
    svgDiagram: `
      <svg viewBox="0 0 540 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="240" fill="#080e1a" rx="10"/>
        
        <!-- 左: LCC-VT (心内膜通電成功例) -->
        <g transform="translate(25, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">LCC-VT (LSV通電成功群)</text>
          
          <!-- V1 波形 (S波浅い: ≤ 1.2mV) -->
          <g transform="translate(15, 35)">
            <text x="0" y="22" fill="#94a3b8" font-size="11" font-weight="700">V1 誘導 (S ≤ 1.2mV)</text>
            <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 45 L 30 45 L 40 32 L 55 90 L 75 45 L 100 52 L 130 45" 
                  fill="none" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="55" y1="45" x2="55" y2="90" stroke="#38bdf8" stroke-width="1.8"/>
            <text x="63" y="72" fill="#38bdf8" font-size="10" font-weight="700">S波 0.8mV</text>
          </g>
          
          <!-- aVL vs aVR Q波比 (Q比 ≤ 1.4) -->
          <g transform="translate(15, 125)">
            <text x="0" y="20" fill="#94a3b8" font-size="11" font-weight="700">Q: aVL/aVR ≤ 1.4</text>
            <rect x="0" y="28" width="200" height="36" fill="rgba(2, 132, 199, 0.15)" rx="6" stroke="rgba(56, 189, 248, 0.2)"/>
            <text x="10" y="50" fill="#38bdf8" font-size="10" font-weight="700">LSV(LCC)内膜通電で根治可能</text>
          </g>
        </g>

        <!-- 右: LVEpi-VT (LSV焼灼不成功・心外膜起源) -->
        <g transform="translate(280, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(244, 63, 94, 0.4)" rx="8"/>
          <text x="14" y="24" fill="#fb7185" font-size="12" font-weight="800">LVEpi-VT (心外膜 / LSV不成功)</text>
          
          <!-- V1 波形 (深いS波: > 1.2mV) -->
          <g transform="translate(15, 35)">
            <text x="0" y="22" fill="#f43f5e" font-size="11" font-weight="700">V1 誘導: S波高 &gt; 1.2 mV (警告!)</text>
            <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 45 L 30 45 L 38 35 L 55 125 L 75 45 L 100 52 L 130 45" 
                  fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="55" y1="45" x2="55" y2="125" stroke="#fbbf24" stroke-width="2"/>
            <text x="63" y="90" fill="#fbbf24" font-size="10" font-weight="800">S波 &gt; 1.4mV</text>
          </g>
          
          <!-- aVL / aVR Q波比 > 1.4 -->
          <g transform="translate(15, 125)">
            <text x="0" y="20" fill="#f43f5e" font-size="11" font-weight="700">Q: aVL / aVR &gt; 1.4 (aVL深QS)</text>
            <rect x="0" y="28" width="200" height="36" fill="rgba(244, 63, 94, 0.2)" rx="6" stroke="rgba(244, 63, 94, 0.4)"/>
            <text x="10" y="50" fill="#fca5a5" font-size="10" font-weight="700">➔ GCV / 心外膜アプローチ必須</text>
          </g>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜLSV(LCC)からの通電が不成功に終わるのか？',
        text: '大動脈洞（LCC）の直近には心外膜側の解剖構造（LV Summit、大心静脈GCV、前室間静脈AIV）が存在します。心外膜下脂肪組織や心筋壁の厚みがあるため、真の起源が心外膜側（LVEpi）にある場合、大動脈弁洞内膜側からの通常RF通電では熱病変が起源巣に到達せず、不成功または早期再発となります。'
      },
      {
        title: '伊藤基準の2大指標（Q比>1.4 と V1 S波>1.2mV）の意義',
        text: '① 心外膜側高位起源では興奮がaVL電極から強烈に離れていくため、aVRに比べてaVLで著明に深いQ波を形成し（Q波比 > 1.4）、\n② 胸壁前面のV1電極からも大きく遠ざかるためV1のS波深さが1.2mV（12mm）を超えます。\nこの2つのどちらかを認めた場合、LCCでの無駄な長時間通電による大動脈弁損傷を避け、早期に冠静脈洞（GCV）内マッピングまたは心膜穿刺を考慮すべきです。'
      }
    ]
  },

  rcc_vs_parahisian_rvot: {
    id: 'rcc_vs_parahisian_rvot',
    title: 'RCC vs RVOT His直上中隔の鑑別指標',
    subtitle: '解剖学的に酷似する表裏対向部位の鑑別：V2 small R波の有無と胸部移行帯',
    authorRef: 'Lin D, et al. Heart Rhythm. 2008;5:663-669',
    formula: 'V2誘導の初期 "small R" の有無 ＋ 胸部移行帯 (V3早期移行)',
    cutoffText: 'V2 small R波あり ➔ RCC (右冠尖) / V2 純粋なQS波 ➔ RVOT His直上中隔',
    performance: '鑑別正診率 > 88%',
    svgDiagram: `
      <svg viewBox="0 0 540 230" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="230" fill="#080e1a" rx="10"/>
        
        <!-- 左: RCC PVC (大動脈弁右冠尖) -->
        <g transform="translate(25, 20)">
          <rect width="235" height="190" fill="#0f172a" stroke="rgba(236, 72, 153, 0.3)" rx="8"/>
          <text x="14" y="24" fill="#ec4899" font-size="12" font-weight="800">RCC 起源 (大動脈弁右冠尖)</text>
          
          <g transform="translate(15, 40)">
            <!-- V2 波形 (small R波あり) -->
            <text x="0" y="15" fill="#f43f5e" font-size="11" font-weight="700">Lead V2: "small R" 出現 (決め手)</text>
            <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 45 L 30 45 L 38 32 L 48 95 L 70 45 L 95 50 L 125 45" 
                  fill="none" stroke="#ec4899" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="38" cy="32" r="4" fill="#fbbf24"/>
            <text x="46" y="28" fill="#fbbf24" font-size="10" font-weight="800">small R</text>
            
            <text x="0" y="115" fill="#e2e8f0" font-size="10">・胸部移行帯: <tspan fill="#34d399" font-weight="700">V3 (早期移行)</tspan></text>
            <text x="0" y="132" fill="#e2e8f0" font-size="10">・下壁誘導: <tspan fill="#ffffff">III R波高 ≥ II R波高</tspan></text>
          </g>
        </g>

        <!-- 右: RVOT His直上中隔 PVC -->
        <g transform="translate(280, 20)">
          <rect width="235" height="190" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="800">RVOT His直上中隔 起源</text>
          
          <g transform="translate(15, 40)">
            <!-- V2 波形 (純粋なQS波) -->
            <text x="0" y="15" fill="#38bdf8" font-size="11" font-weight="700">Lead V2: 純粋な QS pattern</text>
            <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 45 L 30 45 L 45 105 L 68 45 L 95 50 L 125 45" 
                  fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
            <text x="50" y="70" fill="#94a3b8" font-size="10">(r波なし)</text>
            
            <text x="0" y="115" fill="#e2e8f0" font-size="10">・I誘導: <tspan fill="#38bdf8" font-weight="700">高い単相性R波 (波高大)</tspan></text>
            <text x="0" y="132" fill="#e2e8f0" font-size="10">・下壁誘導: <tspan fill="#ffffff">II R波高 &gt;&gt; III R波高</tspan></text>
          </g>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜRCCと低位RVOTは心電図が酷似するのか？',
        text: '右冠尖（RCC）の直前方は右室流出路（RVOT）の後中隔低位（ヒス束直上）に接しています。心室中隔壁を挟んでわずか数ミリの距離で対向しているため、どちらから興奮が発生してもLBBB型パターン＋下軸となり、肉眼的な心電図波形が酷似します。'
      },
      {
        title: 'Linらの鑑別基準（V2 small R）の解剖学的根拠',
        text: '大動脈洞RCCはRVOTよりも解剖学的に後方・左室側に位置します。そのため、興奮が前胸部電極（V2）に向かってわずかに前向きベクトルを形成し、V2誘導の初期に小さな "small R" 波を生じます。一方、RVOT His直上から発生した興奮は電極から後方へ遠ざかるため、V1・V2ともに純粋なQS波形となります。'
      }
    ]
  },

  rvot_freewall_notch: {
    id: 'rvot_freewall_notch',
    title: 'RVOT自由壁：下壁ノッチ (R-R\' > 20ms) と深いV1-3 S波',
    subtitle: '心室筋伝播遅延による二峰性R波（R-R\' > 20ms）と胸壁直下からの離脱ベクトル',
    authorRef: 'Yamashina Y, Tada H, et al. Circ J. 2004;68:909-914',
    formula: '下壁誘導 (II, III, aVF) のR-R\'頂点間時間 > 20 ms ＋ V1-3 Deep S波',
    cutoffText: 'R-R\' > 20ms ➔ RVOT自由壁 (特異度92%、薄壁・心穿孔厳重注意)',
    performance: '感度 86%、特異度 92%',
    svgDiagram: `
      <svg viewBox="0 0 540 230" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="230" fill="#080e1a" rx="10"/>
        
        <!-- 下壁ノッチ R-R' > 20ms 計測パネル -->
        <g transform="translate(25, 20)">
          <rect width="235" height="190" fill="#0f172a" stroke="rgba(244, 63, 94, 0.35)" rx="8"/>
          <text x="14" y="24" fill="#f43f5e" font-size="12" font-weight="700">下壁R波ノッチ (R-R' &gt; 20ms)</text>
          
          <g transform="translate(15, 35)">
            <line x1="0" y1="110" x2="200" y2="110" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <!-- 二峰性R波 (R-R') -->
            <path d="M 10 110 L 40 110 L 65 30 L 75 48 L 95 25 L 120 135 L 140 110 L 170 110" 
                  fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
            
            <circle cx="65" cy="30" r="3.5" fill="#fbbf24"/>
            <circle cx="95" cy="25" r="3.5" fill="#fbbf24"/>
            
            <!-- R-R' 間隔測定 -->
            <line x1="65" y1="15" x2="95" y2="15" stroke="#fbbf24" stroke-width="1.8"/>
            <path d="M 65 10 L 65 20 M 95 10 L 95 20" stroke="#fbbf24" stroke-width="1.8"/>
            <text x="80" y="10" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="800">R-R' &gt; 20ms</text>
            
            <text x="10" y="135" fill="#cbd5e1" font-size="10">二峰性解離: 右室➔左室伝播遅延</text>
          </g>
        </g>

        <!-- V1-3 Deep S wave パネル -->
        <g transform="translate(280, 20)">
          <rect width="235" height="190" fill="#0f172a" stroke="rgba(56, 189, 248, 0.3)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="700">V1-3 著明な深いS波 (Deep S)</text>
          
          <g transform="translate(15, 35)">
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <!-- 深いS波 -->
            <path d="M 10 50 L 35 50 L 42 42 L 55 145 L 80 50 L 110 58 L 140 50" 
                  fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
            
            <line x1="55" y1="50" x2="55" y2="145" stroke="#f43f5e" stroke-width="1.8"/>
            <text x="63" y="100" fill="#f43f5e" font-size="11" font-weight="800">Deep S wave</text>
            <text x="63" y="116" fill="#94a3b8" font-size="9">(胸壁直下から離脱)</text>
            
            <text x="10" y="135" fill="#cbd5e1" font-size="10">胸部移行帯: <tspan fill="#f59e0b" font-weight="700">V4〜V5と著明遅延</tspan></text>
          </g>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜ自由壁ではR-R\'間隔が20ms以上に拡大するのか？',
        text: 'RVOT中隔起源では、左右両室の刺激伝導系にほぼ同時に興奮が伝わるためR波がシャープに一本化します。一方、RVOT自由壁起源では、まず右室自由壁を脱分極させ、その後に心室中隔を通過して左室全体を興奮させるまでに著明な時間差（電気的非同期）が生じます。この2つの心室興奮成分が下壁誘導において20ms以上離れた二峰性の頂点（R-R\' > 20ms）として現れます。'
      },
      {
        title: '心室壁の厚さと心穿孔（タンポナーデ）への直結',
        text: 'RVOT中隔の筋厚は10mm以上あるのに対し、RVOT自由壁はわずか1〜3mmと極めて菲薄です。下壁R-R\' > 20ms かつ V1-3 Deep S波を認めた場合は、高出力通電や過剰なカテーテルコンタクトフォース（>15-20g）を厳重に避け、心膜腔穿刺セットを事前準備する必要があります。'
      }
    ]
  },

  ma_vas_localization: {
    id: 'ma_vas_localization',
    title: '僧帽弁輪部（MA）起源の局在診断：V1 qRパターンと電気軸の対比',
    subtitle: 'AMC前部 vs MA後中隔のV1 qR共通サインと、前側壁・後壁の波形鑑別',
    authorRef: 'Tada H, et al. J Am Coll Cardiol. 2005;45:877-886',
    formula: 'V1誘導形態（qR vs 単相R vs 二峰性R） ＋ 下壁誘導電気軸（下軸 vs 上軸）',
    cutoffText: 'V1 qR ＋ 下軸 ➔ AMC前部 / V1 qR ＋ 上軸 ➔ 僧帽弁輪後中隔',
    performance: '部位同定の特異度 > 90%',
    svgDiagram: `
      <svg viewBox="0 0 540 240" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="240" fill="#080e1a" rx="10"/>
        
        <!-- 左: LVOT (AMC anterior) -->
        <g transform="translate(25, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(56, 189, 248, 0.35)" rx="8"/>
          <text x="14" y="24" fill="#38bdf8" font-size="12" font-weight="800">LVOT (AMC 前部)</text>
          
          <g transform="translate(15, 35)">
            <!-- V1 qR -->
            <text x="0" y="16" fill="#fbbf24" font-size="11" font-weight="700">V1: q(+) / qR パターン</text>
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 50 L 30 50 L 36 58 L 50 15 L 68 50 L 95 50" 
                  fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
            <text x="32" y="70" fill="#fbbf24" font-size="9" font-weight="700">q</text>
            <text x="52" y="14" fill="#38bdf8" font-size="10" font-weight="800">高R波</text>
            
            <!-- 下壁誘導 (下軸: 高R) -->
            <text x="0" y="95" fill="#34d399" font-size="11" font-weight="700">下壁 (II, III, aVF): 下軸 (高R)</text>
            <line x1="0" y1="125" x2="200" y2="125" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 125 L 30 125 L 45 92 L 60 125 L 85 125" 
                  fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round"/>
            
            <text x="0" y="152" fill="#94a3b8" font-size="10">・I誘導: <tspan fill="#38bdf8" font-weight="700">陽性R波 (右➔左)</tspan></text>
          </g>
        </g>

        <!-- 右: 僧帽弁輪 後中隔起源 -->
        <g transform="translate(280, 20)">
          <rect width="235" height="200" fill="#0f172a" stroke="rgba(244, 63, 94, 0.35)" rx="8"/>
          <text x="14" y="24" fill="#f43f5e" font-size="12" font-weight="800">僧帽弁輪 後中隔 (Posteroseptal)</text>
          
          <g transform="translate(15, 35)">
            <!-- V1 qR -->
            <text x="0" y="16" fill="#fbbf24" font-size="11" font-weight="700">V1: qR パターン (共通サイン)</text>
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 50 L 30 50 L 36 58 L 50 15 L 68 50 L 95 50" 
                  fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
            <text x="32" y="70" fill="#fbbf24" font-size="9" font-weight="700">q</text>
            <text x="52" y="14" fill="#f43f5e" font-size="10" font-weight="800">R波</text>
            
            <!-- 下壁誘導 (上軸: 深いQS) -->
            <text x="0" y="95" fill="#f43f5e" font-size="11" font-weight="700">下壁 (II, III, aVF): 上軸 (深いQS)</text>
            <line x1="0" y1="110" x2="200" y2="110" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <path d="M 10 110 L 30 110 L 45 145 L 60 110 L 85 110" 
                  fill="none" stroke="#f43f5e" stroke-width="2.2" stroke-linecap="round"/>
            
            <text x="0" y="152" fill="#94a3b8" font-size="10">・電気軸: <tspan fill="#f43f5e" font-weight="700">著明な上軸 (下壁陰性)</tspan></text>
          </g>
        </g>
      </svg>
    `,
    details: [
      {
        title: 'なぜV1誘導に「qRパターン」が出現するのか？',
        text: '僧帽弁輪後中隔およびAMC前部は、解剖学的に左室流出路・中隔・弁輪の移行部に位置します。興奮開始の瞬間に中隔側へ向かうごく初期のベクトルによってV1誘導に小さな初期q波が生じ、直後に左室全体への前方興奮によって高いR波が形成され、特異的な「qRパターン」となります。'
      },
      {
        title: '電気軸（下壁誘導）による一発局在鑑別',
        text: '・【AMC 前部】流出路の頭側に位置するため、興奮は下方へ向かい「下軸（II, III, aVFで高R波）」を呈します。\n・【後中隔 (Posteroseptal)】左室基部後下方に位置するため、興奮は上方へ向かい「上軸（II, III, aVFで深いQS波）」を呈します。\n・【後壁 (Posterior)】上軸かつV1が「二峰性ノッチ付き高R波」となります。\n・【前側壁 (Anterolateral)】側壁に位置するため「I誘導・aVL誘導で深いQS波」となり、V1は単相性の鋭い高R波となります。'
      }
    ]
  },

  verapamil_sensitive_ilvt: {
    id: 'verapamil_sensitive_ilvt',
    title: '左室ベラパミル感受性頻拍 (ILVT: 野上昭彦教授 基準)',
    subtitle: '左脚後枝起源リエントリー：RBBB ＋ 上軸（-60°〜-120°）とシャープなQRS幅',
    authorRef: 'Nogami A, et al. J Cardiovasc Electrophysiol / Circulation',
    formula: 'RBBB型 ＋ Superior Axis (電気軸 -60°〜-120°) ＋ 狭いQRS (<130-135ms)',
    cutoffText: 'RBBB ＋ 上軸 ＋ RS時間短縮 ➔ ベラパミル感受性左脚後枝頻拍 (特異度 > 95%)',
    performance: '特異度 96%、ベラパミル静注での停止率 100%',
    svgDiagram: `
      <svg viewBox="0 0 540 230" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="230" fill="#080e1a" rx="10"/>
        
        <!-- V1 誘導 (シャープなRBBB波形) -->
        <g transform="translate(25, 20)">
          <rect width="235" height="190" fill="#0f172a" stroke="rgba(168, 85, 247, 0.35)" rx="8"/>
          <text x="14" y="24" fill="#c084fc" font-size="12" font-weight="800">Lead V1: シャープな RBBB 型</text>
          
          <g transform="translate(15, 35)">
            <line x1="0" y1="90" x2="200" y2="90" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <!-- 鋭い立ち上がりR波 -->
            <path d="M 10 90 L 30 90 L 45 25 L 60 75 L 70 55 L 85 90 L 115 90" 
                  fill="none" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round"/>
            
            <circle cx="45" cy="25" r="3.5" fill="#34d399"/>
            <text x="52" y="28" fill="#34d399" font-size="10" font-weight="800">RS時間 &lt; 60ms</text>
            <text x="0" y="115" fill="#cbd5e1" font-size="10">・QRS幅: <tspan fill="#38bdf8" font-weight="700">120〜130ms (比較的狭い)</tspan></text>
            <text x="0" y="132" fill="#cbd5e1" font-size="10">・特殊心筋プルキンエ線維網が旋回路</text>
          </g>
        </g>

        <!-- 下壁誘導 (著明な左軸偏位 / 上軸: Axis -60°〜-120°) -->
        <g transform="translate(280, 20)">
          <rect width="235" height="190" fill="#0f172a" stroke="rgba(244, 63, 94, 0.35)" rx="8"/>
          <text x="14" y="24" fill="#f43f5e" font-size="12" font-weight="800">下壁誘導: 上軸 (Axis -60°〜-120°)</text>
          
          <g transform="translate(15, 35)">
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3 3"/>
            <!-- 深いrS/QS -->
            <path d="M 10 50 L 30 50 L 38 42 L 55 135 L 75 50 L 100 50" 
                  fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
            
            <text x="65" y="100" fill="#f43f5e" font-size="10" font-weight="800">II, III, aVF 深QS/rS</text>
            <text x="0" y="115" fill="#fbbf24" font-size="10" font-weight="700">Courtesy of Prof. Nogami (筑波大/茨城県立)</text>
            <text x="0" y="132" fill="#cbd5e1" font-size="10">・野上教授分類: Pt1(-60°), Pt2(-90°), Pt3(-120°)</text>
          </g>
        </g>
      </svg>
    `,
    details: [
      {
        title: '野上昭彦教授による特発性左室頻拍の電気生理学的解明',
        text: '左室ベラパミル感受性心室頻拍（ILVT）は、左脚後枝領域の偽腱索・プルキンエ線維網を旋回路とするリエントリー性不整脈です。心筋作業筋起源のPVC/VTと異なり、刺激伝導系そのものを介して興奮が急速に広がるため、QRS幅は120〜130ms程度と比較的シャープであり、RS立ち上がり時間が極めて短い特徴を有します。'
      },
      {
        title: '電気軸の多様性（-60°、-90°、-120°）とアブレーション標的',
        text: '野上教授のスライドに示されるように、左脚後枝起源では著明な左軸偏位（上軸: -60°〜-120°）を呈し、下壁誘導（II, III, aVF）がすべて深い陰性波となります。拡張期プルキンエ電位（P1）または前収縮期電位（P2）をICEガイド下で捉え、わずか数秒の高周波通電で安全に完全根治が可能です。'
      }
    ]
  },

  naito_2005_flowchart: {
    id: 'naito_2005_flowchart',
    title: '内藤 2005 流出路(OT-VT) 7ステップ局在診断フローチャート',
    subtitle: '群馬県立心臓血管センター・内藤滋人先生による流出路不整脈の金字塔アルゴリズム（感度88%、特異度95%）',
    authorRef: 'Naito S, et al. Therapeutic Research. 2005;26(8):1690-1697',
    formula: 'V6 s波 ➔ 移行帯/I s波 ➔ R/S & R-duration ➔ Q比/V1 S深さ ➔ I波形 ➔ aVL波形 ➔ 下壁ノッチ/V2 S深さ',
    cutoffText: '7つの段階的判断ステップにより、RV中隔/自由壁/His近傍/LV心内膜/左冠尖/心外膜を90%超の精度で完全同定',
    performance: '感度 88%、特異度 95%',
    svgDiagram: `
      <svg viewBox="0 0 540 260" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
        <rect width="540" height="260" fill="#080e1a" rx="10"/>
        
        <!-- フローチャート ノード群 -->
        <g transform="translate(15, 15)">
          <!-- Step 1 -->
          <rect x="0" y="0" width="160" height="34" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
          <text x="80" y="21" text-anchor="middle" fill="#e2e8f0" font-size="10" font-weight="700">Step 1: V6 s波 ≥ 0.1mV</text>
          
          <!-- Yes -> LV end -->
          <line x1="160" y1="17" x2="220" y2="17" stroke="#22c55e" stroke-width="1.5"/>
          <text x="190" y="12" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="800">Yes</text>
          <rect x="220" y="2" width="100" height="30" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" rx="4"/>
          <text x="270" y="21" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="800">左室心内膜 (LV end)</text>

          <!-- No -> Step 2 -->
          <line x1="80" y1="34" x2="80" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="92" y="50" fill="#94a3b8" font-size="9">No</text>
          
          <!-- Step 2 -->
          <rect x="0" y="60" width="160" height="34" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
          <text x="80" y="76" text-anchor="middle" fill="#e2e8f0" font-size="9" font-weight="700">Step 2: 移行帯≥V4</text>
          <text x="80" y="88" text-anchor="middle" fill="#38bdf8" font-size="8">または I誘導 s波なし</text>

          <!-- Step 2 Yes -> Step 5 (右側分岐) -->
          <line x1="160" y1="77" x2="340" y2="77" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="250" y="71" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="800">Yes (右側優位)</text>
          
          <!-- Step 5 -->
          <rect x="340" y="60" width="170" height="34" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" rx="6"/>
          <text x="425" y="81" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="700">Step 5: I誘導 = R or RR'</text>

          <!-- Step 5 No -> RV sep -->
          <line x1="510" y1="77" x2="525" y2="77" stroke="#94a3b8"/>
          <!-- Step 5 Yes -> Step 6 -->
          <line x1="425" y1="94" x2="425" y2="120" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="435" y="110" fill="#f59e0b" font-size="9">Yes</text>
          
          <!-- Step 6 -->
          <rect x="340" y="120" width="170" height="34" fill="#0f172a" stroke="#a855f7" stroke-width="1.5" rx="6"/>
          <text x="425" y="141" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="700">Step 6: aVL = RSR' or RR'</text>
          
          <!-- Step 6 Yes -> Near His -->
          <line x1="340" y1="137" x2="260" y2="137" stroke="#c084fc" stroke-width="1.5"/>
          <text x="300" y="131" text-anchor="middle" fill="#c084fc" font-size="9">Yes</text>
          <rect x="180" y="122" width="80" height="30" fill="rgba(192, 132, 252, 0.2)" stroke="#c084fc" rx="4"/>
          <text x="220" y="141" text-anchor="middle" fill="#c084fc" font-size="9" font-weight="800">His束近傍 (Near His)</text>

          <!-- Step 6 No -> Step 7 -->
          <line x1="425" y1="154" x2="425" y2="180" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="435" y="170" fill="#94a3b8" font-size="9">No</text>
          
          <!-- Step 7 -->
          <rect x="330" y="180" width="190" height="34" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5" rx="6"/>
          <text x="425" y="196" text-anchor="middle" fill="#f43f5e" font-size="9" font-weight="700">Step 7: 下壁RR' &amp; V2 S≥3.0mV</text>
          
          <!-- Step 7 Yes -> RV自由壁 -->
          <line x1="425" y1="214" x2="425" y2="235" stroke="#f43f5e" stroke-width="1.5"/>
          <rect x="365" y="235" width="120" height="22" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" rx="4"/>
          <text x="425" y="250" text-anchor="middle" fill="#fb7185" font-size="9" font-weight="800">RV自由壁 (RV FW)</text>

          <!-- Step 7 No -> RV中隔 -->
          <line x1="330" y1="197" x2="270" y2="197" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="180" y="185" width="90" height="24" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" rx="4"/>
          <text x="225" y="201" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="800">RV中隔 (RV sep)</text>

          <!-- Step 2 No -> Step 3 (左側精査) -->
          <line x1="80" y1="94" x2="80" y2="120" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="92" y="110" fill="#94a3b8" font-size="9">No</text>
          
          <!-- Step 3 -->
          <rect x="0" y="120" width="160" height="34" fill="#0f172a" stroke="#ec4899" stroke-width="1.5" rx="6"/>
          <text x="80" y="136" text-anchor="middle" fill="#ec4899" font-size="9" font-weight="700">Step 3: R/S amp &lt; 0.3</text>
          <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="8">&amp; R-duration &lt; 0.5</text>

          <!-- Step 3 No -> LCC -->
          <line x1="160" y1="137" x2="180" y2="137" stroke="#94a3b8"/>
          <!-- Step 3 Yes -> Step 4 -->
          <line x1="80" y1="154" x2="80" y2="180" stroke="#ec4899" stroke-width="1.5"/>
          <text x="92" y="170" fill="#ec4899" font-size="9">Yes</text>
          
          <!-- Step 4 -->
          <rect x="0" y="180" width="160" height="34" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5" rx="6"/>
          <text x="80" y="196" text-anchor="middle" fill="#fb7185" font-size="9" font-weight="700">Step 4: Q比 aVL/aVR&gt;1.4</text>
          <text x="80" y="208" text-anchor="middle" fill="#fbbf24" font-size="8">または V1 S波深さ ≥ 1.2mV</text>

          <!-- Step 4 Yes -> LV epi -->
          <line x1="80" y1="214" x2="80" y2="235" stroke="#f43f5e" stroke-width="1.5"/>
          <rect x="25" y="235" width="110" height="22" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" rx="4"/>
          <text x="80" y="250" text-anchor="middle" fill="#fb7185" font-size="9" font-weight="800">左室心外膜 (LV epi)</text>

          <!-- Step 4 No -> LSV(LCC) -->
          <line x1="160" y1="197" x2="180" y2="197" stroke="#38bdf8"/>
        </g>
      </svg>
    `,
    details: [
      {
        title: '内藤滋人先生（群馬県立心臓血管センター）による7段階鑑別',
        text: '本アルゴリズムは、流出路起源心室頻拍（OT-VT）において、右室中隔・右室自由壁・His束近傍・左室内膜・左冠尖・心外膜側（大心静脈走行部）を段階的に絞り込む実践的フローチャートです。感度88%、特異度95%と極めて高い鑑別精度を誇ります。'
      },
      {
        title: '臨床判断のハイライト',
        text: '・【Step 1】V6誘導のs波(≥0.1mV)は左室心内膜側の強力なサイン。\n・【Step 2】I誘導s波なしは右室中隔を強力に支持。\n・【Step 4】伊藤基準（Q比>1.4またはV1 S≥1.2mV）を満たすと左冠尖からの通電不成功・心外膜側(LV epi)となるため、GCVマッピングへの早期移行が必要。\n・【Step 6】aVLのRSR\'/RR\'パターンはHis束近傍の特徴であり、完全房室ブロック回避のため低出力通電が鉄則。'
      }
    ]
  }
};

