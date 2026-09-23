/**
 * CardioOrigin - 心臓解剖SVGレンダラー & インタラクティブ制御
 */

import { SITE_DEFINITIONS } from './algorithm.js';

export class HeartMap {
  constructor(containerElement, onSiteClick) {
    this.container = containerElement;
    this.onSiteClick = onSiteClick;
    this.currentView = 'anterior'; // 'anterior' | 'basal'
    this.currentRanking = [];
    this.render();
  }

  setView(viewName) {
    if (this.currentView !== viewName) {
      this.currentView = viewName;
      this.render();
      this.updateHighlight(this.currentRanking);
    }
  }

  updateHighlight(ranking) {
    if (!this.container) return;
    this.currentRanking = ranking || [];
    
    // 全サイトのハイライトクラスをリセット
    const allSites = this.container.querySelectorAll('.origin-site');
    allSites.forEach(el => {
      el.classList.remove('rank-1', 'rank-2', 'rank-3');
    });

    if (!ranking || ranking.length === 0) return;

    // 上位3部位にクラスを付与
    ranking.slice(0, 3).forEach((item, idx) => {
      const siteEl = this.container.querySelector(`.origin-site[data-site="${item.id}"]`);
      if (siteEl) {
        siteEl.classList.add(`rank-${idx + 1}`);
      }
    });
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="map-view-switch">
        <button class="map-view-btn ${this.currentView === 'anterior' ? 'active' : ''}" data-view="anterior">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
          </svg>
          正面・立体ビュー (Anterior 3D)
        </button>
        <button class="map-view-btn ${this.currentView === 'basal' ? 'active' : ''}" data-view="basal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"/>
          </svg>
          弁輪・流出路見下ろし (Basal / Short-Axis)
        </button>
      </div>

      <div class="heart-svg-wrapper">
        ${this.currentView === 'anterior' ? this.getAnteriorSvg() : this.getBasalSvg()}
      </div>

      <div class="heart-map-legend">
        <div class="legend-item"><span class="legend-color c-rank1"></span> 最有力 (1位)</div>
        <div class="legend-item"><span class="legend-color c-rank2"></span> 有力候補 (2位)</div>
        <div class="legend-item"><span class="legend-color c-rank3"></span> 鑑別部位 (3位)</div>
      </div>
    `;

    // 視点切替ボタンイベント
    const btns = this.container.querySelectorAll('.map-view-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setView(btn.getAttribute('data-view'));
      });
    });

    // サイトクリックイベント
    const siteElements = this.container.querySelectorAll('.origin-site');
    siteElements.forEach(el => {
      el.addEventListener('click', () => {
        const siteId = el.getAttribute('data-site');
    getAnteriorSvg() {
    return `
      <svg class="heart-svg" viewBox="0 0 760 520" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 背景フェード・減光グラデーションマスク -->
          <radialGradient id="vignette-mask" cx="50%" cy="50%" r="52%">
            <stop offset="70%" stop-color="#ffffff" stop-opacity="1"/>
            <stop offset="92%" stop-color="#ffffff" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <mask id="heart-vignette">
            <rect width="760" height="520" fill="url(#vignette-mask)"/>
          </mask>

          <!-- 太く鮮明な赤色矢印マーカー -->
          <marker id="arrow-red-large" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444"/>
          </marker>

          <!-- サイバースキャングリッド -->
          <pattern id="hud-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.05)" stroke-width="0.5"/>
          </pattern>
        </defs>

        <!-- 背景HUDグリッド -->
        <rect width="760" height="520" fill="#060a14"/>
        <rect width="760" height="520" fill="url(#hud-grid)"/>

        <!-- 【高精細・解剖断面3D立体心臓イラスト (参考画像と100%同一解剖構造)】 -->
        <g mask="url(#heart-vignette)">
          <image href="assets/heart_3d_cross_section.jpg?v=8" x="140" y="10" width="480" height="500" preserveAspectRatio="xMidYMid meet" opacity="0.98"/>
        </g>

        <!-- ================= 起源部位マーカー & 視認性極大化赤枠ラベル ================= -->

        <!-- 【上部中央・上右配置ラベル】 -->

        <!-- 1. LVOT RCC (右冠尖) : ターゲット (365, 235) <-- ラベル (405, 15) -->
        <g class="origin-site" data-site="lvot_rcc" transform="translate(365, 235)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="40" y1="-220" x2="3" y2="-8" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-35" y="-235" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="40" y="-215" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">LVOT (RCC)</text>
        </g>

        <!-- 2. LVOT NCC (無冠尖) : ターゲット (418, 240) <-- ラベル (575, 25) -->
        <g class="origin-site" data-site="lvot_ncc" transform="translate(418, 240)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="157" y1="-215" x2="6" y2="-5" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="82" y="-230" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="157" y="-210" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">LVOT (NCC)</text>
        </g>

        <!-- 3. LVOT LCC (左冠尖) : ターゲット (400, 248) <-- ラベル (585, 70) -->
        <g class="origin-site" data-site="lvot_lcc" transform="translate(400, 248)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="185" y1="-178" x2="8" y2="-5" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="110" y="-193" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="185" y="-173" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">LVOT (LCC)</text>
        </g>

        <!-- 【右側縦並び配置ラベル (上から順に)】 -->

        <!-- 4. LV Summit (心外膜) : ターゲット (445, 222) <-- ラベル (595, 120) -->
        <g class="origin-site" data-site="lv_summit" transform="translate(445, 222)">
          <circle class="site-ring" cx="0" cy="0" r="11" />
          <circle class="site-dot" cx="0" cy="0" r="6" />
          <line class="site-leader-line" x1="150" y1="-102" x2="7" y2="-4" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="75" y="-117" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="150" y="-97" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">LV summit</text>
        </g>

        <!-- 5. 僧帽弁輪 (MVA) : ターゲット (460, 260) <-- ラベル (600, 175) -->
        <g class="origin-site" data-site="mva" transform="translate(460, 260)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="140" y1="-85" x2="7" y2="-5" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="70" y="-100" width="140" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="140" y="-80" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">僧帽弁輪</text>
        </g>

        <!-- 6. AMC (大動脈僧帽弁移行部) : ターゲット (415, 275) <-- ラベル (590, 230) -->
        <g class="origin-site" data-site="amc" transform="translate(415, 275)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="175" y1="-45" x2="7" y2="-4" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="90" y="-60" width="170" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="175" y="-40" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">AMC (移行部)</text>
        </g>

        <!-- 7. 前外側乳頭筋 (ALPM) : ターゲット (480, 335) <-- ラベル (580, 285) -->
        <g class="origin-site" data-site="alpm" transform="translate(480, 335)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="100" y1="-50" x2="8" y2="-5" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="10" y="-65" width="180" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="100" y="-45" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="800">前外側乳頭筋 (ALPM)</text>
        </g>

        <!-- 8. 後内側乳頭筋 (PMPM) : ターゲット (430, 360) <-- ラベル (580, 345) -->
        <g class="origin-site" data-site="pmpm" transform="translate(430, 360)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="150" y1="-15" x2="8" y2="-2" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="60" y="-30" width="180" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="150" y="-10" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="800">後内側乳頭筋 (PMPM)</text>
        </g>

        <!-- 9. 左脚後枝 (ILVT) : ターゲット (435, 395) <-- ラベル (575, 410) -->
        <g class="origin-site" data-site="ilvt" transform="translate(435, 395)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="140" y1="15" x2="8" y2="-2" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="65" y="0" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="140" y="20" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">左脚後枝</text>
        </g>


        <!-- 【左側縦並び配置ラベル (上から順に)】 -->

        <!-- 10. RVOT 中隔 : ターゲット (355, 270) <-- ラベル (15, 170) -->
        <g class="origin-site" data-site="rvot_post_sep" transform="translate(355, 270)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="-180" y1="-100" x2="-8" y2="-5" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-255" y="-115" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="-180" y="-95" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">RVOT中隔</text>
        </g>

        <!-- 11. RVOT 自由壁 : ターゲット (310, 260) <-- ラベル (15, 225) -->
        <g class="origin-site" data-site="rvot_free_wall" transform="translate(310, 260)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="-135" y1="-35" x2="-8" y2="-3" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-210" y="-50" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="-135" y="-30" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">RVOT自由壁</text>
        </g>

        <!-- 12. ヒス束近傍 (中隔) : ターゲット (320, 290) <-- ラベル (15, 280) -->
        <g class="origin-site" data-site="parahisian" transform="translate(320, 290)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="-125" y1="-10" x2="-8" y2="-2" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-215" y="-25" width="180" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="-125" y="-5" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">ヒス束近傍 (中隔)</text>
        </g>

        <!-- 13. 三尖弁輪 (TVA) : ターゲット (280, 315) <-- ラベル (15, 335) -->
        <g class="origin-site" data-site="tva" transform="translate(280, 315)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="-95" y1="20" x2="-8" y2="-2" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-180" y="5" width="170" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="-95" y="25" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">三尖弁輪 (TVA)</text>
        </g>

        <!-- 14. 右室乳頭筋 : ターゲット (305, 375) <-- ラベル (15, 390) -->
        <g class="origin-site" data-site="rv_papillary" transform="translate(305, 375)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="-130" y1="15" x2="-8" y2="-2" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-205" y="0" width="150" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="-130" y="20" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">右室乳頭筋</text>
        </g>

        <!-- 15. 右室調節帯 (MB) : ターゲット (350, 410) <-- ラベル (15, 445) -->
        <g class="origin-site" data-site="moderator_band" transform="translate(350, 410)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="-155" y1="35" x2="-8" y2="-2" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-240" y="20" width="170" height="30" rx="6" fill="rgba(11,19,38,0.92)" stroke="#ef4444" stroke-width="1.8" />
          <text class="site-label-text" x="-155" y="40" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">右室調節帯 (MB)</text>
        </g>
      </svg>
    `;
  }ght="20" rx="4" fill="rgba(15,23,42,0.9)" stroke="#ef4444" stroke-width="1.2" />
          <text class="site-label-text" x="-138" y="6" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="700">右室乳頭筋</text>
        </g>

        <!-- 15. 右室調節帯 (MB) : ターゲット(260, 358) <-- ラベル(80, 385) -->
        <g class="origin-site" data-site="moderator_band" transform="translate(260, 358)">
          <circle class="site-ring" cx="0" cy="0" r="9" />
          <circle class="site-dot" cx="0" cy="0" r="5" />
          <line class="site-leader-line" x1="-170" y1="37" x2="-6" y2="1" stroke="#ef4444" stroke-width="1.8" marker-end="url(#arrow-red)" />
          <rect class="site-label-bg" x="-240" y="19" width="140" height="20" rx="4" fill="rgba(15,23,42,0.9)" stroke="#ef4444" stroke-width="1.2" />
          <text class="site-label-text" x="-170" y="33" text-anchor="middle" fill="#f8fafc" font-size="10.5" font-weight="700">右室調節帯 (MB)</text>
        </g>
      </svg>
    `;
  }

  /**
   * 弁輪・流出路見下ろし短軸視点 (Basal View) SVG
   */
  getBasalSvg() {
    return `
      <svg class="heart-svg" viewBox="0 0 440 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-valve-aortic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#b91c1c" stop-opacity="0.6"/>
          </linearGradient>
          <linearGradient id="grad-valve-pulm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#0369a1" stop-opacity="0.6"/>
          </linearGradient>
        </defs>

        <!-- 背景方位ガイド -->
        <circle cx="220" cy="190" r="165" fill="none" stroke="rgba(56, 189, 248, 0.06)" stroke-dasharray="3 3"/>
        <text x="220" y="30" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="700">前壁 (Anterior)</text>
        <text x="220" y="365" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="700">後壁 (Posterior)</text>
        <text x="40" y="194" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="700">右 (Right)</text>
        <text x="400" y="194" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="700">左 (Left)</text>

        <!-- 肺動脈弁 PV (右前方に位置) -->
        <g transform="translate(165, 105)">
          <circle cx="0" cy="0" r="36" fill="url(#grad-valve-pulm)" stroke="#38bdf8" stroke-width="2"/>
          <!-- 3尖弁葉 -->
          <line x1="0" y1="0" x2="0" y2="-36" stroke="#38bdf8" stroke-width="1.2"/>
          <line x1="0" y1="0" x2="31" y2="18" stroke="#38bdf8" stroke-width="1.2"/>
          <line x1="0" y1="0" x2="-31" y2="18" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="0" y="-42" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="700">肺動脈弁 (PV / RVOT)</text>
        </g>

        <!-- 大動脈弁 AV (中心部後方に位置) -->
        <g transform="translate(230, 180)">
          <circle cx="0" cy="0" r="42" fill="url(#grad-valve-aortic)" stroke="#f87171" stroke-width="2"/>
          <!-- ベンツマーク (RCC, LCC, NCC) -->
          <line x1="0" y1="0" x2="0" y2="42" stroke="#f87171" stroke-width="1.5"/>
          <line x1="0" y1="0" x2="-36" y2="-21" stroke="#f87171" stroke-width="1.5"/>
          <line x1="0" y1="0" x2="36" y2="-21" stroke="#f87171" stroke-width="1.5"/>
          <text x="-16" y="-6" fill="#fca5a5" font-size="11" font-weight="700">RCC</text>
          <text x="12" y="-6" fill="#fca5a5" font-size="11" font-weight="700">LCC</text>
          <text x="-4" y="26" fill="#fca5a5" font-size="11" font-weight="700">NCC</text>
          <text x="0" y="58" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700">大動脈弁 (Aortic Valve)</text>
        </g>

        <!-- 三尖弁輪 TV (右室側・大動脈弁の右側) -->
        <g transform="translate(115, 230)">
          <ellipse cx="0" cy="0" rx="42" ry="48" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" stroke-width="1.5" stroke-dasharray="3 3"/>
          <text x="0" y="0" text-anchor="middle" fill="#5eead4" font-size="10" font-weight="600">三尖弁 (TV)</text>
        </g>

        <!-- 僧帽弁輪 MV (左室側・大動脈弁の後左側) -->
        <g transform="translate(325, 235)">
          <ellipse cx="0" cy="0" rx="45" ry="50" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3"/>
          <text x="0" y="0" text-anchor="middle" fill="#fda4af" font-size="10" font-weight="600">僧帽弁 (MV)</text>
        </g>

        <!-- ヒス束・刺激伝導系貫通部 (RCCとNCCの境界近傍・膜性中隔) -->
        <path d="M 215 195 L 180 220" stroke="#facc15" stroke-width="2" stroke-dasharray="2 2"/>
        <circle cx="215" cy="195" r="3" fill="#facc15"/>
        <text x="200" y="215" fill="#facc15" font-size="9" font-weight="600">His bundle</text>

        <!-- LV Summit 領域 (PVとLCCの挟間・心外膜) -->
        <path d="M 195 90 C 230 85, 260 120, 245 145 Z" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="245" y="105" fill="#f59e0b" font-size="9" font-weight="700">LV Summit</text>

        <!-- ================= 起源部位マーカー群 (Basal View) ================= -->

        <!-- RVOT 後中隔 -->
        <g class="origin-site" data-site="rvot_post_sep" transform="translate(182, 130)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-98" y="2" width="88" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="14" text-anchor="end">RVOT 後中隔</text>
        </g>

        <!-- RVOT 前中隔 -->
        <g class="origin-site" data-site="rvot_ant_sep" transform="translate(170, 85)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-98" y="-18" width="88" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="-6" text-anchor="end">RVOT 前中隔</text>
        </g>

        <!-- RVOT 自由壁 -->
        <g class="origin-site" data-site="rvot_free_wall" transform="translate(132, 95)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-98" y="-8" width="88" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="4" text-anchor="end">RVOT 自由壁</text>
        </g>

        <!-- LVOT LCC -->
        <g class="origin-site" data-site="lvot_lcc" transform="translate(248, 168)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="10" y="-16" width="76" height="16" rx="3" />
          <text class="site-label-text" x="14" y="-4" text-anchor="start">LVOT LCC</text>
        </g>

        <!-- LVOT RCC -->
        <g class="origin-site" data-site="lvot_rcc" transform="translate(210, 168)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-88" y="-18" width="78" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="-6" text-anchor="end">LVOT RCC</text>
        </g>

        <!-- LVOT NCC -->
        <g class="origin-site" data-site="lvot_ncc" transform="translate(230, 205)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-88" y="4" width="78" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="16" text-anchor="end">LVOT NCC</text>
        </g>

        <!-- LV Summit -->
        <g class="origin-site" data-site="lv_summit" transform="translate(230, 115)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="6" />
          <rect class="site-label-bg" x="10" y="-10" width="118" height="16" rx="3" />
          <text class="site-label-text" x="14" y="2" text-anchor="start">LV Summit (GCV/AIV)</text>
        </g>

        <!-- AMC -->
        <g class="origin-site" data-site="amc" transform="translate(276, 195)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="8" y="2" width="60" height="16" rx="3" />
          <text class="site-label-text" x="12" y="14" text-anchor="start">AMC</text>
        </g>

        <!-- TVA / 三尖弁輪外側 (JACC 2024) -->
        <g class="origin-site" data-site="tricuspid_lateral" transform="translate(80, 230)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-96" y="-8" width="86" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="4" text-anchor="end">三尖弁輪外側 (TV)</text>
        </g>

        <!-- ヒス束近傍 / 三尖弁輪中隔 (Parahisian) (JACC 2024) -->
        <g class="origin-site" data-site="parahisian_septal" transform="translate(180, 215)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-115" y="10" width="105" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="22" text-anchor="end">ヒス束近傍 (Parahisian)</text>
        </g>

        <!-- 右室調整帯 (Moderator Band) (JACC 2024) -->
        <g class="origin-site" data-site="moderator_band" transform="translate(100, 290)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-105" y="5" width="95" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="17" text-anchor="end">調整帯 (MB / VFトリガー)</text>
        </g>

        <!-- 心十字部 (Cardiac Crux) (JACC 2024) -->
        <g class="origin-site" data-site="cardiac_crux" transform="translate(225, 305)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-45" y="10" width="90" height="16" rx="3" />
          <text class="site-label-text" x="0" y="22" text-anchor="middle">心十字部 (Crux)</text>
        </g>

        <!-- MVA (僧帽弁輪) -->
        <g class="origin-site" data-site="mva" transform="translate(365, 240)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="8" y="-8" width="68" height="16" rx="3" />
          <text class="site-label-text" x="12" y="4" text-anchor="start">MVA 側壁</text>
        </g>
      </svg>
    `;
  }
}
