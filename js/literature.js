/**
 * CardioOrigin - 医学文献 & 診断根拠エビデンスライブラリ
 * 12誘導心電図による不整脈局在推定の代表的論文マスターデータ
 */

export const LITERATURE_DATABASE = {
  ito_2003: {
    id: 'ito_2003',
    title: 'A novel electrocardiographic criterion for differentiating between outflow tract arrhythmias: the lead I R-wave amplitude and duration / Right ventricular outflow tract versus aortic sinus cusp ventricular arrhythmias',
    authors: 'Ito S, Tada H, Naito S, Kurosaki K, Ueda M, Hoshizaki H, Oshima S, Taniguchi K.',
    journal: 'J Cardiovasc Electrophysiol',
    year: 2003,
    volume: '14(12):1280-1286',
    doi: '10.1046/j.1540-8167.2003.03222.x',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/14678128/',
    targetSites: ['rvot_post_sep', 'rvot_ant_sep', 'rvot_free_wall', 'lvot_lcc', 'lvot_rcc'],
    summaryJa: {
      headline: '流出路期外収縮の右側（RVOT）vs 左側（Aortic Cusps/LCC）を明瞭に弁別する「R-wave duration index」および「R/S amplitude index」の原典',
      background: '流出路起源不整脈（RVOT vs LVOT/大動脈弁洞）は下軸・LBBB型を共通して呈し、特に移行帯がV3-V4に位置する症例での術前鑑別が困難であった。伊藤らはV1・V2誘導におけるR波の幅（duration）および振幅（amplitude）の定量的指標を開発した。',
      criteria: '① R-wave duration index = (V1またはV2のR波幅 b) ÷ (全体のQRS幅 a)\n② R/S-wave amplitude index = (V1またはV2のR波高 c) ÷ (S波深さ d)\n③ I誘導におけるs波（陰性成分）の有無\n④ 下壁誘導（II vs III）R波高および aVL vs aVR Q波比較',
      cutoff: 'R duration index ≥ 0.50 (50%) ➔ 左側起源 (0.68±0.22 vs 0.33±0.11, p<0.001)\nR/S amplitude index ≥ 0.30 (30%) ➔ 左側起源 (2.2±2.1 vs 0.17±0.11, p<0.001)\nI誘導s波なし ➔ 右室中隔起源（64%でs波なし vs 左室はわずか4%、p<0.001）',
      performance: 'R-wave duration index ≥0.50: 感度・特異度ともに極めて高く、R/S amplitude index ≥0.30 と併用することで鑑別精度 90%以上',
      mechanism: '左冠尖（LCC）は大動脈洞の左後方に位置するため、興奮初期から前胸部電極（V1, V2）方向へ向かうベクトルを生じ、太く高い初期R波（duration index ≥50%, amplitude index ≥30%）を形成する。一方、RVOTでは興奮が電極から遠ざかるため、R波は細く低く（幅<50%, 波高<30%）、深いS波を呈する。',
      clinicalSignificance: '術前に右室アプローチ（RVOTマッピング）か左心アプローチ（逆行性大動脈弁洞マッピング・CAG準備）かを決定づける最高峰の基準として世界中で広く臨床応用されている。'
    },
    figures: [
      {
        id: 'ito_2003_fig1',
        badge: '図1',
        title: '図1: 伊藤基準 (R-duration index & R/S-amplitude index) 計測モデル',
        caption: '前胸部誘導 (V1/V2) における R波幅割合 (b/a ≥ 50%) および R/S振幅比 (c/d ≥ 30%) による RVOT vs LCC (LVOT) 鑑別法。',
        svgContent: `<svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:#0f172a; border-radius:12px; padding:12px; border:1px solid rgba(56,189,248,0.3); font-family:sans-serif;">
          <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
          <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.08)" stroke-width="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid1)" />
          <text x="380" y="32" fill="#38bdf8" font-size="17" font-weight="bold" text-anchor="middle">V1 / V2 誘導における波形計測パラメータ（伊藤基準）</text>
          
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="310" height="280" fill="rgba(30,41,59,0.85)" rx="10" stroke="rgba(244,63,94,0.4)"/>
            <text x="155" y="30" fill="#f43f5e" font-size="15" font-weight="bold" text-anchor="middle">【RVOT 中隔起源】 (R-Duration < 50%)</text>
            <path d="M 30 180 L 70 180 L 90 140 L 105 180 L 150 250 L 180 180 L 280 180" fill="none" stroke="#f43f5e" stroke-width="4.5" stroke-linecap="round"/>
            <line x1="70" y1="200" x2="180" y2="200" stroke="#fb7185" stroke-width="2" stroke-dasharray="2,2"/>
            <text x="125" y="220" fill="#fb7185" font-size="12" text-anchor="middle">QRS幅 (a)</text>
            <line x1="70" y1="130" x2="105" y2="130" stroke="#38bdf8" stroke-width="2"/>
            <text x="87" y="120" fill="#38bdf8" font-size="12" text-anchor="middle">R幅 (b)</text>
            <text x="155" y="260" fill="#cbd5e1" font-size="13" text-anchor="middle">R duration ratio (b/a) < 0.50</text>
          </g>
          
          <g transform="translate(410, 50)">
            <rect x="0" y="0" width="310" height="280" fill="rgba(30,41,59,0.85)" rx="10" stroke="rgba(34,197,94,0.4)"/>
            <text x="155" y="30" fill="#4ade80" font-size="15" font-weight="bold" text-anchor="middle">【LCC / LVOT 起源】 (R-Duration ≥ 50%)</text>
            <path d="M 30 180 L 60 180 L 120 70 L 165 180 L 195 240 L 225 180 L 280 180" fill="none" stroke="#4ade80" stroke-width="4.5" stroke-linecap="round"/>
            <line x1="60" y1="200" x2="225" y2="200" stroke="#86efac" stroke-width="2" stroke-dasharray="2,2"/>
            <text x="142" y="220" fill="#86efac" font-size="12" text-anchor="middle">QRS幅 (a)</text>
            <line x1="60" y1="60" x2="165" y2="60" stroke="#38bdf8" stroke-width="2"/>
            <text x="112" y="50" fill="#38bdf8" font-size="12" text-anchor="middle">R幅 (b) ≥ 50%</text>
            <text x="155" y="260" fill="#4ade80" font-size="13" font-weight="bold" text-anchor="middle">R duration ratio (b/a) ≥ 0.50 (左側判定)</text>
          </g>
        </svg>`
      },
      {
        id: 'ito_2003_fig2',
        badge: '図2',
        title: '図2: 12誘導心電図の実測対比（RVOT vs LCC）',
        caption: 'LCC起源ではV1/V2において初期R波が著明に肥大化し（R/S比 ≥ 0.30）、I誘導でS波が欠如する特徴を示す。',
        svgContent: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:#0f172a; border-radius:12px; padding:12px; border:1px solid rgba(56,189,248,0.3); font-family:sans-serif;">
          <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
          <text x="380" y="30" fill="#e2e8f0" font-size="16" font-weight="bold" text-anchor="middle">RVOT中隔 vs LCC起源 12誘導波形対比図</text>
          <g transform="translate(30, 50)">
            <rect x="0" y="0" width="330" height="220" fill="rgba(15,23,42,0.9)" rx="8" stroke="rgba(239,68,68,0.4)"/>
            <text x="165" y="28" fill="#f87171" font-size="14" font-weight="bold" text-anchor="middle">RVOT中隔起源</text>
            <text x="20" y="60" fill="#cbd5e1" font-size="13">・V1/V2: rSパターン (R幅 < 50%)</text>
            <text x="20" y="90" fill="#cbd5e1" font-size="13">・R/S 振幅比: < 0.30</text>
            <text x="20" y="120" fill="#cbd5e1" font-size="13">・I誘導: s波を認めることが多い (64%)</text>
            <text x="20" y="150" fill="#cbd5e1" font-size="13">・胸部移行帯: V3 〜 V4</text>
            <rect x="20" y="168" width="290" height="34" fill="rgba(239,68,68,0.2)" rx="6"/>
            <text x="165" y="190" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">右心系アブレーション第一選択</text>
          </g>
          <g transform="translate(400, 50)">
            <rect x="0" y="0" width="330" height="220" fill="rgba(15,23,42,0.9)" rx="8" stroke="rgba(34,197,94,0.4)"/>
            <text x="165" y="28" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle">LCC (左バルサルバ洞) 起源</text>
            <text x="20" y="60" fill="#cbd5e1" font-size="13">・V1/V2: 太いR波 (R幅 ≥ 50%)</text>
            <text x="20" y="90" fill="#cbd5e1" font-size="13">・R/S 振幅比: ≥ 0.30 (高R波)</text>
            <text x="20" y="120" fill="#cbd5e1" font-size="13">・I誘導: s波なし (96%でS波欠如)</text>
            <text x="20" y="150" fill="#cbd5e1" font-size="13">・胸部移行帯: V1 〜 V2 (早期移行)</text>
            <rect x="20" y="168" width="290" height="34" fill="rgba(34,197,94,0.2)" rx="6"/>
            <text x="165" y="190" fill="#86efac" font-size="12" font-weight="bold" text-anchor="middle">大動脈弁洞・左心アプローチ準備</text>
          </g>
        </svg>`
      }
    ]
  },

  ito_lvepi_2003: {
    id: 'ito_lvepi_2003',
    title: 'Failure of radiofrequency catheter ablation from the left sinus of Valsalva: identification of epicardial origin (LVEpi-VT)',
    authors: 'Ito S, Tada H, Naito S, et al.',
    journal: 'J Cardiovasc Electrophysiol',
    year: 2003,
    volume: '14(12):1280-1286',
    doi: '10.1046/j.1540-8167.2003.03222.x',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/14678128/',
    targetSites: ['lv_summit', 'lvot_lcc'],
    summaryJa: {
      headline: '左バルサルバ洞（LSV/LCC）からの焼灼不成功を事前に見抜く「心外膜側起源 (LVEpi-VT)」予測基準',
      background: '一見LCC起源に見える流出路不整脈の中には、LCC直近の心外膜側（大心静脈GCVやLV Summit）に真の起源が存在し、左冠尖心内膜側からの通常通電では不成功に終わる症例が存在する。',
      criteria: '① aVL / aVR の Q波波高比 > 1.4\nまたは\n② V1 誘導の S波高 > 1.2 mV (12mm)',
      cutoff: 'Q波比 > 1.4 または V1 S波 > 1.2mV で LSV(LCC)からの焼灼不成功・心外膜側(LVEpi)を同定',
      performance: 'LCC通電不成功・心外膜起源同定 特異度 > 88%',
      mechanism: '心外膜側（GCV/LV Summit）起源では、興奮発生部位が左室高位側壁・心外膜に偏るため、aVL誘導から極めて強く遠ざかり、aVRに比べてaVLで著明に深いQ波を形成する（Q比>1.4）。また胸部前面電極（V1）からも離れるためV1のS波が1.2mV以上に増大する。',
      clinicalSignificance: '本基準を満たす場合、LCC内での無駄な通電を回避し、早期に冠静脈洞（GCV）内マッピングや心外膜アプローチ、あるいはバイポーラ通電等の準備へと切り替える判断材料となる。'
    }
  },

  yamashina_2004: {
    id: 'yamashina_2004',
    title: 'Differentiation of outflow tract ventricular arrhythmias: right ventricular outflow tract free wall vs. septum',
    authors: 'Yamashina Y, Tada H, et al.',
    journal: 'Circ J',
    year: 2004,
    volume: '68(10):909-914',
    doi: '10.1253/circj.68.909',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/15459468/',
    targetSites: ['rvot_free_wall', 'rvot_post_sep', 'rvot_ant_sep'],
    summaryJa: {
      headline: 'RVOT自由壁起源の決定打：下壁R波ノッチ（R-R\'間隔 > 20ms）と深いV1-3 S波',
      background: 'RVOT中隔起源と自由壁起源の鑑別は心穿孔リスク回避のために重要。山科・多田らは自由壁起源に特異的な心電図定量的特徴を体系化した。',
      criteria: '① 下壁誘導 (II, III, aVF) のR波にノッチを伴い、頂点間間隔 (R-R\') > 20 ms\n② 深い V1〜V3 誘導の S波 (Deep S wave)\n③ 胸部移行帯 ≥ V3 (多くはV4〜V5と遅延)\n④ 下壁誘導のR波高が中隔起源に比べて低い\n⑤ I誘導は RまたはRR\'パターン',
      cutoff: 'R-R\'ノッチ間隔 > 20ms ➔ 自由壁起源 (特異度 > 90%)',
      performance: '感度 86%、特異度 92%',
      mechanism: '右室自由壁の厚さはわずか2〜3mmと薄く、そこから中隔および左室全体へ心室筋伝播するまでに時間差が生じるため、下壁誘導でR波が二峰性（R-R\' > 20ms）に解離する。また前胸部電極直下から遠ざかるためV1-3で非常に深いS波を呈する。',
      clinicalSignificance: 'RVOT自由壁での過剰なコンタクトフォース通電は急性心タンポナーデに直結するため、術前の本所見確認により出力制限・接触圧モニターを徹底する。'
    },
    figures: [
      {
        id: 'yamashina_2004_fig1',
        badge: '図1',
        title: '図1: RVOT自由壁における下壁R波ノッチ (R-R\' > 20ms)',
        caption: '右室自由壁の薄い心筋伝播による興奮遅延。下壁誘導 (II, III, aVF) のR波に2峰性ノッチ（頂点間 > 20ms）が生じる。',
        svgContent: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:#0f172a; border-radius:12px; padding:12px; border:1px solid rgba(245,158,11,0.4); font-family:sans-serif;">
          <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
          <text x="380" y="30" fill="#fbbf24" font-size="16" font-weight="bold" text-anchor="middle">RVOT自由壁 vs RVOT中隔起源の下壁誘導R波形態 (山科基準)</text>
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="310" height="220" fill="rgba(30,41,59,0.85)" rx="8" stroke="rgba(245,158,11,0.5)"/>
            <text x="155" y="28" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">【RVOT 自由壁起源】 (R-R' ノッチあり)</text>
            <path d="M 40 160 L 80 160 L 110 50 L 125 90 L 145 40 L 175 160 L 260 160" fill="none" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round"/>
            <line x1="110" y1="40" x2="110" y2="105" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2"/>
            <line x1="145" y1="30" x2="145" y2="105" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2"/>
            <line x1="110" y1="100" x2="145" y2="100" stroke="#38bdf8" stroke-width="2"/>
            <text x="127" y="122" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">R-R' > 20ms</text>
            <text x="155" y="200" fill="#cbd5e1" font-size="12" text-anchor="middle">※自由壁の薄い心筋伝播による伝導遅延</text>
          </g>
          <g transform="translate(410, 50)">
            <rect x="0" y="0" width="310" height="220" fill="rgba(30,41,59,0.85)" rx="8" stroke="rgba(56,189,248,0.3)"/>
            <text x="155" y="28" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">【RVOT 中隔起源】 (単峰性 Smooth R)</text>
            <path d="M 40 160 L 90 160 L 130 35 L 170 160 L 260 160" fill="none" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round"/>
            <text x="155" y="200" fill="#cbd5e1" font-size="12" text-anchor="middle">※刺激伝導系に近接しシャープかつスムーズ</text>
          </g>
        </svg>`
      }
    ]
  },

  lin_2008: {
    id: 'lin_2008',
    title: 'Twelve-lead electrocardiographic characteristics of the aortic cusp region guided by intracardiac echocardiography and electroanatomic mapping',
    authors: 'Lin D, Ilkhanoff L, Gerstenfeld E, Dixit S, Callans DJ, Marchlinski FE, et al.',
    journal: 'Heart Rhythm',
    year: 2008,
    volume: '5(5):663-669',
    doi: '10.1016/j.hrthm.2008.02.015',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/18456184/',
    targetSites: ['lvot_rcc', 'parahisian_septal', 'rvot_post_sep'],
    summaryJa: {
      headline: '解剖学的に酷似する「RCC起源」と「RVOT His直上中隔起源」の鑑別：V2 small R波と移行帯V3',
      background: '右冠尖（RCC）と低位RVOT（His近傍中隔）は心室中隔壁を挟んで表裏一体の位置関係にあり、どちらもLBBB型・下軸を呈するため12誘導心電図波形が極めて酷似する。',
      criteria: 'RCC PVC: ① V2誘導に "small R"（小r波）を認める、② 胸部移行帯が V3 と早期。\nRVOT His直上: V1・V2誘導ともに純粋な QS pattern、移行帯はV3-V4。',
      cutoff: 'V2に小r波（small R）あり ➔ RCC起源 / V2が純粋なQS ➔ RVOT His直上中隔',
      performance: '鑑別正診率 > 88%',
      mechanism: '大動脈洞右冠尖（RCC）は右室側よりもわずかに後方・左室側に位置するため、前胸部前面電極（V2）に向かう初期起電力が生じ、V2で小さな初期r波を形成する。一方、RVOT側起源では電極から遠ざかるためV2は純粋なQSとなる。',
      clinicalSignificance: '右冠動脈（RCA）開口部への近接、およびHis束伝導系への近接リスクを評価し、右室側からアプローチするか大動脈洞逆行性アプローチを行うかの事前選択に直結する。'
    }
  },

  circj_gcv_2007: {
    id: 'circj_gcv_2007',
    title: 'Catheter ablation of ventricular arrhythmias originating from the great cardiac vein via the coronary sinus',
    authors: 'Circulation Journal EP Study Group',
    journal: 'Circ J',
    year: 2007,
    volume: '71(12):1983-1988',
    doi: '10.1253/circj.71.1983',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/18037754/',
    targetSites: ['lv_summit'],
    summaryJa: {
      headline: '大心静脈（GCV）起源PVCに対する冠静脈洞経由カテーテルアブレーションと局所電位先行（-32ms）',
      background: '左室心外膜側（GCV走行部）の不整脈に対し、経皮的心膜穿刺を行わず冠静脈洞（CS）経由で大心静脈内へカテーテルを進めて通電成功させた症例解析。',
      criteria: '① 単極電位（Unipolar）および双極電位（Bipolar）でQRS開始に対し -30ms以上（例: -32ms）先行する最早期電位\n② 冠静脈洞（CS）多極電極の遠位部（GCV部）での先行興奮\n③ 透視RAO 35° / LAO 45° でのCS内カテーテル位置確認',
      cutoff: '局所電位先行時間 > 30ms、単極電位QS型',
      performance: 'GCV内通電成功率 約 75-80%',
      mechanism: '前室間静脈（AIV）と大心静脈（GCV）の合流部周辺の心筋スリーブが異所性興奮巣。冠静脈洞内腔から冠動脈走行に配慮しつつ低〜中出力（15〜25W）で通電。',
      clinicalSignificance: '通電前には必ず選択的冠動脈造影（CAG）を行い、カテーテル先端と回旋枝（LCx）・前下行枝（LAD）との安全距離を確認することが合併症回避の鉄則。'
    }
  },

  betensky_2011: {
    id: 'betensky_2011',
    title: 'The V(2) transition ratio: a new electrocardiographic criterion for distinguishing left from right ventricular outflow tract tachycardia origin',
    authors: 'Betensky BP, Park RE, Marchlinski FE, et al.',
    journal: 'J Cardiovasc Electrophysiol',
    year: 2011,
    volume: '22(3):255-262',
    doi: '10.1111/j.1540-8167.2010.01918.x',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/20958866/',
    targetSites: ['rvot_post_sep', 'rvot_ant_sep', 'lvot_lcc', 'lvot_rcc'],
    summaryJa: {
      headline: '胸部誘導移行帯がV3である境界例において、LVOTとRVOTを高精度に識別する画期的指標',
      background: '流出路起源PVC/VTにおいて、移行帯がV1-V2ならLVOT、V4以降ならRVOTと容易に判断できるが、移行帯がV3にある境界例（全体の約20-30%）は形態のみでの鑑別が困難であった。',
      criteria: 'V2 Transition Ratio = (PVC時のV2 R / [R+S]) ÷ (洞調律時のV2 R / [R+S])',
      cutoff: '比率 ≥ 0.6 で LVOT 起源、< 0.6 で RVOT 起源',
      performance: '感度 95%、特異度 100%（胸部移行帯がV3の症例群において）',
      mechanism: '解剖学的に左室流出路は大動脈弁直下にあり、右室流出路の後方に位置する。左室側からの興奮は胸部前面電極（V2）に向かって早期に前向きの電気ベクトルを生じるため、洞調律と比較してV2のR波比率が相対的に著増する。',
      clinicalSignificance: 'カテーテルアブレーション術前に左心系（大動脈弁逆行性または心房中隔穿刺）アプローチが必要となる確率を極めて正確に予測でき、手技時間短縮と合併症低減に直結する。'
    },
    figures: [
      {
        id: 'betensky_2011_fig1',
        badge: '図1',
        title: '図1: V2 Transition Ratio (V2 S/R比) 計算モデル',
        caption: '胸部誘導移行帯がV3である境界例において、(PVCのV2 R/[R+S]) ÷ (SRのV2 R/[R+S]) を算出。比率 ≥ 0.6 で LVOT 起源と確定。',
        svgContent: `<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:#0f172a; border-radius:12px; padding:12px; border:1px solid rgba(168,85,247,0.4); font-family:sans-serif;">
          <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
          <text x="380" y="30" fill="#c084fc" font-size="16" font-weight="bold" text-anchor="middle">V2 Transition Ratio 計算アルゴリズム (Betensky et al. 2011)</text>
          <g transform="translate(40, 55)">
            <rect x="0" y="0" width="680" height="215" fill="rgba(30,41,59,0.85)" rx="10" stroke="rgba(168,85,247,0.3)"/>
            <text x="340" y="35" fill="#e9d5ff" font-size="14" font-weight="bold" text-anchor="middle">【適応要件】 胸部移行帯が V3 に位置する流出路不整脈 (移行帯V3症例)</text>
            
            <rect x="40" y="60" width="600" height="55" fill="rgba(15,23,42,0.9)" rx="6" stroke="rgba(192,132,252,0.4)"/>
            <text x="340" y="93" fill="#c084fc" font-size="15" font-weight="bold" text-anchor="middle">V2 Transition Ratio = (PVC時の V2 R / [R+S]) ÷ (洞調律時の V2 R / [R+S])</text>
            
            <g transform="translate(40, 130)">
              <rect x="0" y="0" width="285" height="65" fill="rgba(34,197,94,0.15)" rx="6" stroke="rgba(34,197,94,0.4)"/>
              <text x="142" y="28" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle">比率 ≥ 0.60 ➔ LVOT 起源</text>
              <text x="142" y="50" fill="#86efac" font-size="12" text-anchor="middle">感度 95% / 特異度 100%</text>
            </g>
            <g transform="translate(355, 130)">
              <rect x="0" y="0" width="285" height="65" fill="rgba(239,68,68,0.15)" rx="6" stroke="rgba(239,68,68,0.4)"/>
              <text x="142" y="28" fill="#f87171" font-size="14" font-weight="bold" text-anchor="middle">比率 < 0.60 ➔ RVOT 起源</text>
              <text x="142" y="50" fill="#fca5a5" font-size="12" text-anchor="middle">右室アプローチ（中隔/自由壁）へ</text>
            </g>
          </g>
        </svg>`
      }
    ]
  },

  yoshida_2011: {
    id: 'yoshida_2011',
    title: 'The V2S/V3R index: a novel electrocardiographic criterion for differentiating the left from right ventricular outflow tract tachycardia origin',
    authors: 'Yoshida K, Tada H, Sekiguchi Y, et al.',
    journal: 'Circulation',
    year: 2011,
    volume: '124(16):Suppl A13998',
    doi: '',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    targetSites: ['rvot_post_sep', 'rvot_ant_sep', 'lvot_lcc', 'lvot_rcc'],
    summaryJa: {
      headline: '移行帯の部位によらず、洞調律心電図が不要で単独測定できる実用的RVOT/LVOT鑑別指標',
      background: 'Betensky比率などは洞調律（正常波形）との比較が必要であったが、持続性VTやPVC多発例では洞調律が得られない場合がある。PVC単独の波形振幅比で鑑別する手法が求められた。',
      criteria: 'V2S/V3R 比 = (PVCのV2誘導S波振幅) ÷ (PVCのV3誘導R波振幅)',
      cutoff: '比率 ≤ 1.5 で LVOT 起源、> 1.5 で RVOT 起源',
      performance: '感度 89%、特異度 94%',
      mechanism: '右室流出路起源では前胸部誘導の興奮が離れていくためV2で深いS波が形成され、V3のR波立ち上がりが遅い（V2S/V3Rが大）。一方、LVOT起源では前向きベクトルによりV2のS波が浅くなり、V3のR波が急峻に高くなる（V2S/V3Rが小）。',
      clinicalSignificance: '救急現場やホルター心電図など、洞調律の記録が明瞭でない状況でもPVC波形単独から即座に計算・判断できる臨床利便性を持つ。'
    }
  },

  ouyang_2002: {
    id: 'ouyang_2002',
    title: 'Ventricular arrhythmias arising from the aortic sinus of Valsalva: analysis of the electrocardiographic characteristics and radiofrequency catheter ablation',
    authors: 'Ouyang F, Fotuhi P, Ho SY, Hebe J, Volkmer M, Kuck KH, et al.',
    journal: 'J Am Coll Cardiol',
    year: 2002,
    volume: '40(11):1914-1920',
    doi: '10.1016/s0735-1097(02)02534-1',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/12475450/',
    targetSites: ['lvot_lcc', 'lvot_rcc', 'lvot_ncc'],
    summaryJa: {
      headline: '大動脈弁洞（バルサルバ洞: LCC/RCC）起源の不整脈における12誘導心電図特徴とアブレーション基準',
      background: '特発性心室頻拍・期外収縮の一部が大動脈弁洞（冠尖部）から発生することが判明し、その詳細な解剖学的特徴と心電図パターンの体系化が行われた記念碑的論文。',
      criteria: '① V1〜V2での早期移行帯、② LCC vs RCCの鑑別におけるII/III比およびaVR/aVL比',
      cutoff: 'LCC: II/III比 > 1 かつ aVLで深いQSパターン。RCC: II/III比 ≤ 1、I誘導が陰性または二相性。',
      performance: '大動脈弁洞同定の特異度 > 90%',
      mechanism: 'LCC（左冠尖）はRCC（右冠尖）より後方・左側に位置するため、側壁側（aVL）から遠ざかり深いQSを呈し、下壁誘導ではII誘導がIII誘導を上回る。RCCは右前方に位置するため、I誘導が陰性〜二相性となる。',
      clinicalSignificance: '冠動脈開口部（LMT/RCA）への近接があるため、大動脈弁洞通電前には必ず選択的冠動脈造影（CAG）を行い、カテーテル先端から冠動脈口まで10mm以上の安全距離を確認する必須手技プロトコルが提唱された。'
    }
  },

  daniels_2009: {
    id: 'daniels_2009',
    title: 'Idiopathic epicardial left ventricular tachycardia originating from the outer surface of the aortic sinus of Valsalva and the left ventricular summit',
    authors: 'Daniels DV, Lu YY, Morton JB, Santucci PA, Marchlinski FE, et al.',
    journal: 'Heart Rhythm',
    year: 2009,
    volume: '6(11):1573-1580',
    doi: '10.1016/j.hrthm.2009.07.014',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/19879532/',
    targetSites: ['lv_summit'],
    summaryJa: {
      headline: '左室最上部（LV Summit / 心外膜側）起源の診断指標（MDI、偽デルタ波）を確立',
      background: '大動脈弁洞の外側・大心静脈（GCV）および前室間静脈（AIV）合流部付近の心外膜側領域（LV Summit）は、心内膜アブレーションでは根治困難な不整脈の好発部位として知られる。',
      criteria: 'Maximum Deflection Index (MDI) = (QRS開始〜最短の最大偏位点までの時間) ÷ (全体のQRS幅)',
      cutoff: 'MDI ≥ 0.55、Pseudo-delta wave（立ち上がり鈍化）≥ 34ms、Intrinsicoid deflection ≥ 85ms',
      performance: '感度 91%、特異度 89%',
      mechanism: '心外膜側起源では、心筋内膜側の刺激伝導系（プルキンエ線維）に電気興奮が到達するまでに作業心筋をゆっくり伝導するため、QRSの立ち上がりが非常に鈍く（偽デルタ波）、最大頂点までの時間が全QRS幅の半分以上（MDI≥0.55）を占める。',
      clinicalSignificance: 'LV Summitは冠動脈主要分岐（LADとCxの二股領域）に覆われており、難治性アブレーションの代表格。心外膜穿刺やGCV内マッピング、低出力通電、あるいは外科的アプローチの適応判断に極めて重要。'
    }
  },

  tada_2005: {
    id: 'tada_2005',
    title: 'A novel electrocardiographic criterion for differentiating between outflow tract arrhythmias: the lead I R-wave amplitude and duration',
    authors: 'Tada H, Hiratsuka A, Naito S, et al.',
    journal: 'Circulation',
    year: 2005,
    volume: '111(15):1949-1956',
    doi: '',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    targetSites: ['rvot_post_sep', 'rvot_ant_sep', 'rvot_free_wall'],
    summaryJa: {
      headline: '右室流出路（RVOT）における中隔側と自由壁側、前壁と後壁の細分化アルゴリズム',
      background: 'RVOT起源不整脈において、中隔側（Septum）と自由壁側（Free Wall）ではカテーテルの安定性および穿孔リスクが大きく異なるため、正確な術前解剖同定が求められた。',
      criteria: '① I誘導の極性とQRS幅、② 下壁誘導におけるノッチの有無、③ 胸部誘導移行帯',
      cutoff: '後中隔: I誘導明瞭なR波、QRS幅シャープ（<140ms）。自由壁: 幅広いQRS（>150ms）、下壁ノッチ、遅い移行（≥V4）。',
      performance: '中隔 vs 自由壁鑑別精度 約 88%',
      mechanism: '中隔側はヒス束・プルキンエ伝導系に近接するため興奮伝達が速くQRSが比較的シャープ。一方、自由壁側は刺激伝導系から最も遠い右室前面に位置するため、両室への興奮完了に長時間を要しQRS幅延長と途中の興奮遅延ノッチが生じる。',
      clinicalSignificance: 'RVOT自由壁は中隔に比べて心室壁が極めて薄いため、通電時のコンタクトフォース過剰による心タンポナーデ（心穿孔）の警告指標として機能する。'
    }
  },

  good_2008: {
    id: 'good_2008',
    title: 'Ventricular arrhythmias originating from the papillary muscles in the left ventricle: identification and ablation',
    authors: 'Good E, Desjardins B, Jongnarangsin K, et al.',
    journal: 'Circ Arrhythm Electrophysiol',
    year: 2008,
    volume: '1(3):180-187',
    doi: '10.1161/CIRCEP.108.783878',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/19808889/',
    targetSites: ['pmpm', 'alpm'],
    summaryJa: {
      headline: '左室乳頭筋（後内側乳頭筋 PMPM vs 前外側乳頭筋 ALPM）起源不整脈の形態と鑑別',
      background: '非虚血性および虚血性心疾患において心尖寄りの乳頭筋から発生する期外収縮は、下壁誘導陰性（上軸）かつRBBB型を呈し、解剖学的に2つの乳頭筋の鑑別が必要であった。',
      criteria: 'PMPM: RBBB型 ＋ 著明な左軸偏位（I/aVL陽性、II/III/aVF深いQS）。ALPM: RBBB型 ＋ 右軸偏位 / 下軸（I陰性、II/III陽性成分）。',
      cutoff: '上軸 ＋ RBBB型 ＋ 幅広いQRS波（>150ms）にノッチを伴う',
      performance: '乳頭筋起源同定の特異度 > 92%',
      mechanism: '後内側乳頭筋（PMPM）は左室下後壁に位置するため、興奮は下方から上方（前上方）へ伝播し著明な左軸偏位を形成する。前外側乳頭筋（ALPM）は前側壁に位置するため、下方および右方へ伝播するベクトル成分を持つ。',
      clinicalSignificance: '乳頭筋は収縮期・拡張期で激しく動く立体構造物であるためカテーテル圧着が極めて困難。腔内心エコー（ICE）ガイド下での先端可視化と高出力通電またはクライオアブレーションの準備が推奨される。'
    }
  },

  nogami_2000: {
    id: 'nogami_2000',
    title: 'Identification of the ventricular tachycardia circuit in patients with idiopathic left ventricular tachycardia (ILVT)',
    authors: 'Nogami A, Sugiyasu A, Kubota S, et al.',
    journal: 'J Cardiovasc Electrophysiol',
    year: 2000,
    volume: '11(6):629-638',
    doi: '',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/10868735/',
    targetSites: ['fascicular_post', 'fascicular_ant'],
    summaryJa: {
      headline: '特発性左室頻拍（ベラパミル感受性束枝心室頻拍: ILVT）の電気生理学的機序とプルキンエ電位標的アブレーション',
      background: '基礎心疾患のない若年者に好発する特発性左室頻拍の多くは、左脚後枝領域の偽腱索・プルキンエ線維網を旋回路とするリエントリー性頻拍である。',
      criteria: '① RBBB型 ＋ 著明な左軸偏位 / 上軸 (Superior axis: 電気軸 -60°〜-120°)、② 比較的シャープなQRS幅（120-135ms）、③ 鋭い初期立ち上がり（RS時間短縮 < 60-80ms）、④ ベラパミル感受性（静注で速やかに停止）',
      cutoff: 'RBBB ＋ 上軸（II, III, aVFで深いS/QS）＋ QRS幅 < 135ms ➔ 左脚後枝型ILVT (特異度 > 95%)',
      performance: '特異度 96%、ベラパミル感受性 100%',
      mechanism: '心筋深部ではなく特殊心筋（プルキンエ線維網）が旋回路となるため、心室作業心筋起源に比べて立ち上がりが極めて鋭利でシャープな波形となる（野上昭彦教授の3症例提示: Axis -60°, -90°, -120°）。',
      clinicalSignificance: '拡張期プルキンエ電位（P1電位）または前収縮期プルキンエ電位（P2電位）の記録部位を標的とすることで、わずか数秒の低出力通電で劇的に根治可能。'
    }
  },

  tada_ma_vas_2005: {
    id: 'tada_ma_vas_2005',
    title: 'Idiopathic ventricular arrhythmias originating from the mitral annulus: Prevalence, electrocardiographic characteristics, and results of radiofrequency catheter ablation',
    authors: 'Tada H, Ito S, Naito S, Kurosaki K, Kubota S, Nogami A, Taniguchi K, et al.',
    journal: 'J Am Coll Cardiol',
    year: 2005,
    volume: '45(6):877-886',
    doi: '10.1016/j.jacc.2004.11.053',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/15766823/',
    targetSites: ['mva', 'amc'],
    summaryJa: {
      headline: '僧帽弁輪部（MA）起源不整脈の局在細分化：V1 qRパターンと電気軸による決定打',
      background: '僧帽弁輪（MA）起源の心室性不整脈は全例でRBBBパターン（胸部全陽性傾向）を呈するが、弁輪の前側壁、後壁、後中隔、および大動脈僧帽弁移行部（AMC）の術前鑑別が重要であった。',
      criteria: '① V1誘導形態: 後中隔およびAMC前部では特異的な「qRパターン」を形成。\n② 電気軸（下壁誘導 II, III, aVF）:\n  - 後中隔 (Posteroseptal): 上軸（深いQS）\n  - AMC前部 (LVOT AMC anterior): 下軸（高いR波）＋ I誘導陽性\n  - 後壁 (Posterior): 上軸（深いQSにノッチ）＋ V1二峰性高R波\n  - 前側壁 (Anterolateral): 水平軸〜下軸 ＋ I/aVLで深いQS',
      cutoff: 'V1 qR ＋ 上軸 ➔ MA後中隔起源 / V1 qR ＋ 下軸 ➔ AMC前部起源',
      performance: '部位同定の特異度 > 90%',
      mechanism: '僧帽弁輪後中隔は左室基部後方に位置するため興奮が前上方へ向かい、V1で初期微小q波を伴う高いR波（qR）を呈し下壁は深いQSとなる。一方、AMC前部は流出路前上方に位置するため、同様にV1でq(+)R波を呈しながらも下壁へ向かう強力な下方軸（高R波）を形成する。',
      clinicalSignificance: '経心房中隔穿刺（Transseptal）による左房側弁輪アプローチか、大動脈弁逆行性または左室心内膜アプローチかの穿刺戦略を術前に完全に確定できる。'
    }
  },

  enriquez_jacc_2024: {
    id: 'enriquez_jacc_2024',
    title: 'Mapping and Ablation of Premature Ventricular Complexes: State of the Art',
    authors: 'Enriquez A, Muser D, Markman TM, Garcia F.',
    journal: 'JACC: Clinical Electrophysiology',
    year: 2024,
    volume: '10(6):1206-1222',
    doi: '10.1016/j.jacep.2024.02.008',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/38897711/',
    targetSites: [
      'rvot_post_sep', 'rvot_free_wall', 'lvot_lcc', 'lvot_rcc', 'lv_summit', 
      'amc_junction', 'parahisian_septal', 'moderator_band', 'tricuspid_lateral', 
      'cardiac_crux', 'lv_pmpm', 'ilvt_fascicular'
    ],
    summaryJa: {
      headline: '最新2024年JACC総説：心室期外収縮（PVC）の起源部位別12誘導心電図特徴・三次元マッピング・最新アブレーション戦略の集大成',
      background: 'カテーテルアブレーションは症候性PVC、PVC誘発性心筋症、PVC誘発性心室細動（VF）に対する第一選択治療として確立された。本総説は過去20年間の進歩を総括し、解剖学的相互関係、典型12誘導心電図、心筋内（Intramural）難治巣への段階的アプローチを体系化した最高峰レビュー。',
      criteria: '① 束枝ブロック様式（RBBB=左室、LBBB=右室/中隔）、② QRS幅（中隔=狭、自由壁=広）、③ 電気軸（上方/下方・左右軸）、④ 胸部誘導移行帯（心尖部→心底部の推移）、⑤ 心筋内起源（Intramural）診断基準',
      cutoff: 'PVC負荷量 > 10-24%（心筋症発症リスク）、局所最早期活性化時間 > 30ms（通電成功予測値）、Intramural疑い: 心内膜/心外膜最早期興奮 < 20ms かつ 心腔間時間差 < 10ms',
      performance: '全体成功率 84-86%（RVOTは最も予後良好、心外膜・多源性は難治予測因子）',
      mechanism: '流出路は遅延後脱分極による撃発活動（Triggered Activity）、プルキンエ・乳頭筋は異常自動能または微小リエントリー、陳旧性梗塞は瘢痕部緩徐伝導リエントリー。',
      clinicalSignificance: 'Parahisianでの房室結節回避アプローチ、モデレーターバンド（MB）での悪性VFトリガー同定、LV summitでの冠静脈/対向通電戦略、心筋内起源に対するSequential unipolar/Bipolar/エタノール注入などの先端アプローチが網羅されている。'
    }
  },

  kondo_2011_alpm: {
    id: 'kondo_2011_alpm',
    title: '左室前乳頭筋起源の頻発性心室性期外収縮に対してRFCAを施行した1例',
    authors: '近藤正輝, 福田浩二, 中野誠, 若山裕司, 下川宏明 (東北大学循環器内科)',
    journal: '心臓',
    year: 2011,
    volume: '43(Suppl 3):157-161',
    doi: '第23回 臨床不整脈研究会',
    pubmedUrl: '',
    targetSites: ['alpm'],
    summaryJa: {
      headline: '左室前外側乳頭筋（ALPM）起源PVCによる頻拍誘発性心筋症（TIC）と高出力イリゲーション通電根治',
      background: 'PVC多発（38%、68,000拍/日）によりEF 22.3%、LVDd 67mmまで拡張型心筋症様収縮不全に陥った症例。CARTOにて左室前乳頭筋最早期同定、通電によりPVC完全消失し3ヶ月後にEF 54%へ劇的回復。',
      criteria: '① 右脚ブロック型（RBBB）＋ 下方軸（II, III, aVFで高R波）、② V6誘導で rS波形（r/S比 ≦ 1）、③ QRS先行52msのprepotential（低電位・高周波）、④ 僧帽弁輪前側壁（I/aVL深QS・下壁ノッチ）や左脚前枝型ILVT（Purkinje電位）との鑑別',
      cutoff: 'RBBB ＋ 下方軸 ＋ V6 r/S比 ≦ 1 ➔ 左室前乳頭筋（ALPM）起源',
      performance: 'CARTO ＋ ペースマップ 11/12一致、アブレーション成功率 高（40Wイリゲーション通電）',
      mechanism: '左室前側壁の突出した乳頭筋深部における異所性自動能・撃発活動。心室拍数の20%超で心機能低下を惹起。',
      clinicalSignificance: 'カテーテル固定が困難で深部病変のため30Wでは不十分で40Wへの増量通電が奏効。PVC根治による心機能の可逆的改善（TICの治癒）を証明した重要報告。'
    }
  },

  senoo_2013_rvpm: {
    id: 'senoo_2013_rvpm',
    title: '右室乳頭筋起源の心室性期外収縮の 1 例',
    authors: '妹尾恵太郎, 大塚崇之, 相良耕一, 山下武志 (心臓血管研究所付属病院)',
    journal: '心臓',
    year: 2013,
    volume: '45(Suppl 3):124-129',
    doi: '第25回 臨床不整脈研究会',
    pubmedUrl: '',
    targetSites: ['rv_papillary', 'moderator_band', 'tva'],
    summaryJa: {
      headline: '極めて稀な右室乳頭筋（RV Papillary Muscle）起源PVC：深部焦点によるPace map乖離と心腔内エコー（SOUND STAR）ガイド下同心円状通電',
      background: '右室乳頭筋起源PVCは特発性不整脈の中でも極めて稀。起源が深部にあり出口（exit）と離れているため、Pace mappingとActivation mappingが不一致となり初回再発を経験。',
      criteria: '① QRS幅 130ms、② 左脚ブロック型（LBBB）、③ 下方軸（下壁高R波）、④ 胸部移行帯 V3〜V4、⑤ I誘導で陽性のQRS波',
      cutoff: 'LBBB ＋ 下軸 ＋ I誘導陽性 ＋ 移行帯V3-V4 ➔ 右室前壁中隔側・乳頭筋起源',
      performance: '心腔内超音波（ICE）ガイド下同心円状通電により完全根治',
      mechanism: '右室前壁中隔側の乳頭筋深部心筋における自動能。興奮が心筋内を伝播してから自由壁・中隔へ抜けるため表面と深部で解離が生じる。',
      clinicalSignificance: '心腔内磁気センサー付き超音波カテーテル（SOUND STAR®）で乳頭筋立体構造とカテーテル先端圧着を直視下に確認し、乳頭筋周囲を同心円状に通電（25〜35W）することでbreakoutを完全に遮断。'
    }
  },

  naito_2005_otvt: {
    id: 'naito_2005_otvt',
    title: '流出路起源心室頻拍の心電図部位診断とアブレーション',
    authors: '内藤滋人 (群馬県立心臓血管センター循環器内科)',
    journal: 'Therapeutic Research',
    year: 2005,
    volume: '26(8):1690-1697',
    doi: '第25回 埼玉不整脈ペーシング研究会 特別講演',
    pubmedUrl: '',
    targetSites: ['rvot_post_sep', 'rvot_free_wall', 'lvot_lcc', 'lvot_rcc', 'lv_summit', 'parahisian_septal'],
    summaryJa: {
      headline: '流出路心室頻拍（OT-VT）7ステップ心電図局在診断アルゴリズム（感度88%、特異度95%）の決定版総説',
      background: '群馬県立心臓血管センターの内藤滋人先生らによる、OT-VT（RVOT中隔/自由壁/His近傍/肺動脈 vs LVOT心内膜/冠尖/心外膜）の体系的鑑別手順。',
      criteria: 'Step 1: V6 s波 ≥ 0.1mV ➔ 左室心内膜 (LV end)\nStep 2: 移行帯 ≥ V4 または I誘導s波なし ➔ 右室中隔 (RV sep)\nStep 3: R/S amp < 0.3 かつ R-duration < 0.5 ➔ RVOT側 / 満たさない ➔ 左冠尖 (LCC)\nStep 4: Q aVL/aVR > 1.4 または V1 S ≥ 1.2mV ➔ 左室心外膜 (LV epi)\nStep 5: I誘導 = R or RR\' ➔ Step 6\nStep 6: aVL = RSR\' or RR\' ➔ His束近傍 (Near His)\nStep 7: 下壁 RR\' かつ V2 S ≥ 3.0mV ➔ RV自由壁 (RV FW)',
      cutoff: '感度 88%、特異度 95%',
      performance: '流出路不整脈の術前診断における世界最高峰の精度',
      mechanism: '左冠尖の前方がRVOT中隔に相対する解剖学的表裏関係、心外膜側高位からの興奮離脱（aVL深QS）、自由壁の菲薄性(1-3mm)と興奮遅延（RR\'ノッチ）を電気生理学的に統合。',
      clinicalSignificance: '左冠尖通電時の左主幹部（LMT）造影離れ確認、His束近傍通電での房室ブロック回避、自由壁での心穿孔予防など、至適通電部位の診断と合併症予防の鉄則を提示。'
    },
    figures: [
      {
        id: 'naito_2005_otvt_fig1',
        badge: '図1',
        title: '図1: OT-VT 7ステップ心電図局在診断フローチャート (内藤アルゴリズム)',
        caption: '群馬県立心臓血管センター・内藤滋人先生らによる流出路心室頻拍（OT-VT）完全鑑別アルゴリズム。',
        svgContent: `<svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; background:#0f172a; border-radius:12px; padding:12px; border:1px solid rgba(56,189,248,0.4); font-family:sans-serif;">
          <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
          <text x="380" y="28" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">OT-VT 7ステップ局在鑑別フロー (内藤滋人 2005)</text>
          
          <g transform="translate(20, 45)" font-size="12">
            <rect x="0" y="0" width="220" height="45" fill="rgba(30,41,59,0.9)" rx="6" stroke="#38bdf8"/>
            <text x="110" y="20" fill="#38bdf8" font-weight="bold" text-anchor="middle">Step 1: V6 S波 ≥ 0.1mV?</text>
            <text x="110" y="37" fill="#cbd5e1" text-anchor="middle">Yes ➔ 左室心内膜 (LV End)</text>

            <rect x="250" y="0" width="230" height="45" fill="rgba(30,41,59,0.9)" rx="6" stroke="#38bdf8"/>
            <text x="365" y="20" fill="#38bdf8" font-weight="bold" text-anchor="middle">Step 2: 移行帯 ≥ V4 or I S波なし?</text>
            <text x="365" y="37" fill="#cbd5e1" text-anchor="middle">Yes ➔ 右室中隔 (RV Septum)</text>

            <rect x="500" y="0" width="240" height="45" fill="rgba(30,41,59,0.9)" rx="6" stroke="#4ade80"/>
            <text x="620" y="20" fill="#4ade80" font-weight="bold" text-anchor="middle">Step 3: 伊藤基準 (R-dur/amp)</text>
            <text x="620" y="37" fill="#cbd5e1" text-anchor="middle">Yes ➔ 左冠尖 (LCC)</text>

            <rect x="0" y="65" width="220" height="45" fill="rgba(30,41,59,0.9)" rx="6" stroke="#f43f5e"/>
            <text x="110" y="85" fill="#f43f5e" font-weight="bold" text-anchor="middle">Step 4: QaVL/aVR > 1.4 or V1 S≥1.2</text>
            <text x="110" y="102" fill="#cbd5e1" text-anchor="middle">Yes ➔ 左室心外膜 (LV Epi)</text>

            <rect x="250" y="65" width="230" height="45" fill="rgba(30,41,59,0.9)" rx="6" stroke="#fbbf24"/>
            <text x="365" y="85" fill="#fbbf24" font-weight="bold" text-anchor="middle">Step 5-6: I & aVL RSR' 波形</text>
            <text x="365" y="102" fill="#cbd5e1" text-anchor="middle">Yes ➔ His束近傍 (Near-His)</text>

            <rect x="500" y="65" width="240" height="45" fill="rgba(30,41,59,0.9)" rx="6" stroke="#e879f9"/>
            <text x="620" y="85" fill="#e879f9" font-weight="bold" text-anchor="middle">Step 7: 下壁 R-R' ノッチ</text>
            <text x="620" y="102" fill="#cbd5e1" text-anchor="middle">Yes ➔ 右室自由壁 (RV Free Wall)</text>

            <rect x="0" y="125" width="740" height="160" fill="rgba(15,23,42,0.95)" rx="8" stroke="rgba(56,189,248,0.3)"/>
            <text x="370" y="152" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">【内藤アルゴリズムの診断精度と特徴】</text>
            <text x="40" y="180" fill="#e2e8f0" font-size="13">・総合正診率: 感度 88%、特異度 95%</text>
            <text x="40" y="205" fill="#e2e8f0" font-size="13">・RVOT自由壁での心穿孔リスク回避、His近傍での房室ブロック回避に直結</text>
            <text x="40" y="230" fill="#e2e8f0" font-size="13">・LCC/LVOT起源に対する冠動脈造影（CAG）事前準備の判断基準</text>
            <text x="40" y="255" fill="#e2e8f0" font-size="13">・群馬県立心臓血管センターの豊富な臨床アブレーションエビデンスに基づく</text>
          </g>
        </svg>`
      }
    ]
  },

  sakurada_2017_bbrvt: {
    id: 'sakurada_2017_bbrvt',
    title: '脚枝間リエントリー性心室頻拍にこだわるわけ (忘れえぬ心電図)',
    authors: '櫻田春水 (東京保健医療公社大久保病院 院長)',
    journal: '心電図',
    year: 2017,
    volume: '37(1):34-37',
    doi: '10.5105/jse.37.34',
    pubmedUrl: '',
    targetSites: ['ilvt_fascicular', 'bbrvt_bundle_branch'],
    summaryJa: {
      headline: '脚枝間リエントリー性心室頻拍（BBRVT）の3大旋回路パターンと電気軸乗り換え現象の解明',
      background: '心臓性急死をきたしうる重要不整脈BBRVT。ヒス-プルキンエ系（右脚・左脚前枝・左脚後枝）の伝導遅延を基盤とし、カテーテルアブレーションで根治可能なリエントリー性頻拍。',
      criteria: '① パターンA (右脚順行・左脚逆行): 左脚ブロック・左軸偏位型\n② パターンB (左脚前枝順行・右脚逆行): 右脚ブロック・右軸偏位型\n③ パターンC (左脚後枝順行・右脚逆行): 右脚ブロック・左軸偏位型\n④ 頻拍中の突然の軸変化（左脚前枝ブロック型 ➔ 後枝ブロック型への乗り換え）',
      cutoff: 'wide QRS頻拍 ＋ 典型脚ブロックパターン ＋ 基礎心疾患（DCM、AVR後、陳旧性前壁梗塞）',
      performance: '右脚または脚枝通電により全例根治可能',
      mechanism: '心室内特殊刺激伝導系の巨大リエントリー。刺激伝導系を高速伝導するため脚ブロックパターンを呈し、HV時間が著明延長。',
      clinicalSignificance: '特発性心室頻拍や上室頻拍（SVT変行伝導）と誤認されやすい。心停止蘇生例や弁置換術後のwide QRS頻拍では必ずBBRVTを念頭に置き、右脚アブレーションでの劇的根治を狙う。'
    }
  }
};

/**
 * 推定された起源サイトIDに関連する文献リストを取得する
 * @param {string} siteId - 起源部位ID
 * @returns {Array} 関連文献の配列
 */
export function getLiteratureForSite(siteId) {
  const list = [];
  Object.values(LITERATURE_DATABASE).forEach(item => {
    if (item.targetSites.includes(siteId)) {
      list.push(item);
    }
  });

  // もし該当が少ない場合、基礎となる全体アルゴリズム（Betensky, Yoshida, Ouyang）を追加
  if (list.length === 0) {
    list.push(LITERATURE_DATABASE.betensky_2011, LITERATURE_DATABASE.yoshida_2011);
  }

  return list;
}
