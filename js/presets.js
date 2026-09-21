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
        'I誘導が明瞭な単相性R波でs波を認めない（Ito 2003: 右側中隔の64% vs 左側4%、特異度96%）。',
        'Ito基準: R-wave duration index = 28% (<50%)、R/S amplitude index = 12% (<30%)。',
        'QRS幅は比較的狭く（135ms）、下壁誘導にノッチを認めず II R波高 > III R波高。',
        'aVR Q波高 > aVL Q波高、かつ aVR Q波の開始が aVLより先行（posterior attachment特徴）。'
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
      // Ito et al. 2003 JCE パラメータ
      r_wave_duration_index: 0.28, // < 0.50 => RVOT
      rs_amplitude_index: 0.12, // < 0.30 => RVOT
      lead1_has_s_wave: false, // s波なし => RVOT中隔特異度96%
      ii_gt_iii: true, // II > III => RVOT中隔
      avl_vs_avr: 'avr_q_early_deep', // aVR Q先行・大 => RVOT posterior attachment
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
    subtitle: '幅広いQRS波と下壁ノッチが特徴 (発生頻度 10%)',
    category: '右室流出路 (RVOT)',
    transmuralSite: '心内膜側〜筋層 (Thin Wall)',
    citation: {
      authors: '大西克実 (昭和大学医学部循環器内科) / 篠原徹二',
      title: '心室期外収縮 (特発性流出路起源PVCの正確な起源推測)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 100-106, 108-115',
      figure: '図1: 流出路起源PVCの正確な起源推測フローチャート (Itoアルゴリズム Step 7)',
      doi: 'J Cardiovasc Electrophysiol 2003; 14: 1280-1286'
    },
    description: '自由壁起源は心室中隔から遠いため興奮伝播に時間を要し、QRS幅が広く(>150ms)、下壁誘導にノッチを伴います。移行帯はV4-V5と遅く、I誘導はQSまたは二相性になりやすい。流出路PVCのわずか10%と稀。',
    clinicalInsights: {
      mechanism: '右室自由壁の撃発活動。心室中隔への伝播遅延によりQRS幅が拡大。',
      ecgKeyPoints: [
        '下壁誘導 (II, III, aVF) のR波にノッチを伴い、R-R\'頂点間時間 > 20ms (Yamashina 2004: 特異度92%)。',
        'V1〜V3誘導に著明に深いS波 (Deep S wave: 胸壁直下からの離脱ベクトル)。',
        '胸部誘導の移行帯がV5以降と遅延（Transition ≥ V4、遅延移行）。',
        'I誘導が陰性 (QS) または R(RR\')パターン。',
        '下壁誘導のR波高が中隔起源に比べて低い (vs Sep-VT)。',
        'Ito基準: RVOT中隔(90%)に対し自由壁はわずか10%。R幅比率=35% (<50%)、R/S波高比率=18% (<30%)。'
      ],
      pitfalls: '右室自由壁は心室筋壁が極めて薄いため（1〜3mm程度）、コンタクトフォース過多による心穿孔・急性心タンポナーデに細心の注意が必要。(Cir J 2004 Yamashina)',
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
      has_notch_rr_gt_20ms: true, // Yamashina 2004: R-R' > 20ms
      v1_deep_s: true, // Yamashina 2004: Deep S wave
      // Ito et al. 2003 JCE パラメータ
      r_wave_duration_index: 0.35, // < 0.50 => RVOT
      rs_amplitude_index: 0.18, // < 0.30 => RVOT
      lead1_has_s_wave: true,
      ii_gt_iii: false, // III >= II
      avl_vs_avr: 'normal',
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
    subtitle: '早期移行帯とII/III比>1、Ito基準でLCCを確定',
    category: '左室流出路 (LVOT)',
    transmuralSite: '心内膜〜大動脈洞 (Aortic Cusp)',
    citation: {
      authors: '篠原徹二 (大分大学循環器内科) / 大西克実',
      title: '特発性心室頻拍 (大動脈弁冠尖部起源)',
      journal: 'Heart View 2022; Vol.26 No.12(増刊号): 108-115, 100-106',
      figure: '図1b: 左室流出路起源の特発性心室頻拍の12誘導心電図 (RBBB型下方軸)',
      doi: 'Circulation 2002; 106: 962-967 / Tada 2005 / Ito 2003'
    },
    description: '下軸でV1〜V2で早期に移行（Transition ≤ V2）。Ito基準でR-wave duration index ≥ 50%、R/S amplitude index ≥ 30%を満たしLCCを確定。aVL誘導で深いQS、II/III比 > 1を示します。',
    clinicalInsights: {
      mechanism: '大動脈洞弁尖部の線維筋性スリーブにおける撃発活動。',
      ecgKeyPoints: [
        '胸部誘導の早期移行（V1でR>SまたはV2でR波優位への移行、左側起源の60%）。',
        'Ito基準: R-wave duration index = 65% (≥50%)、R/S amplitude index = 180% (≥30%) で左冠尖を確定 (p < 0.001)。',
        'II誘導のR波高 ＞ III誘導のR波高 (II/III比 > 1.0)。LCCが左後方に位置するため。',
        'aVL誘導で深いQSパターン (aVL Q波高 >> aVR Q波高)。',
        'I誘導で明瞭なRs波（s波成分を認める: 左側の96%に合致）。'
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
      // Ito et al. 2003 JCE パラメータ
      r_wave_duration_index: 0.65, // >= 0.50 => LCC
      rs_amplitude_index: 1.80, // >= 0.30 => LCC
      lead1_has_s_wave: true, // s波あり => 左側96%
      ii_gt_iii: true, // II > III => LCC
      avl_vs_avr: 'avl_q_deep', // aVL Q >> aVR Q => LCC
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
        'Ito 2003 LVEpi基準: aVL/aVR Q波比 1.8 (>1.4) ＋ V1 S波深さ 1.5mV (>1.2mV) で左バルサルバ洞(LSV/LCC)通電不成功・心外膜側(LVEpi)を強力示唆 (特異度>88%)。',
        'Bazan基準: I誘導・aVL誘導ですべて遠ざかる興奮のため完全なqSパターンを呈する。',
        'QRS幅が著明に広い（通常165〜180ms以上）。'
      ],
      pitfalls: '心外膜下脂肪組織に埋もれているため通常の心内膜アブレーションでは高周波エネルギーが到達せず無効になりやすい。さらにLADやLCxなどの主要冠動脈が真横を走行する。',
      ablationStrategy: '冠静脈洞深部（GCV/AIV）内マッピング、または経皮的剣状突起下心膜穿刺（Subxiphoid Epicardial Approach）。CAGで冠動脈との安全距離（>5mm）を必ず確認。局所最早期電位先行時間(-32ms)を指標とする。(Circ J 2007)'
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
      avl_avr_q_ratio: 1.8, // Ito 2003: > 1.4
      v1_s_amp: 1.5, // Ito 2003: > 1.2mV
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
        'V1誘導で特異的なq(+) / qRパターン（Tada 2005 / スライド4）。',
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
      v1Pattern: 'rbbb_qr',
      transition: 'V1',
      lead1: 'positive',
      leadAVL: 'biphasic',
      qrsDuration: 145,
      v2s_v3r_ratio: 0.3,
      v2_trans_ratio: 1.1,
      mdi: 0.47,
      pseudoDelta: 27,
      hasNotch: false,
      v1_qr_pattern: true, // Tada 2005: AMC前部 q(+) / qR
      leads: {
        I: { pattern: 'R', amp: 1.3 },
        II: { pattern: 'R', amp: 2.2 },
        III: { pattern: 'R', amp: 1.8 },
        aVR: { pattern: 'QS', amp: -1.4 },
        aVL: { pattern: 'Rs', amp: 0.6 },
        aVF: { pattern: 'R', amp: 2.1 },
        V1: { pattern: 'qR', amp: 2.2 },
        V2: { pattern: 'R', amp: 2.8 },
        V3: { pattern: 'R', amp: 2.6 },
        V4: { pattern: 'R', amp: 2.2 },
        V5: { pattern: 'R', amp: 1.8 },
        V6: { pattern: 'R', amp: 1.5 }
      }
    }
  },
  {
    id: 'parahisian_septal',
    name: 'ヒス束近傍 / 三尖弁輪中隔 (Parahisian)',
    subtitle: 'LBBB型・狭いQRS・I/aVL陽性・II>>III解離・V1/V2純QS (Lin 2008)',
    category: '中隔 / 弁輪部 (Parahisian)',
    transmuralSite: '心内膜中隔側 (Endocardial Septum)',
    citation: {
      authors: 'Lin D, Marchlinski FE, et al. / Enriquez A, Garcia F.',
      title: 'Twelve-lead ECG characteristics of aortic cusp region / Mapping and Ablation of PVCs',
      journal: 'Heart Rhythm 2008; 5: 663-669 / JACC EP 2024; 10: 1206-1222',
      figure: 'Lin 2008 Figure 2: RVOT PVC just above the His',
      doi: '10.1016/j.hrthm.2008.02.015'
    },
    description: '通常のRVOTよりも右下方、His記録部位直上の中隔起源。I誘導は高R波、IIIのR波高はIIより明らかに低い(II>>III)、V1・V2は純粋なQSパターン(small rなし)、aVL陽性(Q波小)、QRSノッチなし。',
    clinicalInsights: {
      mechanism: 'ヒス束直上・膜性中隔境界部の線維性中隔組織における異常自動能または撃発活動。',
      ecgKeyPoints: [
        'I誘導で高い単相性R波（波高大）。',
        'III誘導のR波高は明らかにII誘導より低い (II >> III)。',
        'V1・V2誘導ともに純粋なQS pattern（RCCと異なりsmall R波なし: Lin 2008）。',
        'aVL誘導のQRS極性は陽性のことが多い（陰性でもQ波はaVRより小）。',
        'QRS notchingなし（比較的シャープ <130ms）。'
      ],
      pitfalls: 'ヒス束電位記録部位から10mm以内のため、直接通電による完全房室ブロック（永久ペースメーカー植え込み）の危険性が極めて高い最厳重注意部位。',
      ablationStrategy: '最早期部位でHis電位を記録する場合、隣接する無冠尖(NCC)や右冠尖(RCC)からの通電を第一選択として検討。10〜20Wの低出力から漸増し、AH延長や脚ブロック出現時は即時中止。安全のためクライオアブレーションも有効。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_qs',
      transition: 'V3',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 126,
      v2s_v3r_ratio: 1.1,
      v2_trans_ratio: 0.72,
      mdi: 0.38,
      pseudoDelta: 20,
      hasNotch: false,
      v2_has_small_r: false, // Lin 2008: V2 small Rなし(純QS)
      ii_gt_iii: true, // II >> III
      lead1_has_s_wave: false,
      leads: {
        I: { pattern: 'R', amp: 1.4 },
        II: { pattern: 'R', amp: 2.3 },
        III: { pattern: 'Rs', amp: 0.9 },
        aVR: { pattern: 'QS', amp: -1.3 },
        aVL: { pattern: 'Rs', amp: 0.8 },
        aVF: { pattern: 'R', amp: 1.8 },
        V1: { pattern: 'QS', amp: -1.6 },
        V2: { pattern: 'QS', amp: -1.4 },
        V3: { pattern: 'Rs', amp: 1.4 },
        V4: { pattern: 'R', amp: 2.1 },
        V5: { pattern: 'R', amp: 1.8 },
        V6: { pattern: 'R', amp: 1.4 }
      }
    }
  },
  {
    id: 'moderator_band',
    name: '右室調整帯 (Moderator Band: MB)',
    subtitle: 'LBBB型＋左上方軸、著明に遅い移行帯(>V4)、悪性VFトリガー',
    category: '心腔内構造物 (Intracavitary)',
    transmuralSite: '右室腔内筋束・プルキンエ網 (Intracavitary Trabecular)',
    citation: {
      authors: 'Andres Enriquez, Daniele Muser, Timothy M. Markman, Fermin Garcia',
      title: 'Mapping and Ablation of Premature Ventricular Complexes: State of the Art',
      journal: 'J Am Coll Cardiol EP 2024; Vol.10 No.6: 1206-1222',
      figure: 'Central Illustration & Figure 3D: Right ventricular moderator band',
      doi: 'https://doi.org/10.1016/j.jacep.2024.02.008'
    },
    description: '右室心腔内を横断する筋束（MB）起源。LBBB型＋著明な左軸偏位（左上方軸）。移行帯はV4以降と著明に遅延（洞調律より遅い）。短連結期PVCが多く心室細動(VF)の主要トリガー。',
    clinicalInsights: {
      mechanism: 'モデレーターバンド内を走行する右脚プルキンエ線維網の撃発活動・異常自動能。',
      ecgKeyPoints: [
        'LBBBパターン ＋ 著明な左軸偏位（左上方軸: I, aVLで高R波、下壁誘導深いQS）。',
        '胸部誘導移行帯が著しく遅延（Transition > V4、患者の洞調律移行帯より遅い）。',
        '下壁誘導解離（II誘導が陽性、III誘導が深い陰性QS）。',
        '短連結期（Coupling interval < 350ms）のPVCが多く、特発性心室細動（VF）の強力なトリガーとなる。'
      ],
      pitfalls: '器質的心疾患のない健康若年者でも心室細動（VF）・突然死のトリガーとなり得る。右室前・後乳頭筋起源との鑑別（乳頭筋は移行帯が早く下方軸）が肝要。',
      ablationStrategy: '腔内心エコー（ICE）とCARTO-SOUNDによるMBの3Dジオメトリ構築が必須。鋭いプルキンエ電位を指標とし、出口が多岐にわたるため長軸に沿った複数点通電が必要。カテーテル安定性に優れるクライオアブレーションが有効。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'lbbb_qs',
      transition: 'V5',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 154,
      v2s_v3r_ratio: 2.8,
      v2_trans_ratio: 0.28,
      mdi: 0.44,
      pseudoDelta: 26,
      hasNotch: true,
      leads: {
        I: { pattern: 'R', amp: 1.4 },
        II: { pattern: 'rS', amp: -1.2 },
        III: { pattern: 'QS', amp: -2.4 },
        aVR: { pattern: 'rS', amp: -0.6 },
        aVL: { pattern: 'R', amp: 1.6 },
        aVF: { pattern: 'QS', amp: -2.0 },
        V1: { pattern: 'QS', amp: -2.2 },
        V2: { pattern: 'QS', amp: -2.5 },
        V3: { pattern: 'QS', amp: -1.9 },
        V4: { pattern: 'rS', amp: -1.1 },
        V5: { pattern: 'Rs', amp: 1.5 },
        V6: { pattern: 'R', amp: 1.3 }
      }
    }
  },
  {
    id: 'tricuspid_lateral',
    name: '三尖弁輪外側壁 (Lateral Tricuspid Annulus)',
    subtitle: 'LBBB型・遅延移行帯(>V3)・I/aVL陽性・下壁ノッチ・カテーテル不安定部位',
    category: '弁輪部 (Valvular Annulus)',
    transmuralSite: '心内膜側弁輪部 (Endocardial Annulus)',
    citation: {
      authors: 'Andres Enriquez, Daniele Muser, Timothy M. Markman, Fermin Garcia',
      title: 'Mapping and Ablation of Premature Ventricular Complexes: State of the Art',
      journal: 'J Am Coll Cardiol EP 2024; Vol.10 No.6: 1206-1222',
      figure: 'Central Illustration & Figure 3B: Lateral tricuspid annulus',
      doi: 'https://doi.org/10.1016/j.jacep.2024.02.008'
    },
    description: '三尖弁輪外側壁起源。LBBB型＋遅延移行帯(>V3)、幅広いQRS(>150ms)、下壁ノッチング。弁輪が右側・下方にあるためI誘導およびaVL誘導は陽性。カテーテル固定が極めて困難。',
    clinicalInsights: {
      mechanism: '三尖弁輪心室側外側壁の線維性筋組織における撃発活動。',
      ecgKeyPoints: [
        'LBBBパターン ＋ 胸部誘導の移行帯遅延（Transition > V3）。',
        'V1誘導でrS型、下壁誘導 (II, III, aVF) に明瞭なノッチングを認める。',
        'I誘導およびaVL誘導が陽性（TVがRVOTより右下方・後方にあるため）。',
        '中隔から離れた外側壁起源のためQRS幅が広い（通常 >155ms）。'
      ],
      pitfalls: '三尖弁輪外側〜上方は血流と心拍動の影響を強く受け、カテーテルの安定した組織コンタクトを維持するのが最も困難な部位のひとつ。',
      ablationStrategy: '大腿静脈アプローチでは逆Sカーブ（Reversed S curve: 弁尖と心室自由壁の間隙に先端をくぐらせる）または長シース（Agilis等）によるバックアップ。困難例では内頸静脈からの上部アプローチが奏功する。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_rs',
      transition: 'V4',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 162,
      v2s_v3r_ratio: 2.1,
      v2_trans_ratio: 0.45,
      mdi: 0.45,
      pseudoDelta: 28,
      hasNotch: true,
      leads: {
        I: { pattern: 'R', amp: 1.1 },
        II: { pattern: 'Notched_R', amp: 2.2 },
        III: { pattern: 'Notched_R', amp: 2.1 },
        aVR: { pattern: 'QS', amp: -1.4 },
        aVL: { pattern: 'Rs', amp: 0.6 },
        aVF: { pattern: 'Notched_R', amp: 2.2 },
        V1: { pattern: 'rS', amp: -1.7 },
        V2: { pattern: 'QS', amp: -2.1 },
        V3: { pattern: 'rS', amp: -1.3 },
        V4: { pattern: 'Rs', amp: 1.4 },
        V5: { pattern: 'R', amp: 1.9 },
        V6: { pattern: 'R', amp: 1.4 }
      }
    }
  },
  {
    id: 'cardiac_crux',
    name: '心十字部 (Cardiac Crux / Basal Inferoseptal LV)',
    subtitle: 'LBBB型＋左上方軸、V2早期移行、下壁QS型、MDI>0.55、中心静脈マッピング',
    category: '心外膜・心底十字部 (Epicardial Crux)',
    transmuralSite: '心外膜側〜中隔深部 (Epicardial Crux)',
    citation: {
      authors: 'Andres Enriquez, Daniele Muser, Timothy M. Markman, Fermin Garcia',
      title: 'Mapping and Ablation of Premature Ventricular Complexes: State of the Art',
      journal: 'J Am Coll Cardiol EP 2024; Vol.10 No.6: 1206-1222',
      figure: 'Central Illustration: Crux & Text Page 1215: Cardiac Crux and Inferoseptal LV',
      doi: 'https://doi.org/10.1016/j.jacep.2024.02.008'
    },
    description: '房室溝と後室間溝の交差部（Crux）起源。LBBB様＋著明な左上方軸（下壁誘導深いQS）、V2早期移行。MDI>0.55と心外膜特徴を示し、中心静脈(MCV)マッピングが鍵。冠動脈近接に警戒。',
    clinicalInsights: {
      mechanism: '心十字部・後下中隔心外膜側組織における異所性自動能・微小リエントリー。',
      ecgKeyPoints: [
        'LBBBパターン ＋ 著明な左上方軸（I, aVLで高R波、下壁誘導II, III, aVFで深いQS）。',
        '胸部誘導はV2で早期移行（Early transition at V2）。',
        '下壁誘導ですべてQSパターン（上方へ遠ざかる興奮）。',
        '最大偏位指数（MDI）> 0.55、初期立ち上がりの緩徐な偽デルタ波（心外膜側特徴）。'
      ],
      pitfalls: '右冠動脈後下行枝（PDA）および中心静脈（MCV）が直近を走行するため、冠動脈造影（CAG）なしに通電すると冠動脈狭窄・下壁心筋梗塞の恐れがある。',
      ablationStrategy: '冠静脈洞経由で中心静脈（MCV）内を多電極カテーテルでマッピング。MCV内通電は10〜20Wの低出力から開始し慎重に漸増（最大30W）。心内膜側からは右房下中隔（遅延伝導路近傍）または左室中隔基部からの対向通電を試みる。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'lbbb_qs',
      transition: 'V2',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 164,
      v2s_v3r_ratio: 0.7,
      v2_trans_ratio: 0.85,
      mdi: 0.58, // > 0.55 => 心外膜
      pseudoDelta: 38, // > 34ms => 心外膜
      hasNotch: true,
      leads: {
        I: { pattern: 'R', amp: 1.3 },
        II: { pattern: 'QS', amp: -2.3 },
        III: { pattern: 'QS', amp: -2.5 },
        aVR: { pattern: 'rS', amp: -0.5 },
        aVL: { pattern: 'R', amp: 1.5 },
        aVF: { pattern: 'QS', amp: -2.4 },
        V1: { pattern: 'QS', amp: -1.7 },
        V2: { pattern: 'Rs', amp: 1.3 },
        V3: { pattern: 'R', amp: 1.8 },
        V4: { pattern: 'R', amp: 1.9 },
        V5: { pattern: 'R', amp: 1.5 },
        V6: { pattern: 'rS', amp: -0.8 }
      }
    }
  },
  {
    id: 'lvot_rcc',
    name: 'LVOT 右冠尖 (RCC: Right Coronary Cusp)',
    subtitle: 'V2 small R波出現と移行帯V3、III≥II (Lin et al. 2008)',
    category: '左室流出路 (Aortic Cusp)',
    transmuralSite: '大動脈洞 (Aortic Cusp)',
    citation: {
      authors: 'Lin D, Ilkhanoff L, Gerstenfeld E, Marchlinski FE, et al.',
      title: 'Twelve-lead electrocardiographic characteristics of the aortic cusp region',
      journal: 'Heart Rhythm 2008; Vol.5 No.5: 663-669',
      figure: 'Figure 1 & 2: RCC PVC vs RVOT PVC just above the His',
      doi: '10.1016/j.hrthm.2008.02.015'
    },
    description: '右冠尖(RCC)起源。心室中隔を挟んでRVOT His直上中隔と対向し心電図が酷似するが、RCCは解剖学的に後方・左室側に位置するためV2誘導に"small R波"が出現し移行帯がV3と早期。III誘導R波高≥II誘導。',
    clinicalInsights: {
      mechanism: '右冠尖線維性スリーブの異所性自動能・撃発活動。',
      ecgKeyPoints: [
        '胸部移行帯がV3と早期（RVOT中隔側は通常V3〜V4）。',
        'V2誘導に初期小r波（"small R"）を認める（Lin 2008: 鑑別正診率>88%）。',
        '下壁誘導でIII誘導のR波高 ≥ II誘導のR波高（右前方からのベクトル）。',
        'I誘導は平坦〜陰性または二相性。'
      ],
      pitfalls: '右冠動脈（RCA）開口部およびヒス束・房室結節伝導系への近接。',
      ablationStrategy: '大動脈弁逆行性アプローチ。CAG下にRCA開口部から10mm以上の安全距離を確認。His電位を避けて通電。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_qs',
      transition: 'V3',
      lead1: 'negative',
      leadAVL: 'negative_shallow',
      qrsDuration: 142,
      v2s_v3r_ratio: 1.3,
      v2_trans_ratio: 0.65,
      mdi: 0.46,
      pseudoDelta: 26,
      hasNotch: false,
      v2_has_small_r: true, // Lin 2008: V2 small R
      ii_gt_iii: false, // III >= II
      r_wave_duration_index: 0.42,
      rs_amplitude_index: 0.28,
      leads: {
        I: { pattern: 'rS', amp: -0.4 },
        II: { pattern: 'R', amp: 2.1 },
        III: { pattern: 'R', amp: 2.3 },
        aVR: { pattern: 'QS', amp: -1.6 },
        aVL: { pattern: 'rS', amp: -0.5 },
        aVF: { pattern: 'R', amp: 2.2 },
        V1: { pattern: 'QS', amp: -1.8 },
        V2: { pattern: 'rS', amp: -1.4 },
        V3: { pattern: 'Rs', amp: 1.2 },
        V4: { pattern: 'R', amp: 1.8 },
        V5: { pattern: 'R', amp: 1.9 },
        V6: { pattern: 'R', amp: 1.5 }
      }
    }
  },
  {
    id: 'mva_posteroseptal',
    name: '僧帽弁輪 後中隔 (Posteroseptal MA)',
    subtitle: 'V1特異的qRパターン ＋ 上軸（下壁深いQS）、AMCとの軸鑑別 (Tada 2005)',
    category: '弁輪部 (Valvular Annulus)',
    transmuralSite: '僧帽弁輪中隔基部 (Mitral Annulus)',
    citation: {
      authors: 'Tada H, Ito S, Naito S, Kubota S, Nogami A, et al.',
      title: 'Idiopathic ventricular arrhythmias originating from the mitral annulus',
      journal: 'J Am Coll Cardiol 2005; Vol.45 No.6: 877-886',
      figure: 'Figure 1C & 3: Posteroseptal MA with qR in lead V1',
      doi: '10.1016/j.jacc.2004.11.053'
    },
    description: '僧帽弁輪後中隔起源。V1誘導に極めて特異的な「qRパターン」を形成。左室基部後下方に位置するため電気軸は上軸（II, III, aVFですべて深いQS型）。AMC前部（下軸）との軸対比で完全同定可能。',
    clinicalInsights: {
      mechanism: '僧帽弁輪後中隔筋束における異所性撃発活動。',
      ecgKeyPoints: [
        'V1誘導で特異的な「qRパターン」（微小初期q波＋高R波: Tada 2005）。',
        '下壁誘導 (II, III, aVF) で深いQSパターン（著明な上軸）。',
        '胸部誘導全陽性傾向（V2〜V6高R波）。',
        'I誘導・aVL誘導は陽性R波。'
      ],
      pitfalls: '冠静脈洞近傍・左房中隔下部に近接。食道や左房後壁との解剖学的距離を考慮。',
      ablationStrategy: '経心房中隔穿刺（Transseptal）による左房側弁輪アプローチ、または大動脈弁逆行性左室心内膜アプローチ。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'rbbb_qr',
      transition: 'V1',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 138,
      v2s_v3r_ratio: 0.3,
      v2_trans_ratio: 0.95,
      mdi: 0.44,
      pseudoDelta: 24,
      hasNotch: false,
      v1_qr_pattern: true, // Tada 2005: V1 qR
      leads: {
        I: { pattern: 'R', amp: 1.4 },
        II: { pattern: 'QS', amp: -2.2 },
        III: { pattern: 'QS', amp: -2.5 },
        aVR: { pattern: 'rS', amp: -0.6 },
        aVL: { pattern: 'R', amp: 1.6 },
        aVF: { pattern: 'QS', amp: -2.4 },
        V1: { pattern: 'qR', amp: 1.6 },
        V2: { pattern: 'R', amp: 2.2 },
        V3: { pattern: 'R', amp: 2.5 },
        V4: { pattern: 'R', amp: 2.3 },
        V5: { pattern: 'R', amp: 1.9 },
        V6: { pattern: 'R', amp: 1.4 }
      }
    }
  },
  {
    id: 'mva_anterolateral',
    name: '僧帽弁輪 前側壁 (Anterolateral MA)',
    subtitle: 'V1単相性高R波 ＋ I/aVL深いQS ＋ 下壁ノッチ (Tada 2005 図A)',
    category: '弁輪部 (Valvular Annulus)',
    transmuralSite: '僧帽弁輪前側壁 (Mitral Annulus)',
    citation: {
      authors: 'Tada H, Ito S, Naito S, Kubota S, Nogami A, et al.',
      title: 'Idiopathic ventricular arrhythmias originating from the mitral annulus',
      journal: 'J Am Coll Cardiol 2005; Vol.45 No.6: 877-886',
      figure: 'Figure 1A: Anterolateral MA with monophasic R in V1 & deep QS in lead I/aVL',
      doi: '10.1016/j.jacc.2004.11.053'
    },
    description: '僧帽弁輪前側壁起源（スライドA）。V1誘導は鋭い単相性高R波（Positive concordance）。前側壁から遠ざかるためI誘導・aVL誘導で深いQS波となり、下壁誘導（II, III, aVF）に特徴的なノッチを伴います。',
    clinicalInsights: {
      mechanism: '僧帽弁輪前側壁筋束の異所性撃発活動。',
      ecgKeyPoints: [
        'V1誘導で鋭い「単相性高R波」（Monophasic R wave in V1）。',
        'I誘導およびaVL誘導ですべて深いQSパターン（前側壁電極から遠ざかるベクトル）。',
        '下壁誘導 (II, III, aVF) の下行脚に顕著なノッチを伴う (スライド内ピンク矢印)。',
        '胸部誘導全陽性 (V1〜V6高R波)。'
      ],
      pitfalls: '左冠動脈回旋枝（LCx）および大心静脈（GCV）の走行部に近接。',
      ablationStrategy: '経中隔穿刺による僧帽弁輪心房側マッピング、または大動脈弁逆行性心室側アプローチ。通電前CAG推奨。'
    },
    params: {
      axis: 'horizontal',
      v1Pattern: 'rbbb_monophasic',
      transition: 'V1',
      lead1: 'negative',
      leadAVL: 'negative_deep',
      qrsDuration: 145,
      v2s_v3r_ratio: 0.2,
      v2_trans_ratio: 0.98,
      mdi: 0.45,
      pseudoDelta: 26,
      hasNotch: true,
      leads: {
        I: { pattern: 'QS', amp: -1.2 },
        II: { pattern: 'Notched_rS', amp: -0.8 },
        III: { pattern: 'Notched_R', amp: 1.4 },
        aVR: { pattern: 'rS', amp: -0.4 },
        aVL: { pattern: 'QS', amp: -1.5 },
        aVF: { pattern: 'Notched_rS', amp: -1.0 },
        V1: { pattern: 'R', amp: 2.4 },
        V2: { pattern: 'R', amp: 2.6 },
        V3: { pattern: 'R', amp: 2.2 },
        V4: { pattern: 'R', amp: 2.0 },
        V5: { pattern: 'R', amp: 1.8 },
        V6: { pattern: 'R', amp: 1.5 }
      }
    }
  },
  {
    id: 'mva_posterior',
    name: '僧帽弁輪 後壁 (Posterior MA)',
    subtitle: 'V1二峰性高R波 ＋ 上軸（深いQS） ＋ 下壁ノッチ (Tada 2005 図B)',
    category: '弁輪部 (Valvular Annulus)',
    transmuralSite: '僧帽弁輪後壁 (Mitral Annulus)',
    citation: {
      authors: 'Tada H, Ito S, Naito S, Kubota S, Nogami A, et al.',
      title: 'Idiopathic ventricular arrhythmias originating from the mitral annulus',
      journal: 'J Am Coll Cardiol 2005; Vol.45 No.6: 877-886',
      figure: 'Figure 1B: Posterior MA with bifid/notched R in V1 and superior axis with notch',
      doi: '10.1016/j.jacc.2004.11.053'
    },
    description: '僧帽弁輪後壁起源（スライドB）。V1誘導は二峰性（M型）の高R波（Notched R in V1）。左室後壁から前方上方へ向かうため、電気軸は上軸（II, III, aVFで深いQS波）を呈し、下壁波形にノッチを伴います。',
    clinicalInsights: {
      mechanism: '僧帽弁輪後壁線維輪近傍の異所性自動能・撃発活動。',
      ecgKeyPoints: [
        'V1誘導で特有の「二峰性高R波 (Notched / Bifid R wave)」(スライド内赤枠)。',
        '下壁誘導 (II, III, aVF) で深いQSパターン（上軸）かつノッチを伴う (スライド内ピンク矢印)。',
        '胸部全陽性（V1〜V6で高R波）。',
        'I誘導は二相性〜低陽性。'
      ],
      pitfalls: '左房後壁および食道との近接。',
      ablationStrategy: '経中隔穿刺アプローチ。CS遠位部マッピングと弁輪部電位を比較し、最も先行する部位で通電。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'rbbb_bifid',
      transition: 'V1',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 148,
      v2s_v3r_ratio: 0.25,
      v2_trans_ratio: 0.96,
      mdi: 0.46,
      pseudoDelta: 28,
      hasNotch: true,
      leads: {
        I: { pattern: 'Rs', amp: 0.4 },
        II: { pattern: 'Notched_QS', amp: -2.0 },
        III: { pattern: 'Notched_QS', amp: -2.2 },
        aVR: { pattern: 'rS', amp: -0.6 },
        aVL: { pattern: 'R', amp: 1.2 },
        aVF: { pattern: 'Notched_QS', amp: -2.1 },
        V1: { pattern: 'Notched_R', amp: 2.5 },
        V2: { pattern: 'R', amp: 2.7 },
        V3: { pattern: 'R', amp: 2.4 },
        V4: { pattern: 'R', amp: 2.1 },
        V5: { pattern: 'R', amp: 1.7 },
        V6: { pattern: 'R', amp: 1.4 }
      }
    }
  },
  {
    id: 'lv_alpm',
    name: '左室前外側乳頭筋 (ALPM)',
    subtitle: 'RBBB型 ＋ 下方軸 ＋ V6 rS波形、頻拍誘発性心筋症 (東北大・近藤 2011)',
    category: '乳頭筋 (Papillary Muscle)',
    transmuralSite: '左室前側壁乳頭筋 (Anterior PM)',
    citation: {
      authors: '近藤正輝, 福田浩二, 中野誠, 若山裕司, 下川宏明 (東北大学循環器内科)',
      title: '左室前乳頭筋起源の頻発性心室性期外収縮に対してRFCAを施行した1例',
      journal: '心臓 2011; Vol.43 Suppl.3: 157-161 (第23回 臨床不整脈研究会)',
      figure: '図1B: 12誘導心電図 (RBBB・下方軸・V6 rS波形) & 図2: CARTO最早期',
      doi: '心臓 2011; 43(Suppl 3): 157-161'
    },
    description: '左室前外側乳頭筋(ALPM)起源。PVC多発(38%)によりEF 22%まで低下した頻拍誘発性心筋症(TIC)症例。RBBBパターン＋下方軸（II, III, aVF高R波）を呈し、V6誘導で特徴的なrS波形（r/S比 ≦ 1）。CARTOで前乳頭筋最早期同定、40Wイリゲーション通電で根治しEF 54%へ劇的回復。',
    clinicalInsights: {
      mechanism: '左室前乳頭筋深部における異所性自動能・撃発活動。QRS先行52msのprepotentialを認める。',
      ecgKeyPoints: [
        'RBBBパターン ＋ 下方軸（II, III, aVFで高いR波）。',
        'V6誘導で特徴的な「rS波形」（r/S比 ≦ 1.0: 前側壁から遠ざかるベクトル）。',
        'I誘導・aVL誘導は二相性〜低電位陰性成分を伴う（右下方への興奮伝播）。',
        'QRS幅は比較的広い（145-155ms）がノッチを伴う。'
      ],
      pitfalls: '僧帽弁輪前側壁（MA anterolateral）や特発性左脚前枝由来VTとの鑑別。前枝由来は鋭利なPurkinje電位を認めるが、乳頭筋は低電位・高周波電位。カテーテル固定が困難で深部病変のため30Wでは不十分で40W通電が必要。',
      ablationStrategy: 'CARTO 3 ＋ ICEガイド下に左室前乳頭筋を同定。イリゲーションカテーテルにて40W、42℃、30mL/分で十分な深部焼灼を実施。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'rbbb_monophasic',
      transition: 'V1',
      lead1: 'negative',
      leadAVL: 'negative_shallow',
      qrsDuration: 152,
      v2s_v3r_ratio: 0.35,
      v2_trans_ratio: 0.90,
      mdi: 0.46,
      pseudoDelta: 28,
      hasNotch: true,
      leads: {
        I: { pattern: 'rS', amp: -0.5 },
        II: { pattern: 'R', amp: 2.3 },
        III: { pattern: 'R', amp: 2.1 },
        aVR: { pattern: 'QS', amp: -1.5 },
        aVL: { pattern: 'rS', amp: -0.6 },
        aVF: { pattern: 'R', amp: 2.2 },
        V1: { pattern: 'R', amp: 2.2 },
        V2: { pattern: 'R', amp: 2.6 },
        V3: { pattern: 'R', amp: 2.3 },
        V4: { pattern: 'Rs', amp: 1.8 },
        V5: { pattern: 'Rs', amp: 1.3 },
        V6: { pattern: 'rS', amp: -0.8 }
      }
    }
  },
  {
    id: 'rv_papillary',
    name: '右室乳頭筋 (RV Papillary Muscle)',
    subtitle: 'LBBB型 ＋ 下軸 ＋ I陽性、心腔内エコー(SOUND STAR)同心円通電 (心研・妹尾 2013)',
    category: '右室 (Right Ventricle)',
    transmuralSite: '右室前壁中隔側乳頭筋 (RV Papillary)',
    citation: {
      authors: '妹尾恵太郎, 大塚崇之, 相良耕一, 山下武志 (心臓血管研究所付属病院)',
      title: '右室乳頭筋起源の心室性期外収縮の 1 例',
      journal: '心臓 2013; Vol.45 Suppl.3: 124-129 (第25回 臨床不整脈研究会)',
      figure: '図1: 12誘導心電図 (LBBB・下軸・I陽性) & 図6: CARTO Sound右室乳頭筋描出',
      doi: '心臓 2013; 45(Suppl 3): 124-129'
    },
    description: '特発性PVCの約5%の中でも極めて稀な右室乳頭筋起源。LBBBパターン＋下方軸（II, III, aVF高R波）、I誘導陽性、移行帯V3〜V4。起源が乳頭筋深部にありexitと離れているためPace mapとActivation mapが不一致になりやすい。心腔内エコー（SOUND STAR®）ガイド下に乳頭筋周囲を同心円状に通電し根治。',
    clinicalInsights: {
      mechanism: '右室前壁中隔側の乳頭筋深部における異常自動能。',
      ecgKeyPoints: [
        'LBBBパターン（V1で深いQS波）。',
        '下方軸（II, III, aVFで高いR波）。',
        'I誘導で陽性波（右室前壁中隔側から左方向へ向かうベクトル）。',
        '胸部誘導移行帯は V3〜V4。QRS幅 130ms。'
      ],
      pitfalls: 'Pace mapとActivation mapが乖離しやすく、通常の点状通電では深部焦点がつぶれず再発しやすい。',
      ablationStrategy: '心腔内磁気センサー付き超音波カテーテル（SOUND STAR®）を用い、CARTO上で右室乳頭筋立体構造を再構築。イリゲーションカテーテルで乳頭筋周囲を同心円状に通電（25〜35W）しbreakoutを完全遮断。'
    },
    params: {
      axis: 'inferior',
      v1Pattern: 'lbbb_qs',
      transition: 'V4',
      lead1: 'positive',
      leadAVL: 'negative_shallow',
      qrsDuration: 130,
      v2s_v3r_ratio: 1.8,
      v2_trans_ratio: 0.45,
      mdi: 0.42,
      pseudoDelta: 24,
      hasNotch: false,
      leads: {
        I: { pattern: 'R', amp: 0.9 },
        II: { pattern: 'R', amp: 2.2 },
        III: { pattern: 'R', amp: 1.8 },
        aVR: { pattern: 'QS', amp: -1.6 },
        aVL: { pattern: 'rS', amp: -0.5 },
        aVF: { pattern: 'R', amp: 2.1 },
        V1: { pattern: 'QS', amp: -1.9 },
        V2: { pattern: 'QS', amp: -2.1 },
        V3: { pattern: 'rS', amp: -1.4 },
        V4: { pattern: 'Rs', amp: 1.5 },
        V5: { pattern: 'R', amp: 1.8 },
        V6: { pattern: 'R', amp: 1.5 }
      }
    }
  },
  {
    id: 'bbrvt_bundle_branch',
    name: '脚枝間リエントリー性心室頻拍 (BBRVT)',
    subtitle: 'ヒス-プルキンエ系巨大リエントリー、3大旋回路と突然の軸変化 (櫻田 2017)',
    category: 'プルキンエ・束枝系',
    transmuralSite: '刺激伝導系 (His-Purkinje System)',
    citation: {
      authors: '櫻田春水 (東京保健医療公社大久保病院 院長)',
      title: '脚枝間リエントリー性心室頻拍にこだわるわけ (忘れえぬ心電図)',
      journal: '心電図 2017; Vol.37 No.1: 34-37',
      figure: '図1: BBRVT 3大旋回路パターン & 図2: 前枝から後枝への突然の軸乗り換え',
      doi: '10.5105/jse.37.34'
    },
    description: 'ヒス-プルキンエ系の右脚・左脚前枝・左脚後枝を旋回路とする巨大リエントリー性VT。基礎にDCM、大動脈弁置換術後、陳旧性前壁梗塞などの伝導障害が存在。頻拍中に左脚前枝から後枝へ乗り換えることで軸が突然変化することがある。右脚カテーテルアブレーションで劇的根治。',
    clinicalInsights: {
      mechanism: '脚枝間・束枝間のマクロリエントリー。右脚順行・左脚逆行、または左脚前枝順行・右脚逆行。',
      ecgKeyPoints: [
        'パターンA: 順行性に右脚、逆行性に左脚 ➔ 左脚ブロック・左軸偏位型。',
        'パターンB: 順行性に左脚前枝、逆行性に右脚 ➔ 右脚ブロック・右軸偏位型。',
        'パターンC: 順行性に左脚後枝、逆行性に右脚 ➔ 右脚ブロック・左軸偏位型。',
        '頻拍中にQRS波形・電気軸が突然シフトする（束枝乗り換え現象）。'
      ],
      pitfalls: '特発性VTや上室頻拍（SVT変行伝導）と誤認されやすい。心停止蘇生例や弁置換術後のwide QRS頻拍では必ずBBRVTを念頭に置く。',
      ablationStrategy: '電気生理検査でHV時間の延長とV先行H波を確認。右脚伝導路（または左脚前枝/後枝）への高周波通電によりリエントリー回路を遮断し完全根治。'
    },
    params: {
      axis: 'superior',
      v1Pattern: 'lbbb_qs',
      transition: 'V5',
      lead1: 'positive',
      leadAVL: 'positive',
      qrsDuration: 160,
      v2s_v3r_ratio: 2.5,
      v2_trans_ratio: 0.30,
      mdi: 0.40,
      pseudoDelta: 22,
      hasNotch: false,
      leads: {
        I: { pattern: 'R', amp: 1.5 },
        II: { pattern: 'QS', amp: -2.0 },
        III: { pattern: 'QS', amp: -2.3 },
        aVR: { pattern: 'rS', amp: -0.6 },
        aVL: { pattern: 'R', amp: 1.7 },
        aVF: { pattern: 'QS', amp: -2.2 },
        V1: { pattern: 'QS', amp: -2.2 },
        V2: { pattern: 'QS', amp: -2.4 },
        V3: { pattern: 'QS', amp: -1.9 },
        V4: { pattern: 'rS', amp: -1.2 },
        V5: { pattern: 'Rs', amp: 1.3 },
        V6: { pattern: 'R', amp: 1.1 }
      }
    }
  }
];
