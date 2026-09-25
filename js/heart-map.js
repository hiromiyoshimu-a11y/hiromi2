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
        if (this.onSiteClick && SITE_DEFINITIONS[siteId]) {
          this.onSiteClick(SITE_DEFINITIONS[siteId]);
        }
      });
    });
  }

  /**
   * 正面・3D斜位視点 SVG (ユーザー提供3D解剖モデル & 部位ラベル配置版)
   */
  getAnteriorSvg() {
    return `
      <svg class="heart-svg" viewBox="0 0 920 620" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <pattern id="hud-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(56, 189, 248, 0.04)" stroke-width="0.5"/>
          </pattern>
        </defs>

        <!-- 背景HUD -->
        <rect width="920" height="620" fill="#060a14"/>
        <rect width="920" height="620" fill="url(#hud-grid)"/>

        <!-- 【ユーザー指定 3D心臓解剖断面図モデル (100%確実表示設定)】 -->
        <g>
          <image href="assets/heart-cross-section.png" xlink:href="assets/heart-cross-section.png" x="250" y="25" width="420" height="560" preserveAspectRatio="xMidYMid meet" opacity="0.98"/>
        </g>

        <!-- ================= 15部位ラベルの左右配置 (矢印指定用) ================= -->

        <!-- 【左側配置ラベル群 (右室・RVOT・ヒス束・心外膜等)】 -->

        <!-- 1. RVOT 自由壁 -->
        <g class="origin-site" data-site="rvot_free_wall" transform="translate(135, 75)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">1. RVOT 自由壁 (Free Wall)</text>
        </g>

        <!-- 2. RVOT 中隔 -->
        <g class="origin-site" data-site="rvot_post_sep" transform="translate(135, 135)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">2. RVOT 中隔 (Septum)</text>
        </g>

        <!-- 3. ヒス束近傍 (パラヒス) -->
        <g class="origin-site" data-site="parahisian_septal" transform="translate(135, 195)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">3. ヒス束近傍 (Para-Hisian)</text>
        </g>

        <!-- 4. 三尖弁輪 (TVA) -->
        <g class="origin-site" data-site="tva" transform="translate(135, 255)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">4. 三尖弁輪 (TVA)</text>
        </g>

        <!-- 5. 右室心尖部 (RV Apex) -->
        <g class="origin-site" data-site="rv_apex" transform="translate(135, 315)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">5. 右室心尖部 (RV Apex)</text>
        </g>

        <!-- 6. RVOT 後外側 -->
        <g class="origin-site" data-site="rvot_posterolateral" transform="translate(135, 375)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">6. RVOT 後外側</text>
        </g>

        <!-- 7. 心外膜 / GCV -->
        <g class="origin-site" data-site="epicardial" transform="translate(135, 435)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">7. 心外膜/GCV (Epicardial)</text>
        </g>

        <!-- 【右側配置ラベル群 (左室・LVOT・大動脈弁・乳頭筋等)】 -->

        <!-- 8. LVOT RCC (右冠尖) -->
        <g class="origin-site" data-site="lvot_rcc" transform="translate(785, 75)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">8. LVOT (RCC 右冠尖)</text>
        </g>

        <!-- 9. LVOT LCC (左冠尖) -->
        <g class="origin-site" data-site="lvot_lcc" transform="translate(785, 135)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">9. LVOT (LCC 左冠尖)</text>
        </g>

        <!-- 10. LVOT NCC (無冠尖) -->
        <g class="origin-site" data-site="lvot_ncc" transform="translate(785, 195)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">10. LVOT (NCC 無冠尖)</text>
        </g>

        <!-- 11. LV Summit -->
        <g class="origin-site" data-site="lv_summit" transform="translate(785, 255)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">11. LV Summit (左室頂部)</text>
        </g>

        <!-- 12. AMC (移行部) -->
        <g class="origin-site" data-site="amc" transform="translate(785, 315)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">12. AMC (大動脈僧帽弁弁膜)</text>
        </g>

        <!-- 13. 僧帽弁輪 (MVA) -->
        <g class="origin-site" data-site="mva" transform="translate(785, 375)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">13. 僧帽弁輪 (Mitral Annulus)</text>
        </g>

        <!-- 14. 前外側乳頭筋 (ALPM) -->
        <g class="origin-site" data-site="alpm" transform="translate(785, 435)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">14. 前外側乳頭筋 (ALPM)</text>
        </g>

        <!-- 15. 後内側乳頭筋 (PMPM) -->
        <g class="origin-site" data-site="pmpm" transform="translate(785, 495)">
          <rect class="site-label-bg" x="-115" y="-18" width="230" height="36" rx="8" fill="rgba(15, 23, 42, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="800">15. 後内側乳頭筋 (PMPM)</text>
        </g>

      </svg>
    `;
  }
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5" />
          <line class="site-leader-line" x1="-188" y1="57" x2="-4" y2="-4" stroke="#ef4444" stroke-width="2.2" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-288" y="39" width="200" height="34" rx="6" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.2" />
          <text class="site-label-text" x="-188" y="62" text-anchor="middle" fill="#ffffff" font-size="14.5" font-weight="800">右室調節帯 (MB)</text>
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
