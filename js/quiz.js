/**
 * CardioOrigin - PVC 12誘導心電図クイズゲーム ロジックモジュール
 */

import { PRESETS } from './presets.js';
import { SITE_DEFINITIONS } from './algorithm.js';
import { generateEcgSvg } from './ecg-draw.js';

export class QuizGame {
  constructor() {
    this.totalQuestions = 10;
    this.currentStep = 0;
    this.score = 0;
    this.correctCount = 0;
    this.questions = [];
    this.currentQuestion = null;
    this.answered = false;
    this.currentLayout = 'standard'; // 'standard' | 'cabrera'

    this.initElements();
    this.initEvents();
    this.startNewGame();
  }

  initElements() {
    this.elProgressFill = document.getElementById('quiz-progress-fill');
    this.elStepIndicator = document.getElementById('quiz-step-indicator');
    this.elCorrectCount = document.getElementById('quiz-correct-count');
    this.elScorePts = document.getElementById('quiz-score-pts');
    this.elEcgContainer = document.getElementById('quiz-ecg-container');
    this.elOptionsContainer = document.getElementById('quiz-options-container');
    this.elExplanationCard = document.getElementById('quiz-explanation-card');
    this.elResultBanner = document.getElementById('quiz-result-banner');
    this.elExplanationBody = document.getElementById('quiz-explanation-body');
    this.elNextBtn = document.getElementById('quiz-next-btn');

    // モーダル要素
    this.elSummaryModal = document.getElementById('quiz-summary-modal');
    this.elSummaryScoreNum = document.getElementById('summary-score-num');
    this.elSummaryRankBadge = document.getElementById('summary-rank-badge');
    this.elSummaryFeedbackMsg = document.getElementById('summary-feedback-msg');
    this.elBtnRestart = document.getElementById('quiz-btn-restart');

    // 配列ボタン
    this.btnStandard = document.getElementById('quiz-btn-standard');
    this.btnCabrera = document.getElementById('quiz-btn-cabrera');
  }

  initEvents() {
    if (this.btnStandard) {
      this.btnStandard.addEventListener('click', () => {
        this.currentLayout = 'standard';
        this.btnStandard.classList.add('active');
        this.btnCabrera.classList.remove('active');
        this.renderCurrentECG();
      });
    }

    if (this.btnCabrera) {
      this.btnCabrera.addEventListener('click', () => {
        this.currentLayout = 'cabrera';
        this.btnCabrera.classList.add('active');
        this.btnStandard.classList.remove('active');
        this.renderCurrentECG();
      });
    }

    if (this.elNextBtn) {
      this.elNextBtn.addEventListener('click', () => {
        this.nextQuestion();
      });
    }

    if (this.elBtnRestart) {
      this.elBtnRestart.addEventListener('click', () => {
        this.elSummaryModal.classList.remove('active');
        this.startNewGame();
      });
    }
  }

  /**
   * ゲームの初期化 ＆ 10問をランダム抽出
   */
  startNewGame() {
    this.currentStep = 0;
    this.score = 0;
    this.correctCount = 0;
    this.answered = false;

    // PRESETS 配列から 10問選出
    const shuffledPresets = this.shuffleArray([...PRESETS]);
    const selectedPresets = shuffledPresets.slice(0, this.totalQuestions);

    this.questions = selectedPresets.map(preset => {
      const correctSiteId = preset.id;
      const correctSite = SITE_DEFINITIONS[correctSiteId] || {};
      const correctName = correctSite.nameJa || correctSite.name || preset.name;
      const correctSub = correctSite.category || preset.category || '';

      const otherSiteIds = Object.keys(SITE_DEFINITIONS).filter(id => id !== correctSiteId);
      const shuffledOthers = this.shuffleArray([...otherSiteIds]);
      const dummySiteIds = shuffledOthers.slice(0, 3);

      const options = this.shuffleArray([
        { id: correctSiteId, name: correctName, sub: correctSub, isCorrect: true },
        ...dummySiteIds.map(id => {
          const s = SITE_DEFINITIONS[id] || {};
          return {
            id: id,
            name: s.nameJa || s.name || id,
            sub: s.category || '',
            isCorrect: false
          };
        })
      ]);

      return {
        key: preset.id,
        preset: preset,
        correctSiteId: correctSiteId,
        correctSite: { name: correctName, subName: correctSub },
        options: options
      };
    });

    this.updateUI();
    this.loadQuestion();
  }

  loadQuestion() {
    this.answered = false;
    this.currentQuestion = this.questions[this.currentStep];

    if (this.elExplanationCard) this.elExplanationCard.classList.remove('active');

    this.renderCurrentECG();
    this.renderOptions();

    const pct = ((this.currentStep + 1) / this.totalQuestions) * 100;
    if (this.elProgressFill) this.elProgressFill.style.width = `${pct}%`;
    if (this.elStepIndicator) this.elStepIndicator.textContent = `QUESTION ${this.currentStep + 1} / ${this.totalQuestions}`;
  }

  renderCurrentECG() {
    if (!this.currentQuestion || !this.elEcgContainer) return;
    const preset = this.currentQuestion.preset;
    this.renderECGGrid(this.elEcgContainer, preset, this.currentLayout);
  }

  renderOptions() {
    if (!this.currentQuestion || !this.elOptionsContainer) return;

    this.elOptionsContainer.innerHTML = '';

    this.currentQuestion.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span><strong style="color:#38bdf8;">${['A', 'B', 'C', 'D'][idx]}.</strong> ${opt.name}</span>
        <span style="font-size:11px; color:#94a3b8; display:block; margin-top:2px;">${opt.sub || ''}</span>
      `;

      btn.addEventListener('click', () => {
        if (this.answered) return;
        this.handleAnswer(opt, btn);
      });

      this.elOptionsContainer.appendChild(btn);
    });
  }

  handleAnswer(selectedOpt, btnElement) {
    this.answered = true;
    const isCorrect = selectedOpt.isCorrect;

    const allBtns = this.elOptionsContainer ? this.elOptionsContainer.querySelectorAll('.quiz-opt-btn') : [];
    allBtns.forEach((b, idx) => {
      b.disabled = true;
      const optData = this.currentQuestion.options[idx];
      if (optData.isCorrect) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      this.correctCount++;
      this.score += 100;
      if (this.elResultBanner) {
        this.elResultBanner.className = 'quiz-result-banner correct';
        this.elResultBanner.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          正解！ (CORRECT +100pts)
        `;
      }
    } else {
      if (btnElement) btnElement.classList.add('wrong');
      if (this.elResultBanner) {
        this.elResultBanner.className = 'quiz-result-banner wrong';
        this.elResultBanner.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          不正解... (INCORRECT)
        `;
      }
    }

    this.updateUI();
    this.renderExplanation();
    if (this.elExplanationCard) this.elExplanationCard.classList.add('active');
  }

  renderExplanation() {
    if (!this.elExplanationBody) return;
    const q = this.currentQuestion;
    const preset = q.preset;
    const correctSite = q.correctSite;
    const ci = preset.clinicalInsights || {};

    const features = ci.ecgKeyPoints || [
      `I誘導・aVL誘導および下誘導(II, III, aVF)のQRS極性が${correctSite.name}の典型パターンを示します。`,
      `胸部誘導(V1〜V6)のR/S移行帯が特徴的です。`
    ];
    const pitfalls = ci.pitfalls || '隣接する解剖部位とのQRS幅および初期振幅比の慎重な比較が重要です。';
    const ablation = ci.ablationStrategy || '通電時はヒス束伝導系や冠動脈、大静脈心外膜への安全マージンを確認して治療を行います。';

    this.elExplanationBody.innerHTML = `
      <div style="margin-bottom: 12px;">
        <span style="background:rgba(16,185,129,0.25); color:#a7f3d0; border:1px solid #10b981; font-size:13px; font-weight:800; padding:4px 10px; border-radius:6px; display:inline-block;">
          正解: ${correctSite.name} (${preset.category || ''})
        </span>
      </div>

      <h4 style="color:#38bdf8; margin:10px 0 4px 0; font-size:13px;">⚡ 12誘導心電図の特徴・ロジック</h4>
      <ul style="margin:4px 0 10px 0; padding-left:18px; font-size:12px; color:#cbd5e1; line-height:1.5;">
        ${features.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <h4 style="color:#f59e0b; margin:10px 0 4px 0; font-size:13px;">💡 鑑別診断のコツ</h4>
      <p style="margin:0 0 10px 0; font-size:12px; color:#cbd5e1; line-height:1.5;">${pitfalls}</p>

      <h4 style="color:#10b981; margin:10px 0 4px 0; font-size:13px;">🎯 カテーテルアブレーション戦略</h4>
      <p style="margin:0; font-size:12px; color:#a7f3d0; line-height:1.5;">${ablation}</p>
    `;
  }

  nextQuestion() {
    this.currentStep++;
    if (this.currentStep >= this.totalQuestions) {
      this.showSummaryModal();
    } else {
      this.loadQuestion();
    }
  }

  showSummaryModal() {
    const pct = Math.round((this.correctCount / this.totalQuestions) * 100);
    if (this.elSummaryScoreNum) this.elSummaryScoreNum.textContent = `${this.correctCount} / ${this.totalQuestions}`;

    let rank = 'EP RESIDENT';
    let msg = '継続的な心電図トレースの学習を重ねることで、さらに局在診断精度が高まります。';

    if (pct >= 90) {
      rank = 'EP MASTER (最優秀局在診断医)';
      msg = '素晴らしい解読力です！流出路・弁輪部・乳頭筋起源の全波形特徴を完璧にマスターしています！';
    } else if (pct >= 70) {
      rank = 'EP SPECIALIST (専門医クラス)';
      msg = '高い判定精度です。主要な起源部位の波形識別が的確に行われています。';
    }

    if (this.elSummaryRankBadge) this.elSummaryRankBadge.textContent = rank;
    if (this.elSummaryFeedbackMsg) this.elSummaryFeedbackMsg.textContent = msg;

    if (this.elSummaryModal) this.elSummaryModal.classList.add('active');
  }

  updateUI() {
    if (this.elCorrectCount) this.elCorrectCount.textContent = this.correctCount;
    if (this.elScorePts) this.elScorePts.textContent = this.score;
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  renderECGGrid(container, preset, layout) {
    const leadsOrder = layout === 'cabrera'
      ? ['aVL', 'I', '-aVR', 'II', 'aVF', 'III', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
      : ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

    const derivedLeads = this.deriveLeadsFromPreset(preset);

    let html = `
      <div class="ecg-grid-layout" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; background:#060a14; padding:12px; border-radius:8px; border:1px solid rgba(56,189,248,0.25);">
        <div class="limb-leads-col">
          <div style="font-size:11px; font-weight:700; color:#38bdf8; margin-bottom:6px;">肢誘導 (Limb Leads)</div>
    `;

    const limbLeads = leadsOrder.slice(0, 6);
    limbLeads.forEach(leadName => {
      const key = leadName === '-aVR' ? 'aVR' : leadName;
      const leadConfig = derivedLeads[key] || { pattern: 'R', amp: 1.0 };
      
      let pat = leadConfig.pattern || leadConfig.pol || 'R';
      if (leadName === '-aVR') {
        if (pat === 'QS') pat = 'R';
        else if (pat === 'R') pat = 'QS';
        else if (pat === 'rS') pat = 'Rs';
        else if (pat === 'Rs') pat = 'rS';
      }
      const amp = Math.abs(leadConfig.amp || 1.0);

      // ecg-draw.js の本格SVGレンダラーを呼び出し
      const svgCode = generateEcgSvg(leadName, pat, amp, false, true, 1.0, '');
      html += `<div style="margin-bottom:6px;">${svgCode}</div>`;
    });

    html += `
        </div>
        <div class="chest-leads-col">
          <div style="font-size:11px; font-weight:700; color:#38bdf8; margin-bottom:6px;">胸部誘導 (Chest Leads)</div>
    `;

    const chestLeads = leadsOrder.slice(6, 12);
    chestLeads.forEach(leadName => {
      const leadConfig = derivedLeads[leadName] || { pattern: 'QS', amp: 1.0 };
      const pat = leadConfig.pattern || leadConfig.pol || 'QS';
      const amp = Math.abs(leadConfig.amp || 1.0);

      const svgCode = generateEcgSvg(leadName, pat, amp, false, true, 1.0, '');
      html += `<div style="margin-bottom:6px;">${svgCode}</div>`;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * PRESETのパラメータからリアルな12誘導波形オブジェクトを自動生成
   */
  deriveLeadsFromPreset(preset) {
    if (preset.params && preset.params.leads) {
      return preset.params.leads;
    }

    const p = (preset && preset.params) ? preset.params : {};
    const axis = p.axis || 'inferior';
    const v1Pat = p.v1Pattern || 'lbbb_qs';
    const trans = p.transition || 'V4';
    const l1 = p.lead1 || 'positive';
    const lAvl = p.leadAVL || 'negative_shallow';
    const hasNotch = !!p.hasNotch;

    const leads = {};

    // 1. 肢誘導の極性設定
    if (axis === 'inferior') {
      leads.II = { pattern: hasNotch ? 'Notched_R' : 'R', amp: 2.2 };
      leads.III = { pattern: hasNotch ? 'Notched_R' : 'R', amp: 1.9 };
      leads.aVF = { pattern: hasNotch ? 'Notched_R' : 'R', amp: 2.1 };
      leads.aVR = { pattern: 'QS', amp: -1.6 };
    } else if (axis === 'superior') {
      leads.II = { pattern: 'rS', amp: -1.8 };
      leads.III = { pattern: 'QS', amp: -2.2 };
      leads.aVF = { pattern: 'rS', amp: -2.0 };
      leads.aVR = { pattern: 'R', amp: 1.5 };
    } else {
      leads.II = { pattern: 'Rs', amp: 1.4 };
      leads.III = { pattern: 'rS', amp: -1.0 };
      leads.aVF = { pattern: 'R', amp: 1.2 };
      leads.aVR = { pattern: 'QS', amp: -1.2 };
    }

    // Lead I
    if (l1 === 'positive') {
      leads.I = { pattern: 'R', amp: 1.0 };
    } else if (l1 === 'negative' || l1 === 'qs') {
      leads.I = { pattern: 'QS', amp: -1.2 };
    } else {
      leads.I = { pattern: 'Rs', amp: 0.6 };
    }

    // Lead aVL
    if (lAvl === 'deep_qs') {
      leads.aVL = { pattern: 'QS', amp: -1.6 };
    } else if (lAvl === 'positive') {
      leads.aVL = { pattern: 'R', amp: 1.2 };
    } else {
      leads.aVL = { pattern: 'rS', amp: -0.5 };
    }

    // 2. 胸部誘導の極性設定 (V1〜V6)
    if (v1Pat === 'rbbb') {
      leads.V1 = { pattern: 'rsR', amp: 1.8 };
    } else if (v1Pat === 'qr') {
      leads.V1 = { pattern: 'qR', amp: 1.5 };
    } else if (v1Pat === 'rS') {
      leads.V1 = { pattern: 'rS', amp: -1.2 };
    } else {
      leads.V1 = { pattern: 'QS', amp: -1.8 };
    }

    const chestNames = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
    const transIdx = chestNames.indexOf(trans) >= 0 ? chestNames.indexOf(trans) : 3;

    chestNames.forEach((cName, idx) => {
      if (cName === 'V1') return;

      if (idx < transIdx) {
        if (v1Pat === 'rbbb' || v1Pat === 'qr') {
          leads[cName] = { pattern: 'Rs', amp: 1.5 - idx * 0.2 };
        } else {
          leads[cName] = { pattern: idx === transIdx - 1 ? 'rS' : 'QS', amp: -1.8 + idx * 0.3 };
        }
      } else if (idx === transIdx) {
        leads[cName] = { pattern: 'Rs', amp: 1.4 };
      } else {
        leads[cName] = { pattern: 'R', amp: 1.8 - (idx - transIdx) * 0.2 };
      }
    });

    return leads;
  }
}

// ドムロード完了時または即時実行でクイズゲームを開始
function bootQuiz() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  try {
    window.quizInstance = new QuizGame();
    console.log('QuizGame initialized successfully!');
  } catch(e) {
    console.error('Failed to boot QuizGame:', e);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootQuiz);
  } else {
    bootQuiz();
  }
}
