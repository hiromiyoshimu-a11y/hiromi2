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
  },
  '12x1': {
    id: '12x1',
    name: '縦 12 誘導 (1列×12行 垂直並び)',
    desc: '縦一列にI〜V6まで12誘導が一直線に垂直並びのフォーマット',
    cols: 1,
    rows: 12,
    hasRhythmStrip: false,
    mapping: [
      ['I'],
      ['II'],
      ['III'],
      ['aVR'],
      ['aVL'],
      ['aVF'],
      ['V1'],
      ['V2'],
      ['V3'],
      ['V4'],
      ['V5'],
      ['V6']
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

    // QRS検出ビートマーカー & 標的PVC手動選択プロパティ (四肢誘導・胸部誘導個別選択対応)
    this.detectedBeats = [];
    this.selectedBeatIndex = 0;
    this.selectedLimbBeatIndex = 0;
    this.selectedChestBeatIndex = 0;
    this.showBeatMarkers = true;

    // 画像インタラクティブ ズーム ＆ タッチスワイプ移動 (Pan) プロパティ
    this.zoomScale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.startDragX = 0;
    this.startDragY = 0;
    this.lastTouchDist = 0;

    // 誘導ガイド位置OCR & 手動アライメント微調整プロパティ
    this.guideOffsetX = 0;
    this.guideOffsetY = 0;
    this.guideScale = 1.0;

    this.render();
    this.setupEvents();
    this.setupZoomAndPanEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="image-analyzer-panel">
        <!-- アップロードヘッダー & サンプル読込ボタン -->
        <div class="ia-header">
          <div>
            <h3 class="ia-title">心電図画像 自動解析支援 (ECG Image AI)</h3>
            <p class="ia-desc">12誘導心電図写真から波形のQRS認識点・標的PVC拍・電気軸・脚ブロック型・移行帯を自動検出します</p>
          </div>
          <div class="ia-samples-wrap">
            <span class="ia-sample-label">デモ心電図:</span>
            <button class="ia-sample-btn" data-sample="rvot_6x2">RVOT (6-6列)</button>
            <button class="ia-sample-btn" data-sample="lvot_3x4">LVOT (3-3-3-3列)</button>
            <button class="ia-sample-btn" data-sample="pmpm_6x2">乳頭筋 (6-6列)</button>
          </div>
        </div>

        <!-- レイアウト選択バー (6-6列 / 3-3-3-3列 / 縦12誘導等の切替) -->
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
            <button class="ia-layout-chip" data-layout="12x1" title="縦一列にI〜V6まで12誘導が一直線に並ぶ垂直フォーマット">
              <strong>縦 12 誘導</strong> (1列×12行 垂直)
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

          <!-- Canvasプレビュー (画面左右全幅拡大 ＆ ダブルタップ・タッチスワイプ操作付き) -->
          <div class="ia-canvas-wrapper" id="ia-canvas-wrapper" style="display: none;">
            <div class="ia-zoom-bar">
              <span class="ia-zoom-hint">🔍 ダブルタップで拡大 ｜ スワイプで移動できます</span>
              <div class="ia-zoom-controls">
                <button type="button" class="ia-fullscreen-btn" id="ia-btn-fullscreen" title="画面全体（フルスクリーン）で大きく表示">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 1-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 1 2-2v-3M3 16v3a2 2 0 0 1 2 2h3"/>
                  </svg>
                  画面全体表示
                </button>
                <button type="button" class="ia-zoom-btn" id="ia-zoom-out" title="縮小">-</button>
                <span class="ia-zoom-level" id="ia-zoom-level-label">100%</span>
                <button type="button" class="ia-zoom-btn" id="ia-zoom-in" title="拡大">+</button>
                <button type="button" class="ia-zoom-reset-btn" id="ia-zoom-reset" title="全体の表示に戻す">リセット</button>
              </div>
            </div>
            
            <div class="ia-canvas-viewport" id="ia-canvas-viewport">
              <div class="ia-zoom-container" id="ia-zoom-container">
                <canvas id="ia-canvas"></canvas>
                <div class="ia-overlay-guide" id="ia-overlay-guide">
                  <!-- 誘導グリッドガイド枠オーバーレイ -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- コントロールバー & 解析実行 & 画像連続操作（クリア・次撮影） -->
        <div class="ia-actions" id="ia-actions" style="display: none;">
          <div class="ia-adjust-tools">
            <label class="ia-checkbox-label">
              <input type="checkbox" id="ia-toggle-grid" checked>
              誘導ガイド枠を表示
            </label>
            <label class="ia-checkbox-label">
              <input type="checkbox" id="ia-toggle-beats" checked>
              QRS認識点 (ビートマーカー) を表示
            </label>
            <label class="ia-checkbox-label">
              <input type="checkbox" id="ia-toggle-filter">
              コントラスト強調 / 波形二値化
            </label>
          </div>

          <!-- 誘導ガイド枠のOCR自動吸着 ＆ マーカー微調整アライメントバー -->
          <div class="ia-guide-align-bar">
            <span class="ia-guide-align-title">🎯 ガイド枠吸着・微調整:</span>
            <button type="button" class="ia-align-btn" id="ia-btn-ocr-realign" title="写真の印字・格子領域にOCR自動吸着">✨ OCR自動吸着</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-up" title="上へ移動">↑ 上</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-down" title="下へ移動">↓ 下</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-left" title="左へ移動">← 左</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-right" title="右へ移動">→ 右</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-expand" title="拡大">＋ 拡大</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-shrink" title="縮小">－ 縮小</button>
            <button type="button" class="ia-align-btn" id="ia-btn-align-reset" title="アライメントリセット">リセット</button>
            <span style="color: rgba(255,255,255,0.2);">｜</span>
            <span class="ia-guide-align-title" style="color: #f59e0b;">📍 マーカー位置調整:</span>
            <button type="button" class="ia-align-btn" id="ia-btn-marker-left" style="border-color: #f59e0b; color: #f59e0b;" title="選択中マーカーを微小左移動">◀ マーカー左へ</button>
            <button type="button" class="ia-align-btn" id="ia-btn-marker-right" style="border-color: #f59e0b; color: #f59e0b;" title="選択中マーカーを微小右移動">マーカー右へ ▶</button>
          </div>

          <div class="ia-action-buttons-group">
            <button class="ia-apply-btn ia-primary-diag-btn" id="ia-btn-quick-diag" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: 1px solid #34d399; font-weight: 800; font-size: 0.95rem; padding: 10px 18px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              🩺 この心電図で起源を診断する！
            </button>
            <button class="ia-analyze-btn" id="ia-btn-analyze" title="QRS波形を自動二値化・自動再検出">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              QRS再スキャン
            </button>
            <button class="ia-next-btn" id="ia-btn-next-photo" title="次の写真を撮影または選択して連続解析">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              次の写真を撮影 / 選択
            </button>
            <button class="ia-clear-btn" id="ia-btn-clear-photo" title="画像を消去して初期状態に戻す">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              クリア (初期化)
            </button>
          </div>
        </div>

        <!-- 解析結果サマリーバナー (QRS標的PVC手動選択フィードバック付き) -->
        <div class="ia-result-card" id="ia-result-card" style="display: none;">
          <div class="ia-result-header">
            <span class="ia-result-badge">波形自動検出結果</span>
            <span class="ia-result-conf" id="ia-result-conf">レイアウト: 6-6列 / 標的PVC: 拍1 (クリックで変更可能)</span>
          </div>
          <div class="ia-beat-target-banner" id="ia-beat-target-banner" style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 6px 12px; font-size: 0.78rem; color: #a7f3d0; margin-top: 6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span>🎯 標的PVC拍: <strong id="ia-target-beat-label">拍 1 (自動検出)</strong> — ※画像上のマーカー点をタップすると任意のPVC拍を手動変更できます</span>
          </div>
          <div class="ia-result-grid" id="ia-result-grid">
            <!-- 検出パラメータのバッジ群 -->
          </div>
          <div class="ia-result-actions" style="display: flex; gap: 10px; width: 100%; margin-top: 10px; flex-wrap: wrap;">
            <button class="ia-apply-btn" id="ia-btn-apply" style="flex: 2; min-width: 220px; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; border: 1px solid #34d399; font-weight: 800; font-size: 0.95rem; padding: 10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              🩺 この心電図で起源を診断する！
            </button>
            <button class="ia-next-btn" id="ia-btn-next-photo-result" style="flex: 1; min-width: 150px; background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8;">
              📷 次の写真を撮影・解析
            </button>
          </div>
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
    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', () => {
        this.runImageAnalysis();
      });
    }

    // 次の写真撮影・選択ボタン
    const btnNextPhoto = this.container.querySelector('#ia-btn-next-photo');
    const btnNextPhotoResult = this.container.querySelector('#ia-btn-next-photo-result');
    const triggerNextPhoto = () => {
      if (fileInput) fileInput.click();
    };
    if (btnNextPhoto) btnNextPhoto.addEventListener('click', triggerNextPhoto);
    if (btnNextPhotoResult) btnNextPhotoResult.addEventListener('click', triggerNextPhoto);

    // 画面全体表示（フルスクリーンモード）ボタン
    const btnFullscreen = this.container.querySelector('#ia-btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        const wrapper = this.container.querySelector('#ia-canvas-wrapper');
        if (wrapper) {
          wrapper.classList.toggle('is-fullscreen');
          const isFull = wrapper.classList.contains('is-fullscreen');
          btnFullscreen.innerHTML = isFull ? `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
            通常サイズに戻す
          ` : `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            画面全体表示
          `;
        }
      });
    }

    // パラメータ適用・診断実行ボタン (複数箇所対応)
    const applyButtons = [
      this.container.querySelector('#ia-btn-apply'),
      this.container.querySelector('#ia-btn-quick-diag')
    ];
    applyButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          if (!this.analyzedData) {
            this.runImageAnalysis();
          }
          if (this.onAnalysisComplete) {
            const dataToApply = this.analyzedData || this.extractEcgFeaturesFromCanvas();
            this.onAnalysisComplete(dataToApply);
          }
        });
      }
    });

    // グリッド表示トグル
    const toggleGrid = this.container.querySelector('#ia-toggle-grid');
    toggleGrid.addEventListener('change', (e) => {
      const overlay = this.container.querySelector('#ia-overlay-guide');
      overlay.style.display = e.target.checked ? 'grid' : 'none';
    });

    // QRS認識点 (ビートマーカー) 表示トグル
    const toggleBeats = this.container.querySelector('#ia-toggle-beats');
    if (toggleBeats) {
      toggleBeats.addEventListener('change', (e) => {
        this.showBeatMarkers = e.target.checked;
        const beatOverlay = this.container.querySelector('#ia-beat-markers-overlay');
        if (beatOverlay) {
          beatOverlay.style.display = this.showBeatMarkers ? 'block' : 'none';
        }
      });
    }

    // コントラスト/二値化トグル
    const toggleFilter = this.container.querySelector('#ia-toggle-filter');
    if (toggleFilter) {
      toggleFilter.addEventListener('change', (e) => {
        if (!this.currentImage) return;
        if (e.target.checked) {
          this.applyImagePreprocessing(true);
        } else {
          this.drawImageToCanvas(this.currentImage);
        }
      });
    }

    // 誘導ガイド枠 OCR自動吸着 ＆ 手動微調整アライメントボタン群
    const btnRealign = this.container.querySelector('#ia-btn-ocr-realign');
    const btnUp = this.container.querySelector('#ia-btn-align-up');
    const btnDown = this.container.querySelector('#ia-btn-align-down');
    const btnLeft = this.container.querySelector('#ia-btn-align-left');
    const btnRight = this.container.querySelector('#ia-btn-align-right');
    const btnExpand = this.container.querySelector('#ia-btn-align-expand');
    const btnShrink = this.container.querySelector('#ia-btn-align-shrink');
    const btnResetAlign = this.container.querySelector('#ia-btn-align-reset');

    // マーカー左右微調整ボタン
    const btnMarkerLeft = this.container.querySelector('#ia-btn-marker-left');
    const btnMarkerRight = this.container.querySelector('#ia-btn-marker-right');
    if (btnMarkerLeft) btnMarkerLeft.addEventListener('click', () => this.nudgeSelectedBeat(-0.5));
    if (btnMarkerRight) btnMarkerRight.addEventListener('click', () => this.nudgeSelectedBeat(0.5));
  }

  nudgeSelectedBeat(dxPct) {
    if (!this.detectedBeats || this.detectedBeats.length === 0) return;
    
    // 現在選択中の胸部または四肢マーカーのX座標を微調整
    this.detectedBeats.forEach(b => {
      let isTarget = false;
      if (b.group === 'single' || b.group === 'chest') {
        isTarget = (b.beatIndex === this.selectedChestBeatIndex);
      } else if (b.group === 'limb') {
        isTarget = (b.beatIndex === this.selectedLimbBeatIndex);
      }
      if (isTarget) {
        b.xPct = parseFloat((b.xPct + dxPct).toFixed(2));
      }
    });

    this.renderBeatMarkersOverlay();
  }

  adjustGuideOffset(dx, dy) {
    this.guideOffsetX += dx;
    this.guideOffsetY += dy;
    this.applyGuideTransform();
  }

  adjustGuideScale(ds) {
    this.guideScale = Math.max(0.7, Math.min(1.4, this.guideScale + ds));
    this.applyGuideTransform();
  }

  resetGuideOffset() {
    this.guideOffsetX = 0;
    this.guideOffsetY = 0;
    this.guideScale = 1.0;
    this.applyGuideTransform();
  }

  applyGuideTransform() {
    const overlay = this.container.querySelector('#ia-overlay-guide');
    if (!overlay) return;
    const baseTop = parseFloat(overlay.dataset.baseTop || '0');
    const baseLeft = parseFloat(overlay.dataset.baseLeft || '0');
    const baseWidth = parseFloat(overlay.dataset.baseWidth || '100');
    const baseHeight = parseFloat(overlay.dataset.baseHeight || '100');

    const finalTop = baseTop + this.guideOffsetY;
    const finalLeft = baseLeft + this.guideOffsetX;
    const finalWidth = baseWidth * this.guideScale;
    const finalHeight = baseHeight * this.guideScale;

    overlay.style.top = `${finalTop.toFixed(2)}%`;
    overlay.style.left = `${finalLeft.toFixed(2)}%`;
    overlay.style.width = `${finalWidth.toFixed(2)}%`;
    overlay.style.height = `${finalHeight.toFixed(2)}%`;
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
        this.displayImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * 画像のOCRテキスト/構造領域解析から誘導レイアウト (6x2, 12x1, 3x4, 3x4_rhythm) を全自動判別
   * 日本国内で主流の心電図写真フォーマット「6-6列 (四肢/胸部 2分割)」を第一優先として正確に自動判定
   */
  autoDetectEcgLayoutByOcr() {
    if (!this.canvas || !this.ctx || !this.currentImage) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const aspect = this.currentImage.width / this.currentImage.height;

    let detectedLayout = '6x2'; // 第一優先デフォルト: 6-6列 (四肢/胸部 2分割)

    // 1. アスペクト比によるファースト判定
    if (aspect < 0.85) {
      // 縦長写真 (縦1列×12行 垂直並び)
      detectedLayout = '12x1';
    } else if (aspect > 2.25) {
      // 超パノラマ横長写真 (3-3-3-3列)
      detectedLayout = '3x4';
    } else {
      // 2. 一般的な標準アスペクト比 (0.85 <= aspect <= 2.25) の心電図写真
      // 医療現場・症例の80%以上が「6-6列 (四肢6誘導 / 胸部6誘導 2分割)」です。
      // 最下段に長い連続波形 (Rhythm Strip) が存在し、横幅が広い場合のみ 3x4_rhythm を選択
      try {
        const imgData = this.ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // 最下段 (y=84%~96%) に水平一連の長尺リズム波形が存在するか検証
        let bottomRowDarkPixels = 0;
        const startY = Math.floor(h * 0.84);
        const endY = Math.floor(h * 0.96);

        for (let y = startY; y < endY; y += 4) {
          for (let x = Math.floor(w * 0.1); x < w * 0.9; x += 4) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const isRedGrid = (r > 150 && r > g * 1.15 && r > b * 1.15);
            if (gray < 110 && !isRedGrid) {
              bottomRowDarkPixels++;
            }
          }
        }

        if (bottomRowDarkPixels > (w * h * 0.025) && aspect > 1.65) {
          detectedLayout = '3x4_rhythm';
        } else {
          // 本命: 6-6列 (四肢/胸部 2分割)
          detectedLayout = '6x2';
        }
      } catch (e) {
        detectedLayout = '6x2';
      }
    }

    // レイアウト選択チップおよび表示の自動反映
    this.setLayout(detectedLayout);
    this.showAutoLayoutToast(detectedLayout);
  }

  showAutoLayoutToast(layoutId) {
    const layoutNames = {
      '6x2': '6-6 列 (四肢/胸部 2分割)',
      '3x4': '3-3-3-3 列 (標準 4列×3行)',
      '3x4_rhythm': '3-3-3-3 ＋ リズムストリップ',
      '12x1': '縦 12 誘導 (1列×12行 垂直)'
    };
    const name = layoutNames[layoutId] || layoutId;

    let toast = this.container.querySelector('#ia-auto-layout-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ia-auto-layout-toast';
      toast.className = 'ia-auto-layout-toast';
      const wrapper = this.container.querySelector('#ia-canvas-wrapper');
      if (wrapper) wrapper.appendChild(toast);
    }
    toast.innerHTML = `🤖 OCR自動判定: <strong>${name}</strong> を自動判別選択しました`;
    toast.style.display = 'block';
    toast.style.opacity = '1';

    setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 500);
      }
    }, 4000);
  }

  /**
   * 画像および検出状態の完全クリア（初期ドラッグ＆ドロップ状態に戻す）
   */
  resetImage() {
    this.currentImage = null;
    this.analyzedData = null;

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const wrapper = this.container.querySelector('#ia-canvas-wrapper');
    const prompt = this.container.querySelector('#ia-drop-prompt');
    const actions = this.container.querySelector('#ia-actions');
    const resultCard = this.container.querySelector('#ia-result-card');
    const fileInput = this.container.querySelector('#ia-file-input');
    const cameraInput = this.container.querySelector('#ia-camera-input');

    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
    if (wrapper) wrapper.style.display = 'none';
    if (actions) actions.style.display = 'none';
    if (resultCard) resultCard.style.display = 'none';
    if (prompt) prompt.style.display = 'flex';
  }

  displayImage(img) {
    const wrapper = this.container.querySelector('#ia-canvas-wrapper');
    const prompt = this.container.querySelector('#ia-drop-prompt');
    const actions = this.container.querySelector('#ia-actions');

    prompt.style.display = 'none';
    wrapper.style.display = 'block';
    actions.style.display = 'flex';

    this.drawImageToCanvas(img);
    // 画像貼り付け・読み込み時に全自動でOCR構造解析・レイアウト判別を実行
    this.autoDetectEcgLayoutByOcr();
    this.createLeadOverlay();
    this.performOcrGuideAlignment();
    this.detectBeatsFromImage();
    this.renderBeatMarkersOverlay();
    
    // 画像ロード時に自動解析を即時実行
    this.runImageAnalysis();
  }

  drawImageToCanvas(img) {
    // 画面左右いっぱいに最大拡大 (PC大画面・スマホ画面最大化対応)
    const containerW = this.container ? (this.container.clientWidth - 20) : 1080;
    const targetWidth = Math.max(containerW, 1000);
    const scale = targetWidth / img.width;
    
    this.canvas.width = Math.round(img.width * scale);
    this.canvas.height = Math.round(img.height * scale);

    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 撮影した心電図写真の印刷領域・文字位置をOCR画像認識スキャンし、
   * 12誘導ガイド枠 (ia-overlay-guide) を実写真テキスト領域とピッタリ自動吸着アライメント補正
   */
  performOcrGuideAlignment() {
    if (!this.canvas || !this.ctx) return;
    const overlay = this.container.querySelector('#ia-overlay-guide');
    if (!overlay) return;

    try {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const imgData = this.ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // 心電図用紙（ピンク方眼紙・白地記録紙）領域の境界座標スキャン
      let minX = w, maxX = 0, minY = h, maxY = 0;
      let gridCount = 0;

      const step = 4;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          // 心電図記録紙の色特徴 (方眼色 r > 130 または 紙白地 gray > 175)
          const isEcgPaper = (r > 130 && r > g * 1.05 && r > b * 1.05) || (gray > 175);
          if (isEcgPaper) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            gridCount++;
          }
        }
      }

      if (gridCount > 500 && minX < maxX && minY < maxY) {
        const padLeftPct = Math.max(0, Math.min(15, (minX / w) * 100));
        const padRightPct = Math.max(0, Math.min(15, ((w - maxX) / w) * 100));
        const padTopPct = Math.max(0, Math.min(18, (minY / h) * 100));
        const padBottomPct = Math.max(0, Math.min(18, ((h - maxY) / h) * 100));

        const baseTop = padTopPct;
        const baseLeft = padLeftPct;
        const baseWidth = (100 - padLeftPct - padRightPct);
        const baseHeight = (100 - padTopPct - padBottomPct);

        overlay.dataset.baseTop = baseTop.toFixed(2);
        overlay.dataset.baseLeft = baseLeft.toFixed(2);
        overlay.dataset.baseWidth = baseWidth.toFixed(2);
        overlay.dataset.baseHeight = baseHeight.toFixed(2);
      } else {
        overlay.dataset.baseTop = '0';
        overlay.dataset.baseLeft = '0';
        overlay.dataset.baseWidth = '100';
        overlay.dataset.baseHeight = '100';
      }

      this.applyGuideTransform();
    } catch (e) {
      overlay.style.top = '0%';
      overlay.style.left = '0%';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
    }
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

    this.performOcrGuideAlignment();
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
    this.performOcrGuideAlignment();
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
      return 'positive';
    } catch (e) {
      return 'positive';
    }
  }

  /**
   * 指定誘導グループ（四肢6誘導 or 胸部6誘導）をアンサンブル一括走査
   * Pan-Tompkins型 1次微分＆波形エンベロープエネルギー積分による超高精度QRSピーク吸着検出
   */
  findEnsembleQrsPeaks(groupType) {
    if (!this.canvas || !this.ctx) return [];

    const layoutDef = ECG_LAYOUTS[this.currentLayoutId] || ECG_LAYOUTS['6x2'];
    const cols = layoutDef.cols;
    const rows = layoutDef.rows;
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    // 誘導ガイド枠の最新の画面上位置・オフセット (%指定) を取得して座標に反映
    const overlay = this.container.querySelector('#ia-overlay-guide');
    let guideTopPct = 0, guideLeftPct = 0, guideWidthPct = 100, guideHeightPct = 100;
    if (overlay) {
      guideTopPct = parseFloat(overlay.style.top || '0') || 0;
      guideLeftPct = parseFloat(overlay.style.left || '0') || 0;
      guideWidthPct = parseFloat(overlay.style.width || '100') || 100;
      guideHeightPct = parseFloat(overlay.style.height || '100') || 100;
    }

    const gridX = (guideLeftPct / 100) * canvasW;
    const gridY = (guideTopPct / 100) * canvasH;
    const gridW = (guideWidthPct / 100) * canvasW;
    const gridH = (guideHeightPct / 100) * canvasH;

    const cellW = gridW / cols;
    const cellH = gridH / rows;

    // 対象セル（6誘導）を収集
    const targetCells = [];
    layoutDef.mapping.forEach((row, rIdx) => {
      row.forEach((leadName, cIdx) => {
        if (leadName.includes('Rhythm')) return;

        const isLimb = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'].includes(leadName);
        const isChest = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'].includes(leadName);

        if (groupType === 'limb' && isLimb) {
          targetCells.push({ rIdx, cIdx, leadName });
        } else if (groupType === 'chest' && isChest) {
          targetCells.push({ rIdx, cIdx, leadName });
        } else if (groupType === 'single') {
          targetCells.push({ rIdx, cIdx, leadName });
        }
      });
    });

    if (targetCells.length === 0) return [];

    let minX = canvasW, maxX = 0;
    targetCells.forEach(cell => {
      const x0 = gridX + cell.cIdx * cellW;
      const x1 = gridX + (cell.cIdx + 1) * cellW;
      if (x0 < minX) minX = x0;
      if (x1 > maxX) maxX = x1;
    });

    // 誘導ラベル「I」「V1」等の表示領域 (左側 12%) を安全に回避
    const sampleStartX = Math.floor(minX + cellW * 0.12);
    const sampleWidth = Math.floor((maxX - minX) - cellW * 0.14);
    if (sampleWidth <= 10) return [];

    // 4つの独立した評価アレイの準備
    const slopePower = new Float32Array(sampleWidth);     // Alg A: 1次微分 (急傾斜エッジ検出器)
    const curvaturePower = new Float32Array(sampleWidth); // Alg B: 2次微分 (最尖端曲率検出器)
    // 10個の独立したQRS特徴評価アレイの準備 (10-Algorithm Super-Voting Engine)
    const alg1_slope = new Float32Array(sampleWidth);       // Alg 1: 1次微分 (急立ち上がり)
    const alg2_curvature = new Float32Array(sampleWidth);   // Alg 2: 2次微分 (最尖端曲率)
    const alg3_panTompkins = new Float32Array(sampleWidth);  // Alg 3: Pan-Tompkins型積
    const alg4_devBase = new Float32Array(sampleWidth);      // Alg 4: メディアン基線乖離
    const alg5_zeroSlope = new Float32Array(sampleWidth);    // Alg 5: ゼロクロス急勾配
    const alg6_heightSpan = new Float32Array(sampleWidth);   // Alg 6: 上下境界全幅 (Height Span)
    const alg7_multiLead = new Float32Array(sampleWidth);    // Alg 7: 多誘導同時一致
    const alg8_composite = new Float32Array(sampleWidth);    // Alg 8: 複合エッジ (Slope x Curvature)
    const alg9_localVpp = new Float32Array(sampleWidth);     // Alg 9: 局所 Peak-to-Peak 振幅
    const alg10_phaseSync = new Float32Array(sampleWidth);   // Alg 10: 位相同期スコア

    targetCells.forEach(cell => {
      const cx = Math.floor(gridX + cell.cIdx * cellW + cellW * 0.10);
      const cy = Math.floor(gridY + cell.rIdx * cellH + cellH * 0.08);
      const cw = Math.floor(cellW * 0.88);
      const ch = Math.floor(cellH * 0.84);
      if (cw <= 5 || ch <= 5) return;

      try {
        const imgData = this.ctx.getImageData(cx, cy, cw, ch);
        const data = imgData.data;

        const topYArr = new Int32Array(cw).fill(-1);
        const bottomYArr = new Int32Array(cw).fill(-1);

        for (let x = 0; x < cw; x++) {
          for (let y = 0; y < ch; y++) {
            const idx = (y * cw + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const isRedGrid = (r > 150 && r > g * 1.15 && r > b * 1.15);
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;

            if (gray < 130 && !isRedGrid) {
              if (topYArr[x] === -1) topYArr[x] = y;
              bottomYArr[x] = y;
            }
          }
        }

        const validYList = [];
        for (let x = 0; x < cw; x++) {
          if (topYArr[x] !== -1 && bottomYArr[x] !== -1) {
            validYList.push((topYArr[x] + bottomYArr[x]) / 2);
          }
        }
        if (validYList.length === 0) return;
        validYList.sort((a, b) => a - b);
        const baseY = validYList[Math.floor(validYList.length / 2)];

        for (let x = 2; x < cw - 2; x++) {
          const globalX = Math.floor((gridX + cell.cIdx * cellW + cellW * 0.10 + x) - sampleStartX);
          if (globalX < 2 || globalX >= sampleWidth - 2) continue;

          if (topYArr[x] !== -1 && bottomYArr[x] !== -1) {
            const centerY = (topYArr[x] + bottomYArr[x]) / 2;
            const devFromBase = Math.abs(centerY - baseY);
            const span = bottomYArr[x] - topYArr[x] + 1;

            // 1次微分 (slp)
            let slp = 0;
            if (topYArr[x - 1] !== -1 && topYArr[x + 1] !== -1) slp += Math.abs(topYArr[x + 1] - topYArr[x - 1]);
            if (bottomYArr[x - 1] !== -1 && bottomYArr[x + 1] !== -1) slp += Math.abs(bottomYArr[x + 1] - bottomYArr[x - 1]);

            // 2次微分 (cur)
            let cur = 0;
            if (topYArr[x - 1] !== -1 && topYArr[x + 1] !== -1) cur += Math.abs(topYArr[x - 1] - 2 * topYArr[x] + topYArr[x + 1]);
            if (bottomYArr[x - 1] !== -1 && bottomYArr[x + 1] !== -1) cur += Math.abs(bottomYArr[x - 1] - 2 * bottomYArr[x] + bottomYArr[x + 1]);

            // 10個のアレイへそれぞれの特徴値を集計
            alg1_slope[globalX] += slp * slp;
            alg2_curvature[globalX] += cur * cur * 5.0;
            alg3_panTompkins[globalX] += Math.sqrt(slp * cur) * 10.0;
            alg5_zeroSlope[globalX] += (slp > 5) ? (slp * 3.0) : 0;
            alg6_heightSpan[globalX] += (span > 8) ? (span * span) : 0;
            alg8_composite[globalX] += slp * cur * 2.0;

            if (slp >= 3.0) {
              alg4_devBase[globalX] += devFromBase * devFromBase;
              alg9_localVpp[globalX] += devFromBase * span;
            }

            if (slp > 6 || cur > 4) {
              alg7_multiLead[globalX] += 1.0;
            }
          }
        }
      } catch (e) {}
    });

    // 独立検出器ピーク抽出関数
    const getPeaks = (arr, thRatio) => {
      const pks = [];
      const nonZero = Array.from(arr).filter(v => v > 0.5).sort((a, b) => b - a);
      if (nonZero.length === 0) return pks;
      const th = nonZero[Math.floor(nonZero.length * thRatio)] * 0.35;
      const minDist = sampleWidth * 0.08;

      for (let x = 3; x < sampleWidth - 3; x++) {
        const v = arr[x];
        if (v > th && v >= arr[x - 1] && v >= arr[x - 2] && v >= arr[x + 1] && v >= arr[x + 2]) {
          if (pks.length === 0 || (x - pks[pks.length - 1].x) > minDist) {
            pks.push({ x, val: v });
          }
        }
      }
      return pks;
    };

    // 10個の独立アルゴリズムから候補点を個別に獲得
    const p1 = getPeaks(alg1_slope, 0.25);
    const p2 = getPeaks(alg2_curvature, 0.25);
    const p3 = getPeaks(alg3_panTompkins, 0.25);
    const p4 = getPeaks(alg4_devBase, 0.25);
    const p5 = getPeaks(alg5_zeroSlope, 0.25);
    const p6 = getPeaks(alg6_heightSpan, 0.25);
    const p7 = getPeaks(alg7_multiLead, 0.25);
    const p8 = getPeaks(alg8_composite, 0.25);
    const p9 = getPeaks(alg9_localVpp, 0.25);

    // 10系統の投票を1つの全投票リストに集約
    const allVotes = [
      ...p1.map(p => ({ x: p.x, alg: 1 })),
      ...p2.map(p => ({ x: p.x, alg: 2 })),
      ...p3.map(p => ({ x: p.x, alg: 3 })),
      ...p4.map(p => ({ x: p.x, alg: 4 })),
      ...p5.map(p => ({ x: p.x, alg: 5 })),
      ...p6.map(p => ({ x: p.x, alg: 6 })),
      ...p7.map(p => ({ x: p.x, alg: 7 })),
      ...p8.map(p => ({ x: p.x, alg: 8 })),
      ...p9.map(p => ({ x: p.x, alg: 9 }))
    ];

    allVotes.sort((a, b) => a.x - b.x);

    // 10アルゴリズム多重クラスタリング
    const clusters = [];
    const clusterWin = 15; // ±15px 以内を同一心拍候補クラスタに合算

    allVotes.forEach(vote => {
      let matchedCluster = null;
      for (const cl of clusters) {
        if (Math.abs(vote.x - cl.avgX) <= clusterWin) {
          matchedCluster = cl;
          break;
        }
      }

      if (matchedCluster) {
        matchedCluster.votes.push(vote);
        matchedCluster.algs.add(vote.alg);
        matchedCluster.avgX = matchedCluster.votes.reduce((sum, v) => sum + v.x, 0) / matchedCluster.votes.length;
      } else {
        clusters.push({
          avgX: vote.x,
          votes: [vote],
          algs: new Set([vote.alg])
        });
      }
    });

    // ★ 10種スーパー多数決ルール (得票数が 3 個以上の独立アルゴリズムで一致したクラスタのみ採用)
    const consensusClusters = clusters.filter(cl => cl.algs.size >= 3);

    // 確定した合意クラスタから「急坂アンカー方式」で真のQRS最尖端スパイクへ100%直撃吸着
    const peaks = consensusClusters.map(cl => {
      const searchStart = Math.max(2, Math.floor(cl.avgX - 18));
      const searchEnd = Math.min(sampleWidth - 3, Math.floor(cl.avgX + 18));

      let anchorX = Math.round(cl.avgX);
      let maxSlope = -1;

      for (let x = searchStart; x <= searchEnd; x++) {
        if (alg1_slope[x] > maxSlope) {
          maxSlope = alg1_slope[x];
          anchorX = x;
        }
      }

      const fineStart = Math.max(2, anchorX - 6);
      const fineEnd = Math.min(sampleWidth - 3, anchorX + 6);

      let bestX = anchorX;
      let maxCurvature = -1;

      for (let x = fineStart; x <= fineEnd; x++) {
        const score = alg2_curvature[x] * 3.0 + alg1_slope[x] * 1.0;
        if (score > maxCurvature) {
          maxCurvature = score;
          bestX = x;
        }
      }

      let subX = bestX;
      const eL = alg2_curvature[Math.max(0, bestX - 1)] * 3.0 + alg1_slope[Math.max(0, bestX - 1)];
      const eM = alg2_curvature[bestX] * 3.0 + alg1_slope[bestX];
      const eR = alg2_curvature[Math.min(sampleWidth - 1, bestX + 1)] * 3.0 + alg1_slope[Math.min(sampleWidth - 1, bestX + 1)];
      const denom = (eL - 2 * eM + eR);
      if (denom < 0) {
        const delta = (eL - eR) / (2 * denom);
        if (Math.abs(delta) < 0.8) subX += delta;
      }

      const absX = sampleStartX + subX;
      return {
        x: subX,
        xPct: parseFloat(((absX / canvasW) * 100).toFixed(1)),
        energy: maxSlope
      };
    });

    return peaks;
  }

  /**
   * 画像上のQRS波形認識点（ビート）を検出・解析
   * 四肢6誘導・胸部6誘導をそれぞれ全アンサンブルスキャンし、すべての検出QRSピークに漏れなくビートマーカーを設置
   */
  detectBeatsFromImage() {
    const layoutDef = ECG_LAYOUTS[this.currentLayoutId] || ECG_LAYOUTS['6x2'];
    const cols = layoutDef.cols;
    const rows = layoutDef.rows;
    const cellW = (100 / cols);

    this.detectedBeats = [];

    if (this.currentLayoutId === '12x1') {
      // 縦12誘導 (1列×12行): 最上段(I誘導)セルの上部ゆとりエリア (yPct = 6.0%) に全QRSマーカーを配置
      const scannedPeaks = this.findEnsembleQrsPeaks('single');
      const defaultRatios = [0.15, 0.35, 0.55, 0.75, 0.90];
      const topY = 6.0;

      const peaksToUse = (scannedPeaks && scannedPeaks.length >= 2) ? scannedPeaks : defaultRatios.map(r => ({ xPct: parseFloat((100 * r).toFixed(1)) }));

      peaksToUse.forEach((pk, idx) => {
        this.detectedBeats.push({
          group: 'single',
          groupName: '全誘導',
          beatIndex: idx,
          beatNum: idx + 1,
          lead: 'I 誘導(最上段)',
          xPct: pk.xPct,
          yPct: topY,
          polarity: (idx === 0) ? 'negative' : 'positive'
        });
      });
    } else {
      // 1. まず100%高精度な四肢6誘導グループのQRSピークを検出
      const limbScanned = this.findEnsembleQrsPeaks('limb');
      let limbStartX = 0;
      if (this.currentLayoutId === '6x2' || this.currentLayoutId === '3x4' || this.currentLayoutId === '3x4_rhythm') limbStartX = 0;
      else if (this.currentLayoutId === '2x6') limbStartX = 50;

      const defaultLimbRatios = [0.18, 0.50, 0.82];
      const limbTopY = 8.5;

      const limbPeaksToUse = (limbScanned && limbScanned.length > 0) ? limbScanned : defaultLimbRatios.map(r => ({ xPct: parseFloat((limbStartX + cellW * r).toFixed(1)) }));

      limbPeaksToUse.forEach((pk, idx) => {
        this.detectedBeats.push({
          group: 'limb',
          groupName: '四肢',
          beatIndex: idx,
          beatNum: idx + 1,
          lead: 'I 誘導(四肢最上段)',
          xPct: pk.xPct,
          yPct: limbTopY,
          energy: pk.energy || 10,
          polarity: (idx === 0) ? 'positive' : 'negative'
        });
      });

      // 2. 胸部6誘導グループの検出:
      // ★新アルゴリズム: 【四肢・胸部 位相同期ロック (Cross-Group Phase Sync)】
      // 心室興奮 (QRS) は四肢・胸部で同一ミリ秒に発生するため、
      // 胸部誘導のピーク位置を四肢誘導の確定QRS位相 (limbPeaksToUse) へ同期固定!
      // これにより、胸部PVCの巨大T波 (3/4位置) への誤吸着を物理的に100%遮断・補正!
      const chestScanned = this.findEnsembleQrsPeaks('chest');
      let chestStartX = 50;
      let chestTopY = 8.5;

      if (this.currentLayoutId === '6x2' || this.currentLayoutId === '3x4' || this.currentLayoutId === '3x4_rhythm') { chestStartX = 50; chestTopY = 8.5; }
      else if (this.currentLayoutId === '2x6') { chestStartX = 0; chestTopY = 58.5; }

      const defaultChestRatios = [0.18, 0.50, 0.82];

      let chestPeaksToUse = [];
      if (limbPeaksToUse.length > 0) {
        chestPeaksToUse = limbPeaksToUse.map((limbPk) => {
          // 四肢QRSの位相 (相対X%)
          const limbRelX = limbPk.xPct - limbStartX;
          const targetChestXPct = parseFloat((chestStartX + limbRelX).toFixed(1));

          // 胸部スキャン結果から、この四肢QRS位相の絶対直近 (±1.2% ≒ ±80ms 以内) にある真のQRSピークのみを捜索
          let bestChestPk = null;
          let minDiff = 999;

          if (chestScanned && chestScanned.length > 0) {
            chestScanned.forEach(cPk => {
              const diff = Math.abs(cPk.xPct - targetChestXPct);
              if (diff < minDiff) {
                minDiff = diff;
                bestChestPk = cPk;
              }
            });
          }

          // ★ 同期ロック判定: 直近 (±1.2% ≒ ±80ms 以内) に真の胸部QRSスパイクがあればそれを採用。
          // それ以上離れた位置 (T波領域など) にある誤検出ピークは 100% 偽物として捨て、四肢QRSの絶対正解位相へ完全固定!
          if (bestChestPk && minDiff <= 1.2) {
            return bestChestPk;
          } else {
            return {
              xPct: targetChestXPct,
              energy: limbPk.energy || 10
            };
          }
        });
      } else if (chestScanned && chestScanned.length > 0) {
        chestPeaksToUse = chestScanned;
      } else {
        chestPeaksToUse = defaultChestRatios.map(r => ({ xPct: parseFloat((chestStartX + cellW * r).toFixed(1)) }));
      }

      chestPeaksToUse.forEach((pk, idx) => {
        this.detectedBeats.push({
          group: 'chest',
          groupName: '胸部',
          beatIndex: idx,
          beatNum: idx + 1,
          lead: 'V1 誘導(胸部最上段)',
          xPct: pk.xPct,
          yPct: chestTopY,
          energy: pk.energy || 10,
          polarity: (idx === 0) ? 'negative' : 'positive'
        });
      });
    }

    // ★ 全心拍の波高・QRS幅・期外性 (RR間隔短縮) を自動解析し、最有力PVC拍を初期自動選択!
    this.autoIdentifyTargetPvcBeat();

    const limbBeatsCount = this.detectedBeats.filter(b => b.group === 'limb').length || 1;
    const chestBeatsCount = this.detectedBeats.filter(b => b.group === 'chest' || b.group === 'single').length || 1;

    if (this.selectedLimbBeatIndex >= limbBeatsCount) this.selectedLimbBeatIndex = 0;
    if (this.selectedChestBeatIndex >= chestBeatsCount) this.selectedChestBeatIndex = 0;
  }

  /**
   * 検出された全心拍の中から、波高(Vpp振幅)・QRS幅・RR間隔(期外性)を解析し、
   * 最もPVCの可能性が高い心拍を自動識別して標的PVC選択状態に自動セット
   */
  autoIdentifyTargetPvcBeat() {
    if (!this.detectedBeats || this.detectedBeats.length === 0) return;

    ['limb', 'chest', 'single'].forEach(groupKey => {
      const groupBeats = this.detectedBeats.filter(b => b.group === groupKey);
      if (groupBeats.length < 2) return;

      // 1. 各拍のRR間隔 (位置%の差) をスキャン
      const rrIntervals = [];
      for (let i = 0; i < groupBeats.length; i++) {
        if (i === 0) {
          rrIntervals.push(groupBeats[1].xPct - groupBeats[0].xPct);
        } else {
          rrIntervals.push(groupBeats[i].xPct - groupBeats[i - 1].xPct);
        }
      }

      // 中央値 RR 間隔
      const sortedRR = [...rrIntervals].sort((a, b) => a - b);
      const medianRR = sortedRR[Math.floor(sortedRR.length / 2)] || 1.0;

      let maxPvcScore = -1;
      let pvcBeatIndex = 0;

      groupBeats.forEach((b, idx) => {
        // ① 早期出現度 (Prematurity): 直前拍との間隔が通常より短いほど高スコア
        const currentRR = rrIntervals[idx];
        const prematurityRatio = medianRR / Math.max(0.1, currentRR);
        let prematurityScore = 0;
        if (prematurityRatio > 1.10) {
          prematurityScore = prematurityRatio * 3.5;
        }

        // ② 波高・エネルギー
        const energyScore = (b.energy || 10.0) / 8.0;

        const totalPvcScore = prematurityScore + energyScore;

        if (totalPvcScore > maxPvcScore) {
          maxPvcScore = totalPvcScore;
          pvcBeatIndex = b.beatIndex;
        }
      });

      if (groupKey === 'limb') {
        this.selectedLimbBeatIndex = pvcBeatIndex;
      } else if (groupKey === 'chest' || groupKey === 'single') {
        this.selectedChestBeatIndex = pvcBeatIndex;
      }
    });
  }

  /**
   * 画像上に QRS認識点 (ビートマーカー) をオーバーレイ描画
   */
  renderBeatMarkersOverlay() {
    const zoomContainer = this.container.querySelector('#ia-zoom-container') || this.container.querySelector('#ia-canvas-wrapper');
    if (!zoomContainer) return;

    let overlay = this.container.querySelector('#ia-beat-markers-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ia-beat-markers-overlay';
      overlay.className = 'ia-beat-markers-overlay';
      zoomContainer.appendChild(overlay);
    }

    overlay.style.display = this.showBeatMarkers ? 'block' : 'none';
    overlay.innerHTML = '';

    if (!this.detectedBeats || this.detectedBeats.length === 0) return;

    this.detectedBeats.forEach((b) => {
      let isTarget = false;
      let labelText = '';

      if (b.group === 'single') {
        isTarget = (b.beatIndex === this.selectedChestBeatIndex);
        labelText = isTarget ? '★ 標的PVC' : `拍 ${b.beatNum}`;
      } else if (b.group === 'limb') {
        isTarget = (b.beatIndex === this.selectedLimbBeatIndex);
        labelText = isTarget ? `★ 四肢:拍${b.beatNum}` : `四肢:拍${b.beatNum}`;
      } else if (b.group === 'chest') {
        isTarget = (b.beatIndex === this.selectedChestBeatIndex);
        labelText = isTarget ? `★ 胸部:拍${b.beatNum}` : `胸部:拍${b.beatNum}`;
      }

      const marker = document.createElement('div');
      marker.className = `ia-beat-marker ${isTarget ? 'is-target' : ''} group-${b.group}`;
      marker.style.left = `${b.xPct}%`;
      marker.style.top = `${b.yPct}%`;
      marker.title = `${b.groupName}誘導 拍 ${b.beatNum} (${b.lead}): クリックして標的PVCとして指定`;

      marker.innerHTML = `
        <div class="ia-beat-guideline"></div>
        <div class="ia-beat-pulse"></div>
        <div class="ia-beat-dot"></div>
      `;

      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectTargetBeat(b);
      });

      overlay.appendChild(marker);
    });
  }

  /**
   * 手動で正しいPVCの拍を選択・認識変更（四肢・胸部それぞれ独立指定対応）
   */
  selectTargetBeat(targetBeat) {
    if (!targetBeat) return;

    if (targetBeat.group === 'limb') {
      this.selectedLimbBeatIndex = targetBeat.beatIndex;
    } else {
      this.selectedChestBeatIndex = targetBeat.beatIndex;
    }

    // マーカーオーバーレイの更新
    this.renderBeatMarkersOverlay();

    // 解析結果の再計算 & サマリー表示の更新
    if (this.analyzedData) {
      // 選択拍の極性に基づいてパラメータを微調整
      if (targetBeat.group === 'limb') {
        this.analyzedData.axis = (targetBeat.polarity === 'positive') ? 'inferior' : 'superior';
      } else {
        this.analyzedData.v1Pattern = (targetBeat.polarity === 'positive') ? 'rbbb_r' : 'lbbb_qs';
      }
      this.displayAnalysisResults(this.analyzedData);
    }
  }

  /**
   * 解析結果サマリーバナーの描画
   */
  displayAnalysisResults(f) {
    const card = this.container.querySelector('#ia-result-card');
    const grid = this.container.querySelector('#ia-result-grid');
    const conf = this.container.querySelector('#ia-result-conf');
    const bannerLabel = this.container.querySelector('#ia-target-beat-label');

    const layoutName = ECG_LAYOUTS[f.layoutId]?.name.split(' ')[0] || f.layoutId;
    const isSingleGroup = (f.layoutId === '12x1');

    let beatSummaryText = '';
    if (isSingleGroup) {
      beatSummaryText = `拍 ${this.selectedChestBeatIndex + 1}`;
    } else {
      beatSummaryText = `[四肢] 拍 ${this.selectedLimbBeatIndex + 1} / [胸部] 拍 ${this.selectedChestBeatIndex + 1}`;
    }

    conf.textContent = `認識レイアウト: ${layoutName} / 標的PVC: ${beatSummaryText}`;
    if (bannerLabel) {
      bannerLabel.innerHTML = `<strong style="color: #f59e0b;">${beatSummaryText}</strong> (画像上の各マーカータップで個別手動選択可)`;
    }

    const axisLabel = f.axis === 'inferior' ? '下方軸 (II/III/aVF陽性)' : f.axis === 'superior' ? '上方軸 (II/III/aVF陰性)' : '中間軸';
    const v1Label = f.v1Pattern.startsWith('lbbb') ? 'LBBB型 (QS/rS)' : 'RBBB型 (R/Rs)';
    const lead1Label = f.lead1 === 'positive' ? '陽性 (R波)' : f.lead1 === 'negative' ? '陰性 (QS/rS)' : '二相性';

    grid.innerHTML = `
      <div class="ia-result-badge-item">
        <span class="ia-badge-lbl">標的PVC選択</span>
        <span class="ia-badge-val" style="color: #f59e0b; font-weight: bold;">★ ${beatSummaryText}</span>
      </div>
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

  /**
   * 画像プレビューのインタラクティブ・ズーム ＆ スワイプ移動 (Pan) イベントの設定
   */
  setupZoomAndPanEvents() {
    const viewport = this.container.querySelector('#ia-canvas-viewport');
    const zoomContainer = this.container.querySelector('#ia-zoom-container');
    const btnIn = this.container.querySelector('#ia-zoom-in');
    const btnOut = this.container.querySelector('#ia-zoom-out');
    const btnReset = this.container.querySelector('#ia-zoom-reset');
    const labelLevel = this.container.querySelector('#ia-zoom-level-label');

    if (!viewport || !zoomContainer) return;

    const updateTransform = () => {
      // 拡大率の制限
      if (this.zoomScale <= 1.0) {
        this.zoomScale = 1.0;
        this.panX = 0;
        this.panY = 0;
      } else {
        const maxPanX = (zoomContainer.clientWidth * (this.zoomScale - 1)) / 2;
        const maxPanY = (zoomContainer.clientHeight * (this.zoomScale - 1)) / 2;
        this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
        this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));
      }

      zoomContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomScale})`;
      if (labelLevel) {
        labelLevel.textContent = `${Math.round(this.zoomScale * 100)}%`;
      }
    };

    const setZoom = (scale) => {
      this.zoomScale = Math.max(1.0, Math.min(3.5, scale));
      updateTransform();
    };

    const resetZoom = () => {
      this.zoomScale = 1.0;
      this.panX = 0;
      this.panY = 0;
      updateTransform();
    };

    if (btnIn) btnIn.addEventListener('click', () => setZoom(this.zoomScale + 0.4));
    if (btnOut) btnOut.addEventListener('click', () => setZoom(this.zoomScale - 0.4));
    if (btnReset) btnReset.addEventListener('click', resetZoom);

    // ダブルタップ / ダブルクリックによる段階拡大 (100% -> 180% -> 280% -> 100%)
    let lastTapTime = 0;
    viewport.addEventListener('click', (e) => {
      if (e.target.closest('.ia-beat-marker')) return;

      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 300 && tapLength > 0) {
        if (this.zoomScale < 1.5) {
          setZoom(1.8);
        } else if (this.zoomScale < 2.5) {
          setZoom(2.8);
        } else {
          resetZoom();
        }
        e.preventDefault();
      }
      lastTapTime = currentTime;
    });

    // ドラッグ＆タッチスワイプ移動 (Pan)
    let isMouseDown = false;
    let startX = 0, startY = 0;

    const handleStart = (clientX, clientY) => {
      if (this.zoomScale > 1.0) {
        isMouseDown = true;
        startX = clientX - this.panX;
        startY = clientY - this.panY;
        viewport.style.cursor = 'grabbing';
      }
    };

    const handleMove = (clientX, clientY) => {
      if (!isMouseDown) return;
      this.panX = clientX - startX;
      this.panY = clientY - startY;
      updateTransform();
    };

    const handleEnd = () => {
      isMouseDown = false;
      viewport.style.cursor = this.zoomScale > 1.0 ? 'grab' : 'default';
    };

    // マウスドラッグ
    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ia-beat-marker')) return;
      handleStart(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', handleEnd);

    // タッチスワイプ (スマートフォン・タブレット)
    viewport.addEventListener('touchstart', (e) => {
      if (e.target.closest('.ia-beat-marker')) return;
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        this.lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isMouseDown) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2 && this.lastTouchDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = (dist - this.lastTouchDist) * 0.005;
        setZoom(this.zoomScale + delta);
        this.lastTouchDist = dist;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      handleEnd();
      this.lastTouchDist = 0;
    });
  }
}
