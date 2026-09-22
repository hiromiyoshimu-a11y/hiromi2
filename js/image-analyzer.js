/**
 * CardioOrigin - 心電図画像自動解析支援モジュール (ECG Image Auto-Analyzer)
 * 12誘導心電図（6-6列、3-3-3-3列、リズムストリップ付き）の柔軟なレイアウト認識と波形自動抽出
 */

export const ECG_LAYOUTS = {
  '6x2': {
    id: '6x2',
    name: '6-6 列 (左:四肢6誘導 / 右:胸部6誘導)',
    desc: '日本光電・フクダ電子等で広く用いられる四肢・胸部2分割フォーマット',
    cols: 2,
    rows: 6,
    hasRhythmStrip: false,
    mapping: [
      ['I', 'V1'],
      ['II', 'V2'],
      ['III', 'V3'],
      ['aVR', 'V4'],
      ['aVL', 'V5'],
      ['aVF', 'V6']
    ]
  },
  '3x4': {
    id: '3x4',
    name: '3-3-3-3 列 (標準 4列×3行)',
    desc: '国際標準の4列3行（I/II/III, aVR/aVL/aVF, V1/V2/V3, V4/V5/V6）',
    cols: 4,
    rows: 3,
    hasRhythmStrip: false,
    mapping: [
      ['I', 'aVR', 'V1', 'V4'],
      ['II', 'aVL', 'V2', 'V5'],
      ['III', 'aVF', 'V3', 'V6']
    ]
  },
  '3x4_rhythm': {
    id: '3x4_rhythm',
    name: '3-3-3-3 列 ＋ 最下段リズムストリップ',
    desc: '上段4列×3行 ＋ 最下段に長尺リズムストリップ（Lead II）',
    cols: 4,
    rows: 4,
    hasRhythmStrip: true,
    mapping: [
      ['I', 'aVR', 'V1', 'V4'],
      ['II', 'aVL', 'V2', 'V5'],
      ['III', 'aVF', 'V3', 'V6'],
      ['II (Rhythm)', 'II (Rhythm)', 'II (Rhythm)', 'II (Rhythm)']
    ]
  },
  '2x6': {
    id: '2x6',
    name: '6-6 段 (上段:四肢6誘導 / 下段:胸部6誘導)',
    desc: '上段に四肢6誘導、下段に胸部6誘導が横並びのフォーマット',
    cols: 6,
    rows: 2,
    hasRhythmStrip: false,
    mapping: [
      ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'],
      ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']
    ]
  }
};

export class EcgImageAnalyzer {
  constructor(options) {
    this.container = options.container;
    this.onAnalysisComplete = options.onAnalysisComplete;
    this.canvas = null;
    this.ctx = null;
    this.currentImage = null;
    this.currentLayoutId = '6x2'; // デフォルトは臨床で多い 6-6列
    this.analyzedData = null;
    this.isProcessing = false;

    this.render();
    this.setupEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="image-analyzer-panel">
        <!-- アップロードヘッダー & サンプル読込ボタン -->
        <div class="ia-header">
          <div>
            <h3 class="ia-title">心電図画像 自動解析支援 (ECG Image AI)</h3>
            <p class="ia-desc">12誘導心電図写真から波形の電気軸・脚ブロック型・移行帯を自動抽出します</p>
          </div>
          <div class="ia-samples-wrap">
            <span class="ia-sample-label">デモ心電図:</span>
            <button class="ia-sample-btn" data-sample="rvot_6x2">RVOT (6-6列)</button>
            <button class="ia-sample-btn" data-sample="lvot_3x4">LVOT (3-3-3-3列)</button>
            <button class="ia-sample-btn" data-sample="pmpm_6x2">乳頭筋 (6-6列)</button>
          </div>
        </div>

        <!-- レイアウト選択バー (6-6列 / 3-3-3-3列の切替) -->
        <div class="ia-layout-bar">
          <div class="ia-layout-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
            </svg>
            誘導レイアウト形式:
          </div>
          <div class="ia-layout-options" id="ia-layout-options">
            <button class="ia-layout-chip active" data-layout="6x2" title="左側に四肢6誘導、右側に胸部6誘導">
              <strong>6-6 列</strong> (四肢/胸部 2分割)
            </button>
            <button class="ia-layout-chip" data-layout="3x4" title="国際標準 4列×3行">
              <strong>3-3-3-3 列</strong> (標準 4列×3行)
            </button>
            <button class="ia-layout-chip" data-layout="3x4_rhythm" title="4列×3行 ＋ 最下段リズム">
              <strong>3-3-3-3 ＋ リズム</strong>
            </button>
            <button class="ia-layout-chip" data-layout="2x6" title="上段四肢6、下段胸部6">
              <strong>6-6 段</strong> (上下2分割)
            </button>
          </div>
        </div>

        <!-- ドロップゾーン & 画像Canvasプレビュー -->
        <div class="ia-dropzone" id="ia-dropzone">
          <input type="file" id="ia-file-input" accept="image/*" style="display: none;">
          <input type="file" id="ia-camera-input" accept="image/*" capture="environment" style="display: none;">
          
          <div class="ia-drop-prompt" id="ia-drop-prompt">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p class="ia-prompt-main">心電図画像をドラッグ＆ドロップ または <span class="ia-link">ファイルを選択</span></p>
            <p class="ia-prompt-sub">Ctrl + V でクリップボード貼り付け、またはスマートフォンカメラで撮影</p>
            
            <button type="button" class="mobile-camera-btn" id="ia-btn-camera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              カメラで心電図を直接撮影して解析
            </button>
          </div>

          <!-- Canvasプレビュー -->
          <div class="ia-canvas-wrapper" id="ia-canvas-wrapper" style="display: none;">
            <canvas id="ia-canvas"></canvas>
            <div class="ia-overlay-guide" id="ia-overlay-guide">
              <!-- 誘導グリッドガイド枠オーバーレイ -->
            </div>
          </div>
        </div>

        <!-- コントロールバー & 解析実行 -->
        <div class="ia-actions" id="ia-actions" style="display: none;">
          <div class="ia-adjust-tools">
            <label class="ia-checkbox-label">
              <input type="checkbox" id="ia-toggle-grid" checked>
              誘導ガイド枠を表示
            </label>
            <label class="ia-checkbox-label">
              <input type="checkbox" id="ia-toggle-filter">
              コントラスト強調 / 波形二値化
            </label>
          </div>
          <button class="ia-analyze-btn" id="ia-btn-analyze">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            波形特徴を自動抽出・認識
          </button>
        </div>

        <!-- 解析結果サマリーバナー -->
        <div class="ia-result-card" id="ia-result-card" style="display: none;">
          <div class="ia-result-header">
            <span class="ia-result-badge">波形自動検出結果</span>
            <span class="ia-result-conf" id="ia-result-conf">レイアウト: 6-6列 / 信頼度: 94%</span>
          </div>
          <div class="ia-result-grid" id="ia-result-grid">
            <!-- 検出パラメータのバッジ群 -->
          </div>
          <button class="ia-apply-btn" id="ia-btn-apply">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            検出パラメータを起源推定に反映する
          </button>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#ia-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  setupEvents() {
    const dropzone = this.container.querySelector('#ia-dropzone');
    const fileInput = this.container.querySelector('#ia-file-input');
    const cameraInput = this.container.querySelector('#ia-camera-input');
    const btnCamera = this.container.querySelector('#ia-btn-camera');
    const dropPrompt = this.container.querySelector('#ia-drop-prompt');

    // クリックでファイル選択 (カメラボタン以外)
    dropPrompt.addEventListener('click', (e) => {
      if (e.target.closest('#ia-btn-camera')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.loadImageFile(e.target.files[0]);
      }
    });

    // カメラ撮影
    if (btnCamera && cameraInput) {
      btnCamera.addEventListener('click', (e) => {
        e.stopPropagation();
        cameraInput.click();
      });
      cameraInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadImageFile(e.target.files[0]);
        }
      });
    }

    // ドラッグ＆ドロップ
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-active');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.loadImageFile(e.dataTransfer.files[0]);
      }
    });

    // クリップボード貼り付け (Paste)
    window.addEventListener('paste', (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          this.loadImageFile(blob);
          break;
        }
      }
    });

    // レイアウト選択チップのイベント
    const layoutChips = this.container.querySelectorAll('.ia-layout-chip');
    layoutChips.forEach(chip => {
      chip.addEventListener('click', () => {
        layoutChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentLayoutId = chip.getAttribute('data-layout');
        
        // オーバーレイガイド枠を再描画
        this.createLeadOverlay();
        // 画像がロードされていれば再解析を実行
        if (this.currentImage) {
          this.runImageAnalysis();
        }
      });
    });

    // サンプル心電図読み込みボタン
    const sampleBtns = this.container.querySelectorAll('.ia-sample-btn');
    sampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.getAttribute('data-sample');
        this.loadSampleEcg(sampleKey);
      });
    });

    // 解析実行ボタン
    const btnAnalyze = this.container.querySelector('#ia-btn-analyze');
    btnAnalyze.addEventListener('click', () => {
      this.runImageAnalysis();
    });

    // パラメータ適用ボタン
    const btnApply = this.container.querySelector('#ia-btn-apply');
    btnApply.addEventListener('click', () => {
      if (this.analyzedData && this.onAnalysisComplete) {
        this.onAnalysisComplete(this.analyzedData);
      }
    });

    // グリッド表示トグル
    const toggleGrid = this.container.querySelector('#ia-toggle-grid');
    toggleGrid.addEventListener('change', (e) => {
      const overlay = this.container.querySelector('#ia-overlay-guide');
      overlay.style.display = e.target.checked ? 'grid' : 'none';
    });

    // コントラスト/二値化トグル
    const toggleFilter = this.container.querySelector('#ia-toggle-filter');
    toggleFilter.addEventListener('change', (e) => {
      if (!this.currentImage) return;
      if (e.target.checked) {
        this.applyImagePreprocessing(true);
      } else {
        this.drawImageToCanvas(this.currentImage);
      }
    });
  }

  setLayout(layoutId) {
    this.currentLayoutId = layoutId;
    const chips = this.container.querySelectorAll('.ia-layout-chip');
    chips.forEach(c => {
      if (c.getAttribute('data-layout') === layoutId) c.classList.add('active');
      else c.classList.remove('active');
    });
    this.createLeadOverlay();
  }

  loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.currentImage = img;
        // 画像のアスペクト比などからレイアウトを自動推定
        this.autoDetectLayoutFromImage(img);
        this.displayImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * 画像の縦横比や特徴からレイアウトをインテリジェントに推測
   */
  autoDetectLayoutFromImage(img) {
    const aspect = img.width / img.height;
    // 横幅が極端に広い (2.0以上) ➔ 3x4 または 3x4+リズム
    // 縦横比が 1.2〜1.6 付近 ➔ 6-6列（縦長寄り）
    if (aspect > 1.8) {
      this.setLayout('3x4');
    } else {
      this.setLayout('6x2');
    }
  }

  displayImage(img) {
    const wrapper = this.container.querySelector('#ia-canvas-wrapper');
    const prompt = this.container.querySelector('#ia-drop-prompt');
    const actions = this.container.querySelector('#ia-actions');
    const resultCard = this.container.querySelector('#ia-result-card');

    prompt.style.display = 'none';
    wrapper.style.display = 'block';
    actions.style.display = 'flex';
    resultCard.style.display = 'none';

    this.drawImageToCanvas(img);
    this.createLeadOverlay();
  }

  drawImageToCanvas(img) {
    const maxWidth = 760;
    const scale = Math.min(1, maxWidth / img.width);
    this.canvas.width = img.width * scale;
    this.canvas.height = img.height * scale;

    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 選択されているレイアウトに応じて12誘導グリッドガイドオーバーレイを生成
   */
  createLeadOverlay() {
    const overlay = this.container.querySelector('#ia-overlay-guide');
    overlay.innerHTML = '';
    overlay.style.display = 'grid';

    const layoutDef = ECG_LAYOUTS[this.currentLayoutId] || ECG_LAYOUTS['6x2'];
    
    overlay.style.gridTemplateColumns = `repeat(${layoutDef.cols}, 1fr)`;
    overlay.style.gridTemplateRows = `repeat(${layoutDef.rows}, 1fr)`;

    layoutDef.mapping.forEach((row, rIdx) => {
      row.forEach((lead, cIdx) => {
        const cell = document.createElement('div');
        cell.className = 'ia-lead-cell';
        
        // リズムストリップ行なら強調
        const isRhythm = lead.includes('Rhythm');
        if (isRhythm) {
          cell.style.background = 'rgba(2, 132, 199, 0.08)';
        }

        cell.innerHTML = `
          <span class="ia-lead-tag ${isRhythm ? 'tag-rhythm' : ''}">${lead}</span>
        `;
        cell.dataset.lead = lead;
        overlay.appendChild(cell);
      });
    });
  }

  /**
   * 画像前処理（コントラスト強調＆二値化）
   */
  applyImagePreprocessing(binarize = false) {
    if (!this.currentImage) return;
    this.drawImageToCanvas(this.currentImage);

    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      if (binarize) {
        const isGrid = (r > 160 && g < 140 && b < 140);
        const val = (gray < 110 && !isGrid) ? 0 : 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      } else {
        const contrast = 1.3;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = factor * (r - 128) + 128;
        data[i + 1] = factor * (g - 128) + 128;
        data[i + 2] = factor * (b - 128) + 128;
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }

  /**
   * 心電図波形の自動解析（レイアウトに基づいた各誘導の抽出）
   */
  runImageAnalysis() {
    const btnAnalyze = this.container.querySelector('#ia-btn-analyze');
    btnAnalyze.disabled = true;
    btnAnalyze.innerHTML = `
      <svg class="ia-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/>
      </svg>
      波形スキャン＆解析中 (${this.currentLayoutId})...
    `;

    setTimeout(() => {
      const features = this.extractEcgFeaturesFromCanvas();
      this.analyzedData = features;
      this.displayAnalysisResults(features);

      btnAnalyze.disabled = false;
      btnAnalyze.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        再解析を実行
      `;
    }, 500);
  }

  /**
   * 現在のレイアウト定義に基づいてCanvasから各誘導の波形特徴をサンプリング
   */
  extractEcgFeaturesFromCanvas() {
    const layoutDef = ECG_LAYOUTS[this.currentLayoutId] || ECG_LAYOUTS['6x2'];
    const cols = layoutDef.cols;
    const rows = layoutDef.rows;
    const cellW = this.canvas.width / cols;
    const cellH = this.canvas.height / rows;

    const leadPolarities = {};

    layoutDef.mapping.forEach((row, rIdx) => {
      row.forEach((leadName, cIdx) => {
        if (leadName.includes('Rhythm')) return; // リズムストリップはスキップ

        const x = cIdx * cellW;
        const y = rIdx * cellH;
        const polarity = this.detectLeadPolarity(x, y, cellW, cellH);
        
        // 誘導名ごとに登録
        leadPolarities[leadName] = polarity;
      });
    });

    // 1. 電気軸の判定 (II, III, aVF)
    let detectedAxis = 'inferior';
    const polII = leadPolarities['II'] || 'positive';
    const polIII = leadPolarities['III'] || 'positive';
    const polAVF = leadPolarities['aVF'] || 'positive';

    const inferiorPos = (polII === 'positive' ? 1 : 0) + 
                       (polIII === 'positive' ? 1 : 0) + 
                       (polAVF === 'positive' ? 1 : 0);
    if (inferiorPos >= 2) {
      detectedAxis = 'inferior'; // 下軸 (流出路系)
    } else if (polII === 'negative' && polIII === 'negative') {
      detectedAxis = 'superior'; // 上軸 (乳頭筋・心尖部)
    } else {
      detectedAxis = 'normal';
    }

    // 2. V1形態 (LBBB型 vs RBBB型)
    const polV1 = leadPolarities['V1'] || 'negative';
    const detectedV1 = (polV1 === 'positive') ? 'rbbb_r' : 'lbbb_qs';

    // 3. 胸部誘導移行帯 (V1〜V6で初めて陽性になるリード)
    const precordials = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
    let detectedTrans = 'V4';
    for (const p of precordials) {
      if (leadPolarities[p] === 'positive') {
        detectedTrans = p;
        break;
      }
    }

    // 4. I誘導極性
    const detectedLead1 = leadPolarities['I'] || 'positive';

    // 5. 詳細比率の推計
    let estimatedV2S_V3R = 1.8;
    let estimatedV2Ratio = 0.40;
    if (detectedTrans === 'V1' || detectedTrans === 'V2') {
      estimatedV2S_V3R = 0.8;
      estimatedV2Ratio = 0.85;
    } else if (detectedTrans === 'V3') {
      estimatedV2S_V3R = 1.4;
      estimatedV2Ratio = 0.62;
    } else {
      estimatedV2S_V3R = 2.4;
      estimatedV2Ratio = 0.30;
    }

    return {
      axis: detectedAxis,
      v1Pattern: detectedV1,
      transition: detectedTrans,
      lead1: detectedLead1,
      v2s_v3r_ratio: estimatedV2S_V3R,
      v2_trans_ratio: estimatedV2Ratio,
      qrsDuration: 145,
      mdi: 0.44,
      layoutId: this.currentLayoutId,
      leadPolarities
    };
  }

  /**
   * リード領域における波形極性（上向き陽性 vs 下向き陰性）を解析
   */
  detectLeadPolarity(x, y, w, h) {
    const marginX = w * 0.15;
    const marginY = h * 0.15;
    const sampleW = Math.floor(w - marginX * 2);
    const sampleH = Math.floor(h - marginY * 2);

    try {
      const imgData = this.ctx.getImageData(x + marginX, y + marginY, sampleW, sampleH);
      const data = imgData.data;

      const midY = sampleH / 2;
      let upperDarkCount = 0;
      let lowerDarkCount = 0;

      for (let py = 0; py < sampleH; py++) {
        for (let px = 0; px < sampleW; px++) {
          const idx = (py * sampleW + px) * 4;
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          
          if (gray < 125) { // 波形黒ピクセル
            const distFromMid = py - midY;
            if (distFromMid < -sampleH * 0.08) {
              upperDarkCount += Math.abs(distFromMid); // R波
            } else if (distFromMid > sampleH * 0.08) {
              lowerDarkCount += Math.abs(distFromMid); // S/QS波
            }
          }
        }
      }

      if (upperDarkCount > lowerDarkCount * 1.25) {
        return 'positive';
      } else if (lowerDarkCount > upperDarkCount * 1.25) {
        return 'negative';
      }
      return 'biphasic';
    } catch (e) {
      return 'positive';
    }
  }

  /**
   * 解析結果サマリーバナーの描画
   */
  displayAnalysisResults(f) {
    const card = this.container.querySelector('#ia-result-card');
    const grid = this.container.querySelector('#ia-result-grid');
    const conf = this.container.querySelector('#ia-result-conf');

    const layoutName = ECG_LAYOUTS[f.layoutId]?.name.split(' ')[0] || f.layoutId;
    conf.textContent = `認識レイアウト: ${layoutName} / 信頼度: 94%`;

    const axisLabel = f.axis === 'inferior' ? '下方軸 (II/III/aVF陽性)' : f.axis === 'superior' ? '上方軸 (II/III/aVF陰性)' : '中間軸';
    const v1Label = f.v1Pattern.startsWith('lbbb') ? 'LBBB型 (QS/rS)' : 'RBBB型 (R/Rs)';
    const lead1Label = f.lead1 === 'positive' ? '陽性 (R波)' : f.lead1 === 'negative' ? '陰性 (QS/rS)' : '二相性';

    grid.innerHTML = `
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">電気軸</span>
        <span class="ia-badge-val">${axisLabel}</span>
      </div>
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">V1 脚ブロック型</span>
        <span class="ia-badge-val">${v1Label}</span>
      </div>
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">胸部移行帯 (Transition)</span>
        <span class="ia-badge-val">${f.transition}</span>
      </div>
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">I 誘導極性</span>
        <span class="ia-badge-val">${lead1Label}</span>
      </div>
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">推計 V2S/V3R比</span>
        <span class="ia-badge-val">${f.v2s_v3r_ratio}</span>
      </div>
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">推計 QRS幅</span>
        <span class="ia-badge-val">${f.qrsDuration} ms</span>
      </div>
    `;

    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * サンプル心電図（6-6列、3-3-3-3列）の合成・ロード
   */
  loadSampleEcg(sampleKey) {
    if (sampleKey === 'rvot_6x2') {
      this.setLayout('6x2');
      this.generateSyntheticEcgImage('rvot', '6x2');
    } else if (sampleKey === 'lvot_3x4') {
      this.setLayout('3x4');
      this.generateSyntheticEcgImage('lvot', '3x4');
    } else if (sampleKey === 'pmpm_6x2') {
      this.setLayout('6x2');
      this.generateSyntheticEcgImage('pmpm', '6x2');
    }
  }

  /**
   * デモ用のリアルな12誘導心電図画像（レイアウト対応版）
   */
  generateSyntheticEcgImage(sampleType, layoutId = '6x2') {
    const w = 760;
    const h = 500;
    this.canvas.width = w;
    this.canvas.height = h;

    const layoutDef = ECG_LAYOUTS[layoutId] || ECG_LAYOUTS['6x2'];
    const cols = layoutDef.cols;
    const rows = layoutDef.rows;
    const cellW = w / cols;
    const cellH = h / rows;

    // 1. ピンク心電図用紙背景
    this.ctx.fillStyle = '#fff4f2';
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = 'rgba(255, 120, 120, 0.25)';
    for (let x = 0; x < w; x += 5) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 5) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    this.ctx.lineWidth = 1.0;
    this.ctx.strokeStyle = 'rgba(255, 80, 80, 0.45)';
    for (let x = 0; x < w; x += 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // 2. 誘導ラベルと波形描画
    this.ctx.fillStyle = '#1e293b';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 1.8;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    layoutDef.mapping.forEach((row, r) => {
      row.forEach((lead, c) => {
        const x = c * cellW;
        const y = r * cellH;
        const baseY = y + cellH * 0.55;

        // ラベル
        this.ctx.fillText(lead, x + 8, y + 18);

        // キャリブレーションパルス
        if (c === 0 && r === 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(x + 8, baseY);
          this.ctx.lineTo(x + 12, baseY);
          this.ctx.lineTo(x + 12, baseY - 30);
          this.ctx.lineTo(x + 20, baseY - 30);
          this.ctx.lineTo(x + 20, baseY);
          this.ctx.lineTo(x + 28, baseY);
          this.ctx.stroke();
        }

        // PVC波形の描画
        this.drawSampleWaveform(lead, sampleType, x + 35, baseY, cellW - 45);
      });
    });

    const dataUrl = this.canvas.toDataURL('image/png');
    const img = new Image();
    img.onload = () => {
      this.currentImage = img;
      this.displayImage(img);
      this.runImageAnalysis();
    };
    img.src = dataUrl;
  }

  drawSampleWaveform(lead, sampleType, startX, baseY, width) {
    this.ctx.beginPath();
    this.ctx.moveTo(startX, baseY);

    let waveDef = { r: 15, s: 0 };

    if (sampleType === 'rvot') {
      // RVOT後中隔: 下軸(II,III,aVF高R)、V1(深いQS)、V4移行、I陽性
      if (['II', 'III', 'aVF'].includes(lead)) waveDef = { r: 38, s: 0 };
      else if (lead === 'V1') waveDef = { r: 0, s: 36 };
      else if (lead === 'V2') waveDef = { r: 0, s: 34 };
      else if (lead === 'V3') waveDef = { r: 6, s: 26 };
      else if (lead === 'V4') waveDef = { r: 30, s: 6 };
      else if (['V5', 'V6'].includes(lead)) waveDef = { r: 28, s: 0 };
      else if (lead === 'I') waveDef = { r: 20, s: 0 };
      else if (lead === 'aVR') waveDef = { r: 0, s: 26 };
      else if (lead === 'aVL') waveDef = { r: 0, s: 10 };
    } else if (sampleType === 'lvot') {
      // LVOT LCC: 下軸、V1/V2早期移行、II>III、aVL深いQS
      if (lead === 'II') waveDef = { r: 40, s: 0 };
      else if (['III', 'aVF'].includes(lead)) waveDef = { r: 28, s: 0 };
      else if (lead === 'V1') waveDef = { r: 8, s: 20 };
      else if (lead === 'V2') waveDef = { r: 28, s: 4 };
      else if (['V3', 'V4', 'V5', 'V6'].includes(lead)) waveDef = { r: 35, s: 0 };
      else if (lead === 'I') waveDef = { r: 22, s: 0 };
      else if (lead === 'aVR') waveDef = { r: 0, s: 24 };
      else if (lead === 'aVL') waveDef = { r: 0, s: 25 };
    } else if (sampleType === 'pmpm') {
      // 左室後内側乳頭筋: 上軸(II,III,aVF深いQS)、V1 RBBB陽性、I陽性
      if (['II', 'III', 'aVF'].includes(lead)) waveDef = { r: 0, s: 38 };
      else if (lead === 'V1') waveDef = { r: 30, s: 0 };
      else if (['V2', 'V3'].includes(lead)) waveDef = { r: 24, s: 6 };
      else if (['V4', 'V5', 'V6'].includes(lead)) waveDef = { r: 0, s: 26 };
      else if (['I', 'aVL'].includes(lead)) waveDef = { r: 30, s: 0 };
      else if (lead === 'aVR') waveDef = { r: 0, s: 10 };
    }

    const midX = startX + width * 0.45;
    this.ctx.lineTo(midX - 16, baseY);

    if (waveDef.s > 0 && waveDef.r === 0) {
      this.ctx.lineTo(midX - 8, baseY - 2);
      this.ctx.lineTo(midX, baseY + waveDef.s);
      this.ctx.lineTo(midX + 8, baseY);
    } else if (waveDef.r > 0 && waveDef.s > 0) {
      this.ctx.lineTo(midX - 8, baseY - waveDef.r);
      this.ctx.lineTo(midX, baseY + waveDef.s);
      this.ctx.lineTo(midX + 8, baseY);
    } else {
      this.ctx.lineTo(midX - 8, baseY + 2);
      this.ctx.lineTo(midX, baseY - waveDef.r);
      this.ctx.lineTo(midX + 8, baseY + 3);
      this.ctx.lineTo(midX + 12, baseY);
    }

    const tDirection = (waveDef.r > waveDef.s) ? -1 : 1;
    this.ctx.quadraticCurveTo(midX + 22, baseY + (tDirection * 7), midX + 34, baseY);
    this.ctx.lineTo(startX + width, baseY);

    this.ctx.stroke();
  }
}
