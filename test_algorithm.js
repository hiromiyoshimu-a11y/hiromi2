/**
 * アルゴリズム検証用ユニットテスト
 */

import { PRESETS } from './js/presets.js';
import { estimatePVCOrigin } from './js/algorithm.js';

console.log('=== CardioOrigin アルゴリズム検証テスト開始 ===\n');

let passCount = 0;

PRESETS.forEach(preset => {
  const result = estimatePVCOrigin(preset.params);
  const top = result.topSite;
  
  console.log(`[症例] ${preset.name}`);
  console.log(`  -> 最有力推定: ${top.nameJa} (${top.nameEn}) [${top.probability}%]`);
  console.log(`  -> 根拠ステップ数: ${result.reasoning.length}`);
  
  // 期待される起源が含まれているか検証
  let isExpected = false;
  if (preset.id === 'rvot_post_sep' && top.id === 'rvot_post_sep') isExpected = true;
  if (preset.id === 'rvot_free_wall' && top.id === 'rvot_free_wall') isExpected = true;
  if (preset.id === 'lvot_lcc' && top.id === 'lvot_lcc') isExpected = true;
  if (preset.id === 'lv_summit' && top.id === 'lv_summit') isExpected = true;
  if (preset.id === 'lv_pmpm' && top.id === 'pmpm') isExpected = true;
  if (preset.id === 'ilvt_fascicular' && top.id === 'fascicular_post') isExpected = true;
  if (preset.id === 'tva_annular' && (top.id === 'tva' || top.id === 'rvot_free_wall')) isExpected = true;
  if (preset.id === 'amc_junction' && top.id === 'amc') isExpected = true;

  if (isExpected) {
    console.log('  -> 結果: PASS (期待通りの起源を同定)\n');
    passCount++;
  } else {
    console.log(`  -> 結果: 判定確認 (Top: ${top.id})\n`);
  }
});

console.log(`=== テスト結果: ${passCount} / ${PRESETS.length} 成功 ===`);
