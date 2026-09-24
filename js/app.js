import { PRESETS } from './presets.js';
import { estimatePVCOrigin, SITE_DEFINITIONS } from './algorithm.js';
import { HeartMap } from './heart-map.js';
import { generateEcgSvg } from './ecg-draw.js';
import { LITERATURE_DATABASE, getLiteratureForSite } from './literature.js';
import { EcgImageAnalyzer } from './image-analyzer.js';
import { METRIC_EXPLANATIONS } from './metric-explainer.js';
import { checkAndShowMedicalDisclaimer, showDisclaimerModal } from './disclaimer-modal.js';
import { QuizGame } from './quiz.js';

let quizInstance = null;

// デフォルト状態
const defaultState = {
  axis: null, // 初期未選択
  v1Pattern: null, // 初期未選択
  transition: null, // 初期未選択
  lead1: null, // 初期未選択
  enableStep5: false, // ⑤チェックオフ
  enableStep6: false, // ⑥チェックオフ
  enableStep7: false, // ⑦チェックオフ
  leadAVL: 'negative_shallow',
  qrsDuration: 140,
  v2s_v3r_ratio: 1.8,
  v2_trans_ratio: 0.40,
  mdi: 0.42,
  pseudoDelta: 25,
  hasNotch: false,
  // Ito et al. 2003 JCE パラメータ
  r_wave_duration_index: 0.35,
  rs_amplitude_index: 0.15,
  lead1_has_s_wave: false,
  ii_gt_iii: true,
  avl_vs_avr: 'normal',
  // 新規・拡張鑑別パラメータ (Lin 2008, Yamashina 2004, Ito 2003, Tada 2005)
  v2_has_small_r: false,
  has_notch_rr_gt_20ms: false,
  v1_deep_s: false,
  avl_avr_q_ratio: 1.0,
  v1_s_amp: 0.8,
  v1_qr_pattern: false,
  ecgGain: 1.0, // 感度倍率 (0.5, 1.0, 1.5, 2.0)
  leadFormat: 'standard', // 誘導配列 ('standard' または 'cabrera')
  stdLayout: 'vertical', // 標準配列の配置 ('vertical': 縦型3列 / 'horizontal': 横並び2行)
  leads: {
    I: { pattern: 'R', amp: 0.9 },
    II: { pattern: 'R', amp: 2.2 },
    III: { pattern: 'R', amp: 1.8 },
    aVR: { pattern: 'QS', amp: -1.6 },
    aVL: { pattern: 'rS', amp: -0.4 },
    aVF: { pattern: 'R', amp: 2.1 },
    V1: { pattern: 'QS', amp: -1.8 },
    V2: { pattern: 'QS', amp: -2.0 },
    V3: { pattern: 'rS', amp: -1.5 },
    V4: { pattern: 'Rs', amp: 1.5 },
    V5: { pattern: 'R', amp: 1.7 },
    V6: { pattern: 'R', amp: 1.4 }
  }
};

let appState = JSON.parse(JSON.stringify(defaultState));
let currentPreset = PRESETS[0] || null;
let heartMapInstance = null;
let imageAnalyzerInstance = null;
let isDiagnosisRevealed = false;

// DOM要素の取得
const dom = {
  presetContainer: document.getElementById('preset-container'),
  tabWizardBtn: document.getElementById('tab-wizard-btn'),
  tabMatrixBtn: document.getElementById('tab-matrix-btn'),
  tabImageBtn: document.getElementById('tab-image-btn'),
  viewWizard: document.getElementById('view-wizard'),
  viewMatrix: document.getElementById('view-matrix'),
  viewImage: document.getElementById('view-image'),
  matrixContainer: document.getElementById('matrix-container'),
  imageAnalyzerRoot: document.getElementById('image-analyzer-root'),
  
  // ステップボタン群
  optAxis: document.getElementById('opt-axis'),
  optV1: document.getElementById('opt-v1'),
  optTransition: document.getElementById('opt-transition'),
  optLead1: document.getElementById('opt-lead1'),
  
  // ステップ5〜7 チェックボックス & アコーディオンボディ
  chkStep5: document.getElementById('chk-step-5'),
  chkStep6: document.getElementById('chk-step-6'),
  chkStep7: document.getElementById('chk-step-7'),
  bodyStep5: document.getElementById('body-step-5'),
  bodyStep6: document.getElementById('body-step-6'),
  bodyStep7: document.getElementById('body-step-7'),
  
  // 診断する！ & クリアボタン
  btnRunDiagnosis: document.getElementById('btn-run-diagnosis'),
  btnClearDiagnosis: document.getElementById('btn-clear-diagnosis'),
  btnRunMatrixDiagnosis: document.getElementById('btn-run-matrix-diagnosis'),
  btnClearMatrixDiagnosis: document.getElementById('btn-clear-matrix-diagnosis'),

  // インライン診断結果表示カード
  inlineDiagnosisResult: document.getElementById('inline-diagnosis-result'),
  inlineWinnerProb: document.getElementById('inline-winner-prob'),
  inlineWinnerNameJa: document.getElementById('inline-winner-name-ja'),
  inlineWinnerNameEn: document.getElementById('inline-winner-name-en'),
  inlineWinnerFeatures: document.getElementById('inline-winner-features'),
  inlineBadgeEndoEpi: document.getElementById('inline-badge-endo-epi'),
  inlineBadgeOutflow: document.getElementById('inline-badge-outflow'),

  inlineMatrixDiagnosisResult: document.getElementById('inline-matrix-diagnosis-result'),
  inlineMatrixWinnerProb: document.getElementById('inline-matrix-winner-prob'),
  inlineMatrixWinnerNameJa: document.getElementById('inline-matrix-winner-name-ja'),
  inlineMatrixWinnerNameEn: document.getElementById('inline-matrix-winner-name-en'),
  inlineMatrixWinnerFeatures: document.getElementById('inline-matrix-winner-features'),
  inlineMatrixBadgeEndoEpi: document.getElementById('inline-matrix-badge-endo-epi'),
  inlineMatrixBadgeOutflow: document.getElementById('inline-matrix-badge-outflow'),

  // スライダー群
  inputV2sV3r: document.getElementById('input-v2s-v3r'),
  valV2sV3r: document.getElementById('val-v2s-v3r'),
  inputV2Ratio: document.getElementById('input-v2-ratio'),
  valV2Ratio: document.getElementById('val-v2-ratio'),
  inputMdi: document.getElementById('input-mdi'),
  valMdi: document.getElementById('val-mdi'),
  inputQrs: document.getElementById('input-qrs'),
  valQrs: document.getElementById('val-qrs'),
  // Ito 2003 コントロール要素
  inputRDuration: document.getElementById('input-r-duration'),
  valRDuration: document.getElementById('val-r-duration'),
  inputRsAmplitude: document.getElementById('input-rs-amplitude'),
  valRsAmplitude: document.getElementById('val-rs-amplitude'),
  optLead1SWave: document.getElementById('opt-lead1-s-wave'),
  optAvlVsAvr: document.getElementById('opt-avl-vs-avr'),
  optV2SmallR: document.getElementById('opt-v2-small-r'),
  optHasNotchRR20: document.getElementById('opt-has-notch-rr20'),
  optLvepiCriteria: document.getElementById('opt-lvepi-criteria'),
  optV1QrPattern: document.getElementById('opt-v1-qr-pattern'),
  
  // 結果表示群
  winnerProb: document.getElementById('winner-prob'),
  winnerNameJa: document.getElementById('winner-name-ja'),
  winnerNameEn: document.getElementById('winner-name-en'),
  winnerFeatures: document.getElementById('winner-features'),
  rankingContainer: document.getElementById('ranking-container'),
  reasoningContainer: document.getElementById('reasoning-container'),
  ablationTipText: document.getElementById('ablation-tip-text'),
  literatureContainer: document.getElementById('literature-container'),
  cardRanking: document.getElementById('card-ranking'),
  cardReasoning: document.getElementById('card-reasoning'),
  cardLiterature: document.getElementById('card-literature'),
  literatureToggleBtn: document.getElementById('literature-toggle-btn'),
  literatureCollapseBody: document.getElementById('literature-collapse-body'),
  literatureToggleHint: document.getElementById('literature-toggle-hint'),
  
  // アクション
  btnReset: document.getElementById('btn-reset'),
  btnShowNaitoFlowchart: document.getElementById('btn-show-naito-flowchart'),
  btnShowAlgorithm: document.getElementById('btn-show-algorithm'),
  btnShowDisclaimer: document.getElementById('btn-show-disclaimer'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  algorithmModal: document.getElementById('algorithm-modal'),
  heartMapRoot: document.getElementById('heart-map-root'),

  // 論文引用パネル要素
  paperCitationPanel: document.getElementById('paper-citation-panel'),
  citationCaseTitle: document.getElementById('citation-case-title'),
  citationLayerTag: document.getElementById('citation-layer-tag'),
  citationSourceInfo: document.getElementById('citation-source-info'),
  citationEcgGrid: document.getElementById('citation-ecg-grid'),
  citationStdVertical: document.getElementById('citation-standard-vertical'),
  stdLayoutGroup: document.getElementById('std-layout-group'),
  btnLayoutVertical: document.getElementById('btn-layout-vertical'),
  btnLayoutHorizontal: document.getElementById('btn-layout-horizontal'),
  colLimbLeads: document.getElementById('col-limb-leads'),
  colChestLeads: document.getElementById('col-chest-leads'),
  colVerticalInsights: document.getElementById('col-vertical-insights'),
  colInsightsWrapper: document.getElementById('col-insights-wrapper'),
  citationCabreraSpatial: document.getElementById('citation-cabrera-spatial'),
  cabreraFrontalStage: document.getElementById('cabrera-frontal-stage'),
  cabreraThoraxStage: document.getElementById('cabrera-thorax-stage'),
  citationInsightsContainer: document.getElementById('citation-insights-container'),

  // 心内膜 vs 心外膜 鑑別パネル要素
  layerVerdictGrid: document.getElementById('layer-verdict-grid'),
  endoEpiCard: document.getElementById('endo-epi-card'),
  endoEpiVerdictBadge: document.getElementById('endo-epi-verdict-badge'),
  valEndoProb: document.getElementById('val-endo-prob'),
  valEpiProb: document.getElementById('val-epi-prob'),
  meterFillEndo: document.getElementById('meter-fill-endo'),
  meterFillEpi: document.getElementById('meter-fill-epi'),
  endoEpiCriteria: document.getElementById('endo-epi-criteria'),
  endoEpiStrategyBox: document.getElementById('endo-epi-strategy-box'),

  // 流出路起源：右側 vs 左側 鑑別パネル要素 (Ito et al. 2003)
  outflowSideCard: document.getElementById('outflow-side-card'),
  outflowVerdictBadge: document.getElementById('outflow-verdict-badge'),
  valRightProb: document.getElementById('val-right-prob'),
  valLeftProb: document.getElementById('val-left-prob'),
  meterFillRight: document.getElementById('meter-fill-right'),
  meterFillLeft: document.getElementById('meter-fill-left'),
  outflowCriteriaGrid: document.getElementById('outflow-criteria-grid'),
  outflowPearlsBox: document.getElementById('outflow-pearls-box')
};

/**
 * DOM要素参照の最新化関数
 */
function refreshDomReferences() {
  dom.presetContainer = document.getElementById('preset-container');
  dom.tabWizardBtn = document.getElementById('tab-wizard-btn');
  dom.tabMatrixBtn = document.getElementById('tab-matrix-btn');
  dom.tabImageBtn = document.getElementById('tab-image-btn');
  dom.viewWizard = document.getElementById('view-wizard');
  dom.viewMatrix = document.getElementById('view-matrix');
  dom.viewImage = document.getElementById('view-image');
  dom.matrixContainer = document.getElementById('matrix-container');
  dom.imageAnalyzerRoot = document.getElementById('image-analyzer-root');

  dom.optAxis = document.getElementById('opt-axis');
  dom.optV1 = document.getElementById('opt-v1');
  dom.optTransition = document.getElementById('opt-transition');
  dom.optLead1 = document.getElementById('opt-lead1');

  dom.chkStep5 = document.getElementById('chk-step-5');
  dom.chkStep6 = document.getElementById('chk-step-6');
  dom.chkStep7 = document.getElementById('chk-step-7');
  dom.bodyStep5 = document.getElementById('body-step-5');
  dom.bodyStep6 = document.getElementById('body-step-6');
  dom.bodyStep7 = document.getElementById('body-step-7');

  dom.btnRunDiagnosis = document.getElementById('btn-run-diagnosis');
  dom.btnClearDiagnosis = document.getElementById('btn-clear-diagnosis');
  dom.btnRunMatrixDiagnosis = document.getElementById('btn-run-matrix-diagnosis');
  dom.btnClearMatrixDiagnosis = document.getElementById('btn-clear-matrix-diagnosis');

  dom.inlineDiagnosisResult = document.getElementById('inline-diagnosis-result');
  dom.inlineWinnerProb = document.getElementById('inline-winner-prob');
  dom.inlineWinnerNameJa = document.getElementById('inline-winner-name-ja');
  dom.inlineWinnerNameEn = document.getElementById('inline-winner-name-en');
  dom.inlineWinnerFeatures = document.getElementById('inline-winner-features');
  dom.inlineBadgeEndoEpi = document.getElementById('inline-badge-endo-epi');
  dom.inlineBadgeOutflow = document.getElementById('inline-badge-outflow');

  dom.inlineMatrixDiagnosisResult = document.getElementById('inline-matrix-diagnosis-result');
  dom.inlineMatrixWinnerProb = document.getElementById('inline-matrix-winner-prob');
  dom.inlineMatrixWinnerNameJa = document.getElementById('inline-matrix-winner-name-ja');
  dom.inlineMatrixWinnerNameEn = document.getElementById('inline-matrix-winner-name-en');
  dom.inlineMatrixWinnerFeatures = document.getElementById('inline-matrix-winner-features');
  dom.inlineMatrixBadgeEndoEpi = document.getElementById('inline-matrix-badge-endo-epi');
  dom.inlineMatrixBadgeOutflow = document.getElementById('inline-matrix-badge-outflow');
  dom.valV2sV3r = document.getElementById('val-v2s-v3r');
  dom.inputV2Ratio = document.getElementById('input-v2-ratio');
  dom.valV2Ratio = document.getElementById('val-v2-ratio');
  dom.inputMdi = document.getElementById('input-mdi');
  dom.valMdi = document.getElementById('val-mdi');
  dom.inputQrs = document.getElementById('input-qrs');
  dom.valQrs = document.getElementById('val-qrs');

  dom.inputRDuration = document.getElementById('input-r-duration');
  dom.valRDuration = document.getElementById('val-r-duration');
  dom.inputRsAmplitude = document.getElementById('input-rs-amplitude');
  dom.valRsAmplitude = document.getElementById('val-rs-amplitude');
  dom.optLead1SWave = document.getElementById('opt-lead1-s-wave');
  dom.optAvlVsAvr = document.getElementById('opt-avl-vs-avr');
  dom.optV2SmallR = document.getElementById('opt-v2-small-r');
  dom.optHasNotchRR20 = document.getElementById('opt-has-notch-rr20');
  dom.optLvepiCriteria = document.getElementById('opt-lvepi-criteria');
  dom.optV1QrPattern = document.getElementById('opt-v1-qr-pattern');

  dom.winnerProb = document.getElementById('winner-prob');
  dom.winnerNameJa = document.getElementById('winner-name-ja');
  dom.winnerNameEn = document.getElementById('winner-name-en');
  dom.winnerFeatures = document.getElementById('winner-features');
  dom.rankingContainer = document.getElementById('ranking-container');
  dom.reasoningContainer = document.getElementById('reasoning-container');
  dom.ablationTipText = document.getElementById('ablation-tip-text');
  dom.literatureContainer = document.getElementById('literature-container');
  dom.cardRanking = document.getElementById('card-ranking');
  dom.cardReasoning = document.getElementById('card-reasoning');
  dom.cardLiterature = document.getElementById('card-literature');
  dom.literatureToggleBtn = document.getElementById('literature-toggle-btn');
  dom.literatureCollapseBody = document.getElementById('literature-collapse-body');
  dom.literatureToggleHint = document.getElementById('literature-toggle-hint');

  dom.btnReset = document.getElementById('btn-reset');
  dom.btnShowNaitoFlowchart = document.getElementById('btn-show-naito-flowchart');
  dom.btnShowAlgorithm = document.getElementById('btn-show-algorithm');
  dom.btnShowDisclaimer = document.getElementById('btn-show-disclaimer');
  dom.modalCloseBtn = document.getElementById('modal-close-btn');
  dom.algorithmModal = document.getElementById('algorithm-modal');
  dom.heartMapRoot = document.getElementById('heart-map-root');

  dom.paperCitationPanel = document.getElementById('paper-citation-panel');
  dom.citationCaseTitle = document.getElementById('citation-case-title');
  dom.citationLayerTag = document.getElementById('citation-layer-tag');
  dom.citationSourceInfo = document.getElementById('citation-source-info');
  dom.citationEcgGrid = document.getElementById('citation-ecg-grid');
  dom.citationStdVertical = document.getElementById('citation-standard-vertical');
  dom.stdLayoutGroup = document.getElementById('std-layout-group');
  dom.btnLayoutVertical = document.getElementById('btn-layout-vertical');
  dom.btnLayoutHorizontal = document.getElementById('btn-layout-horizontal');
  dom.colLimbLeads = document.getElementById('col-limb-leads');
  dom.colChestLeads = document.getElementById('col-chest-leads');
  dom.colVerticalInsights = document.getElementById('col-vertical-insights');
  dom.colInsightsWrapper = document.getElementById('col-insights-wrapper');
  dom.citationCabreraSpatial = document.getElementById('citation-cabrera-spatial');
  dom.cabreraFrontalStage = document.getElementById('cabrera-frontal-stage');
  dom.cabreraThoraxStage = document.getElementById('cabrera-thorax-stage');
  dom.citationInsightsContainer = document.getElementById('citation-insights-container');

  dom.layerVerdictGrid = document.getElementById('layer-verdict-grid');
  dom.endoEpiCard = document.getElementById('endo-epi-card');
  dom.endoEpiVerdictBadge = document.getElementById('endo-epi-verdict-badge');
  dom.valEndoProb = document.getElementById('val-endo-prob');
  dom.valEpiProb = document.getElementById('val-epi-prob');
  dom.meterFillEndo = document.getElementById('meter-fill-endo');
  dom.meterFillEpi = document.getElementById('meter-fill-epi');
  dom.endoEpiCriteria = document.getElementById('endo-epi-criteria');
  dom.endoEpiStrategyBox = document.getElementById('endo-epi-strategy-box');

  dom.outflowSideCard = document.getElementById('outflow-side-card');
  dom.outflowVerdictBadge = document.getElementById('outflow-verdict-badge');
  dom.valRightProb = document.getElementById('val-right-prob');
  dom.valLeftProb = document.getElementById('val-left-prob');
  dom.meterFillRight = document.getElementById('meter-fill-right');
  dom.meterFillLeft = document.getElementById('meter-fill-left');
  dom.outflowCriteriaGrid = document.getElementById('outflow-criteria-grid');
  dom.outflowPearlsBox = document.getElementById('outflow-pearls-box');
}

/**
 * 初期化関数
 */
function init() {
  try {
    // 全DOM要素への参照を最新化
    refreshDomReferences();

    // スマホ端末の破損キャッシュ・Service Worker障害を自動解除 (非同期安全化)
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          if (registrations) {
            for (let registration of registrations) {
              registration.unregister().catch(() => {});
            }
          }
        }).catch(() => {});
      }
      if ('caches' in window) {
        caches.keys().then(names => {
          if (names) {
            for (let name of names) {
              caches.delete(name).catch(() => {});
            }
          }
        }).catch(() => {});
      }
    } catch(e) {}

    // 心臓解剖マップの初期化
    if (dom.heartMapRoot) {
      try {
        heartMapInstance = new HeartMap(dom.heartMapRoot, (site) => {
          showSiteModal(site);
        });
      } catch(e) {
        console.error('HeartMap init error:', e);
      }
    }

    // 画像自動解析モジュールの初期化
    if (dom.imageAnalyzerRoot) {
      try {
        imageAnalyzerInstance = new EcgImageAnalyzer({
          container: dom.imageAnalyzerRoot,
          onAnalysisComplete: (detectedData) => {
            applyDetectedParameters(detectedData);
          }
        });
      } catch(e) {
        console.error('EcgImageAnalyzer init error:', e);
      }
    }

    // プリセットチップのレンダリング
    renderPresets();

    // 12誘導マトリックスのレンダリング
    renderMatrix();

    // イベントリスナーのセットアップ
    setupEventListeners();

    // iOSボトムタブバーのセットアップ
    try {
      setupIosTabBar();
    } catch(e) {
      console.warn('setupIosTabBar note:', e);
    }

    // 最初のプリセットに基づく論文引用パネルの初期描画 (確実に実行)
    if (PRESETS && PRESETS.length > 0) {
      renderPaperCitation(PRESETS[0]);
    }

    // 初回解析実行
    runAnalysis();

    // URLハッシュによる初期セクション自動切替 (例: #diagnosis, #quiz)
    handleInitialHash();
  } catch(globalErr) {
    console.error('Global App init error:', globalErr);
  }
}

/**
 * URLハッシュによる初期セクション決定
 */
function handleInitialHash() {
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('diagnosis') || hash.includes('diag')) {
    switchMainSection('diagnosis');
  } else if (hash.includes('quiz')) {
    switchMainSection('quiz');
  } else if (hash.includes('sim')) {
    switchMainSection('simulation');
  }
}

let currentCategoryFilter = 'all';

/**
 * プリセットチップのレンダリング (右室・左室・その他 解剖領域分岐対応)
 */
function renderPresets() {
  if (!dom.presetContainer) return;
  dom.presetContainer.innerHTML = '';

  const filtered = PRESETS.filter(preset => {
    if (currentCategoryFilter === 'all') return true;
    const cat = (preset.category || '').toLowerCase();
    const id = (preset.id || '').toLowerCase();

    if (currentCategoryFilter === 'rv') {
      return cat.includes('右室') || cat.includes('rvot') || id.includes('rv') || id.includes('tva');
    } else if (currentCategoryFilter === 'lv') {
      return cat.includes('左室') || cat.includes('lvot') || cat.includes('aortic') || id.includes('lv') || id.includes('rcc') || id.includes('lcc') || id.includes('ncc') || id.includes('amc') || id.includes('fascicular');
    } else if (currentCategoryFilter === 'other') {
      return cat.includes('心外膜') || cat.includes('特殊') || cat.includes('other') || id.includes('epi') || id.includes('gcv') || id.includes('cs');
    }
    return true;
  });

  if (filtered.length === 0) {
    dom.presetContainer.innerHTML = '<div style="color:#94a3b8; font-size:0.85rem; padding:12px;">該当領域の症例データを読み込んでいます</div>';
    return;
  }

  filtered.forEach((preset, index) => {
    const chip = document.createElement('div');
    const isCurrentActive = currentPreset && currentPreset.id === preset.id;
    chip.className = `preset-chip ${isCurrentActive || (index === 0 && !currentPreset) ? 'active' : ''}`;
    chip.dataset.id = preset.id;
    chip.innerHTML = `
      <span class="preset-name">${preset.name}</span>
      <span class="preset-category">${preset.category}</span>
    `;
    chip.addEventListener('click', () => {
      applyPreset(preset);
      dom.presetContainer.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
    dom.presetContainer.appendChild(chip);
  });
}

/**
 * 解剖領域分岐フィルターボタンの初期化
 */
function setupPresetFilterListeners() {
  const container = document.getElementById('preset-filter-container');
  if (!container) return;

  container.querySelectorAll('.preset-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.preset-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.dataset.category || 'all';

      renderPresets();

      // フィルター適用後の最初の症例を自動選択
      const firstChip = dom.presetContainer.querySelector('.preset-chip');
      if (firstChip) {
        firstChip.click();
      }
    });
  });
}

/**
 * プリセットデータの適用
 */
function applyPreset(preset) {
  currentPreset = preset;

  // プリセットに含まれるパラメータに応じてステップ5, 6, 7を自動有効化
  const p = preset.params || {};
  const hasStep5 = p.v2s_v3r_ratio !== undefined || p.v2_trans_ratio !== undefined || p.mdi !== undefined || p.qrsDuration !== undefined;
  const hasStep6 = p.r_wave_duration_index !== undefined || p.rs_amplitude_index !== undefined || p.lead1_has_s_wave !== undefined || p.avl_vs_avr !== undefined;
  const hasStep7 = p.v2_has_small_r !== undefined || p.has_notch_rr_gt_20ms !== undefined || p.hasNotch !== undefined;

  appState = {
    ...appState,
    ...preset.params,
    enableStep5: hasStep5,
    enableStep6: hasStep6,
    enableStep7: hasStep7
  };

  syncControlsWithState();
  renderMatrix();
  renderPaperCitation(preset);

  if (dom.layerVerdictGrid) dom.layerVerdictGrid.style.display = 'grid';
  if (dom.endoEpiCard) dom.endoEpiCard.style.display = 'block';

  runAnalysis();
}

/**
 * 画像解析から検出されたパラメータを適用
 */
function applyDetectedParameters(detected) {
  appState.axis = detected.axis;
  appState.v1Pattern = detected.v1Pattern;
  appState.transition = detected.transition;
  appState.lead1 = detected.lead1;
  appState.v2s_v3r_ratio = detected.v2s_v3r_ratio;
  appState.v2_trans_ratio = detected.v2_trans_ratio;
  appState.qrsDuration = detected.qrsDuration;

  syncControlsWithState();
  renderMatrix();
  isDiagnosisRevealed = true;
  runAnalysis();

  // ステップ診断タブに自動切替して確認させる
  switchTab('wizard');
}

/**
 * UIコントロールとappStateの同期
 */
function syncControlsWithState() {
  if (dom.optAxis) updateButtonGroup(dom.optAxis, appState.axis);
  if (dom.optV1) updateButtonGroup(dom.optV1, appState.v1Pattern);

  if (dom.optTransition) {
    dom.optTransition.querySelectorAll('.trans-btn').forEach(btn => {
      if (appState.transition && btn.dataset.value === appState.transition) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (dom.optLead1) updateButtonGroup(dom.optLead1, appState.lead1);

  // ステップ 5, 6, 7 チェックボックスと開閉の同期
  if (dom.chkStep5 && dom.bodyStep5) {
    dom.chkStep5.checked = !!appState.enableStep5;
    dom.bodyStep5.style.display = appState.enableStep5 ? 'block' : 'none';
  }
  if (dom.chkStep6 && dom.bodyStep6) {
    dom.chkStep6.checked = !!appState.enableStep6;
    dom.bodyStep6.style.display = appState.enableStep6 ? 'block' : 'none';
  }
  if (dom.chkStep7 && dom.bodyStep7) {
    dom.chkStep7.checked = !!appState.enableStep7;
    dom.bodyStep7.style.display = appState.enableStep7 ? 'block' : 'none';
  }

  if (dom.inputV2sV3r && dom.valV2sV3r) {
    dom.inputV2sV3r.value = appState.v2s_v3r_ratio;
    dom.valV2sV3r.textContent = appState.v2s_v3r_ratio;
  }

  if (dom.inputV2Ratio && dom.valV2Ratio) {
    dom.inputV2Ratio.value = appState.v2_trans_ratio;
    dom.valV2Ratio.textContent = Number(appState.v2_trans_ratio).toFixed(2);
  }

  if (dom.inputMdi && dom.valMdi) {
    dom.inputMdi.value = appState.mdi;
    dom.valMdi.textContent = Number(appState.mdi).toFixed(2);
  }

  if (dom.inputQrs && dom.valQrs) {
    dom.inputQrs.value = appState.qrsDuration;
    dom.valQrs.textContent = `${appState.qrsDuration} ms`;
  }

  // Ito et al. 2003 コントロール同期
  if (dom.inputRDuration && dom.valRDuration) {
    dom.inputRDuration.value = appState.r_wave_duration_index;
    dom.valRDuration.textContent = `${Math.round(appState.r_wave_duration_index * 100)}%`;
  }

  if (dom.inputRsAmplitude && dom.valRsAmplitude) {
    dom.inputRsAmplitude.value = appState.rs_amplitude_index;
    dom.valRsAmplitude.textContent = `${Math.round(appState.rs_amplitude_index * 100)}%`;
  }

  if (dom.optLead1SWave) {
    const sValStr = String(appState.lead1_has_s_wave !== undefined ? appState.lead1_has_s_wave : false);
    dom.optLead1SWave.querySelectorAll('.sub-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === sValStr);
    });
  }

  if (dom.optAvlVsAvr) {
    const avlVal = appState.avl_vs_avr || 'normal';
    dom.optAvlVsAvr.querySelectorAll('.sub-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === avlVal);
    });
  }

  // Lin 2008: V2 small R波同期
  if (dom.optV2SmallR) {
    const v2SmallRVal = String(appState.v2_has_small_r || false);
    dom.optV2SmallR.querySelectorAll('.sub-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === v2SmallRVal);
    });
  }

  // Yamashina 2004: 下壁ノッチ R-R' > 20ms 同期
  if (dom.optHasNotchRR20) {
    const notchVal = String(appState.has_notch_rr_gt_20ms || appState.hasNotch || false);
    dom.optHasNotchRR20.querySelectorAll('.sub-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === notchVal);
    });
  }

  // Ito 2003: LVEpi不成功予測 同期
  if (dom.optLvepiCriteria) {
    const isLvepi = (appState.avl_avr_q_ratio > 1.4 || appState.v1_s_amp > 1.2);
    const lvepiVal = String(isLvepi);
    dom.optLvepiCriteria.querySelectorAll('.sub-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === lvepiVal);
    });
  }

  // Tada 2005: V1 qRパターン 同期
  if (dom.optV1QrPattern) {
    const qrVal = String(appState.v1_qr_pattern || appState.v1Pattern === 'rbbb_qr' || false);
    dom.optV1QrPattern.querySelectorAll('.sub-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === qrVal);
    });
  }
}

function updateButtonGroup(groupElement, activeValue) {
  groupElement.querySelectorAll('.opt-btn').forEach(btn => {
    if (btn.dataset.value === activeValue) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * 誘導配列定義（標準配列 vs カブレラ配列）
 * カブレラ配列 (Cabrera sequence): 前額面肢誘導を電気軸順 (-30°〜+120°) に解剖学的に再配置
 * -aVR は aVR の逆極性波形 (+30°) を表示
 */
const STANDARD_LEAD_ORDER = [
  { id: 'I', label: 'I' },
  { id: 'II', label: 'II' },
  { id: 'III', label: 'III' },
  { id: 'aVR', label: 'aVR' },
  { id: 'aVL', label: 'aVL' },
  { id: 'aVF', label: 'aVF' },
  { id: 'V1', label: 'V1' },
  { id: 'V2', label: 'V2' },
  { id: 'V3', label: 'V3' },
  { id: 'V4', label: 'V4' },
  { id: 'V5', label: 'V5' },
  { id: 'V6', label: 'V6' }
];

// 標準配列の縦型3列表示用（四肢誘導 vs 胸部誘導）
const LIMB_LEADS = [
  { id: 'I', label: 'I' },
  { id: 'II', label: 'II' },
  { id: 'III', label: 'III' },
  { id: 'aVR', label: 'aVR' },
  { id: 'aVL', label: 'aVL' },
  { id: 'aVF', label: 'aVF' }
];

const CHEST_LEADS = [
  { id: 'V1', label: 'V1' },
  { id: 'V2', label: 'V2' },
  { id: 'V3', label: 'V3' },
  { id: 'V4', label: 'V4' },
  { id: 'V5', label: 'V5' },
  { id: 'V6', label: 'V6' }
];

const CABRERA_LEAD_ORDER = [
  { id: 'aVL', label: 'aVL', angle: '-30°' },
  { id: 'I', label: 'I', angle: '0°' },
  { id: '-aVR', label: '-aVR', angle: '+30°', sourceLead: 'aVR', inverted: true },
  { id: 'II', label: 'II', angle: '+60°' },
  { id: 'aVF', label: 'aVF', angle: '+90°' },
  { id: 'III', label: 'III', angle: '+120°' },
  { id: 'V1', label: 'V1' },
  { id: 'V2', label: 'V2' },
  { id: 'V3', label: 'V3' },
  { id: 'V4', label: 'V4' },
  { id: 'V5', label: 'V5' },
  { id: 'V6', label: 'V6' }
];

function getInvertedLeadPattern(pattern) {
  const invMap = {
    'R': 'QS',
    'Rs': 'rS',
    'rS': 'qR',
    'QS': 'R',
    'qR': 'rS',
    'rsR': 'rS',
    'Notched_R': 'QS'
  };
  return invMap[pattern] || 'R';
}

/**
 * 12誘導マトリックスUIのレンダリング
 */
const LEAD_LIST = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
const WAVE_OPTIONS = [
  { value: 'R', label: 'R波 (単相性)' },
  { value: 'Rs', label: 'Rs波 (R優位)' },
  { value: 'rS', label: 'rS波 (深S波)' },
  { value: 'QS', label: 'QS波 (単相陰性)' },
  { value: 'qR', label: 'qR波 (先行q波)' },
  { value: 'rsR', label: 'rsR’波 (二峰性)' },
  { value: 'Notched_R', label: 'Notched R (ノッチ)' }
];

function renderMatrix() {
  if (!dom.matrixContainer) return;
  dom.matrixContainer.innerHTML = '';

  const gridWrapper = document.createElement('div');
  gridWrapper.className = 'matrix-2col-wrapper';

  // 左列: 四肢誘導
  const limbCol = document.createElement('div');
  limbCol.className = 'matrix-col';
  limbCol.innerHTML = `
    <div class="matrix-col-header">
      <span class="std-col-tag limb">四肢誘導</span>
      <span class="matrix-col-sub">I, II, III, aVR, aVL, aVF</span>
    </div>
    <div class="matrix-col-cards" id="matrix-limb-cards"></div>
  `;

  // 右列: 胸部誘導
  const chestCol = document.createElement('div');
  chestCol.className = 'matrix-col';
  chestCol.innerHTML = `
    <div class="matrix-col-header">
      <span class="std-col-tag chest">胸部誘導</span>
      <span class="matrix-col-sub">V1, V2, V3, V4, V5, V6</span>
    </div>
    <div class="matrix-col-cards" id="matrix-chest-cards"></div>
  `;

  gridWrapper.appendChild(limbCol);
  gridWrapper.appendChild(chestCol);
  dom.matrixContainer.appendChild(gridWrapper);

  const limbCardsContainer = limbCol.querySelector('#matrix-limb-cards');
  const chestCardsContainer = chestCol.querySelector('#matrix-chest-cards');

  const createCard = (lead) => {
    const leadData = appState.leads[lead] || { pattern: 'R', amp: 1.0 };
    const card = document.createElement('div');
    card.className = 'matrix-lead-card';
    card.innerHTML = `
      <div class="matrix-lead-header">
        <span class="matrix-lead-label">${lead}</span>
        <select class="matrix-lead-select" data-lead="${lead}">
          ${WAVE_OPTIONS.map(opt => `
            <option value="${opt.value}" ${leadData.pattern === opt.value ? 'selected' : ''}>
              ${opt.label}
            </option>
          `).join('')}
        </select>
      </div>
      <div class="matrix-lead-svg-wrap" id="lead-svg-${lead}">
        ${generateEcgSvg(lead, leadData.pattern, leadData.amp || 1.0, false, false, appState.ecgGain || 1.0)}
      </div>
    `;

    const selectEl = card.querySelector('.matrix-lead-select');
    selectEl.addEventListener('change', (e) => {
      const newPattern = e.target.value;
      appState.leads[lead].pattern = newPattern;
      
      const svgWrap = card.querySelector('.matrix-lead-svg-wrap');
      svgWrap.innerHTML = generateEcgSvg(lead, newPattern, appState.leads[lead].amp || 1.0, false, false, appState.ecgGain || 1.0);

      syncMatrixToState(lead, newPattern);
      runAnalysis();
    });

    return card;
  };

  LIMB_LEADS.forEach(item => {
    limbCardsContainer.appendChild(createCard(item.id));
  });

  CHEST_LEADS.forEach(item => {
    chestCardsContainer.appendChild(createCard(item.id));
  });
}

function syncMatrixToState(changedLead, pattern) {
  if (['II', 'III', 'aVF'].includes(changedLead)) {
    const pII = appState.leads.II.pattern;
    const pIII = appState.leads.III.pattern;
    const pAVF = appState.leads.aVF.pattern;
    
    if (['QS', 'rS'].includes(pII) && ['QS', 'rS'].includes(pIII)) {
      appState.axis = 'superior';
    } else if (['R', 'Rs', 'qR', 'Notched_R'].includes(pII) && ['R', 'Rs', 'Notched_R'].includes(pAVF)) {
      appState.axis = 'inferior';
    } else {
      appState.axis = 'normal';
    }
  }

  if (changedLead === 'V1') {
    if (['QS', 'rS'].includes(pattern)) {
      appState.v1Pattern = 'lbbb_qs';
    } else {
      appState.v1Pattern = 'rbbb_r';
    }
  }

  if (changedLead === 'I') {
    if (['R', 'Rs', 'qR'].includes(pattern)) {
      appState.lead1 = 'positive';
    } else if (['QS', 'rS'].includes(pattern)) {
      appState.lead1 = 'negative';
    } else {
      appState.lead1 = 'biphasic';
    }
  }

  const precordials = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
  for (const lead of precordials) {
    const p = appState.leads[lead].pattern;
    if (['R', 'Rs', 'qR', 'Notched_R'].includes(p)) {
      appState.transition = lead;
      break;
    }
  }

  syncControlsWithState();
}

/**
 * タブ切り替え関数
 */
function switchTab(tabName) {
  if (dom.tabWizardBtn) dom.tabWizardBtn.classList.toggle('active', tabName === 'wizard');
  if (dom.tabMatrixBtn) dom.tabMatrixBtn.classList.toggle('active', tabName === 'matrix');
  if (dom.tabImageBtn) dom.tabImageBtn.classList.toggle('active', tabName === 'image');

  if (dom.viewWizard) dom.viewWizard.style.display = tabName === 'wizard' ? 'block' : 'none';
  if (dom.viewMatrix) dom.viewMatrix.style.display = tabName === 'matrix' ? 'block' : 'none';
  if (dom.viewImage) dom.viewImage.style.display = tabName === 'image' ? 'block' : 'none';
}

/**
 * 単一ページSPA 3大部門セクション切り替え関数
 */
function switchMainSection(sectionName) {
  const btnSim = document.getElementById('btn-tab-sim');
  const btnDiag = document.getElementById('btn-tab-diag');
  const btnQuiz = document.getElementById('btn-tab-quiz');

  const mSim = document.getElementById('mobile-tab-sim');
  const mDiag = document.getElementById('mobile-tab-diag');
  const mQuiz = document.getElementById('mobile-tab-quiz');

  const secSim = document.getElementById('section-simulation');
  const secDiag = document.getElementById('section-diagnosis');
  const secQuiz = document.getElementById('section-quiz');

  const subtitle = document.getElementById('header-subtitle-text');

  if (btnSim) btnSim.classList.toggle('active', sectionName === 'simulation');
  if (btnDiag) btnDiag.classList.toggle('active', sectionName === 'diagnosis');
  if (btnQuiz) btnQuiz.classList.toggle('active', sectionName === 'quiz');

  if (mSim) mSim.classList.toggle('active', sectionName === 'simulation');
  if (mDiag) mDiag.classList.toggle('active', sectionName === 'diagnosis');
  if (mQuiz) mQuiz.classList.toggle('active', sectionName === 'quiz');

  if (secSim) {
    secSim.classList.toggle('active', sectionName === 'simulation');
    secSim.style.display = sectionName === 'simulation' ? 'block' : 'none';
  }
  if (secDiag) {
    secDiag.classList.toggle('active', sectionName === 'diagnosis');
    secDiag.style.display = sectionName === 'diagnosis' ? 'block' : 'none';
  }
  if (secQuiz) {
    secQuiz.classList.toggle('active', sectionName === 'quiz');
    secQuiz.style.display = sectionName === 'quiz' ? 'block' : 'none';
  }

  if (sectionName === 'quiz' && !quizInstance) {
    try {
      quizInstance = new QuizGame();
    } catch(e) {
      console.error('QuizGame init error:', e);
    }
  }

  if (history && history.replaceState) {
    try {
      history.replaceState(null, '', `#section-${sectionName}`);
    } catch(e) {}
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// グローバル空間へ露出（インラインイベント用フェールセーフ）
window.switchMainSection = switchMainSection;

/**
 * イベントリスナーのセットアップ
 */
function setupEventListeners() {
  setupPresetFilterListeners();

  const btnSim = document.getElementById('btn-tab-sim');
  const btnDiag = document.getElementById('btn-tab-diag');
  const btnQuiz = document.getElementById('btn-tab-quiz');

  if (btnSim) btnSim.addEventListener('click', () => switchMainSection('simulation'));
  if (btnDiag) btnDiag.addEventListener('click', () => switchMainSection('diagnosis'));
  if (btnQuiz) btnQuiz.addEventListener('click', () => switchMainSection('quiz'));

  if (dom.tabWizardBtn) dom.tabWizardBtn.addEventListener('click', () => switchTab('wizard'));
  if (dom.tabMatrixBtn) dom.tabMatrixBtn.addEventListener('click', () => switchTab('matrix'));
  if (dom.tabImageBtn) dom.tabImageBtn.addEventListener('click', () => switchTab('image'));

  // Step 1: Axis
  if (dom.optAxis) {
    dom.optAxis.addEventListener('click', (e) => {
      const btn = e.target.closest('.opt-btn');
      if (!btn) return;
      const val = btn.dataset.value;
      if (appState.axis === val) {
        appState.axis = null; // 再タップで選択解除
      } else {
        appState.axis = val;
      }
      updateButtonGroup(dom.optAxis, appState.axis);
      runAnalysis();
    });
  }

  // Step 2: V1
  if (dom.optV1) {
    dom.optV1.addEventListener('click', (e) => {
      const btn = e.target.closest('.opt-btn');
      if (!btn) return;
      const val = btn.dataset.value;
      if (appState.v1Pattern === val) {
        appState.v1Pattern = null; // 再タップで選択解除
      } else {
        appState.v1Pattern = val;
      }
      updateButtonGroup(dom.optV1, appState.v1Pattern);
      runAnalysis();
    });
  }

  // Step 3: Transition
  if (dom.optTransition) {
    dom.optTransition.addEventListener('click', (e) => {
      const btn = e.target.closest('.trans-btn');
      if (!btn) return;
      const val = btn.dataset.value;
      if (appState.transition === val) {
        appState.transition = null; // 再タップで選択解除
      } else {
        appState.transition = val;
      }
      dom.optTransition.querySelectorAll('.trans-btn').forEach(b => {
        b.classList.toggle('active', appState.transition !== null && b.dataset.value === appState.transition);
      });
      runAnalysis();
    });
  }

  // Step 4: Lead 1
  if (dom.optLead1) {
    dom.optLead1.addEventListener('click', (e) => {
      const btn = e.target.closest('.opt-btn');
      if (!btn) return;
      const val = btn.dataset.value;
      if (appState.lead1 === val) {
        appState.lead1 = null; // 再タップで選択解除
      } else {
        appState.lead1 = val;
      }
      updateButtonGroup(dom.optLead1, appState.lead1);
      runAnalysis();
    });
  }

  // Step 5, 6, 7 チェックボックス トグルリスナー
  if (dom.chkStep5) {
    dom.chkStep5.addEventListener('change', (e) => {
      appState.enableStep5 = e.target.checked;
      if (dom.bodyStep5) dom.bodyStep5.style.display = appState.enableStep5 ? 'block' : 'none';
      runAnalysis();
    });
  }

  if (dom.chkStep6) {
    dom.chkStep6.addEventListener('change', (e) => {
      appState.enableStep6 = e.target.checked;
      if (dom.bodyStep6) dom.bodyStep6.style.display = appState.enableStep6 ? 'block' : 'none';
      runAnalysis();
    });
  }

  if (dom.chkStep7) {
    dom.chkStep7.addEventListener('change', (e) => {
      appState.enableStep7 = e.target.checked;
      if (dom.bodyStep7) dom.bodyStep7.style.display = appState.enableStep7 ? 'block' : 'none';
      runAnalysis();
    });
  }

  // 「診断する！」ボタン
  if (dom.btnRunDiagnosis) {
    dom.btnRunDiagnosis.addEventListener('click', () => {
      isDiagnosisRevealed = true;
      runAnalysis();

      if (dom.inlineDiagnosisResult) {
        dom.inlineDiagnosisResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 「クリア」ボタン
  if (dom.btnClearDiagnosis) {
    dom.btnClearDiagnosis.addEventListener('click', () => {
      const confirmed = window.confirm('入力が消去されますがよいですか？');
      if (!confirmed) return;

      appState = JSON.parse(JSON.stringify(defaultState));
      syncControlsWithState();
      isDiagnosisRevealed = false;

      // エビデンス論文の折りたたみ状態も閉じた状態にリセット
      if (dom.literatureCollapseBody) dom.literatureCollapseBody.style.display = 'none';
      if (dom.literatureToggleHint) dom.literatureToggleHint.textContent = 'タップで展開';
      const icon = dom.literatureToggleBtn ? dom.literatureToggleBtn.querySelector('.toggle-icon') : null;
      if (icon) icon.style.transform = 'rotate(0deg)';

      runAnalysis();
    });
  }

  // マトリックス「診断する！」ボタン
  if (dom.btnRunMatrixDiagnosis) {
    dom.btnRunMatrixDiagnosis.addEventListener('click', () => {
      isDiagnosisRevealed = true;
      runAnalysis();

      if (dom.inlineMatrixDiagnosisResult) {
        dom.inlineMatrixDiagnosisResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // マトリックス「クリア」ボタン
  if (dom.btnClearMatrixDiagnosis) {
    dom.btnClearMatrixDiagnosis.addEventListener('click', () => {
      const confirmed = window.confirm('入力が消去されますがよいですか？');
      if (!confirmed) return;

      appState = JSON.parse(JSON.stringify(defaultState));
      syncControlsWithState();
      renderMatrix();
      isDiagnosisRevealed = false;

      // エビデンス論文の折りたたみ状態も閉じた状態にリセット
      if (dom.literatureCollapseBody) dom.literatureCollapseBody.style.display = 'none';
      if (dom.literatureToggleHint) dom.literatureToggleHint.textContent = 'タップで展開';
      const icon = dom.literatureToggleBtn ? dom.literatureToggleBtn.querySelector('.toggle-icon') : null;
      if (icon) icon.style.transform = 'rotate(0deg)';

      runAnalysis();
    });
  }

  // エビデンス論文・ガイドライン照合カードのアコーディオン開閉
  if (dom.literatureToggleBtn) {
    dom.literatureToggleBtn.addEventListener('click', () => {
      const isHidden = !dom.literatureCollapseBody || dom.literatureCollapseBody.style.display === 'none';
      if (dom.literatureCollapseBody) {
        dom.literatureCollapseBody.style.display = isHidden ? 'block' : 'none';
      }
      const icon = dom.literatureToggleBtn.querySelector('.toggle-icon');
      if (icon) {
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      }
      if (dom.literatureToggleHint) {
        dom.literatureToggleHint.textContent = isHidden ? 'タップで閉じる' : 'タップで展開';
      }
    });
  }

  // Step 5: Sliders
  if (dom.inputV2sV3r) {
    dom.inputV2sV3r.addEventListener('input', (e) => {
      appState.v2s_v3r_ratio = parseFloat(e.target.value);
      if (dom.valV2sV3r) dom.valV2sV3r.textContent = appState.v2s_v3r_ratio;
      runAnalysis();
    });
  }

  if (dom.inputV2Ratio) {
    dom.inputV2Ratio.addEventListener('input', (e) => {
      appState.v2_trans_ratio = parseFloat(e.target.value);
      if (dom.valV2Ratio) dom.valV2Ratio.textContent = Number(appState.v2_trans_ratio).toFixed(2);
      runAnalysis();
    });
  }

  if (dom.inputMdi) {
    dom.inputMdi.addEventListener('input', (e) => {
      appState.mdi = parseFloat(e.target.value);
      if (dom.valMdi) dom.valMdi.textContent = Number(appState.mdi).toFixed(2);
      runAnalysis();
    });
  }

  if (dom.inputQrs) {
    dom.inputQrs.addEventListener('input', (e) => {
      appState.qrsDuration = parseInt(e.target.value, 10);
      if (dom.valQrs) dom.valQrs.textContent = `${appState.qrsDuration} ms`;
      runAnalysis();
    });
  }

  // Ito et al. 2003: R-wave duration index (b/a)
  if (dom.inputRDuration) {
    dom.inputRDuration.addEventListener('input', (e) => {
      appState.r_wave_duration_index = parseFloat(e.target.value);
      dom.valRDuration.textContent = `${Math.round(appState.r_wave_duration_index * 100)}%`;
      runAnalysis();
    });
  }

  // Ito et al. 2003: R/S-wave amplitude index (c/d)
  if (dom.inputRsAmplitude) {
    dom.inputRsAmplitude.addEventListener('input', (e) => {
      appState.rs_amplitude_index = parseFloat(e.target.value);
      dom.valRsAmplitude.textContent = `${Math.round(appState.rs_amplitude_index * 100)}%`;
      runAnalysis();
    });
  }

  // Ito et al. 2003: I誘導 s波なし頻度
  if (dom.optLead1SWave) {
    dom.optLead1SWave.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-pill');
      if (!btn) return;
      const val = btn.dataset.value === 'true';
      if (appState.lead1_has_s_wave === val) {
        appState.lead1_has_s_wave = undefined; // 再タップで解除
      } else {
        appState.lead1_has_s_wave = val;
      }
      const sValStr = String(appState.lead1_has_s_wave !== undefined ? appState.lead1_has_s_wave : '');
      dom.optLead1SWave.querySelectorAll('.sub-pill').forEach(b => {
        b.classList.toggle('active', appState.lead1_has_s_wave !== undefined && b.dataset.value === sValStr);
      });
      runAnalysis();
    });
  }

  // Ito et al. 2003: aVL vs aVR Q波
  if (dom.optAvlVsAvr) {
    dom.optAvlVsAvr.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-pill');
      if (!btn) return;
      const val = btn.dataset.value;
      if (appState.avl_vs_avr === val) {
        appState.avl_vs_avr = null; // 再タップで解除
      } else {
        appState.avl_vs_avr = val;
      }
      dom.optAvlVsAvr.querySelectorAll('.sub-pill').forEach(b => {
        b.classList.toggle('active', appState.avl_vs_avr !== null && b.dataset.value === appState.avl_vs_avr);
      });
      runAnalysis();
    });
  }

  // Lin 2008: V2 small R波
  if (dom.optV2SmallR) {
    dom.optV2SmallR.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-pill');
      if (!btn) return;
      const val = btn.dataset.value === 'true';
      if (appState.v2_has_small_r === val) {
        appState.v2_has_small_r = false; // 再タップで解除
      } else {
        appState.v2_has_small_r = val;
      }
      const v2SmallRVal = String(appState.v2_has_small_r);
      dom.optV2SmallR.querySelectorAll('.sub-pill').forEach(b => {
        b.classList.toggle('active', appState.v2_has_small_r && b.dataset.value === 'true');
      });
      runAnalysis();
    });
  }

  // Yamashina 2004: 下壁ノッチ R-R' > 20ms
  if (dom.optHasNotchRR20) {
    dom.optHasNotchRR20.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-pill');
      if (!btn) return;
      const isNotch = btn.dataset.value === 'true';
      if (appState.has_notch_rr_gt_20ms === isNotch) {
        appState.has_notch_rr_gt_20ms = false; // 再タップで解除
        appState.hasNotch = false;
      } else {
        appState.has_notch_rr_gt_20ms = isNotch;
        appState.hasNotch = isNotch;
      }
      dom.optHasNotchRR20.querySelectorAll('.sub-pill').forEach(b => {
        b.classList.toggle('active', appState.has_notch_rr_gt_20ms && b.dataset.value === 'true');
      });
      runAnalysis();
    });
  }

  // Ito 2003: LVEpi不成功予測
  if (dom.optLvepiCriteria) {
    dom.optLvepiCriteria.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-pill');
      if (!btn) return;
      const isLvepi = btn.dataset.value === 'true';
      appState.avl_avr_q_ratio = isLvepi ? 1.6 : 1.0;
      appState.v1_s_amp = isLvepi ? 1.4 : 0.8;
      dom.optLvepiCriteria.querySelectorAll('.sub-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      runAnalysis();
    });
  }

  // Tada 2005: V1 qRパターン
  if (dom.optV1QrPattern) {
    dom.optV1QrPattern.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-pill');
      if (!btn) return;
      const isQR = btn.dataset.value === 'true';
      appState.v1_qr_pattern = isQR;
      if (isQR && !appState.v1Pattern.startsWith('rbbb')) {
        appState.v1Pattern = 'rbbb_qr';
        updateButtonGroup(dom.optV1, appState.v1Pattern);
      }
      dom.optV1QrPattern.querySelectorAll('.sub-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      runAnalysis();
    });
  }

  // 精密鑑別指標の図解・解説クリックイベント (スライダーヘッダー & トグル内バッジ)
  document.querySelectorAll('.slider-header-clickable, .metric-help-badge.clickable').forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      const metricId = header.dataset.metric || header.closest('[data-metric]')?.dataset.metric;
      if (metricId && METRIC_EXPLANATIONS[metricId]) {
        showMetricExplanationModal(METRIC_EXPLANATIONS[metricId]);
      }
    });
  });

  // リセットボタン
  if (dom.btnReset) {
    dom.btnReset.addEventListener('click', () => {
      const confirmed = window.confirm('入力が消去されますがよいですか？');
      if (!confirmed) return;

      appState = JSON.parse(JSON.stringify(defaultState));
      syncControlsWithState();
      renderMatrix();
      runAnalysis();
    });
  }

  // 内藤 2005 流出路7ステップ局在診断フローチャートモーダル
  if (dom.btnShowNaitoFlowchart) {
    dom.btnShowNaitoFlowchart.addEventListener('click', () => {
      if (METRIC_EXPLANATIONS.naito_2005_flowchart) {
        showMetricExplanationModal(METRIC_EXPLANATIONS.naito_2005_flowchart);
      }
    });
  }

  // 医療免責事項の確認モーダル
  if (dom.btnShowDisclaimer) {
    dom.btnShowDisclaimer.addEventListener('click', () => {
      showDisclaimerModal();
    });
  }

  // 波高感度（Gain）切替ボタンのリスナー登録
  document.querySelectorAll('.gain-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const g = parseFloat(e.currentTarget.dataset.gain);
      if (!isNaN(g)) setEcgGain(g);
    });
  });

  const btnToggleGain = document.getElementById('btn-toggle-gain');
  if (btnToggleGain) {
    btnToggleGain.addEventListener('click', toggleEcgGain);
  }

  // 誘導配列（標準 vs カブレラ）切替ボタンのリスナー登録
  const btnFormatStd = document.getElementById('btn-format-std');
  const btnFormatCab = document.getElementById('btn-format-cabrera');
  if (btnFormatStd) {
    btnFormatStd.addEventListener('click', () => setLeadFormat('standard'));
  }
  if (btnFormatCab) {
    btnFormatCab.addEventListener('click', () => setLeadFormat('cabrera'));
  }

  // 標準配列の配置（縦型3列 vs 横並び2行）切替ボタンのリスナー登録
  if (dom.btnLayoutVertical) {
    dom.btnLayoutVertical.addEventListener('click', () => setStdLayout('vertical'));
  }
  if (dom.btnLayoutHorizontal) {
    dom.btnLayoutHorizontal.addEventListener('click', () => setStdLayout('horizontal'));
  }

  // モーダル
  if (dom.btnShowAlgorithm) {
    dom.btnShowAlgorithm.addEventListener('click', () => {
      showFullLiteratureModal();
    });
  }

  if (dom.modalCloseBtn) {
    dom.modalCloseBtn.addEventListener('click', () => {
      if (dom.algorithmModal) dom.algorithmModal.classList.remove('open');
    });
  }

  if (dom.algorithmModal) {
    dom.algorithmModal.addEventListener('click', (e) => {
      if (e.target === dom.algorithmModal) {
        dom.algorithmModal.classList.remove('open');
      }
    });
  }
}

/**
 * iOS風ボトムナビゲーションバーのイベント設定
 */
function setupIosTabBar() {
  const tabItems = document.querySelectorAll('.ios-tab-item');
  if (!tabItems || tabItems.length === 0) return;

  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      tabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.dataset.target;
      if (targetId === 'panel-step') {
        switchTab('wizard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId === 'panel-matrix') {
        switchTab('matrix');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId === 'panel-image') {
        switchTab('image');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId) {
        // 心臓マップまたは文献へのスクロール
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/**
 * 最有力起源 (winner) が 流出路 / summit / 僧帽弁輪 / 三尖弁輪 か判定する
 * @param {Object} winner 診断結果の最有力部位オブジェクト (topSite)
 * @returns {boolean} RVOT・LVOT・LV summit・僧帽弁輪・三尖弁輪 であれば true
 */
function isOutflowOrAnnularSite(winner) {
  if (!winner) return false;

  const id = (winner.id || '').toLowerCase();
  const nameJa = (winner.nameJa || '').toLowerCase();
  const nameEn = (winner.nameEn || '').toLowerCase();
  const category = (winner.category || '').toLowerCase();

  // 明示的な除外判定（乳頭筋、束枝/プルキンエ系、調整帯、心筋梗塞/瘢痕、心十字部、心尖部など）
  if (
    id.includes('papillary') || id.includes('pmpm') || id.includes('alpm') || nameJa.includes('乳頭筋') || nameEn.includes('papillary') ||
    id.includes('fascicular') || id.includes('bbrvt') || id.includes('purkinje') || nameJa.includes('束枝') || nameJa.includes('プルキンエ') || nameJa.includes('脚枝') ||
    id.includes('moderator') || nameJa.includes('調整帯') ||
    id.includes('crux') || nameJa.includes('十字部') ||
    id.includes('omi') || id.includes('scar') || nameJa.includes('梗塞') || nameJa.includes('瘢痕') ||
    id.includes('apex') || nameJa.includes('心尖')
  ) {
    return false;
  }

  // 表示対象の判定：
  // 1. RVOT (右室流出路)
  // 2. LVOT (左室流出路 / 大動脈弁 / 冠尖 RCC, LCC, NCC)
  // 3. LV summit (LV summit)
  // 4. 僧帽弁輪 (MVA, AMC, Mitral)
  // 5. 三尖弁輪 (TVA, Tricuspid, Parahisian)
  const isRvot = id.includes('rvot') || category.includes('rvot') || nameJa.includes('rvot') || nameJa.includes('右室流出路');
  const isLvot = id.includes('lvot') || id.includes('rcc') || id.includes('lcc') || id.includes('ncc') || id.includes('cusp') || category.includes('lvot') || category.includes('cusp') || nameJa.includes('lvot') || nameJa.includes('左室流出路') || nameJa.includes('冠尖');
  const isSummit = id.includes('summit') || nameJa.includes('summit') || nameEn.includes('summit');
  const isMitral = id.includes('mva') || id.includes('amc') || id.includes('mitral') || nameJa.includes('僧帽弁') || nameJa.includes('mva') || nameJa.includes('amc');
  const isTricuspid = id.includes('tva') || id.includes('parahisian') || id.includes('his') || id.includes('tricuspid') || nameJa.includes('三尖弁') || nameJa.includes('parahisian') || nameJa.includes('his直上') || nameJa.includes('tva');

  return isRvot || isLvot || isSummit || isMitral || isTricuspid || category.includes('流出路') || category.includes('弁輪');
}

/**
 * 起源推定解析の実行とUI反映
 */
function runAnalysis() {
  const result = estimatePVCOrigin(appState);

  // 1. 心臓マップのハイライト更新
  if (heartMapInstance) {
    heartMapInstance.updateHighlight(result.ranking);
  }

  // 2. 最有力起源 (Top Winner) カードの更新
  const winner = result.topSite;
  const showOutflowCard = isOutflowOrAnnularSite(winner);

  if (dom.winnerProb) dom.winnerProb.innerHTML = `${winner.probability}<span>%</span>`;
  if (dom.winnerNameJa) dom.winnerNameJa.textContent = winner.nameJa;
  if (dom.winnerNameEn) dom.winnerNameEn.textContent = `${winner.nameEn} / ${winner.category}`;
  if (dom.winnerFeatures) dom.winnerFeatures.textContent = winner.keyFeatures;
  if (dom.ablationTipText) dom.ablationTipText.textContent = winner.ablationTips;

  // 2-B. 直下のインライン結果カード（★選択中の起源部位）の更新
  if (dom.inlineDiagnosisResult) {
    if (dom.inlineWinnerProb) dom.inlineWinnerProb.textContent = `確率: ${winner.probability}%`;
    if (dom.inlineWinnerNameJa) dom.inlineWinnerNameJa.textContent = winner.nameJa || '-';
    if (dom.inlineWinnerNameEn) dom.inlineWinnerNameEn.textContent = `${winner.nameEn || ''} / ${winner.category || ''}`;
    if (dom.inlineWinnerFeatures) dom.inlineWinnerFeatures.textContent = winner.keyFeatures || '-';

    if (dom.inlineBadgeEndoEpi && result.endoVsEpi) {
      const isEndo = result.endoVsEpi.layer === 'endocardial' || (result.endoVsEpi.endoProb >= result.endoVsEpi.epiProb);
      const endoLabel = isEndo ? '心内膜側 (Endocardial)' : '心外膜側 (Epicardial)';
      dom.inlineBadgeEndoEpi.textContent = endoLabel;
      dom.inlineBadgeEndoEpi.style.background = isEndo ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      dom.inlineBadgeEndoEpi.style.color = isEndo ? '#34d399' : '#f87171';
      dom.inlineBadgeEndoEpi.style.borderColor = isEndo ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    }

    if (dom.inlineBadgeOutflow) {
      if (showOutflowCard && result.outflowAnalysis) {
        const isRight = result.outflowAnalysis.verdict === 'right_rvot' || result.outflowAnalysis.verdict === 'right' || (result.outflowAnalysis.rightProb >= result.outflowAnalysis.leftProb);
        const outflowLabel = isRight ? '右室流出路 (RVOT)' : '左室流出路 (LVOT/LCC)';
        dom.inlineBadgeOutflow.textContent = outflowLabel;
        dom.inlineBadgeOutflow.style.background = isRight ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)';
        dom.inlineBadgeOutflow.style.color = isRight ? '#38bdf8' : '#fbbf24';
        dom.inlineBadgeOutflow.style.borderColor = isRight ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)';
        dom.inlineBadgeOutflow.style.display = 'inline-block';
      } else {
        dom.inlineBadgeOutflow.style.display = 'none';
      }
    }
  }

  // マトリックス用インライン結果カードの更新
  if (dom.inlineMatrixDiagnosisResult) {
    if (dom.inlineMatrixWinnerProb) dom.inlineMatrixWinnerProb.textContent = `確率: ${winner.probability}%`;
    if (dom.inlineMatrixWinnerNameJa) dom.inlineMatrixWinnerNameJa.textContent = winner.nameJa || '-';
    if (dom.inlineMatrixWinnerNameEn) dom.inlineMatrixWinnerNameEn.textContent = `${winner.nameEn || ''} / ${winner.category || ''}`;
    if (dom.inlineMatrixWinnerFeatures) dom.inlineMatrixWinnerFeatures.textContent = winner.keyFeatures || '-';

    if (dom.inlineMatrixBadgeEndoEpi && result.endoVsEpi) {
      const isEndo = result.endoVsEpi.layer === 'endocardial' || (result.endoVsEpi.endoProb >= result.endoVsEpi.epiProb);
      const endoLabel = isEndo ? '心内膜側 (Endocardial)' : '心外膜側 (Epicardial)';
      dom.inlineMatrixBadgeEndoEpi.textContent = endoLabel;
      dom.inlineMatrixBadgeEndoEpi.style.background = isEndo ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      dom.inlineMatrixBadgeEndoEpi.style.color = isEndo ? '#34d399' : '#f87171';
      dom.inlineMatrixBadgeEndoEpi.style.borderColor = isEndo ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    }

    if (dom.inlineMatrixBadgeOutflow) {
      if (showOutflowCard && result.outflowAnalysis) {
        const isRight = result.outflowAnalysis.verdict === 'right_rvot' || result.outflowAnalysis.verdict === 'right' || (result.outflowAnalysis.rightProb >= result.outflowAnalysis.leftProb);
        const outflowLabel = isRight ? '右室流出路 (RVOT)' : '左室流出路 (LVOT/LCC)';
        dom.inlineMatrixBadgeOutflow.textContent = outflowLabel;
        dom.inlineMatrixBadgeOutflow.style.background = isRight ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)';
        dom.inlineMatrixBadgeOutflow.style.color = isRight ? '#38bdf8' : '#fbbf24';
        dom.inlineMatrixBadgeOutflow.style.borderColor = isRight ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)';
        dom.inlineMatrixBadgeOutflow.style.display = 'inline-block';
      } else {
        dom.inlineMatrixBadgeOutflow.style.display = 'none';
      }
    }
  }

  // 3. 鑑別候補ランキング (Rank 2 & 3)
  if (dom.rankingContainer) {
    dom.rankingContainer.innerHTML = '';
    const secondAndThird = result.ranking.slice(1, 3);
    secondAndThird.forEach((item, idx) => {
      const rankNum = idx + 2;
      const rankRow = document.createElement('div');
      rankRow.className = 'ranking-item';
      rankRow.innerHTML = `
        <div class="ranking-meta">
          <span class="ranking-pos pos-${rankNum}">${rankNum}</span>
          <span class="ranking-name">${item.nameJa}</span>
        </div>
        <div class="ranking-bar-wrapper">
          <div class="ranking-bar-bg">
            <div class="ranking-bar-fill bar-${rankNum}" style="width: ${item.probability}%"></div>
          </div>
          <span class="ranking-pct">${item.probability}%</span>
        </div>
      `;
      dom.rankingContainer.appendChild(rankRow);
    });
  }

  // 4. 診断推論ステップ (Reasoning Timeline)
  if (dom.reasoningContainer) {
    dom.reasoningContainer.innerHTML = '';
    result.reasoning.forEach(step => {
      const stepEl = document.createElement('div');
      stepEl.className = 'reasoning-step';
      stepEl.innerHTML = `
        <div class="reasoning-step-header">
          <span class="reasoning-badge">${step.badge}</span>
          <span class="reasoning-step-title">${step.step}</span>
        </div>
        <p class="reasoning-text">${step.text}</p>
      `;
      dom.reasoningContainer.appendChild(stepEl);
    });
  }

  // 5. 心内膜 vs 心外膜 鑑別診断パネル & 各結果カードの表示制御
  if (isDiagnosisRevealed) {
    if (dom.inlineDiagnosisResult) dom.inlineDiagnosisResult.style.display = 'block';
    if (dom.inlineMatrixDiagnosisResult) dom.inlineMatrixDiagnosisResult.style.display = 'block';
    if (dom.layerVerdictGrid) dom.layerVerdictGrid.style.display = 'grid';
    if (dom.endoEpiCard) dom.endoEpiCard.style.display = 'block';

    if (result.endoVsEpi && dom.endoEpiCard) {
      renderEndoVsEpi(result.endoVsEpi);
    }

    if (dom.outflowSideCard) {
      if (showOutflowCard && result.outflowAnalysis) {
        renderOutflowSideCard(result.outflowAnalysis);
        dom.outflowSideCard.style.display = 'block';
      } else {
        dom.outflowSideCard.style.display = 'none';
      }
    }

    if (dom.cardRanking) dom.cardRanking.style.display = 'block';
    if (dom.cardReasoning) dom.cardReasoning.style.display = 'block';
    if (dom.cardLiterature) dom.cardLiterature.style.display = 'block';
  } else {
    if (dom.inlineDiagnosisResult) dom.inlineDiagnosisResult.style.display = 'none';
    if (dom.inlineMatrixDiagnosisResult) dom.inlineMatrixDiagnosisResult.style.display = 'none';
    if (dom.layerVerdictGrid) dom.layerVerdictGrid.style.display = 'none';
    if (dom.endoEpiCard) dom.endoEpiCard.style.display = 'none';
    if (dom.outflowSideCard) dom.outflowSideCard.style.display = 'none';
    if (dom.cardRanking) dom.cardRanking.style.display = 'none';
    if (dom.cardReasoning) dom.cardReasoning.style.display = 'none';
    if (dom.cardLiterature) dom.cardLiterature.style.display = 'none';
  }

  // 7. 診断根拠となる参考論文＆日本語サマリーのレンダリング
  if (dom.literatureContainer) {
    renderLiteratureForWinner(winner.id);
  }
}

/**
 * 最有力部位に関連する参考論文リストと日本語サマリーを描画
 */
function renderLiteratureForWinner(siteId) {
  if (!dom.literatureContainer) return;
  dom.literatureContainer.innerHTML = '';

  const papers = getLiteratureForSite(siteId);

  papers.forEach(paper => {
    const card = document.createElement('div');
    card.className = 'lit-card';
    const pId = paper.id;
    const s = paper.summaryJa;

    card.innerHTML = `
      <div class="lit-header">
        <h4 class="lit-title-text">${paper.title}</h4>
        ${paper.pubmedUrl ? `
          <a href="${paper.pubmedUrl}" target="_blank" rel="noopener noreferrer" class="lit-pubmed-link" title="PubMedで論文を開く">
            PubMed
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        ` : ''}
      </div>
      <div class="lit-citation">${paper.authors} — <em>${paper.journal}</em> (${paper.year})</div>
      <div class="lit-headline-badge">${s.headline}</div>
      
      <button class="lit-accordion-btn" data-target="body-${pId}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        根拠・詳細サマリーを表示
      </button>

      <div class="lit-summary-body" id="body-${pId}">
        <p style="margin-bottom: 6px;"><strong>【研究背景】</strong> ${s.background}</p>
        <p style="margin-bottom: 4px;"><strong>【提唱された指標】</strong> ${s.criteria}</p>
        <div class="lit-cutoff-box">判定基準: ${s.cutoff}</div>
        <div class="lit-metrics-row">
          <span class="lit-metric-tag">診断精度: ${s.performance}</span>
        </div>
        <p style="margin: 6px 0;"><strong>【医学的・電気生理学的メカニズム】</strong> ${s.mechanism}</p>
        <div class="lit-clinical-tip">
          <strong>【臨床的・アブレーション意義】</strong> ${s.clinicalSignificance}
        </div>
      </div>
    `;

    // アコーディオン開閉
    const btn = card.querySelector('.lit-accordion-btn');
    const body = card.querySelector(`#body-${pId}`);
    btn.addEventListener('click', () => {
      const isOpen = body.classList.contains('open');
      body.classList.toggle('open', !isOpen);
      btn.innerHTML = isOpen ? `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        根拠・詳細サマリーを表示
      ` : `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
        サマリーを閉じる
      `;
    });

    dom.literatureContainer.appendChild(card);
  });
}

/**
 * 全医学文献ライブラリ（総合モーダル）の表示
 */
function showFullLiteratureModal() {
  const modal = dom.algorithmModal;
  modal.querySelector('.modal-title').textContent = '医学文献エビデンスライブラリ & 判定基準';
  
  let html = `
    <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem;">
      CardioOrigin で採用されている心室性不整脈起源同定の主要な国際的論文と、その日本語構造化サマリー一覧です。
    </p>
  `;

  Object.values(LITERATURE_DATABASE).forEach(paper => {
    const s = paper.summaryJa;
    html += `
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 14px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
          <h4 style="font-size: 0.92rem; color: #ffffff; margin: 0 0 4px 0;">${paper.title}</h4>
          ${paper.pubmedUrl ? `<a href="${paper.pubmedUrl}" target="_blank" class="lit-pubmed-link">PubMed</a>` : ''}
        </div>
        <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px;">${paper.authors} — <em>${paper.journal}</em> (${paper.year})</div>
        <div class="lit-headline-badge">${s.headline}</div>
        <p style="font-size: 0.8rem; margin: 6px 0;"><strong>【背景】</strong> ${s.background}</p>
        <div class="lit-cutoff-box">指標: ${s.criteria} ➔ <strong>${s.cutoff}</strong> (${s.performance})</div>
        <p style="font-size: 0.8rem; margin: 6px 0;"><strong>【メカニズム】</strong> ${s.mechanism}</p>
        <div class="lit-clinical-tip"><strong>【臨床的意義】</strong> ${s.clinicalSignificance}</div>
      </div>
    `;
  });

  modal.querySelector('.modal-body').innerHTML = html;
  modal.classList.add('open');
}

/**
 * 心臓マップ部位クリック時のモーダル表示
 */
function showSiteModal(site) {
  const modal = dom.algorithmModal;
  modal.querySelector('.modal-title').textContent = `${site.nameJa} (${site.nameEn})`;
  modal.querySelector('.modal-body').innerHTML = `
    <p style="margin-bottom: 12px;"><strong>解剖分類:</strong> <span style="color: var(--accent-sky); font-weight: 600;">${site.category}</span></p>
    <h4>典型的な12誘導心電図特徴</h4>
    <p style="margin-bottom: 12px; background: rgba(255, 255, 255, 0.04); padding: 8px 12px; border-radius: 8px;">${site.keyFeatures}</p>
    <h4>カテーテルアブレーション時の臨床留意点</h4>
    <p style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 8px 12px; border-radius: 4px; color: #fef08a;">${site.ablationTips}</p>
  `;
  modal.classList.add('open');
}

/**
 * 精密鑑別指標の図解・解説モーダル表示
 */
function showMetricExplanationModal(metric) {
  const modal = dom.algorithmModal;
  modal.querySelector('.modal-title').textContent = metric.title;

  let detailsHtml = '';
  metric.details.forEach(d => {
    detailsHtml += `
      <div style="margin-top: 14px;">
        <h4 style="font-size: 0.92rem; color: #38bdf8; margin-bottom: 4px;">${d.title}</h4>
        <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; white-space: pre-line;">${d.text}</p>
      </div>
    `;
  });

  modal.querySelector('.modal-body').innerHTML = `
    <div style="margin-bottom: 12px;">
      <p style="font-size: 0.86rem; color: #94a3b8; margin-bottom: 4px;">${metric.subtitle}</p>
      <span style="font-size: 0.72rem; color: var(--accent-green); background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 4px; font-weight: 700;">
        出典: ${metric.authorRef}
      </span>
    </div>

    <!-- SVG図解エリア -->
    <div style="margin: 14px 0; border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
      ${metric.svgDiagram}
    </div>

    <!-- 判定基準 & 数値カットオフ -->
    <div class="lit-cutoff-box" style="font-size: 0.82rem; padding: 8px 12px; margin: 10px 0;">
      <strong>【計算式】</strong> ${metric.formula}
    </div>
    
    <div class="lit-metrics-row" style="margin: 10px 0;">
      <span class="lit-metric-tag" style="font-size: 0.8rem; padding: 4px 12px; background: rgba(2, 132, 199, 0.25);">
        判定基準: ${metric.cutoffText}
      </span>
      <span class="lit-metric-tag" style="font-size: 0.8rem; padding: 4px 12px; background: rgba(16, 185, 129, 0.25); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">
        診断精度: ${metric.performance}
      </span>
    </div>

    <!-- 詳細解説セクション -->
    ${detailsHtml}
  `;

  modal.classList.add('open');
}

/**
 * 感度（波高ゲイン）の変更
 */
function setEcgGain(gain) {
  appState.ecgGain = parseFloat(gain) || 1.0;

  // 1. すべてのピルボタングループのactiveクラスを同期
  document.querySelectorAll('.gain-pill').forEach(btn => {
    const bGain = parseFloat(btn.dataset.gain);
    btn.classList.toggle('active', Math.abs(bGain - appState.ecgGain) < 0.01);
  });

  // 2. キャリブレーションバッジの表示テキストを更新
  const gainDisplay = document.getElementById('citation-gain-display');
  if (gainDisplay) {
    const mmPerMv = Math.round(appState.ecgGain * 10);
    gainDisplay.textContent = `${mmPerMv}mm/mV`;
  }

  // 3. 典型12誘導プレビューを再描画
  if (currentPreset) {
    renderPaperCitation(currentPreset);
  }

  // 4. 12誘導マトリックスを再描画
  renderMatrix();
}

/**
 * キャリブレーションバッジのクリックによる感度トグル切替
 * ×1.0 (10mm/mV) -> ×1.5 (15mm/mV) -> ×2.0 (20mm/mV) -> ×0.5 (5mm/mV) -> ...
 */
const GAIN_LEVELS = [1.0, 1.5, 2.0, 0.5];
function toggleEcgGain() {
  const current = appState.ecgGain || 1.0;
  const curIdx = GAIN_LEVELS.findIndex(g => Math.abs(g - current) < 0.01);
  const nextIdx = (curIdx + 1) % GAIN_LEVELS.length;
  setEcgGain(GAIN_LEVELS[nextIdx]);
}

/**
 * 誘導配列（標準 vs カブレラ）の切り替え
 */
function setLeadFormat(format) {
  appState.leadFormat = (format === 'cabrera') ? 'cabrera' : 'standard';

  // ピルボタンのactive状態を更新
  const btnStd = document.getElementById('btn-format-std');
  const btnCab = document.getElementById('btn-format-cabrera');
  if (btnStd) btnStd.classList.toggle('active', appState.leadFormat === 'standard');
  if (btnCab) btnCab.classList.toggle('active', appState.leadFormat === 'cabrera');

  // カブレラ配列時は配置切替ボタン群を非表示、標準配列時は表示
  if (dom.stdLayoutGroup) {
    dom.stdLayoutGroup.style.display = (appState.leadFormat === 'standard') ? 'inline-flex' : 'none';
  }

  // 典型12誘導パネルを再描画
  if (currentPreset) {
    renderPaperCitation(currentPreset);
  }
}

/**
 * 標準配列の配置（縦型3列 vs 横並び2行）の切り替え
 */
function setStdLayout(layout) {
  appState.stdLayout = (layout === 'horizontal') ? 'horizontal' : 'vertical';

  // ピルボタンのactive状態を更新
  if (dom.btnLayoutVertical) {
    dom.btnLayoutVertical.classList.toggle('active', appState.stdLayout === 'vertical');
  }
  if (dom.btnLayoutHorizontal) {
    dom.btnLayoutHorizontal.classList.toggle('active', appState.stdLayout === 'horizontal');
  }

  // 典型12誘導パネルを再描画
  if (currentPreset) {
    renderPaperCitation(currentPreset);
  }
}

/**
 * 臨床解説カード群のHTML生成
 */
function generateClinicalInsightsHtml(ci) {
  if (!ci) return '';
  return `
    <div class="insight-card points">
      <h4>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        心電図波形の特徴と機序
      </h4>
      <p style="font-size: 0.74rem; color: #94a3b8; margin-bottom: 6px;"><strong>機序:</strong> ${ci.mechanism}</p>
      <ul>
        ${ci.ecgKeyPoints.map(pt => `<li>${pt}</li>`).join('')}
      </ul>
    </div>

    <div class="insight-card pitfalls">
      <h4>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        見落とさないためのコツと落とし穴
      </h4>
      <p>${ci.pitfalls}</p>
    </div>

    <div class="insight-card strategy">
      <h4>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/>
        </svg>
        カテーテルアブレーション戦略
      </h4>
      <p>${ci.ablationStrategy}</p>
    </div>
  `;
}

/**
 * 論文引用・典型12誘導心電図 & 臨床解説パネルのレンダリング
 */
function renderPaperCitation(preset) {
  if (!dom.paperCitationPanel || !preset) return;

  // タイトルと層別タグ
  dom.citationCaseTitle.textContent = preset.name;
  dom.citationLayerTag.textContent = preset.transmuralSite || '心内膜側 (Endocardial)';
  const isEpi = (preset.transmuralSite && (preset.transmuralSite.includes('心外膜') || preset.transmuralSite.includes('Epicardial')));
  dom.citationLayerTag.className = `citation-layer-tag ${isEpi ? 'epi' : ''}`;

  // 論文出典情報
  if (preset.citation) {
    dom.citationSourceInfo.innerHTML = `
      <div><strong>出典論文:</strong> ${preset.citation.authors} 著</div>
      <div>『${preset.citation.title}』${preset.citation.journal} <span class="fig-badge">${preset.citation.figure}</span></div>
    `;
  }

  const isCabrera = (appState.leadFormat === 'cabrera');
  const isVertical = (appState.stdLayout === 'vertical');
  const gain = appState.ecgGain || 1.0;
  const insightsHtml = (preset.clinicalInsights) ? generateClinicalInsightsHtml(preset.clinicalInsights) : '';

  // 配置切替ボタン群の表示/非表示（カブレラ配列時は非表示）
  if (dom.stdLayoutGroup) {
    dom.stdLayoutGroup.style.display = isCabrera ? 'none' : 'inline-flex';
  }

  // 臨床解説を常に下部全幅コンテナ (citationInsightsContainer) に統一描画
  if (dom.colInsightsWrapper) dom.colInsightsWrapper.style.display = 'none';
  if (dom.colVerticalInsights) dom.colVerticalInsights.innerHTML = '';
  if (dom.citationInsightsContainer) {
    dom.citationInsightsContainer.style.display = insightsHtml ? 'grid' : 'none';
    dom.citationInsightsContainer.innerHTML = insightsHtml;
  }

  if (isCabrera) {
    // カブレラ配列時: 標準グリッド & 縦型2列を非表示にし、空間配置ビューを表示
    if (dom.citationEcgGrid) dom.citationEcgGrid.style.display = 'none';
    if (dom.citationStdVertical) dom.citationStdVertical.style.display = 'none';
    if (dom.citationCabreraSpatial) dom.citationCabreraSpatial.style.display = 'block';

    renderCabreraFrontalStage(preset);
    renderCabreraThoraxStage(preset);
  } else if (isVertical) {
    // 標準配列・縦型2列配置 (四肢誘導 | 胸部誘導)
    if (dom.citationCabreraSpatial) dom.citationCabreraSpatial.style.display = 'none';
    if (dom.citationEcgGrid) dom.citationEcgGrid.style.display = 'none';
    if (dom.citationStdVertical) dom.citationStdVertical.style.display = 'block';

    // 左列: 四肢誘導 6つ (I, II, III, aVR, aVL, aVF)
    if (dom.colLimbLeads && preset.params && preset.params.leads) {
      dom.colLimbLeads.innerHTML = '';
      LIMB_LEADS.forEach(item => {
        const leadData = preset.params.leads[item.id] || { pattern: 'R', amp: 1.0 };
        const box = document.createElement('div');
        box.className = 'citation-lead-box';
        box.innerHTML = generateEcgSvg(item.label, leadData.pattern, leadData.amp, false, true, gain, '');
        dom.colLimbLeads.appendChild(box);
      });
    }

    // 中央列: 胸部誘導 6つ (V1〜V6)
    if (dom.colChestLeads && preset.params && preset.params.leads) {
      dom.colChestLeads.innerHTML = '';
      CHEST_LEADS.forEach(item => {
        const leadData = preset.params.leads[item.id] || { pattern: 'QS', amp: -1.0 };
        const box = document.createElement('div');
        box.className = 'citation-lead-box';
        box.innerHTML = generateEcgSvg(item.label, leadData.pattern, leadData.amp, false, true, gain, '');
        dom.colChestLeads.appendChild(box);
      });
    }
  } else {
    // 標準配列・従来の横並びグリッド (2行×6列)
    if (dom.citationCabreraSpatial) dom.citationCabreraSpatial.style.display = 'none';
    if (dom.citationStdVertical) dom.citationStdVertical.style.display = 'none';
    if (dom.citationEcgGrid) {
      dom.citationEcgGrid.style.display = 'grid';
      dom.citationEcgGrid.innerHTML = '';

      if (preset.params && preset.params.leads) {
        STANDARD_LEAD_ORDER.forEach(item => {
          const leadData = preset.params.leads[item.id] || { pattern: 'R', amp: 1.0 };
          const leadBox = document.createElement('div');
          leadBox.className = 'citation-lead-box';
          leadBox.innerHTML = generateEcgSvg(item.label, leadData.pattern, leadData.amp, false, true, gain, '');
          dom.citationEcgGrid.appendChild(leadBox);
        });
      }
    }
  }
}

/**
 * 前額面 Cabrera 6軸サークルステージの描画
 * 心臓正面伝導系を中心として、時計回りに連続する電気軸シークエンス（aVL -> I -> -aVR -> II -> aVF -> III）を描画
 */
function renderCabreraFrontalStage(preset) {
  const stage = dom.cabreraFrontalStage;
  if (!stage || !preset.params || !preset.params.leads) return;
  stage.innerHTML = '';

  const gain = appState.ecgGain || 1.0;
  const leads = preset.params.leads;

  // 1. 背景SVG（前額面 Cabrera 6軸サークル ＆ 心臓伝導系ガイド）
  const bgSvg = `
    <svg class="spatial-bg-svg" viewBox="0 0 540 510" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="cabrera-arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
        </marker>
        <marker id="cabrera-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b"/>
        </marker>
        <radialGradient id="heart-center-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9"/>
          <stop offset="70%" stop-color="#0f172a" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="1"/>
        </radialGradient>
      </defs>

      <!-- サークルガイド (中心: 270, 245, 半径: 165px) -->
      <circle cx="270" cy="245" r="165" fill="none" stroke="rgba(56, 189, 248, 0.22)" stroke-width="1.8" stroke-dasharray="4,4"/>
      <circle cx="270" cy="245" r="130" fill="none" stroke="rgba(56, 189, 248, 0.10)" stroke-width="1"/>

      <!-- 時計回り進行方向の大きなガイドライン円弧矢印 (+30°から+90°へ向かう円弧) -->
      <path d="M 395 327 A 165 165 0 0 1 270 410" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#cabrera-arr-amber)"/>
      <text x="370" y="388" fill="#f59e0b" font-size="10.5" font-weight="700">↻ 電気軸進行順</text>

      <!-- 6軸基準矢印ライン (中心 270, 245 から各誘導カードまで) -->
      <line x1="270" y1="245" x2="441" y2="146" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/> <!-- aVL (-30°) -->
      <line x1="270" y1="245" x2="488" y2="245" stroke="#38bdf8" stroke-width="1.8"/> <!-- I (0°) -->
      <line x1="270" y1="245" x2="433" y2="339" stroke="#0284c7" stroke-width="2"/> <!-- -aVR (+30°) -->
      <line x1="270" y1="245" x2="381" y2="437" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/> <!-- II (+60°) -->
      <line x1="270" y1="245" x2="270" y2="435" stroke="#38bdf8" stroke-width="1.8"/> <!-- aVF (+90°) -->
      <line x1="270" y1="245" x2="159" y2="437" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/> <!-- III (+120°) -->
      <line x1="270" y1="245" x2="99" y2="146" stroke="rgba(148, 163, 184, 0.4)" stroke-width="1.2" stroke-dasharray="2,2"/> <!-- aVR参考 (-150°) -->

      <!-- 中央：心臓イラスト ＆ 刺激伝導系背景シェイプ -->
      <g transform="translate(270, 245)">
        <ellipse cx="0" cy="0" rx="56" ry="44" fill="url(#heart-center-grad)" stroke="#38bdf8" stroke-width="1.8"/>
        <!-- 房室結節 & 刺激伝導系パルスライン -->
        <path d="M -15 -18 L 0 -4 L 14 18 M 0 -4 L -12 20" stroke="#fbbf24" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <circle cx="-15" cy="-18" r="4" fill="#ef4444"/>
        <text x="0" y="-24" fill="#93c5fd" font-size="10" font-weight="700" text-anchor="middle">前額面伝導系</text>
        <text x="0" y="32" fill="#64748b" font-size="9" font-weight="600" text-anchor="middle">Cabrera 6-Axis</text>
      </g>
    </svg>
  `;

  stage.insertAdjacentHTML('beforeend', bgSvg);

  // 2. 前額面 Cabrera 6誘導カードの配置 (重なりを防止する放射状交互スタッガード配置)
  const cabreraFrontalConfigs = [
    { id: 'aVL', label: 'aVL', leftPct: 81.754, topPct: 28.627, angle: '-30°' },
    { id: 'I', label: 'I', leftPct: 90.370, topPct: 48.039, angle: '0°' },
    { id: '-aVR', label: '-aVR', leftPct: 80.150, topPct: 66.471, angle: '+30°', sourceLead: 'aVR', inverted: true },
    { id: 'II', label: 'II', leftPct: 70.556, topPct: 85.737, angle: '+60°' },
    { id: 'aVF', label: 'aVF', leftPct: 50.000, topPct: 85.294, angle: '+90°' },
    { id: 'III', label: 'III', leftPct: 29.444, topPct: 85.737, angle: '+120°' },
    { id: 'aVR', label: 'aVR (参考)', leftPct: 18.246, topPct: 28.627, angle: '-150°', isRef: true }
  ];

  cabreraFrontalConfigs.forEach(cfg => {
    let leadData;
    if (cfg.inverted && cfg.sourceLead) {
      const orig = leads[cfg.sourceLead] || { pattern: 'QS', amp: -1.0 };
      leadData = getInvertedLeadPattern(orig.pattern, orig.amp);
    } else {
      leadData = leads[cfg.id] || { pattern: 'R', amp: 1.0 };
    }

    const card = document.createElement('div');
    card.className = `spatial-lead-node ${cfg.inverted ? 'inverted-lead' : ''} ${cfg.isRef ? 'ref-lead' : ''}`;
    card.style.left = `${cfg.leftPct}%`;
    card.style.top = `${cfg.topPct}%`;

    card.innerHTML = generateEcgSvg(
      cfg.label,
      leadData.pattern,
      leadData.amp,
      false,
      true,
      gain,
      cfg.angle
    );

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = card.classList.contains('active');
      stage.querySelectorAll('.spatial-lead-node').forEach(node => node.classList.remove('active', 'selected'));
      if (!isActive) {
        card.classList.add('active', 'selected');
      }
    });

    stage.appendChild(card);
  });

  // キャンバス領域タップで選択解除
  stage.addEventListener('click', (e) => {
    if (!e.target.closest('.spatial-lead-node')) {
      stage.querySelectorAll('.spatial-lead-node').forEach(node => node.classList.remove('active', 'selected'));
    }
  });
}

/**
 * 水平面 胸部横断面ステージの描画
 * 胸郭楕円の体表面（外周境界線上）に電極の点を配置し、波形カードから体表面の点へ矢印を結ぶ
 * 電極のテキストラベルは不要のため除去し、ドットと矢印のみですっきりと表示
 */
function renderCabreraThoraxStage(preset) {
  const stage = dom.cabreraThoraxStage;
  if (!stage || !preset.params || !preset.params.leads) return;
  stage.innerHTML = '';

  const gain = appState.ecgGain || 1.0;
  const leads = preset.params.leads;

  // 1. 背景SVG（胸部横断面・心臓4腔断面・脊椎骨・体表面の電極点・ベクトル矢印）
  const bgSvg = `
    <svg class="spatial-bg-svg" viewBox="0 0 530 485" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="thorax-arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
        </marker>
        <radialGradient id="thorax-body-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95"/>
          <stop offset="85%" stop-color="#0f172a" stop-opacity="0.98"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="1"/>
        </radialGradient>
        <radialGradient id="heart-cross-grad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.92"/>
          <stop offset="80%" stop-color="#172554" stop-opacity="0.96"/>
          <stop offset="100%" stop-color="#0b1329" stop-opacity="1"/>
        </radialGradient>
      </defs>

      <!-- 胸部横断面の楕円輪郭 (中心: 195, 255, 横径rx=135, 縦径ry=92) -->
      <ellipse cx="195" cy="255" rx="135" ry="92" fill="url(#thorax-body-grad)" stroke="rgba(56, 189, 248, 0.45)" stroke-width="2.5" />
      <ellipse cx="195" cy="255" rx="122" ry="80" fill="none" stroke="rgba(56, 189, 248, 0.18)" stroke-width="1" stroke-dasharray="3,3" />

      <!-- 前胸部マーク (Sternum / 前胸壁: 上中央 195, 163) -->
      <path d="M 183 161 Q 195 157, 207 161 L 203 170 Q 195 168, 187 170 Z" fill="#64748b" stroke="#94a3b8" stroke-width="1.2"/>
      <text x="195" y="149" fill="#94a3b8" font-size="10.5" font-weight="700" text-anchor="middle">前胸部 (Anterior / Sternum)</text>

      <!-- 背部マーク (脊椎骨・棘突起: 下中央 195, 350) -->
      <g transform="translate(195, 350)">
        <circle cx="0" cy="0" r="13" fill="#15803d" stroke="#22c55e" stroke-width="1.5"/>
        <path d="M -10 6 C -12 18, -4 24, 0 26 C 4 24, 12 18, 10 6 Z" fill="#16a34a" stroke="#22c55e" stroke-width="1.5"/>
        <circle cx="0" cy="3" r="4.5" fill="#052e16"/>
      </g>
      <text x="195" y="396" fill="#22c55e" font-size="10.5" font-weight="700" text-anchor="middle">背部 (Posterior / Spine)</text>

      <!-- 左右方向ラベル -->
      <text x="70" y="258" fill="#64748b" font-size="10" font-weight="600" text-anchor="middle">右 (Right)</text>
      <text x="310" y="230" fill="#64748b" font-size="10" font-weight="600" text-anchor="middle">左 (Left)</text>

      <!-- 心臓4腔断面 -->
      <g transform="translate(200, 255) rotate(-35)">
        <ellipse cx="0" cy="0" rx="58" ry="40" fill="url(#heart-cross-grad)" stroke="#38bdf8" stroke-width="2"/>
        <line x1="-56" y1="0" x2="56" y2="0" stroke="#38bdf8" stroke-width="2.5" opacity="0.85"/>
        <line x1="-5" y1="-38" x2="-5" y2="38" stroke="#38bdf8" stroke-width="1.8" opacity="0.65"/>

        <!-- 4腔ラベル -->
        <text x="21" y="-13" fill="#93c5fd" font-size="12" font-weight="800" text-anchor="middle">RV</text>
        <text x="21" y="22" fill="#93c5fd" font-size="12" font-weight="800" text-anchor="middle">LV</text>
        <text x="-28" y="-13" fill="#60a5fa" font-size="10" font-weight="700" text-anchor="middle">RA</text>
        <text x="-28" y="22" fill="#60a5fa" font-size="10" font-weight="700" text-anchor="middle">LA</text>
      </g>

      <!-- 体表面上の電極位置ポイント (V1〜V6: 楕円周上に正確に配置、ラベル不要のためテキスト除去) -->
      <circle cx="160" cy="166" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="230" cy="166" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="272" cy="180" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="306" cy="202" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="327" cy="236" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="325" cy="279" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>

      <!-- 参考誘導ポイント (右側誘導 V4R, V3R & 後壁誘導 V7, V8, V9: 体表面周上の点のみ、ラベルなし) -->
      <circle cx="84" cy="202" r="3" fill="#f87171" stroke="#ffffff" stroke-width="0.8" opacity="0.85"/>
      <circle cx="118" cy="180" r="3" fill="#f87171" stroke="#ffffff" stroke-width="0.8" opacity="0.85"/>

      <circle cx="306" cy="308" r="3" fill="#a78bfa" stroke="#ffffff" stroke-width="0.8" opacity="0.85"/>
      <circle cx="272" cy="330" r="3" fill="#a78bfa" stroke="#ffffff" stroke-width="0.8" opacity="0.85"/>
      <circle cx="230" cy="344" r="3" fill="#a78bfa" stroke="#ffffff" stroke-width="0.8" opacity="0.85"/>

      <!-- 各波形カードから体表面の電極ポイントへ向かうシアン色のベクトル矢印 (体表面の点でピタッと結ぶ) -->
      <!-- V1: カード (120, 108) -> 体表面電極 (160, 166) -->
      <line x1="120" y1="108" x2="160" y2="166" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#thorax-arr-cyan)"/>
      <!-- V2: カード (215, 93) -> 体表面電極 (230, 166) -->
      <line x1="215" y1="93" x2="230" y2="166" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#thorax-arr-cyan)"/>
      <!-- V3: カード (300, 108) -> 体表面電極 (272, 180) -->
      <line x1="300" y1="108" x2="272" y2="180" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#thorax-arr-cyan)"/>
      <!-- V4: カード (355, 155) -> 体表面電極 (306, 202) -->
      <line x1="355" y1="155" x2="306" y2="202" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#thorax-arr-cyan)"/>
      <!-- V5: カード (368, 240) -> 体表面電極 (327, 236) -->
      <line x1="368" y1="240" x2="327" y2="236" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#thorax-arr-cyan)"/>
      <!-- V6: カード (355, 330) -> 体表面電極 (325, 279) -->
      <line x1="355" y1="330" x2="325" y2="279" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#thorax-arr-cyan)"/>
    </svg>
  `;

  stage.insertAdjacentHTML('beforeend', bgSvg);

  // 2. 胸部誘導波形カードの配置 (パーセンテージ座標で完全レスポンシブ対応化)
  const thoraxLeadConfigs = [
    { id: 'V1', label: 'V1', leftPct: 16.038, topPct: 14.433 },
    { id: 'V2', label: 'V2', leftPct: 36.792, topPct: 11.340 },
    { id: 'V3', label: 'V3', leftPct: 57.547, topPct: 14.433 },
    { id: 'V4', label: 'V4', leftPct: 75.472, topPct: 26.804 },
    { id: 'V5', label: 'V5', leftPct: 79.245, topPct: 50.515 },
    { id: 'V6', label: 'V6', leftPct: 76.415, topPct: 75.258 }
  ];

  thoraxLeadConfigs.forEach(cfg => {
    const leadData = leads[cfg.id] || { pattern: 'QS', amp: -1.0 };
    const card = document.createElement('div');
    card.className = 'spatial-lead-node';
    card.style.left = `${cfg.leftPct}%`;
    card.style.top = `${cfg.topPct}%`;

    card.innerHTML = generateEcgSvg(
      cfg.label,
      leadData.pattern,
      leadData.amp,
      false,
      true,
      gain,
      ''
    );

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = card.classList.contains('active');
      stage.querySelectorAll('.spatial-lead-node').forEach(node => node.classList.remove('active', 'selected'));
      if (!isActive) {
        card.classList.add('active', 'selected');
      }
    });

    stage.appendChild(card);
  });

  // キャンバス領域タップで選択解除
  stage.addEventListener('click', (e) => {
    if (!e.target.closest('.spatial-lead-node')) {
      stage.querySelectorAll('.spatial-lead-node').forEach(node => node.classList.remove('active', 'selected'));
    }
  });
}

/**
 * 心内膜 (Endo) vs 心外膜 (Epi) 鑑別パネルのレンダリング
 */
function renderEndoVsEpi(data) {
  if (!data || !dom.endoEpiCard) return;

  // 1. パーセンテージとメーターバー
  if (dom.valEndoProb) dom.valEndoProb.textContent = `${data.endoProb}%`;
  if (dom.valEpiProb) dom.valEpiProb.textContent = `${data.epiProb}%`;
  if (dom.meterFillEndo) dom.meterFillEndo.style.width = `${data.endoProb}%`;
  if (dom.meterFillEpi) dom.meterFillEpi.style.width = `${data.epiProb}%`;

  // 2. 判定バッジ
  if (dom.endoEpiVerdictBadge) {
    dom.endoEpiVerdictBadge.textContent = data.layerJa;
    dom.endoEpiVerdictBadge.className = `endo-epi-verdict-badge ${data.layer === 'epicardial' ? 'epi' : (data.layer === 'endocardial' ? 'endo' : 'borderline')}`;
  }

  // 3. 適合した論文基準リスト & LVEpi警告バナー
  if (dom.endoEpiCriteria) {
    dom.endoEpiCriteria.innerHTML = '';
    
    // Ito 2003 LVEpi 通電不成功警告バナー
    if (data.lvepiWarning) {
      const warnDiv = document.createElement('div');
      warnDiv.className = 'lvepi-warning-banner';
      warnDiv.innerHTML = `
        <div class="lvepi-warning-header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <strong>${data.lvepiWarning.title}</strong>
        </div>
        <p class="lvepi-warning-text">${data.lvepiWarning.text}</p>
      `;
      dom.endoEpiCriteria.appendChild(warnDiv);
    }

    if (data.criteriaMet && data.criteriaMet.length > 0) {
      data.criteriaMet.forEach(c => {
        const item = document.createElement('div');
        item.className = 'criterion-item';
        item.innerHTML = `
          <div class="criterion-name">${c.name}</div>
          <div class="criterion-value">${c.value}</div>
          <span class="criterion-tag ${c.favor}">${c.favor === 'epi' ? '心外膜側' : '心内膜側'}</span>
        `;
        dom.endoEpiCriteria.appendChild(item);
      });
    }
  }

  // 4. アブレーション推奨戦略
  if (dom.endoEpiStrategyBox && data.ablationStrategy) {
    const strat = data.ablationStrategy;
    const isEpi = data.layer === 'epicardial';
    dom.endoEpiStrategyBox.className = `endo-epi-strategy-box ${isEpi ? 'epi-strategy' : ''}`;
    dom.endoEpiStrategyBox.innerHTML = `
      <div class="strategy-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 16 12 12 8"/>
        </svg>
        ${strat.title}
      </div>
      <div class="strategy-approach">${strat.approach}</div>
      <ul class="strategy-list">
        ${strat.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
      </ul>
    `;

    // 5. JACC 2024 (Enriquez et al. Fig 5) 心筋内 (Intramural) 難治例への段階的アプローチ
    if (data.intramuralGuidance) {
      const im = data.intramuralGuidance;
      const intramuralDiv = document.createElement('div');
      intramuralDiv.className = 'intramural-guidance-card';
      intramuralDiv.innerHTML = `
        <div class="intramural-header">
          <span class="intramural-badge">JACC 2024 最新総説 (Enriquez et al. Fig 5)</span>
          <span class="intramural-title">心筋内 (Intramural) 起源の診断基準 &amp; 段階的アブレーション戦略</span>
        </div>
        <div class="intramural-steps">
          ${im.stepwiseStrategies.map(s => `
            <div class="intramural-step-item">
              <span class="step-tag">${s.step}</span>
              <span class="step-desc">${s.desc}</span>
            </div>
          `).join('')}
        </div>
      `;
      dom.endoEpiStrategyBox.appendChild(intramuralDiv);
    }
  }
}

/**
 * 流出路起源：右側 (RVOT) vs 左側 (LVOT/LCC) 精密鑑別パネル (Ito et al. 2003) のレンダリング
 */
function renderOutflowSideCard(data) {
  if (!data || !dom.outflowSideCard) return;

  // 1. パーセンテージとメーターバー
  if (dom.valRightProb) dom.valRightProb.textContent = `${data.rightProb}%`;
  if (dom.valLeftProb) dom.valLeftProb.textContent = `${data.leftProb}%`;
  if (dom.meterFillRight) dom.meterFillRight.style.width = `${data.rightProb}%`;
  if (dom.meterFillLeft) dom.meterFillLeft.style.width = `${data.leftProb}%`;

  // 2. 判定バッジ
  if (dom.outflowVerdictBadge) {
    dom.outflowVerdictBadge.textContent = `${data.verdictJa} (${data.subVerdictJa})`;
    dom.outflowVerdictBadge.className = `outflow-verdict-badge ${data.verdict === 'left_lvot' ? 'left' : (data.verdict === 'right_rvot' ? '' : 'borderline')}`;
  }

  // 3. 判定チェックリスト
  if (dom.outflowCriteriaGrid) {
    dom.outflowCriteriaGrid.innerHTML = '';
    if (data.checklist && data.checklist.length > 0) {
      data.checklist.forEach(c => {
        const item = document.createElement('div');
        item.className = 'outflow-criterion-card';
        item.innerHTML = `
          <div class="outflow-criterion-top">
            <span class="outflow-crit-name">${c.item}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="outflow-crit-val">${c.value}</span>
              <span class="outflow-crit-badge ${c.verdict}">${c.badge}</span>
            </div>
          </div>
          <div class="outflow-crit-detail">${c.detail}</div>
        `;
        dom.outflowCriteriaGrid.appendChild(item);
      });
    }
  }

  // 4. 臨床パール
  if (dom.outflowPearlsBox && data.clinicalPearls) {
    dom.outflowPearlsBox.innerHTML = `
      <div class="pearls-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        流出路PVC鑑別の重要エッセンス (Ito et al. 2003 / JACC 2024)
      </div>
      <ul class="pearls-list">
        ${data.clinicalPearls.map(p => `<li>${p}</li>`).join('')}
      </ul>
    `;
  }
}

// DOM構築完了後に起動 (type="module" の即時実行対応)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
