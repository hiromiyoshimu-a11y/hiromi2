/**
 * CardioOrigin - 12誘導心電図 PVC 起源推定アルゴリズムエンジン
 * 
 * 電気生理学の定評あるアルゴリズム（Ouyang, Betensky, Tada, Daniels, Yamada等）
 * に基づく階層的・多因子スコアリングシステム
 */

export const SITE_DEFINITIONS = {
  rvot_post_sep: {
    id: 'rvot_post_sep',
    nameJa: 'RVOT 後中隔',
    nameEn: 'RVOT Posterior Septum',
    category: '右室流出路 (RVOT)',
    coordinates: { x: 44, y: 38, z: 'anterior' },
    ablationTips: 'ヒス束伝導系が後下方に位置するため、His電位記録カテーテル留置下に通電することが推奨されます。一般的に高周波通電の成功率は高い領域です。',
    keyFeatures: 'LBBB型、下軸、V3〜V4移行、I誘導陽性、QRS幅は比較的シャープ'
  },
  rvot_ant_sep: {
    id: 'rvot_ant_sep',
    nameJa: 'RVOT 前中隔',
    nameEn: 'RVOT Anterior Septum',
    category: '右室流出路 (RVOT)',
    coordinates: { x: 40, y: 32, z: 'anterior' },
    ablationTips: '前下行枝（LAD）本幹が肺動脈弁直下の前壁心外膜側を走行するため、必要に応じて冠動脈造影（CAG）との距離確認を行います。',
    keyFeatures: 'LBBB型、下軸、I誘導陰性または小r波、移行帯は通常V3〜V4'
  },
  rvot_free_wall: {
    id: 'rvot_free_wall',
    nameJa: 'RVOT 自由壁',
    nameEn: 'RVOT Free Wall',
    category: '右室流出路 (RVOT)',
    coordinates: { x: 30, y: 36, z: 'anterior' },
    ablationTips: '中隔側に比べて心筋壁が薄いため、通電時のコンタクトフォース過多による心穿孔・心タンポナーデに細心の注意が必要です。',
    keyFeatures: 'LBBB型、下軸、QRS幅広い(>150ms)、下壁誘導のノッチ、遅い移行帯(≥V4)'
  },
  lvot_lcc: {
    id: 'lvot_lcc',
    nameJa: 'LVOT 左冠尖 (LCC)',
    nameEn: 'Left Coronary Cusp (LCC)',
    category: '左室流出路 (Aortic Cusp)',
    coordinates: { x: 52, y: 40, z: 'middle' },
    ablationTips: '左主幹部（LMT）や回旋枝・前下行枝の分岐部が直近に存在します。通電前には必ず選択的冠動脈造影（CAG）を行い、カテーテル先端と冠動脈開口部が10mm以上離れていることを確認します。',
    keyFeatures: '下軸、早期移行(V1-V2)、II/III比 > 1、I誘導陽性、aVLで深いQS'
  },
  lvot_rcc: {
    id: 'lvot_rcc',
    nameJa: 'LVOT 右冠尖 (RCC)',
    nameEn: 'Right Coronary Cusp (RCC)',
    category: '左室流出路 (Aortic Cusp)',
    coordinates: { x: 47, y: 44, z: 'middle' },
    ablationTips: '右冠動脈（RCA）開口部およびヒス束接合部が近接します。RCC下部〜NCC移行部では房室伝導ブロックリスクをモニターします。',
    keyFeatures: '下軸、V3移行(境界例多し)、I誘導陰性/二相性、II/III比 ≤ 1、V2S/V3R比 ≤ 1.5'
  },
  lvot_ncc: {
    id: 'lvot_ncc',
    nameJa: 'LVOT 無冠尖 / ヒス束近傍',
    nameEn: 'Non-Coronary Cusp / Perihisian',
    category: '左室流出路 (Aortic Cusp)',
    coordinates: { x: 50, y: 48, z: 'posterior' },
    ablationTips: '房室結節・ヒス束に極めて近接しています。カテーテル先端でのHis電位の有無・高低を厳密に観察し、ペーシング試験で伝導障害がないか慎重に評価します。',
    keyFeatures: '下軸〜中間軸、QRS幅が比較的狭い、V1で二相性または陽性成分、aVL陰性'
  },
  lv_summit: {
    id: 'lv_summit',
    nameJa: 'LV Summit / 大心静脈心外膜',
    nameEn: 'LV Summit / Epicardial (GCV/AIV)',
    category: '左室心外膜 (Epicardial)',
    coordinates: { x: 57, y: 33, z: 'epicardial' },
    ablationTips: '心外膜側（冠静脈洞内/心外膜下脂肪組織内）のため、冠動脈近接や心筋外膜アブレーションの解剖学的アクセス（GCV/AIV経由、または心外膜穿刺）の検討が必要です。難治性部位の代表。',
    keyFeatures: 'MDI > 0.55、偽デルタ波(≥34ms)、幅広いQRS、II/III比>1、aVL深いQS'
  },
  amc: {
    id: 'amc',
    nameJa: '大動脈僧帽弁移行部 (AMC)',
    nameEn: 'Aortomitral Continuity (AMC)',
    category: '弁輪・流出路移行部',
    coordinates: { x: 56, y: 45, z: 'posterior' },
    ablationTips: '線維性三角部でありカテーテルの安定性が重要です。冠動脈回旋枝および食道との位置関係を考慮します。',
    keyFeatures: '胸部誘導全陽性 (V1-V6高R波)、下軸、I誘導陽性'
  },
  pmpm: {
    id: 'pmpm',
    nameJa: '左室後内側乳頭筋 (PMPM)',
    nameEn: 'Posteromedial Papillary Muscle',
    category: '乳頭筋 (Papillary Muscle)',
    coordinates: { x: 58, y: 64, z: 'endocardial' },
    ablationTips: '乳頭筋の頭部〜基部への立体的な接触と心エコー（ICE: 腔内心エコー）ガイド下での接触確認が極めて有効です。高出力通電やクライオアブレーションが考慮されます。',
    keyFeatures: '上軸（II, III, aVF深いQS）、著明な左軸偏位、RBBB型(V1陽性)、幅広いQRS'
  },
  alpm: {
    id: 'alpm',
    nameJa: '左室前外側乳頭筋 (ALPM)',
    nameEn: 'Anterolateral Papillary Muscle',
    category: '乳頭筋 (Papillary Muscle)',
    coordinates: { x: 65, y: 52, z: 'endocardial' },
    ablationTips: '前側壁に位置し、左室自由壁の腱索付着部。ICEガイド下で心筋カテーテル圧着と安定性を維持します。',
    keyFeatures: '右軸偏位 / 下軸（I誘導陰性）、RBBB型(V1陽性)、ノッチを伴う幅広い波形'
  },
  fascicular_post: {
    id: 'fascicular_post',
    nameJa: '特発性左室頻拍 (左脚後枝)',
    nameEn: 'Idiopathic LV Fascicular (Post. Fascicle)',
    category: 'プルキンエ・束枝系',
    coordinates: { x: 55, y: 58, z: 'subendocardial' },
    ablationTips: 'プルキンエ電位（Purkinje potential: P電位）の先行部位を標的とします。通電成功率が高く、ベラパミル感受性を有することが臨床的特徴です。',
    keyFeatures: '比較的狭いQRS(120-135ms)、極めて鋭い立ち上がり(RS短)、RBBB型＋左軸偏位'
  },
  fascicular_ant: {
    id: 'fascicular_ant',
    nameJa: '特発性左室頻拍 (左脚前枝)',
    nameEn: 'Idiopathic LV Fascicular (Ant. Fascicle)',
    category: 'プルキンエ・束枝系',
    coordinates: { x: 62, y: 44, z: 'subendocardial' },
    ablationTips: '左室前中隔領域のPurkinje電位をマッピング。完全左脚前枝ブロックの出現に注意します。',
    keyFeatures: 'シャープなQRS、RBBB型＋右軸偏位（I誘導陰性、II/III/aVF陽性）'
  },
  tva: {
    id: 'tva',
    nameJa: '三尖弁輪 (TVA)',
    nameEn: 'Tricuspid Annulus',
    category: '弁輪部 (Annular)',
    coordinates: { x: 36, y: 48, z: 'annular' },
    ablationTips: '右室側弁輪部に沿ったマッピング。自由壁側では右冠動脈、中隔側ではヒス束・房室結節の損傷を回避します。',
    keyFeatures: 'LBBB型(V1深いQS)、胸部移行遅い(V4-V5)、弁輪部位により下軸〜上軸に変化'
  },
  mva: {
    id: 'mva',
    nameJa: '僧帽弁輪 (MVA)',
    nameEn: 'Mitral Annulus',
    category: '弁輪部 (Annular)',
    coordinates: { x: 66, y: 56, z: 'annular' },
    ablationTips: '経中隔穿刺（Transseptal）または大動脈逆行性アプローチ。側壁側では冠動脈回旋枝および冠静脈洞への影響を考慮します。',
    keyFeatures: 'RBBB型(V1陽性)、胸部全陽性傾向、側壁部ではI/aVLでQSパターン'
  }
};

/**
 * 12誘導ECG情報から起源部位を推定するメイン関数
 * @param {Object} input - 入力パラメータ
 * @returns {Object} 推定結果オブジェクト
 */
export function estimatePVCOrigin(input) {
  const {
    axis = 'inferior', // 'inferior' | 'superior' | 'normal'
    v1Pattern = 'lbbb_qs', // 'lbbb_qs' | 'lbbb_rs' | 'rbbb_r' | 'rbbb_rs' | 'rbbb_qr'
    transition = 'V4', // 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6'
    lead1 = 'positive', // 'positive' | 'negative' | 'biphasic'
    leadAVL = 'negative_shallow', // 'positive' | 'negative_deep' | 'negative_shallow' | 'biphasic'
    qrsDuration = 140, // 数値 (ms)
    v2s_v3r_ratio = 1.8, // 数値 (V2S/V3R index)
    v2_trans_ratio = 0.4, // 数値 (V2 transition ratio)
    mdi = 0.45, // 数値 (Maximum Deflection Index)
    pseudoDelta = 25, // 数値 (ms)
    hasNotch = false, // ブール値 (下壁誘導等のノッチ)
    leads = {} // 個別誘導波形 (マトリックス入力時)
  } = input;

  const reasoning = [];
  const scores = {};

  // スコア初期化
  Object.keys(SITE_DEFINITIONS).forEach(id => {
    scores[id] = 0;
  });

  const isLBBB = v1Pattern.startsWith('lbbb');
  const isRBBB = v1Pattern.startsWith('rbbb');
  const isInferiorAxis = axis === 'inferior';
  const isSuperiorAxis = axis === 'superior';

  // 1. 電気軸 (Frontal plane axis) の判定
  if (isInferiorAxis) {
    reasoning.push({
      step: 'Step 1: 電気軸判定',
      badge: '下軸 (Inferior Axis)',
      text: '下壁誘導 (II, III, aVF) が陽性（高R波）であり、心臓の頭側・上方（流出路系または弁輪部基部）からの興奮伝播を強く示唆します。'
    });
    // 流出路系・基部にボーナス
    scores.rvot_post_sep += 35;
    scores.rvot_ant_sep += 35;
    scores.rvot_free_wall += 35;
    scores.lvot_lcc += 35;
    scores.lvot_rcc += 35;
    scores.lvot_ncc += 30;
    scores.lv_summit += 35;
    scores.amc += 35;
    scores.tva += 15;
    scores.mva += 10;
  } else if (isSuperiorAxis) {
    reasoning.push({
      step: 'Step 1: 電気軸判定',
      badge: '上軸 (Superior Axis)',
      text: '下壁誘導 (II, III, aVF) が陰性（深いQS/rS）であり、心尖部・乳頭筋・下後壁側からの興奮伝播を示唆します。'
    });
    scores.pmpm += 50;
    scores.alpm += 20;
    scores.fascicular_post += 45;
    scores.tva += 15;
    scores.mva += 25;
    // 流出路系・基部には強力なペナルティ
    scores.rvot_post_sep -= 30;
    scores.rvot_ant_sep -= 30;
    scores.rvot_free_wall -= 25;
    scores.lvot_lcc -= 30;
    scores.lvot_rcc -= 30;
    scores.lv_summit -= 30;
    scores.amc -= 30;
  } else {
    reasoning.push({
      step: 'Step 1: 電気軸判定',
      badge: '中間軸 / 水平軸',
      text: '心室中隔中央部または弁輪側壁部からの興奮伝播を疑います。'
    });
    scores.alpm += 30;
    scores.fascicular_ant += 30;
    scores.tva += 15;
    scores.mva += 15;
  }

  // 2. V1誘導形態（脚ブロック様パターン）
  if (isLBBB) {
    reasoning.push({
      step: 'Step 2: V1脚ブロック型',
      badge: 'LBBB パターン',
      text: 'V1が陰性優位（QS型またはrS型）であり、右室側（RV）または心室中隔からの起始を示唆します。'
    });
    scores.rvot_post_sep += 30;
    scores.rvot_ant_sep += 30;
    scores.rvot_free_wall += 30;
    scores.tva += 30;
    // LVOTでも中隔寄りの場合はLBBB型を呈する
    scores.lvot_rcc += 15;
    scores.lvot_lcc += 10;
    // 左室自由壁側にはペナルティ
    scores.pmpm -= 20;
    scores.alpm -= 20;
    scores.amc -= 20;
    scores.mva -= 20;
  } else {
    reasoning.push({
      step: 'Step 2: V1脚ブロック型',
      badge: 'RBBB パターン',
      text: 'V1が陽性優位（R, Rs, qR）であり、左室側（LV）または大動脈僧帽弁移行部（AMC）からの起始を示唆します。'
    });
    scores.lvot_lcc += 25;
    scores.lv_summit += 25;
    scores.amc += 35;
    scores.pmpm += 35;
    scores.alpm += 35;
    scores.fascicular_post += 30;
    scores.fascicular_ant += 30;
    scores.mva += 25;
    // 右室側にはペナルティ
    scores.rvot_post_sep -= 25;
    scores.rvot_ant_sep -= 25;
    scores.rvot_free_wall -= 30;
    scores.tva -= 25;
  }

  // 3. 胸部誘導移行帯 (Precordial Transition Zone)
  const transOrder = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
  const transIdx = transOrder.indexOf(transition);

  if (transIdx <= 1) { // V1 or V2 (早期移行)
    reasoning.push({
      step: 'Step 3: 移行帯判定',
      badge: `早期移行 (${transition})`,
      text: `胸部誘導の移行帯が${transition}と早期であり、左室流出路 (LVOT/LCC/RCC) またはAMC、僧帽弁輪を強く示唆します。`
    });
    scores.lvot_lcc += 25;
    scores.lvot_rcc += 20;
    scores.lv_summit += 20;
    scores.amc += 30;
    scores.mva += 15;
  } else if (transIdx >= 3) { // V4, V5, V6 (遅い移行)
    reasoning.push({
      step: 'Step 3: 移行帯判定',
      badge: `遅い移行 (${transition})`,
      text: `移行帯が${transition}と遅く、右室流出路（RVOT中隔〜自由壁）または三尖弁輪（TVA）を強く示唆します。`
    });
    scores.rvot_post_sep += 20;
    scores.rvot_ant_sep += 22;
    scores.rvot_free_wall += 25;
    scores.tva += 20;
  } else { // V3 (境界領域)
    reasoning.push({
      step: 'Step 3: 移行帯判定 (V3境界)',
      badge: 'V3 境界移行帯',
      text: '移行帯がV3であり、RVOTとLVOTの鑑別にV2S/V3R比やV2 transition ratioの精密評価が必要です。'
    });
    // 詳細比率による分岐
    if (v2s_v3r_ratio <= 1.5 || v2_trans_ratio >= 0.6) {
      reasoning.push({
        step: 'Step 3b: V2S/V3R比 & V2比率',
        badge: 'LVOT 優位',
        text: `V2S/V3R比=${v2s_v3r_ratio} (≤1.5) または V2移行比=${v2_trans_ratio} (≥0.6) であり、左室側（LVOT / Aortic Cusp）が有力です。`
      });
      scores.lvot_lcc += 25;
      scores.lvot_rcc += 25;
      scores.lv_summit += 15;
      scores.rvot_post_sep += 5;
    } else {
      reasoning.push({
        step: 'Step 3b: V2S/V3R比 & V2比率',
        badge: 'RVOT 優位',
        text: `V2S/V3R比=${v2s_v3r_ratio} (>1.5) または V2移行比=${v2_trans_ratio} (<0.6) であり、右室流出路（RVOT）が有力です。`
      });
      scores.rvot_post_sep += 25;
      scores.rvot_ant_sep += 25;
      scores.rvot_free_wall += 20;
    }
  }

  // 4. I誘導・aVL誘導の極性と中隔/自由壁・左右冠尖の弁別
  if (lead1 === 'positive') {
    reasoning.push({
      step: 'Step 4: I誘導極性',
      badge: 'I誘導 陽性 (R波)',
      text: 'I誘導が陽性であり、電気軸が右から左へ向かっています。流出路では後中隔またはLCC、乳頭筋ではPMPMを支持します。'
    });
    scores.rvot_post_sep += 15;
    scores.lvot_lcc += 15;
    scores.amc += 15;
    scores.pmpm += 15;
  } else if (lead1 === 'negative') {
    reasoning.push({
      step: 'Step 4: I誘導極性',
      badge: 'I誘導 陰性 (QS/rS)',
      text: 'I誘導が陰性であり、左から右へ興奮が向かっています。前中隔、RVOT自由壁、RCC、ALPMを支持します。'
    });
    scores.rvot_ant_sep += 15;
    scores.rvot_free_wall += 15;
    scores.lvot_rcc += 15;
    scores.alpm += 20;
    scores.tva += 15;
  }

  // 5. 心外膜側指標 (MDI / Pseudo-delta wave)
  if (mdi >= 0.55 || pseudoDelta >= 34) {
    reasoning.push({
      step: 'Step 5: 心外膜性マーカー',
      badge: 'MDI ≥ 0.55 / 偽デルタ波 陽性',
      text: `MDI=${mdi} (≥0.55) かつ立ち上がり時間延長（pseudo-delta波=${pseudoDelta}ms）を認め、LV Summitや冠静脈洞心外膜起源の可能性が極めて高くなります。`
    });
    scores.lv_summit += 35;
    scores.lvot_lcc += 5;
  } else {
    // 心内膜を示唆
    scores.rvot_post_sep += 5;
    scores.lvot_lcc += 5;
    scores.lvot_rcc += 5;
  }

  // 6. QRS幅とノッチの評価
  if (qrsDuration < 130 && isRBBB && isSuperiorAxis) {
    reasoning.push({
      step: 'Step 6: QRS幅と立ち上がり速度',
      badge: '狭いQRS (プルキンエ波形)',
      text: `QRS幅=${qrsDuration}ms と比較的狭く、鋭い立ち上がりを認めるため、特発性左室頻拍（左脚後枝/前枝）が最有力です。`
    });
    scores.fascicular_post += 35;
  } else if (qrsDuration >= 160 || hasNotch) {
    reasoning.push({
      step: 'Step 6: QRS幅とノッチ',
      badge: '幅広いQRS / 下壁ノッチ',
      text: `QRS幅=${qrsDuration}ms と広くノッチを認めるため、自由壁伝播遅延（RVOT自由壁）または乳頭筋起源、心外膜側を強く支持します。`
    });
    scores.rvot_free_wall += 20;
    scores.pmpm += 15;
    scores.lv_summit += 15;
  }

  // 7. aVL/aVR比率の評価
  if (leadAVL === 'negative_deep') {
    reasoning.push({
      step: 'Step 7: aVL深いQSパターン',
      badge: 'aVL 深いQS',
      text: 'aVLで深いQSを認め、左冠尖(LCC)やLV Summitなどの左側高位構造物を示唆します。'
    });
    scores.lvot_lcc += 10;
    scores.lv_summit += 10;
  }

  // 正規化とパーセンテージランキングの計算
  const siteList = Object.keys(SITE_DEFINITIONS).map(id => {
    const rawScore = Math.max(0, scores[id]);
    return {
      id,
      def: SITE_DEFINITIONS[id],
      rawScore
    };
  });

  siteList.sort((a, b) => b.rawScore - a.rawScore);

  // 上位3候補をべき乗スケールで正規化（トップ候補の優位性を際立たせる）
  const topSlice = siteList.slice(0, 3);
  const minScore = Math.min(...topSlice.map(s => s.rawScore));
  const expWeights = topSlice.map(item => Math.pow(Math.max(1, item.rawScore - minScore + 15), 3));
  const expSum = expWeights.reduce((a, b) => a + b, 0);

  const results = siteList.map((item, index) => {
    let probability = 0;
    if (index < 3 && expSum > 0) {
      probability = Math.round((expWeights[index] / expSum) * 100);
    }
    return {
      id: item.id,
      nameJa: item.def.nameJa,
      nameEn: item.def.nameEn,
      category: item.def.category,
      rawScore: item.rawScore,
      probability,
      ablationTips: item.def.ablationTips,
      keyFeatures: item.def.keyFeatures,
      coordinates: item.def.coordinates
    };
  });

  // 合計を100%に調整
  const topProbSum = results[0].probability + results[1].probability + results[2].probability;
  if (topProbSum > 0 && topProbSum !== 100) {
    results[0].probability += (100 - topProbSum);
  }

  return {
    topSite: results[0],
    ranking: results,
    reasoning,
    inputSummary: {
      axis,
      v1Pattern,
      transition,
      lead1,
      qrsDuration,
      v2s_v3r_ratio,
      mdi
    }
  };
}
