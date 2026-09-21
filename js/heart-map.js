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
   * 正面・3D斜位視点 SVG (リアル3D心臓レンダリング & 精密解剖同期版)
   */
  getAnteriorSvg() {
    return `
      <svg class="heart-svg" viewBox="0 0 600 448" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 背景フェード・周辺減光グラデーションマスク -->
          <radialGradient id="vignette-mask" cx="50%" cy="50%" r="52%">
            <stop offset="68%" stop-color="#ffffff" stop-opacity="1"/>
            <stop offset="92%" stop-color="#ffffff" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <mask id="heart-vignette">
            <rect width="600" height="448" fill="url(#vignette-mask)"/>
          </mask>

          <!-- サイバースキャングリッド -->
          <pattern id="hud-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.05)" stroke-width="0.5"/>
          </pattern>
        </defs>

        <!-- 背景HUDグリッド -->
        <rect width="600" height="448" fill="#070c18"/>
        <rect width="600" height="448" fill="url(#hud-grid)"/>

        <!-- リアルな3D心臓解剖レンダリング画像 (600x448 のviewBoxと1:1完全一致) -->
        <g mask="url(#heart-vignette)">
          <image href="assets/heart_3d_anterior.jpg" x="0" y="0" width="600" height="448" preserveAspectRatio="none" opacity="0.95"/>
        </g>

        <!-- 解剖方位ガイド & センター十字 -->
        <circle cx="310" cy="225" r="200" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-dasharray="3 4"/>

        <!-- ================= 解剖学的主要ランドマーク表示 (画像上の構造と直結) ================= -->
        <!-- 上行大動脈 (Aorta) -->
        <g transform="translate(270, 75)">
          <circle cx="0" cy="0" r="2.5" fill="#f87171"/>
          <line x1="0" y1="0" x2="-40" y2="-35" stroke="rgba(248,113,113,0.5)" stroke-width="1" stroke-dasharray="2 2"/>
          <rect x="-135" y="-45" width="92" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="rgba(248,113,113,0.4)" stroke-width="0.8"/>
          <text x="-89" y="-32" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700">Aorta (上行大動脈)</text>
        </g>

        <!-- 肺動脈幹 (PA) -->
        <g transform="translate(355, 145)">
          <circle cx="0" cy="0" r="2.5" fill="#38bdf8"/>
          <line x1="0" y1="0" x2="45" y2="-40" stroke="rgba(56,189,248,0.5)" stroke-width="1" stroke-dasharray="2 2"/>
          <rect x="48" y="-50" width="88" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.4)" stroke-width="0.8"/>
          <text x="92" y="-37" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="700">PA (肺動脈幹)</text>
        </g>

        <!-- 心尖部 (Apex) - 左室最尖端の正確な解剖位置 (367, 418) -->
        <g transform="translate(367, 418)">
          <circle cx="0" cy="0" r="3" fill="#38bdf8"/>
          <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(56,189,248,0.7)" stroke-width="1.2" stroke-dasharray="2 2"/>
          <rect x="-42" y="14" width="84" height="16" rx="4" fill="rgba(15,23,42,0.9)" stroke="rgba(56,189,248,0.4)" stroke-width="0.8"/>
          <text x="0" y="26" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-weight="700">Apex (心尖部)</text>
        </g>

        <!-- 前室間溝 (LAD前下行枝走行部) -->
        <g transform="translate(325, 280)">
          <circle cx="0" cy="0" r="2" fill="#fda4af"/>
          <line x1="0" y1="0" x2="-20" y2="0" stroke="rgba(253,164,175,0.5)" stroke-width="0.8" stroke-dasharray="2 2"/>
          <text x="-24" y="3" text-anchor="end" fill="#fda4af" font-size="8" font-weight="600">LAD (前下行枝)</text>
        </g>


        <!-- ================= 起源部位マーカー群 (整然とした引き出し線 & 解剖完全一致) ================= -->

        <!-- ===== 【左側配置群 (上から順に整然と配置・交差ゼロ)】 ===== -->

        <!-- 1. LVOT RCC (右冠尖) : 点 (280, 175) -> ラベル Y=150 -->
        <g class="origin-site" data-site="lvot_rcc" transform="translate(280, 175)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="-170" y2="-25" />
          <rect class="site-label-bg" x="-270" y="-34" width="100" height="18" rx="4" />
          <text class="site-label-text" x="-220" y="-21" text-anchor="middle">LVOT RCC (右冠尖)</text>
        </g>

        <!-- 2. RVOT 後中隔 : 点 (287, 200) -> ラベル Y=190 -->
        <g class="origin-site" data-site="rvot_post_sep" transform="translate(287, 200)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="-177" y2="-10" />
          <rect class="site-label-bg" x="-277" y="-19" width="100" height="18" rx="4" />
          <text class="site-label-text" x="-227" y="-6" text-anchor="middle">RVOT 後中隔</text>
        </g>

        <!-- 3. LVOT NCC (無冠尖) : 点 (282, 212) -> ラベル Y=230 -->
        <g class="origin-site" data-site="lvot_ncc" transform="translate(282, 212)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="-172" y2="18" />
          <rect class="site-label-bg" x="-272" y="9" width="100" height="18" rx="4" />
          <text class="site-label-text" x="-222" y="22" text-anchor="middle">LVOT NCC (無冠尖)</text>
        </g>

        <!-- 4. RVOT 自由壁 : 点 (252, 220) -> ラベル Y=270 -->
        <g class="origin-site" data-site="rvot_free_wall" transform="translate(252, 220)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="-142" y2="50" />
          <rect class="site-label-bg" x="-242" y="41" width="100" height="18" rx="4" />
          <text class="site-label-text" x="-192" y="54" text-anchor="middle">RVOT 自由壁</text>
        </g>

        <!-- 5. 三尖弁輪 TVA : 点 (210, 265) -> ラベル Y=310 -->
        <g class="origin-site" data-site="tva" transform="translate(210, 265)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="-100" y2="45" />
          <rect class="site-label-bg" x="-200" y="36" width="100" height="18" rx="4" />
          <text class="site-label-text" x="-150" y="49" text-anchor="middle">三尖弁輪 (TVA)</text>
        </g>

        <!-- 6. 特発性左室頻拍 (左脚後枝 - ILVT) : 点 (330, 375) -> ラベル Y=360 -->
        <g class="origin-site" data-site="fascicular_post" transform="translate(330, 375)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="-220" y2="-15" />
          <rect class="site-label-bg" x="-320" y="-24" width="100" height="18" rx="4" />
          <text class="site-label-text" x="-270" y="-11" text-anchor="middle">左脚後枝 (ILVT)</text>
        </g>


        <!-- ===== 【右側配置群 (上から順に整然と配置・交差ゼロ)】 ===== -->

        <!-- 7. LVOT LCC (左冠尖) : 点 (305, 160) -> ラベル Y=140 -->
        <g class="origin-site" data-site="lvot_lcc" transform="translate(305, 160)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="185" y2="-20" />
          <rect class="site-label-bg" x="185" y="-29" width="100" height="18" rx="4" />
          <text class="site-label-text" x="235" y="-16" text-anchor="middle">LVOT LCC (左冠尖)</text>
        </g>

        <!-- 8. LV Summit (心外膜) : 点 (340, 185) -> ラベル Y=180 -->
        <g class="origin-site" data-site="lv_summit" transform="translate(340, 185)">
          <circle class="site-ring" cx="0" cy="0" r="11" />
          <circle class="site-dot" cx="0" cy="0" r="6" />
          <line class="site-leader-line" x1="0" y1="0" x2="150" y2="-5" />
          <rect class="site-label-bg" x="150" y="-14" width="108" height="18" rx="4" />
          <text class="site-label-text" x="204" y="-1" text-anchor="middle">LV Summit (心外膜)</text>
        </g>

        <!-- 9. RVOT 前中隔 : 点 (315, 207) -> ラベル Y=220 -->
        <g class="origin-site" data-site="rvot_ant_sep" transform="translate(315, 207)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="175" y2="13" />
          <rect class="site-label-bg" x="175" y="4" width="100" height="18" rx="4" />
          <text class="site-label-text" x="225" y="17" text-anchor="middle">RVOT 前中隔</text>
        </g>

        <!-- 10. AMC (大動脈僧帽弁移行部) : 点 (352, 215) -> ラベル Y=260 -->
        <g class="origin-site" data-site="amc" transform="translate(352, 215)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="138" y2="45" />
          <rect class="site-label-bg" x="138" y="36" width="100" height="18" rx="4" />
          <text class="site-label-text" x="188" y="49" text-anchor="middle">AMC (移行部)</text>
        </g>

        <!-- 11. 僧帽弁輪 MVA : 点 (402, 250) -> ラベル Y=300 -->
        <g class="origin-site" data-site="mva" transform="translate(402, 250)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="88" y2="50" />
          <rect class="site-label-bg" x="88" y="41" width="100" height="18" rx="4" />
          <text class="site-label-text" x="138" y="54" text-anchor="middle">僧帽弁輪 (MVA)</text>
        </g>

        <!-- 12. ALPM (前外側乳頭筋) : 点 (375, 310) -> ラベル Y=340 -->
        <g class="origin-site" data-site="alpm" transform="translate(375, 310)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="115" y2="30" />
          <rect class="site-label-bg" x="115" y="21" width="108" height="18" rx="4" />
          <text class="site-label-text" x="169" y="34" text-anchor="middle">前外側乳頭筋 (ALPM)</text>
        </g>

        <!-- 13. PMPM (後内側乳頭筋) : 点 (355, 355) -> ラベル Y=380 -->
        <g class="origin-site" data-site="pmpm" transform="translate(355, 355)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <line class="site-leader-line" x1="0" y1="0" x2="135" y2="25" />
          <rect class="site-label-bg" x="135" y="16" width="108" height="18" rx="4" />
          <text class="site-label-text" x="189" y="29" text-anchor="middle">後内側乳頭筋 (PMPM)</text>
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

        <!-- TVA (三尖弁輪) -->
        <g class="origin-site" data-site="tva" transform="translate(85, 230)">
          <circle class="site-ring" cx="0" cy="0" r="10" />
          <circle class="site-dot" cx="0" cy="0" r="5.5" />
          <rect class="site-label-bg" x="-78" y="-8" width="68" height="16" rx="3" />
          <text class="site-label-text" x="-10" y="4" text-anchor="end">TVA 側壁</text>
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
