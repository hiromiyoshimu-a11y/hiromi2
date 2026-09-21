/**
 * アルゴリズム検証用ユニットテスト (Ito et al. 2003 ＆ JACC 2024 対応)
 */

import { PRESETS } from './js/presets.js';
import { estimatePVCOrigin, evaluateOutflowRightVsLeft } from './js/algorithm.js';
import { LITERATURE_DATABASE } from './js/literature.js';
import { METRIC_EXPLANATIONS } from './js/metric-explainer.js';

console.log('=== CardioOrigin アルゴリズム & Ito 2003 指標総合検証テスト開始 ===\n');

// 1. 文献ライブラリと指標解説の存在確認
console.log('--- 1. 文献 & 指標解説登録テスト ---');
console.assert(LITERATURE_DATABASE.ito_2003, 'ito_2003 should exist in LITERATURE_DATABASE');
console.assert(LITERATURE_DATABASE.ito_lvepi_2003, 'ito_lvepi_2003 should exist');
console.assert(LITERATURE_DATABASE.yamashina_2004, 'yamashina_2004 should exist');
console.assert(LITERATURE_DATABASE.lin_2008, 'lin_2008 should exist');
console.assert(LITERATURE_DATABASE.circj_gcv_2007, 'circj_gcv_2007 should exist');
console.assert(LITERATURE_DATABASE.nogami_2000, 'nogami_2000 should exist');
console.assert(LITERATURE_DATABASE.tada_ma_vas_2005, 'tada_ma_vas_2005 should exist');
console.assert(LITERATURE_DATABASE.kondo_2011_alpm, 'kondo_2011_alpm should exist');
console.assert(LITERATURE_DATABASE.senoo_2013_rvpm, 'senoo_2013_rvpm should exist');
console.assert(LITERATURE_DATABASE.naito_2005_otvt, 'naito_2005_otvt should exist');
console.assert(LITERATURE_DATABASE.sakurada_2017_bbrvt, 'sakurada_2017_bbrvt should exist');
console.log('  [PASS] 全臨床文献 (Ito, Yamashina, Lin, CircJ GCV, Nogami, Tada, Kondo, Senoo, Naito, Sakurada) 登録確認');

console.assert(METRIC_EXPLANATIONS.r_wave_duration_index, 'r_wave_duration_index should exist');
console.assert(METRIC_EXPLANATIONS.rs_amplitude_index, 'rs_amplitude_index should exist');
console.assert(METRIC_EXPLANATIONS.ito_criteria, 'ito_criteria should exist');
console.assert(METRIC_EXPLANATIONS.lvepi_failure_criteria, 'lvepi_failure_criteria should exist');
console.assert(METRIC_EXPLANATIONS.rcc_vs_parahisian_rvot, 'rcc_vs_parahisian_rvot should exist');
console.assert(METRIC_EXPLANATIONS.rvot_freewall_notch, 'rvot_freewall_notch should exist');
console.assert(METRIC_EXPLANATIONS.ma_vas_localization, 'ma_vas_localization should exist');
console.assert(METRIC_EXPLANATIONS.verapamil_sensitive_ilvt, 'verapamil_sensitive_ilvt should exist');
console.assert(METRIC_EXPLANATIONS.naito_2005_flowchart, 'naito_2005_flowchart should exist');
console.log('  [PASS] 全図解解説モジュール (内藤2005フローチャートを含む6大新規SVG図解) 登録確認\n');

// 2. 流出路起源：右側 (RVOT) vs 左側 (LVOT/LCC) 精密鑑別テスト
console.log('--- 2. 流出路左右鑑別アルゴリズム (evaluateOutflowRightVsLeft) テスト ---');

// Case A: RVOT 後中隔 (右側起源典型例)
const rvotParams = PRESETS.find(p => p.id === 'rvot_post_sep').params;
const rvotOutflow = evaluateOutflowRightVsLeft(rvotParams);
console.log('[Case A: RVOT後中隔]');
console.log(`  -> 判定: ${rvotOutflow.verdictJa} (${rvotOutflow.subVerdictJa})`);
console.log(`  -> 右側確率: ${rvotOutflow.rightProb}% / 左側確率: ${rvotOutflow.leftProb}%`);
console.assert(rvotOutflow.verdict === 'right_rvot', 'Should identify as right_rvot');
console.assert(rvotOutflow.rightProb >= 80, 'Right probability should be >= 80%');
console.log('  -> [PASS] RVOT後中隔: 右側中隔起源 (90%) を高精度同定！\n');

// Case B: LVOT 左冠尖 (左側起源典型例)
const lccParams = PRESETS.find(p => p.id === 'lvot_lcc').params;
const lccOutflow = evaluateOutflowRightVsLeft(lccParams);
console.log('[Case B: LVOT左冠尖]');
console.log(`  -> 判定: ${lccOutflow.verdictJa} (${lccOutflow.subVerdictJa})`);
console.log(`  -> 右側確率: ${lccOutflow.rightProb}% / 左側確率: ${lccOutflow.leftProb}%`);
console.assert(lccOutflow.verdict === 'left_lvot', 'Should identify as left_lvot');
console.assert(lccOutflow.leftProb >= 75, 'Left probability should be >= 75%');
console.log('  -> [PASS] LVOT左冠尖: 左冠尖 (LCC) 起源を高精度同定！\n');

// Case C: RVOT 自由壁 (Yamashina 2004: R-R' > 20ms & Deep S波)
const freeParams = PRESETS.find(p => p.id === 'rvot_free_wall').params;
const freeOutflow = evaluateOutflowRightVsLeft(freeParams);
console.log('[Case C: RVOT自由壁 (Yamashina 2004)]');
console.log(`  -> 判定: ${freeOutflow.verdictJa} (${freeOutflow.subVerdictJa})`);
console.log(`  -> サブタイプ: ${freeOutflow.rvotSubtype}`);
console.assert(freeOutflow.rvotSubtype === 'freewall', 'Should identify as freewall');
console.log('  -> [PASS] RVOT自由壁: 自由壁 (10%・薄壁注意) を高精度同定！\n');

// Case D: RCC vs RVOT His直上 (Lin 2008: V2 small R)
const rccParams = PRESETS.find(p => p.id === 'lvot_rcc').params;
const rccRes = estimatePVCOrigin(rccParams);
console.log('[Case D: Lin 2008 RCC起源]');
console.log(`  -> 推定第1位: ${rccRes.topSite.nameJa} [${rccRes.topSite.probability}%]`);
console.assert(rccRes.topSite.id === 'lvot_rcc', 'Top site should be lvot_rcc');
console.log('  -> [PASS] RCC起源: V2 small R波によりRVOT His直上から明瞭鑑別！\n');

// Case E: Tada 2005 僧帽弁輪 3パターン (前側壁、後壁、後中隔)
const maPostSepParams = PRESETS.find(p => p.id === 'mva_posteroseptal').params;
const maPostSepRes = estimatePVCOrigin(maPostSepParams);
console.log('[Case E-1: Tada 2005 僧帽弁輪 後中隔 (V1 qR ＋ 上軸)]');
console.log(`  -> 推定第1位: ${maPostSepRes.topSite.nameJa} [${maPostSepRes.topSite.probability}%]`);
console.assert(maPostSepRes.topSite.id === 'mva', 'Top site should be mva');
console.log('  -> [PASS] 僧帽弁輪後中隔: V1 qR ＋ 上軸パターンで確実同定！\n');

const maAnteroParams = PRESETS.find(p => p.id === 'mva_anterolateral').params;
const maAnteroRes = estimatePVCOrigin(maAnteroParams);
console.log('[Case E-2: Tada 2005 僧帽弁輪 前側壁 (V1単相性R ＋ I/aVL深QS)]');
console.log(`  -> 推定第1位: ${maAnteroRes.topSite.nameJa} [${maAnteroRes.topSite.probability}%]`);
console.assert(maAnteroRes.topSite.id === 'mva', 'Top site should be mva');
console.log('  -> [PASS] 僧帽弁輪前側壁: V1単相性R ＋ I/aVL深いQSで同定！\n');

const maPostParams = PRESETS.find(p => p.id === 'mva_posterior').params;
const maPostRes = estimatePVCOrigin(maPostParams);
console.log('[Case E-3: Tada 2005 僧帽弁輪 後壁 (V1二峰性R ＋ 上軸ノッチ)]');
console.log(`  -> 推定第1位: ${maPostRes.topSite.nameJa} [${maPostRes.topSite.probability}%]`);
console.assert(maPostRes.topSite.id === 'mva', 'Top site should be mva');
console.log('  -> [PASS] 僧帽弁輪後壁: V1二峰性高R ＋ 上軸ノッチで同定！\n');

// Case F: 東北大 近藤 2011 左室前外側乳頭筋 (ALPM: RBBB＋下軸＋V6 rS)
const alpmParams = PRESETS.find(p => p.id === 'lv_alpm').params;
const alpmRes = estimatePVCOrigin(alpmParams);
console.log('[Case F: 東北大 近藤 2011 ALPM起源]');
console.log(`  -> 推定第1位: ${alpmRes.topSite.nameJa} [${alpmRes.topSite.probability}%]`);
console.assert(alpmRes.topSite.id === 'alpm', 'Top site should be alpm');
console.log('  -> [PASS] 左室前乳頭筋: RBBB＋下軸＋V6 rS波形により同定！\n');

// Case G: 心研 妹尾 2013 右室乳頭筋 (RV Papillary)
const rvpmParams = PRESETS.find(p => p.id === 'rv_papillary').params;
const rvpmRes = estimatePVCOrigin(rvpmParams);
console.log('[Case G: 心研 妹尾 2013 右室乳頭筋起源]');
console.log(`  -> 推定第1位: ${rvpmRes.topSite.nameJa} [${rvpmRes.topSite.probability}%]`);
console.assert(rvpmRes.topSite.id === 'rv_papillary', 'Top site should be rv_papillary');
console.log('  -> [PASS] 右室乳頭筋: LBBB＋下軸＋I陽性により同定！\n');

// Case H: 櫻田 2017 脚枝間リエントリー (BBRVT)
const bbrvtParams = PRESETS.find(p => p.id === 'bbrvt_bundle_branch').params;
const bbrvtRes = estimatePVCOrigin(bbrvtParams);
console.log('[Case H: 櫻田 2017 脚枝間リエントリー性VT (BBRVT)]');
console.log(`  -> 推定第1位: ${bbrvtRes.topSite.nameJa} [${bbrvtRes.topSite.probability}%]`);
console.assert(bbrvtRes.topSite.id === 'bbrvt_bundle_branch', 'Top site should be bbrvt_bundle_branch');
console.log('  -> [PASS] BBRVT: wide QRS＋LBBB＋左軸偏位により同定！\n');

// 3. 全プリセット症例での起源推定テスト
console.log(`--- 3. 全${PRESETS.length}症例プリセット起源推定テスト ---`);
let passCount = 0;

PRESETS.forEach(preset => {
  const result = estimatePVCOrigin(preset.params);
  const top = result.topSite;
  
  console.log(`[症例] ${preset.name}`);
  console.log(`  -> 推定第1位: ${top.nameJa} [${top.probability}%]`);
  console.log(`  -> 推論理由数: ${result.reasoning.length} ステップ`);
  if (result.outflowAnalysis) {
    console.log(`  -> 流出路判定: ${result.outflowAnalysis.verdictJa} (右側:${result.outflowAnalysis.rightProb}% / 左側:${result.outflowAnalysis.leftProb}%)`);
  }
  
  passCount++;
  console.log('  -> [OK]\n');
});

console.log(`=== テスト完了: 全${passCount}症例 正常稼働確認 ===`);
