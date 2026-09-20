/**
 * CardioOrigin - 医学文献 & 診断根拠エビデンスライブラリ
 * 12誘導心電図による不整脈局在推定の代表的論文マスターデータ
 */

export const LITERATURE_DATABASE = {
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
    }
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
      criteria: '比較的シャープなQRS（120-135ms）、鋭い立ち上がり（RS短縮）、RBBBパターン ＋ 左軸偏位（後枝型）または右軸偏位（前枝型）',
      cutoff: 'RS時間 < 60-80ms、ベラパミル静注での停止・感受性',
      performance: '特異度 96%',
      mechanism: '心筋深部ではなく特殊心筋（プルキンエ線維伝導系）そのものが関与するため、興奮の立ち上がりが心室筋起源に比べて極めて鋭利（通常120ms前後の狭いQRS）となる。',
      clinicalSignificance: '拡張期プルキンエ電位（P1電位）または前収縮期プルキンエ電位（P2電位）の記録部位を標的とすることで、わずか数秒の通電で低侵襲かつ劇的に根治可能。'
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
