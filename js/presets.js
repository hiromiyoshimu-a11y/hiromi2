/**
 * CardioOrigin - 症例プリセットデータ
 * 代表的な12誘導心電図PVC波形と詳細臨床パラメータ
 */

export const PRESETS = [
  {
    id: 'rvot_post_sep',
    name: 'RVOT 後中隔 (Posterior Septum)',
    subtitle: '最も頻度の高い特発性PVCの典型例',
    category: '流出路系 (RVOT)',
    description: '下軸（II, III, aVFで高R波）、V1は深いQS型（LBBB様）、胸部誘導移行帯はV3〜V4。I誘導は陽性（R波）で幅が狭いのが後中隔の特徴。',
    params: {
      axis: 'inferior', // inferior (下軸), superior (上軸), normal/other
      v1Pattern: 'lbbb_qs', // lbbb_qs, lbbb_rs, rbbb_r, rbbb_rs, rbbb_qr
      transition: 'V4', // V1, V2, V3, V4, V5, V6
      lead1: 'positive', // positive, negative, biphasic
      leadAVL: 'negative_shallow', // positive, negative_deep, negative_shallow
      qrsDuration: 135, // ms
      v2s_v3r_ratio: 2.2, // > 1.5 => RVOT
      v2_trans_ratio: 0.35, // < 0.6 => RVOT
      mdi: 0.40, // < 0.55 => 心内膜
      leads: {
        I: { pattern: 'R', amp: 0.8 },
        II: { pattern: 'R', amp: 2.2 },
        III: { pattern: 'R', amp: 1.9 },
        aVR: { pattern: 'QS', amp: -1.6 },
        aVL: { pattern: 'rS', amp: -0.4 },
        aVF: { pattern: 'R', amp: 2.1 },
        V1: { pattern: 'QS', amp: -1.8 },
        V2: { pattern: 'QS', amp: -2.0 },
        V3: { pattern: 'rS', amp: -1.5 },
        V4: { pattern: 'Rs', amp: 1.6 },
        V5: { pattern: 'R', amp: 1.8 },
        V6: { pattern: 'R', amp: 1.4 }
      }
    }
  },
  {
    id: 'rvot_free_wall',
    name: 'RVOT 自由壁 (Free Wall)',
    subtitle: '幅広いQRS波と下壁ノッチが特徴',
    category: '流出路系 (RVOT)',
    description: '自由壁起源は心室中隔から遠いため興奮伝播に時間を要し、QRS幅が広く(>150ms)、下壁誘導にノッチを伴います。移行帯はV4-V5と遅く、I誘導はQSまたは二相性になりやすい。',
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_qs',
      transition: 'V5',
      lead1: 'negative',
      leadAVL: 'negative_deep',
      qrsDuration: 165,
      v2s_v3r_ratio: 3.1,
      v2_trans_ratio: 0.22,
      mdi: 0.44,
      hasNotch: true,
      leads: {
        I: { pattern: 'QS', amp: -0.7 },
        II: { pattern: 'Notched_R', amp: 2.0 },
        III: { pattern: 'Notched_R', amp: 2.3 },
        aVR: { pattern: 'QS', amp: -1.7 },
        aVL: { pattern: 'QS', amp: -1.2 },
        aVF: { pattern: 'Notched_R', amp: 2.2 },
        V1: { pattern: 'QS', amp: -2.2 },
        V2: { pattern: 'QS', amp: -2.4 },
        V3: { pattern: 'QS', amp: -1.8 },
        V4: { pattern: 'rS', amp: -1.0 },
        V5: { pattern: 'Rs', amp: 1.4 },
        V6: { pattern: 'R', amp: 1.2 }
      }
    }
  },
  {
    id: 'lvot_lcc',
    name: 'LVOT 左冠尖 (LCC: Left Coronary Cusp)',
    subtitle: '早期移行帯とII/III比>1が鍵',
    category: '流出路系 (LVOT)',
    description: '下軸でV1〜V2で早期に移行（Transition ≤ V2またはV3でV2S/V3R ≤ 1.5）。I誘導は明瞭なR波、II誘導のR波がIII誘導より高く(II/III > 1)、aVLは深い陰性(aVL/aVR QS比率大)を示します。',
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_rs',
      transition: 'V2',
      lead1: 'positive',
      leadAVL: 'negative_deep',
      qrsDuration: 140,
      v2s_v3r_ratio: 0.8,
      v2_trans_ratio: 0.85,
      mdi: 0.46,
      leads: {
        I: { pattern: 'R', amp: 1.1 },
        II: { pattern: 'R', amp: 2.4 },
        III: { pattern: 'R', amp: 1.5 },
        aVR: { pattern: 'QS', amp: -1.2 },
        aVL: { pattern: 'QS', amp: -1.5 },
        aVF: { pattern: 'R', amp: 2.0 },
        V1: { pattern: 'rS', amp: -1.2 },
        V2: { pattern: 'Rs', amp: 1.4 },
        V3: { pattern: 'R', amp: 2.2 },
        V4: { pattern: 'R', amp: 2.0 },
        V5: { pattern: 'R', amp: 1.6 },
        V6: { pattern: 'R', amp: 1.3 }
      }
    }
  },
  {
    id: 'lv_summit',
    name: 'LV Summit / 心外膜 (Epicardial)',
    subtitle: 'MDI延長と偽デルタ波、アブレーション難治部',
    category: '左室心外膜側',
    description: '左室最上部・大心静脈(GCV)/前室間静脈(AIV)近傍の心外膜起源。MDI > 0.55、立ち上がりが鈍い偽デルタ波(≥34ms)、aVLの深いQS、II/III比>1を示します。冠動脈近接に要注意。',
    params: {
      axis: 'inferior',
      v1Pattern: 'rbbb_rs',
      transition: 'V2',
      lead1: 'positive',
      leadAVL: 'negative_deep',
      qrsDuration: 172,
      v2s_v3r_ratio: 0.6,
      v2_trans_ratio: 0.92,
      mdi: 0.59, // > 0.55 => LV summit/心外膜
      pseudoDelta: 42, // ms (>=34ms)
      leads: {
        I: { pattern: 'R', amp: 1.0 },
        II: { pattern: 'R', amp: 2.3 },
        III: { pattern: 'R', amp: 1.4 },
        aVR: { pattern: 'QS', amp: -1.0 },
        aVL: { pattern: 'QS', amp: -1.8 },
        aVF: { pattern: 'R', amp: 1.9 },
        V1: { pattern: 'Rs', amp: 0.9 },
        V2: { pattern: 'R', amp: 2.1 },
        V3: { pattern: 'R', amp: 2.4 },
        V4: { pattern: 'R', amp: 2.0 },
        V5: { pattern: 'R', amp: 1.5 },
        V6: { pattern: 'R', amp: 1.1 }
      }
    }
  },
  {
    id: 'lv_pmpm',
    name: '左室後内側乳頭筋 (PMPM)',
    subtitle: 'RBBB型 ＋ 著明な左軸偏位（上軸）',
    category: '乳頭筋 (Papillary Muscle)',
    description: '後下壁寄りの乳頭筋起源。興奮が心尖・後壁から上方へ向かうため下壁誘導(II, III, aVF)は深いQS（上軸）。V1はRBBB型(Rs/qR)を示し、QRS幅は比較的広くノッチを伴います。',
    params: {
      axis: 'superior', // 上軸
      v1Pattern: 'rbbb_qr', // RBBB型
      transition: 'V2',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 155,
      v2s_v3r_ratio: 0.5,
      v2_trans_ratio: 0.9,
      mdi: 0.48,
      leads: {
        I: { pattern: 'R', amp: 1.6 },
        II: { pattern: 'QS', amp: -2.1 },
        III: { pattern: 'QS', amp: -2.5 },
        aVR: { pattern: 'rS', amp: -0.6 },
        aVL: { pattern: 'R', amp: 1.8 },
        aVF: { pattern: 'QS', amp: -2.3 },
        V1: { pattern: 'qR', amp: 1.7 },
        V2: { pattern: 'Rs', amp: 1.5 },
        V3: { pattern: 'rS', amp: -0.8 },
        V4: { pattern: 'rS', amp: -1.4 },
        V5: { pattern: 'QS', amp: -1.8 },
        V6: { pattern: 'QS', amp: -1.5 }
      }
    }
  },
  {
    id: 'ilvt_fascicular',
    name: '特発性左室頻拍 (左脚後枝起源)',
    subtitle: '比較的シャープなQRS、RBBB＋左軸偏位',
    category: '束枝・プルキンエ (Fascicular)',
    description: '心筋深部ではなく特殊心筋（プルキンエ網）起源のため、立ち上がりが非常に鋭くRS時間が短い（<60-80ms）。QRS幅は120-135msと比較的狭く、RBBB型＋左軸偏位を示します。',
    params: {
      axis: 'superior',
      v1Pattern: 'rbbb_rs',
      transition: 'V3',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 124,
      v2s_v3r_ratio: 0.9,
      v2_trans_ratio: 0.75,
      mdi: 0.36,
      rsTime: 52, // ms
      leads: {
        I: { pattern: 'R', amp: 1.4 },
        II: { pattern: 'rS', amp: -1.8 },
        III: { pattern: 'rS', amp: -2.2 },
        aVR: { pattern: 'rS', amp: -0.5 },
        aVL: { pattern: 'R', amp: 1.5 },
        aVF: { pattern: 'rS', amp: -2.0 },
        V1: { pattern: 'rsR', amp: 1.6 },
        V2: { pattern: 'Rs', amp: 1.4 },
        V3: { pattern: 'Rs', amp: 1.1 },
        V4: { pattern: 'rS', amp: -0.9 },
        V5: { pattern: 'rS', amp: -1.2 },
        V6: { pattern: 'rS', amp: -1.0 }
      }
    }
  },
  {
    id: 'tva_annular',
    name: '三尖弁輪 (TVA: Tricuspid Annulus)',
    subtitle: 'LBBB型で全胸部誘導QS/遅い移行',
    category: '弁輪部 (Annular)',
    description: '右室側弁輪。V1はLBBB型(深いQS)、胸部誘導の移行帯はV4以降と遅く、弁輪部位により軸が変化します（前側壁なら下軸、後壁なら上軸）。QRS幅が広い傾向があります。',
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_qs',
      transition: 'V5',
      lead1: 'negative',
      leadAVL: 'negative_deep',
      qrsDuration: 160,
      v2s_v3r_ratio: 3.8,
      v2_trans_ratio: 0.15,
      mdi: 0.45,
      leads: {
        I: { pattern: 'QS', amp: -1.0 },
        II: { pattern: 'R', amp: 1.8 },
        III: { pattern: 'R', amp: 2.2 },
        aVR: { pattern: 'QS', amp: -1.5 },
        aVL: { pattern: 'QS', amp: -1.6 },
        aVF: { pattern: 'R', amp: 2.0 },
        V1: { pattern: 'QS', amp: -2.3 },
        V2: { pattern: 'QS', amp: -2.6 },
        V3: { pattern: 'QS', amp: -2.1 },
        V4: { pattern: 'rS', amp: -1.4 },
        V5: { pattern: 'Rs', amp: 1.1 },
        V6: { pattern: 'R', amp: 1.3 }
      }
    }
  },
  {
    id: 'amc_junction',
    name: '大動脈僧帽弁移行部 (AMC)',
    subtitle: 'V1〜V6全陽性、著明な高R波',
    category: '流出路/弁輪移行部',
    description: '大動脈弁輪と僧帽弁輪の結合部。心臓のほぼ中央・後上方に位置し、V1からV6まで高いR波（Precordial concordance）を示し、下軸でI誘導も陽性R波になります。',
    params: {
      axis: 'inferior',
      v1Pattern: 'rbbb_r',
      transition: 'V1',
      lead1: 'positive',
      leadAVL: 'biphasic',
      qrsDuration: 145,
      v2s_v3r_ratio: 0.3,
      v2_trans_ratio: 1.1,
      mdi: 0.47,
      leads: {
        I: { pattern: 'R', amp: 1.3 },
        II: { pattern: 'R', amp: 2.2 },
        III: { pattern: 'R', amp: 1.8 },
        aVR: { pattern: 'QS', amp: -1.4 },
        aVL: { pattern: 'Rs', amp: 0.6 },
        aVF: { pattern: 'R', amp: 2.1 },
        V1: { pattern: 'R', amp: 2.2 },
        V2: { pattern: 'R', amp: 2.8 },
        V3: { pattern: 'R', amp: 2.6 },
        V4: { pattern: 'R', amp: 2.2 },
        V5: { pattern: 'R', amp: 1.8 },
        V6: { pattern: 'R', amp: 1.5 }
      }
    }
  }
];
