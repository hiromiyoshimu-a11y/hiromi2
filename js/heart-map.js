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
   * 正面・3D斜位視点 SVG (ユーザー作成PPTと100%完全一致座標 & 大文字高視認性版)
   */
  getAnteriorSvg() {
    return `
      <svg class="heart-svg" viewBox="0 0 1200 896" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 背景フェード・減光グラデーションマスク -->
          <radialGradient id="vignette-mask" cx="50%" cy="50%" r="55%">
            <stop offset="78%" stop-color="#ffffff" stop-opacity="1"/>
            <stop offset="95%" stop-color="#ffffff" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <mask id="heart-vignette">
            <rect width="1200" height="896" fill="url(#vignette-mask)"/>
          </mask>

          <!-- 太く鮮明な赤色矢印マーカー -->
          <marker id="arrow-red-large" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444"/>
          </marker>

          <!-- サイバースキャングリッド -->
          <pattern id="hud-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(56, 189, 248, 0.04)" stroke-width="0.5"/>
          </pattern>
        </defs>

        <!-- 背景HUDグリッド -->
        <rect width="1200" height="896" fill="#060a14"/>
        <rect width="1200" height="896" fill="url(#hud-grid)"/>

        <!-- 【高精細・解剖断面3D立体心臓イラスト (参考画像PPTと100%同一解剖構造)】 -->
        <g mask="url(#heart-vignette)">
          <image href="assets/heart_3d_cross_section.jpg?v=12" x="0" y="0" width="1200" height="896" preserveAspectRatio="none" opacity="0.98"/>
        </g>

        <!-- ================= 起源部位マーカー & 視認性極大化赤枠ラベル ================= -->

        <!-- 【右側配置ラベル群 (左室・大動脈弁側)】 -->

        <!-- 1. LVOT RCC (右冠尖) : ターゲット (558, 302) -->
        <g class="origin-site" data-site="lvot_rcc" transform="translate(558, 302)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="137" y1="-272" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="42" y="-291" width="190" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="137" y="-266" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">LVOT (RCC)</text>
        </g>

        <!-- 2. LVOT NCC (無冠尖) : ターゲット (608, 412) -->
        <g class="origin-site" data-site="lvot_ncc" transform="translate(608, 412)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="287" y1="-332" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="192" y="-351" width="190" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="287" y="-326" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">LVOT (NCC)</text>
        </g>

        <!-- 3. LVOT LCC (左冠尖) : ターゲット (616, 442) -->
        <g class="origin-site" data-site="lvot_lcc" transform="translate(616, 442)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="299" y1="-302" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="204" y="-321" width="190" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="299" y="-296" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">LVOT (LCC)</text>
        </g>

        <!-- 4. LV Summit (心外膜) : ターゲット (626, 466) -->
        <g class="origin-site" data-site="lv_summit" transform="translate(626, 466)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="309" y1="-266" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="219" y="-285" width="180" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="309" y="-260" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">LV summit</text>
        </g>

        <!-- 5. 僧帽弁輪 : ターゲット (672, 468) -->
        <g class="origin-site" data-site="mva" transform="translate(672, 468)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="273" y1="-198" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="188" y="-217" width="170" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="273" y="-192" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">僧帽弁輪</text>
        </g>

        <!-- 6. AMC (移行部) : ターゲット (638, 502) -->
        <g class="origin-site" data-site="amc" transform="translate(638, 502)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="297" y1="-162" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="202" y="-181" width="190" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="297" y="-156" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">AMC (移行部)</text>
        </g>

        <!-- 7. 前外側乳頭筋 (ALPM) : ターゲット (672, 588) -->
        <g class="origin-site" data-site="alpm" transform="translate(672, 588)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="263" y1="-168" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="133" y="-187" width="260" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="263" y="-162" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="800">前外側乳頭筋 (ALPM)</text>
        </g>

        <!-- 8. 後内側乳頭筋 (PMPM) : ターゲット (645, 648) -->
        <g class="origin-site" data-site="pmpm" transform="translate(645, 648)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="290" y1="-148" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="160" y="-167" width="260" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="290" y="-142" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="800">後内側乳頭筋 (PMPM)</text>
        </g>

        <!-- 9. 左脚後枝 : ターゲット (652, 708) -->
        <g class="origin-site" data-site="fascicular_post" transform="translate(652, 708)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="283" y1="-128" x2="6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="193" y="-147" width="180" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="283" y="-122" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">左脚後枝</text>
        </g>

        <!-- 【左側配置ラベル群 (右室・RVOT側)】 -->

        <!-- 10. RVOT中隔 : ターゲット (552, 508) -->
        <g class="origin-site" data-site="rvot_post_sep" transform="translate(552, 508)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="-287" y1="-238" x2="-6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-382" y="-257" width="190" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="-287" y="-232" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">RVOT中隔</text>
        </g>

        <!-- 11. RVOT自由壁 : ターゲット (512, 532) -->
        <g class="origin-site" data-site="rvot_free_wall" transform="translate(512, 532)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="-247" y1="-182" x2="-6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-357" y="-201" width="220" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="-247" y="-176" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">RVOT自由壁</text>
        </g>

        <!-- 12. ヒス束近傍 (パラヒス) : ターゲット (506, 582) -->
        <g class="origin-site" data-site="parahisian_septal" transform="translate(506, 582)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="-241" y1="-152" x2="-6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-361" y="-171" width="240" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="-241" y="-146" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">ヒス束近傍 (パラヒス)</text>
        </g>

        <!-- 13. 三尖弁輪 (TVA) : ターゲット (478, 638) -->
        <g class="origin-site" data-site="tva" transform="translate(478, 638)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="-213" y1="-128" x2="-6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-308" y="-147" width="190" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="-213" y="-122" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">三尖弁輪 (TVA)</text>
        </g>

        <!-- 14. 右室乳頭筋 : ターゲット (538, 692) -->
        <g class="origin-site" data-site="rv_papillary" transform="translate(538, 692)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="-273" y1="-102" x2="-6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-378" y="-121" width="210" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="-273" y="-96" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">右室乳頭筋</text>
        </g>

        <!-- 15. 右室調節帯 (MB) : ターゲット (572, 698) -->
        <g class="origin-site" data-site="moderator_band" transform="translate(572, 698)">
          <circle class="site-ring" cx="0" cy="0" r="14" />
          <circle class="site-dot" cx="0" cy="0" r="7" />
          <line class="site-leader-line" x1="-307" y1="-28" x2="-6" y2="-6" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red-large)" />
          <rect class="site-label-bg" x="-427" y="-47" width="240" height="38" rx="8" fill="rgba(7, 12, 24, 0.94)" stroke="#ef4444" stroke-width="2.5" />
          <text class="site-label-text" x="-307" y="-22" text-anchor="middle" fill="#ffffff" font-size="17.5" font-weight="800">右室調節帯 (MB)</text>
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
