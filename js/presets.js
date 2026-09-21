/**
 * CardioOrigin - 症例シミュレーションプリセットデータ
 * 
 * 日本不整脈心電学会・循環器専門誌『Heart View』(2022年増刊号 特集: 心電図波形を読む)
 * 等の臨床論文から厳選引用した典型的な12誘導PVC波形と詳細パラメータ
 */

export const PRESETS = [
  {
    id: 'rvot_post_sep',
    name: 'RVOT 後中隔 (Posterior Septum)',
    subtitle: '最も頻度の高い特発性PVCの典型例',
    category: '右室流出路 (RVOT)',
    transmuralSite: '心内膜側 (Endocardial)',
    citation: {
      authors: '篠原徹二 (大分大学医学部循環器内科)',
      title: '特発性心室頻拍 (流出路起源心室頻拍)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 108-115',
      figure: '図1a: 右室流出路起源の心室頻拍・心室期外収縮の12誘導心電図',
      doi: 'JCS/JHRS ガイドライン 2018/2020 準拠'
    },
    description: '下軸（II, III, aVFで高R波）、V1は深いQS型（LBBB様）、胸部誘導移行帯はV3〜V4。I誘導は陽性（R波）で幅が狭いのが後中隔の特徴。',
    clinicalInsights: {
      mechanism: '遅延後脱分極による撃発活動 (Triggered Activity)。',
      ecgKeyPoints: [
        '下壁誘導 (II, III, aVF) で高い単相性R波（上方から下方へ向かう興奮伝播）。',
        'V1誘導は深いQS波（LBBB型パターン）。',
        'I誘導が明瞭なR波（心室中隔後方から前方・左方へ向かう）。',
        'QRS幅は比較的狭く（135ms）、下壁誘導にノッチを認めない。'
      ],
      pitfalls: 'RVOT自由壁との鑑別が重要。自由壁はQRS幅が広く(>150ms)、下壁誘導にノッチを伴い移行帯が遅延する。',
      ablationStrategy: '肺動脈弁直下の右室流出路中隔側。His束近傍に近接するため、His電位をモニターしながら通電し房室ブロックを回避する。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_qs',
      transition: 'V4',
      lead1: 'positive',
      leadAVL: 'negative_shallow',
      qrsDuration: 135,
      v2s_v3r_ratio: 2.2, // > 1.5 => RVOT
      v2_trans_ratio: 0.35, // < 0.6 => RVOT
      mdi: 0.40, // < 0.55 => 心内膜
      pseudoDelta: 24, // < 34ms => 心内膜
      hasNotch: false,
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
    category: '右室流出路 (RVOT)',
    transmuralSite: '心内膜側〜筋層 (Thin Wall)',
    citation: {
      authors: '大西克実 (昭和大学医学部循環器内科) / 篠原徹二',
      title: '心室期外収縮 (特発性流出路起源PVCの正確な起源推測)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 100-106, 108-115',
      figure: '図1: 流出路起源PVCの正確な起源推測フローチャート (Itoアルゴリズム Step 7)',
      doi: 'J Cardiovasc Electrophysiol 2003; 14: 1280-1286'
    },
    description: '自由壁起源は心室中隔から遠いため興奮伝播に時間を要し、QRS幅が広く(>150ms)、下壁誘導にノッチを伴います。移行帯はV4-V5と遅く、I誘導はQSまたは二相性になりやすい。',
    clinicalInsights: {
      mechanism: '右室自由壁の撃発活動。心室中隔への伝播遅延によりQRS幅が拡大。',
      ecgKeyPoints: [
        '下壁誘導 (II, III, aVF) のR波下行脚に明瞭なノッチング（伝導遅延所見）。',
        '胸部誘導の移行帯がV5以降と遅延（Transition ≥ V4）。',
        'I誘導が陰性 (QS) または平坦・二相性（右から左へのベクトルが欠如）。',
        'V2誘導のS波高が著明に深い (S ≧ 3.0mV)。'
      ],
      pitfalls: '右室自由壁は心室筋壁が極めて薄いため（1〜3mm程度）、コンタクトフォース過多による心穿孔・急性心タンポナーデに細心の注意が必要。',
      ablationStrategy: 'コンタクトフォースモニター（5〜15g）下に低〜中出力（25〜35W）で慎重に通電。心膜腔穿刺セットを事前準備。'
    },
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
      pseudoDelta: 28,
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
    category: '左室流出路 (LVOT)',
    transmuralSite: '心内膜〜大動脈洞 (Aortic Cusp)',
    citation: {
      authors: '篠原徹二 (大分大学循環器内科) / 大西克実',
      title: '特発性心室頻拍 (大動脈弁冠尖部起源)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 108-115, 100-106',
      figure: '図1b: 左室流出路起源の特発性心室頻拍の12誘導心電図 (RBBB型下方軸)',
      doi: 'Circulation 2002; 106: 962-967 / Tada 2005'
    },
    description: '下軸でV1〜V2で早期に移行（Transition ≤ V2またはV3でV2S/V3R ≤ 1.5）。I誘導は明瞭なR波、II誘導のR波がIII誘導より高く(II/III > 1)、aVLは深い陰性を示します。',
    clinicalInsights: {
      mechanism: '大動脈洞弁尖部の線維筋性スリーブにおける撃発活動。',
      ecgKeyPoints: [
        '胸部誘導の早期移行（V1でR>SまたはV2でR波優位への移行）。',
        'II誘導のR波高 ＞ III誘導のR波高 (II/III比 > 1.0)。LCCが左後方に位置するため。',
        'I誘導で明瞭なR波（左側から中隔・右室側へ向かう）。',
        'aVL誘導で深いQSパターン (aVL/aVR比率大)。'
      ],
      pitfalls: '左冠動脈主幹部（LMT）開口部に極めて近接する。通電前の冠動脈造影（CAG）確認を怠ると致死的な冠動脈閉塞・急性心筋梗塞を惹起する。',
      ablationStrategy: '大動脈バルサルバ洞内への逆行性アプローチ。CAG同時造影下でカテーテル先端とLMT開口部との距離が10mm以上離れていることを確認して通電。'
    },
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
      pseudoDelta: 26,
      hasNotch: false,
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
    subtitle: 'MDI延長と偽デルタ波、アブレーション最難治部',
    category: '左室心外膜側 (Epicardial)',
    transmuralSite: '心外膜側 (Epicardial Focus)',
    citation: {
      authors: '服部正幸 (茨城県立中央病院), 山﨑浩 (筑波大学) / 篠原徹二',
      title: '器質的背景をもった心室頻拍 (心外膜側起源の鑑別とアプローチ)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 116-122, 112-115',
      figure: '図4: 心内膜側起源と心外膜側起源の鑑別シェーマ & 図6: 心外膜側VT症例',
      doi: 'Bazan 2007 Heart Rhythm / Daniels 2009 / Santangeli 2015'
    },
    description: '左室最上部・大心静脈(GCV)/前室間静脈(AIV)近傍の心外膜起源。MDI > 0.55、立ち上がりが鈍い偽デルタ波(≥34ms)、I/aVL誘導の深いqS波、II/III比>1を示します。冠動脈近接に要注意。',
    clinicalInsights: {
      mechanism: '心外膜下心筋層の異所性巣。心室壁外側から内側へ興奮が伝播するため初期立ち上がりが緩徐。',
      ecgKeyPoints: [
        'Daniels最大偏位指数 (MDI: Maximum Deflection Index) ≧ 0.55。',
        'Berruezo偽デルタ波時間 ≧ 34ms（緩徐な初期脱分極）。',
        'Bazan基準: I誘導・aVL誘導ですべて遠ざかる興奮のため完全なqSパターンを呈する。',
        'QRS幅が著明に広い（通常165〜180ms以上）。'
      ],
      pitfalls: '心外膜下脂肪組織に埋もれているため通常の心内膜アブレーションでは高周波エネルギーが到達せず無効になりやすい。さらにLADやLCxなどの主要冠動脈が真横を走行する。',
      ablationStrategy: '冠静脈洞深部（GCV/AIV）内マッピング、または経皮的剣状突起下心膜穿刺（Subxiphoid Epicardial Approach）。CAGで冠動脈との安全距離（>5mm）を必ず確認。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'rbbb_rs',
      transition: 'V2',
      lead1: 'negative',
      leadAVL: 'negative_deep',
      qrsDuration: 172,
      v2s_v3r_ratio: 0.6,
      v2_trans_ratio: 0.92,
      mdi: 0.62, // >= 0.55 => 心外膜
      pseudoDelta: 42, // >= 34ms => 心外膜
      hasNotch: true,
      leads: {
        I: { pattern: 'QS', amp: -1.0 },
        II: { pattern: 'Notched_R', amp: 2.3 },
        III: { pattern: 'Notched_R', amp: 1.4 },
        aVR: { pattern: 'QS', amp: -1.0 },
        aVL: { pattern: 'QS', amp: -1.8 },
        aVF: { pattern: 'Notched_R', amp: 1.9 },
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
    id: 'ilvt_fascicular',
    name: '特発性左室頻拍 (左脚後枝起源 - ILVT)',
    subtitle: '比較的シャープなQRS、RBBB＋左軸偏位、ベラパミル感受性',
    category: '束枝・プルキンエ (Fascicular)',
    transmuralSite: '心内膜下刺激伝導系 (Subendocardial)',
    citation: {
      authors: '篠原徹二 (大分大学) / 向井靖, 河合俊輔 (福岡赤十字病院)',
      title: '特発性心室頻拍 (ベラパミル感受性心室頻拍) / Wide QRS tachycardia',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 110-114, 125',
      figure: '図4: ベラパミル感受性心室頻拍の12誘導心電図 & 図5: ベラパミル静注の効果',
      doi: 'Nogami A. PACE 2011; 34: 624-650'
    },
    description: '特殊心筋（プルキンエ網）を回路に含むリエントリー。立ち上がりが鋭くRS時間が短い（<60-80ms）。QRS幅は120-135msと比較的狭く、RBBB型＋著明な左軸偏位を示します。ベラパミル静注で停止。',
    clinicalInsights: {
      mechanism: '左脚後枝領域のプルキンエ線維網を中心とするカルシウム依存性マクロリエントリー。',
      ecgKeyPoints: [
        '右脚ブロック (RBBB) パターン（V1誘導でrsR\'または単相性R波）。',
        '著明な左軸偏位（上方軸: I誘導で高いR波、II, III, aVFで深いrS波）。',
        'QRS幅が比較的狭い（120〜130ms程度: 伝導系を利用するため）。',
        '初期立ち上がりが極めて鋭峻（RS時間短縮、MDI 0.36と著明に低値）。'
      ],
      pitfalls: 'QRS幅が比較的狭いため、発作性上室頻拍（PSVT＋脚ブロック変行伝導）と誤診されやすい。房室解離の確認やベラパミル静注時の心電図変化が鑑別の鍵。',
      ablationStrategy: '左室後中隔中下部において、局所心室電位に先行する鋭いプルキンエ電位（Purkinje Potential / P電位）を同定し通電。根治率が極めて高い。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'rbbb_rs',
      transition: 'V3',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 124,
      v2s_v3r_ratio: 0.9,
      v2_trans_ratio: 0.75,
      mdi: 0.36, // < 0.55
      pseudoDelta: 18, // < 34ms
      hasNotch: false,
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
    id: 'lv_inferior_omi',
    name: '左室下壁・陳旧性心筋梗塞合併二次性PVC',
    subtitle: '上方軸＋右脚ブロック、下壁誘導の異常Q波が病因を証明',
    category: '器質的心疾患 (Ischemic / Scar)',
    transmuralSite: '瘢痕辺縁心内膜側 (Endocardial Borderzone)',
    citation: {
      authors: '大西克実 (昭和大学医学部循環器内科)',
      title: '心室期外収縮 (二次性PVCと陳旧性心筋梗塞)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 100-106',
      figure: '図2: 左室下壁の陳旧性心筋梗塞に合併した二次性PVC (実例心電図)',
      doi: 'Heart View 2022 / Stevenson 1993'
    },
    description: '右冠動脈領域の陳旧性心筋梗塞瘢痕を基質とする二次性PVC。上方軸（下壁誘導深いQS）＋RBBB型。期外収縮だけでなく洞調律時の下壁誘導にも病的な異常Q波を認めます。',
    clinicalInsights: {
      mechanism: '心筋梗塞瘢痕組織辺縁（Borderzone）の伝導遅延・リエントリーまたは異常自動能。',
      ecgKeyPoints: [
        '上方軸（II, III, aVF誘導で深いQSパターン・異常Q波）。',
        '胸部誘導は右脚ブロックパターン（V1でRまたはqR）。',
        '期外収縮以外の洞調律心電図でも下壁誘導に病的な異常Q波・T波陰転を認める。',
        'QRS幅は150ms以上と延長。'
      ],
      pitfalls: '特発性不整脈と誤診して単なる経過観察とせず、冠動脈造影（CAG）や心エコー等で虚血性心疾患・心機能低下の評価を必ず行うこと。',
      ablationStrategy: '遅延造影MRIや3D電位マッピング（Voltage Mapping）で瘢痕境界領域の緩徐伝導峡部（Isthmus）を同定し、基質修飾アブレーション（Substrate Modification）を実施。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'rbbb_qr',
      transition: 'V2',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 158,
      v2s_v3r_ratio: 0.5,
      v2_trans_ratio: 0.88,
      mdi: 0.46,
      pseudoDelta: 28,
      hasNotch: true,
      leads: {
        I: { pattern: 'R', amp: 1.2 },
        II: { pattern: 'QS', amp: -2.2 },
        III: { pattern: 'QS', amp: -2.6 },
        aVR: { pattern: 'rS', amp: -0.6 },
        aVL: { pattern: 'R', amp: 1.6 },
        aVF: { pattern: 'QS', amp: -2.4 },
        V1: { pattern: 'qR', amp: 1.5 },
        V2: { pattern: 'Rs', amp: 1.3 },
        V3: { pattern: 'rS', amp: -1.0 },
        V4: { pattern: 'rS', amp: -1.5 },
        V5: { pattern: 'QS', amp: -1.6 },
        V6: { pattern: 'QS', amp: -1.3 }
      }
    }
  },
  {
    id: 'lv_pmpm',
    name: '左室後内側乳頭筋 (PMPM)',
    subtitle: 'RBBB型 ＋ 著明な左軸偏位（上軸）、幅広いQRS',
    category: '乳頭筋 (Papillary Muscle)',
    transmuralSite: '心内膜側隆起部 (Endocardial Trabecular)',
    citation: {
      authors: '向井靖, 河合俊輔 (福岡赤十字病院) / 服部正幸',
      title: 'Wide QRS tachycardiaの鑑別手順 / 器質的背景をもったVT',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 123-131, 116-122',
      figure: '表3: QRS極性による鑑別法 & 図4b: 左室下壁起源のVTシェーマ',
      doi: 'Good E, et al. Circ Arrhythm Electrophysiol 2011; 4: 837-843'
    },
    description: '後下壁寄りの乳頭筋頭部・基部起源。興奮が心尖・後壁から上方へ向かうため下壁誘導(II, III, aVF)は深いQS（上軸）。V1はRBBB型(qR)を示し、QRS幅は比較的広くノッチを伴います。',
    clinicalInsights: {
      mechanism: '乳頭筋深部の線維性構造周囲の微小リエントリーまたは撃発活動。',
      ecgKeyPoints: [
        '下壁誘導 (II, III, aVF) で深いQSパターン（上方軸）。',
        'V1誘導でRBBBパターン（qR型またはR型）。',
        'I誘導で高いR波（左軸偏位）。',
        'QRS幅が150ms以上と広く、下壁誘導や胸部誘導に明瞭なノッチを伴う。'
      ],
      pitfalls: 'ILVT（左脚後枝）と軸・脚ブロック型が類似するが、QRS幅が明らかに広く、立ち上がりが鈍い点、ベラパミルが無効な点で鑑別可能。',
      ablationStrategy: '腔内心エコー（ICE）ガイド下に乳頭筋頭部・基部へのカテーテルコンタクトを直視確認しながら通電。クライオアブレーションも有効。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'rbbb_qr',
      transition: 'V2',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 155,
      v2s_v3r_ratio: 0.5,
      v2_trans_ratio: 0.9,
      mdi: 0.48,
      pseudoDelta: 28,
      hasNotch: true,
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
    id: 'amc_junction',
    name: '大動脈僧帽弁移行部 (AMC)',
    subtitle: 'V1〜V6全陽性 (Concordant R波)、著明な高R波',
    category: '流出路/弁輪移行部',
    transmuralSite: '心室基部線維筋部 (Basal Continuity)',
    citation: {
      authors: '向井靖, 河合俊輔 (福岡赤十字病院) / 篠原徹二',
      title: 'Wide QRS tachycardia (胸部誘導Concordantパターンの臨床的意義)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 123-131, 108',
      figure: '本文 p.127: 胸部誘導がPositive Concordantになる解剖学的機序',
      doi: 'Heart Rhythm 2005; Tada et al.'
    },
    description: '大動脈弁輪と僧帽弁輪の結合部。心臓のほぼ中央・後上方に位置し、V1からV6まで高い単相性R波（Positive Concordance）を示し、下軸でI誘導も陽性R波になります。',
    clinicalInsights: {
      mechanism: '大動脈僧帽弁輪結合部の線維三角部における異常自動能または撃発活動。',
      ecgKeyPoints: [
        '胸部誘導 (V1〜V6) すべてでR波優位（Positive Concordantパターン）。',
        '下壁誘導 (II, III, aVF) で高いR波（下方軸）。',
        'I誘導で陽性R波（左から右への興奮伝播）。',
        '心室基部・後上方から前方心尖部へ向かって均一に興奮が広がる。'
      ],
      pitfalls: 'WPW症候群の左側副伝導路（Kent束）順伝導頻拍でもPositive Concordanceを呈するため、非発作時のデルタ波の有無を確認すること。',
      ablationStrategy: '経大動脈逆行性アプローチで無冠尖(NCC)〜左冠尖(LCC)下部の僧帽弁前尖付着部をマッピング。冠動脈回旋枝および房室結節の損傷に注意。'
    },
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
      pseudoDelta: 27,
      hasNotch: false,
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
