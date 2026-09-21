/**
 * CardioOrigin - アプリケーション メインロジック
 */

import { PRESETS } from './presets.js';
import { estimatePVCOrigin, SITE_DEFINITIONS } from './algorithm.js';
import { HeartMap } from './heart-map.js';
import { generateEcgSvg } from './ecg-draw.js';
import { LITERATURE_DATABASE, getLiteratureForSite } from './literature.js';
import { EcgImageAnalyzer } from './image-analyzer.js';
import { METRIC_EXPLANATIONS } from './metric-explainer.js';
import { checkAndShowMedicalDisclaimer, showDisclaimerModal } from './disclaimer-modal.js';

// デフォルト状態
const defaultState = {
  axis: 'inferior',
  v1Pattern: 'lbbb_qs',
  transition: 'V4',
  lead1: 'positive',
  leadAVL: 'negative_shallow',
  qrsDuration: 140,
  v2s_v3r_ratio: 1.8,
  v2_trans_ratio: 0.40,
  mdi: 0.42,
  pseudoDelta: 25,
  hasNotch: false,
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
let heartMapInstance = null;
let imageAnalyzerInstance = null;

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
  
  // スライダー群
  inputV2sV3r: document.getElementById('input-v2s-v3r'),
  valV2sV3r: document.getElementById('val-v2s-v3r'),
  inputV2Ratio: document.getElementById('input-v2-ratio'),
  valV2Ratio: document.getElementById('val-v2-ratio'),
  inputMdi: document.getElementById('input-mdi'),
  valMdi: document.getElementById('val-mdi'),
  inputQrs: document.getElementById('input-qrs'),
  valQrs: document.getElementById('val-qrs'),
  
  // 結果表示群
  winnerProb: document.getElementById('winner-prob'),
  winnerNameJa: document.getElementById('winner-name-ja'),
  winnerNameEn: document.getElementById('winner-name-en'),
  winnerFeatures: document.getElementById('winner-features'),
  rankingContainer: document.getElementById('ranking-container'),
  reasoningContainer: document.getElementById('reasoning-container'),
  ablationTipText: document.getElementById('ablation-tip-text'),
  literatureContainer: document.getElementById('literature-container'),
  
  // アクション
  btnReset: document.getElementById('btn-reset'),
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
  citationInsightsContainer: document.getElementById('citation-insights-container'),

  // 心内膜 vs 心外膜 鑑別パネル要素
  endoEpiCard: document.getElementById('endo-epi-card'),
  endoEpiVerdictBadge: document.getElementById('endo-epi-verdict-badge'),
  valEndoProb: document.getElementById('val-endo-prob'),
  valEpiProb: document.getElementById('val-epi-prob'),
  meterFillEndo: document.getElementById('meter-fill-endo'),
  meterFillEpi: document.getElementById('meter-fill-epi'),
  endoEpiCriteria: document.getElementById('endo-epi-criteria'),
  endoEpiStrategyBox: document.getElementById('endo-epi-strategy-box')
};

/**
 * 初期化関数
 */
function init() {
  // 初回起動時の医療免責事項モーダル強制表示は無効化（ヘッダーボタンから任意で確認可能）
  // checkAndShowMedicalDisclaimer();

  // Service Worker 登録 (オフライン完全対応)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // 心臓解剖マップの初期化
  heartMapInstance = new HeartMap(dom.heartMapRoot, (site) => {
    showSiteModal(site);
  });

  // 画像自動解析モジュールの初期化
  if (dom.imageAnalyzerRoot) {
    imageAnalyzerInstance = new EcgImageAnalyzer({
      container: dom.imageAnalyzerRoot,
      onAnalysisComplete: (detectedData) => {
        applyDetectedParameters(detectedData);
      }
    });
  }

  // プリセットチップのレンダリング
  renderPresets();

  // 12誘導マトリックスのレンダリング
  renderMatrix();

  // イベントリスナーのセットアップ
  setupEventListeners();

  // iOSボトムタブバーのセットアップ
  setupIosTabBar();

  // 最初のプリセットに基づく論文引用パネルの初期描画
  if (PRESETS.length > 0) {
    renderPaperCitation(PRESETS[0]);
  }

  // 初回解析実行
  runAnalysis();
}

/**
 * プリセットチップのレンダリング
 */
function renderPresets() {
  dom.presetContainer.innerHTML = '';
  PRESETS.forEach((preset, index) => {
    const chip = document.createElement('div');
    chip.className = `preset-chip ${index === 0 ? 'active' : ''}`;
    chip.dataset.id = preset.id;
    chip.innerHTML = `
      <span class="preset-name">${preset.name}</span>
      <span class="preset-category">${preset.category}</span>
    `;
    chip.addEventListener('click', () => {
      applyPreset(preset);
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
    dom.presetContainer.appendChild(chip);
  });
}

/**
 * プリセットデータの適用
 */
function applyPreset(preset) {
  appState = {
    ...appState,
    ...preset.params
  };

  syncControlsWithState();
  renderMatrix();
  renderPaperCitation(preset);
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
  runAnalysis();

  // ステップ診断タブに自動切替して確認させる
  switchTab('wizard');
}

/**
 * UIコントロールとappStateの同期
 */
function syncControlsWithState() {
  updateButtonGroup(dom.optAxis, appState.axis);
  updateButtonGroup(dom.optV1, appState.v1Pattern);

  dom.optTransition.querySelectorAll('.trans-btn').forEach(btn => {
    if (btn.dataset.value === appState.transition) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  updateButtonGroup(dom.optLead1, appState.lead1);

  dom.inputV2sV3r.value = appState.v2s_v3r_ratio;
  dom.valV2sV3r.textContent = appState.v2s_v3r_ratio;

  dom.inputV2Ratio.value = appState.v2_trans_ratio;
  dom.valV2Ratio.textContent = Number(appState.v2_trans_ratio).toFixed(2);

  dom.inputMdi.value = appState.mdi;
  dom.valMdi.textContent = Number(appState.mdi).toFixed(2);

  dom.inputQrs.value = appState.qrsDuration;
  dom.valQrs.textContent = `${appState.qrsDuration} ms`;
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
 * 12誘導マトリックスUIのレンダリング
 */
const LEAD_LIST = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
const WAVE_OPTIONS = [
  { value: 'R', label: 'R波 (単相性高波)' },
  { value: 'Rs', label: 'Rs型 (R波優位+小s)' },
  { value: 'rS', label: 'rS型 (小r+深いS)' },
  { value: 'QS', label: 'QS型 (単相性陰性)' },
  { value: 'qR', label: 'qR型 (小q+高R)' },
  { value: 'rsR', label: 'rsR\'型 (二峰性/RBBB)' },
  { value: 'Notched_R', label: 'Notched R (幅広ノッチ)' }
];

function renderMatrix() {
  dom.matrixContainer.innerHTML = '';
  LEAD_LIST.forEach(lead => {
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
        ${generateEcgSvg(lead, leadData.pattern, leadData.amp || 1.0)}
      </div>
    `;

    const selectEl = card.querySelector('.matrix-lead-select');
    selectEl.addEventListener('change', (e) => {
      const newPattern = e.target.value;
      appState.leads[lead].pattern = newPattern;
      
      const svgWrap = card.querySelector('.matrix-lead-svg-wrap');
      svgWrap.innerHTML = generateEcgSvg(lead, newPattern, appState.leads[lead].amp || 1.0);

      syncMatrixToState(lead, newPattern);
      runAnalysis();
    });

    dom.matrixContainer.appendChild(card);
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
  dom.tabWizardBtn.classList.toggle('active', tabName === 'wizard');
  dom.tabMatrixBtn.classList.toggle('active', tabName === 'matrix');
  dom.tabImageBtn.classList.toggle('active', tabName === 'image');

  dom.viewWizard.style.display = tabName === 'wizard' ? 'block' : 'none';
  dom.viewMatrix.style.display = tabName === 'matrix' ? 'block' : 'none';
  dom.viewImage.style.display = tabName === 'image' ? 'block' : 'none';
}

/**
 * イベントリスナーのセットアップ
 */
function setupEventListeners() {
  dom.tabWizardBtn.addEventListener('click', () => switchTab('wizard'));
  dom.tabMatrixBtn.addEventListener('click', () => switchTab('matrix'));
  dom.tabImageBtn.addEventListener('click', () => switchTab('image'));

  // Step 1: Axis
  dom.optAxis.addEventListener('click', (e) => {
    const btn = e.target.closest('.opt-btn');
    if (!btn) return;
    appState.axis = btn.dataset.value;
    updateButtonGroup(dom.optAxis, appState.axis);
    runAnalysis();
  });

  // Step 2: V1
  dom.optV1.addEventListener('click', (e) => {
    const btn = e.target.closest('.opt-btn');
    if (!btn) return;
    appState.v1Pattern = btn.dataset.value;
    updateButtonGroup(dom.optV1, appState.v1Pattern);
    runAnalysis();
  });

  // Step 3: Transition
  dom.optTransition.addEventListener('click', (e) => {
    const btn = e.target.closest('.trans-btn');
    if (!btn) return;
    appState.transition = btn.dataset.value;
    dom.optTransition.querySelectorAll('.trans-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    runAnalysis();
  });

  // Step 4: Lead 1
  dom.optLead1.addEventListener('click', (e) => {
    const btn = e.target.closest('.opt-btn');
    if (!btn) return;
    appState.lead1 = btn.dataset.value;
    updateButtonGroup(dom.optLead1, appState.lead1);
    runAnalysis();
  });

  // Step 5: Sliders
  dom.inputV2sV3r.addEventListener('input', (e) => {
    appState.v2s_v3r_ratio = parseFloat(e.target.value);
    dom.valV2sV3r.textContent = appState.v2s_v3r_ratio;
    runAnalysis();
  });

  dom.inputV2Ratio.addEventListener('input', (e) => {
    appState.v2_trans_ratio = parseFloat(e.target.value);
    dom.valV2Ratio.textContent = Number(appState.v2_trans_ratio).toFixed(2);
    runAnalysis();
  });

  dom.inputMdi.addEventListener('input', (e) => {
    appState.mdi = parseFloat(e.target.value);
    dom.valMdi.textContent = Number(appState.mdi).toFixed(2);
    runAnalysis();
  });

  dom.inputQrs.addEventListener('input', (e) => {
    appState.qrsDuration = parseInt(e.target.value, 10);
    dom.valQrs.textContent = `${appState.qrsDuration} ms`;
    runAnalysis();
  });

  // 精密鑑別指標の図解・解説クリックイベント
  document.querySelectorAll('.slider-header-clickable').forEach(header => {
    header.addEventListener('click', () => {
      const metricId = header.dataset.metric;
      if (metricId && METRIC_EXPLANATIONS[metricId]) {
        showMetricExplanationModal(METRIC_EXPLANATIONS[metricId]);
      }
    });
  });

  // リセットボタン
  dom.btnReset.addEventListener('click', () => {
    appState = JSON.parse(JSON.stringify(defaultState));
    syncControlsWithState();
    renderMatrix();
    runAnalysis();
  });

  // 医療免責事項の確認モーダル
  if (dom.btnShowDisclaimer) {
    dom.btnShowDisclaimer.addEventListener('click', () => {
      showDisclaimerModal();
    });
  }

  // モーダル
  dom.btnShowAlgorithm.addEventListener('click', () => {
    showFullLiteratureModal();
  });

  dom.modalCloseBtn.addEventListener('click', () => {
    dom.algorithmModal.classList.remove('open');
  });

  dom.algorithmModal.addEventListener('click', (e) => {
    if (e.target === dom.algorithmModal) {
      dom.algorithmModal.classList.remove('open');
    }
  });
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
  dom.winnerProb.innerHTML = `${winner.probability}<span>%</span>`;
  dom.winnerNameJa.textContent = winner.nameJa;
  dom.winnerNameEn.textContent = `${winner.nameEn} / ${winner.category}`;
  dom.winnerFeatures.textContent = winner.keyFeatures;

  // アブレーション注意点
  dom.ablationTipText.textContent = winner.ablationTips;

  // 3. 鑑別候補ランキング (Rank 2 & 3)
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

  // 4. 診断推論ステップ (Reasoning Timeline)
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

  // 5. 心内膜 vs 心外膜 鑑別診断パネルの更新
  if (result.endoVsEpi) {
    renderEndoVsEpi(result.endoVsEpi);
  }

  // 5. 診断根拠となる参考論文＆日本語サマリーのレンダリング
  renderLiteratureForWinner(winner.id);
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

  // 典型12誘導心電図グリッドの描画
  if (dom.citationEcgGrid && preset.params && preset.params.leads) {
    dom.citationEcgGrid.innerHTML = '';
    const leadOrder = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
    leadOrder.forEach(leadName => {
      const leadData = preset.params.leads[leadName] || { pattern: 'R', amp: 1.0 };
      const leadBox = document.createElement('div');
      leadBox.className = 'citation-lead-box';
      leadBox.innerHTML = generateEcgSvg(leadName, leadData.pattern, leadData.amp, false);
      dom.citationEcgGrid.appendChild(leadBox);
    });
  }

  // 論文解説（メカニズム・見落とし防止・アブレーション戦略）
  if (dom.citationInsightsContainer && preset.clinicalInsights) {
    const ci = preset.clinicalInsights;
    dom.citationInsightsContainer.innerHTML = `
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
    dom.endoEpiVerdictBadge.className = `endo-epi-verdict-badge ${data.layer === 'epicardial' ? 'epi' : (data.layer === 'endocardial' ? '' : 'borderline')}`;
  }

  // 3. 適合した論文基準リスト
  if (dom.endoEpiCriteria) {
    dom.endoEpiCriteria.innerHTML = '';
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
  }
}

// DOM構築完了後に起動
document.addEventListener('DOMContentLoaded', init);
