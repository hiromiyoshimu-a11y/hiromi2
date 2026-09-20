/**
 * CardioOrigin - 医療免責事項 & インフォームド・コンセント (Apple App Store Guideline 1.4.1 準拠)
 */

const STORAGE_KEY = 'cardio_origin_medical_disclaimer_accepted_v1';

export function checkAndShowMedicalDisclaimer(onAccepted) {
  const isAccepted = localStorage.getItem(STORAGE_KEY);
  if (isAccepted === 'true') {
    if (onAccepted) onAccepted();
    return;
  }

  showDisclaimerModal(onAccepted);
}

export function showDisclaimerModal(onAccepted) {
  let modalEl = document.getElementById('medical-disclaimer-modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'medical-disclaimer-modal';
    modalEl.className = 'disclaimer-overlay';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="disclaimer-modal-card">
      <div class="disclaimer-header">
        <div class="disclaimer-icon-wrapper">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <h3>医療免責事項およびご利用上の注意</h3>
          <p class="disclaimer-subtitle">Important Medical Disclaimer & Terms of Use</p>
        </div>
      </div>

      <div class="disclaimer-scroll-content">
        <div class="disclaimer-box warning">
          <h4>⚠️ 医療機器非該当および確定診断の禁止</h4>
          <p>
            本アプリケーション<strong>「CardioOrigin」</strong>は、医師・不整脈専門医・医療従事者および医学生の学習・診断支援・臨床推論の補助を目的として開発されたソフトウェアであり、<strong>薬機法（医薬品医療機器等法）に基づく医療機器プログラムではありません。</strong>
          </p>
          <p>
            本アプリが提示する心室性期外収縮（PVC）の発生起源推定、確率、および心電図特徴は、公開された学術文献（Betensky 2011, Yoshida 2011, Ouyang 2002等）に基づくアルゴリズムによる参考情報であり、<strong>確定的な医学的診断・治療方針の決定を行うものではありません。</strong>
          </p>
        </div>

        <div class="disclaimer-box">
          <h4>🩺 臨床現場における最終判断</h4>
          <p>
            患者の実際の診断、治療選択、カテーテルアブレーション適応判断等の最終決定は、必ず担当医師が患者個別の臨床症状、心エコー検査、心臓カテーテル検査、電気生理学的検査（EPS）等の所見を総合的に勘案の上、医師自身の責任において行ってください。
          </p>
        </div>

        <div class="disclaimer-box privacy">
          <h4>🔒 患者プライバシーと完全オンデバイス処理の保証</h4>
          <p>
            本アプリにアップロードまたはカメラ撮影された心電図画像および解析パラメーターは、<strong>お使いの端末内（オンデバイス / ブラウザローカル）でのみ処理されます。</strong>
          </p>
          <p>
            いかなる患者個人情報（氏名、生年月日、ID等）や心電図データも、外部サーバーへ送信・保存・共有されることは一切ありません。
          </p>
        </div>
      </div>

      <div class="disclaimer-footer">
        <label class="disclaimer-checkbox-label">
          <input type="checkbox" id="disclaimer-agree-checkbox">
          <span>上記の内容を十分に理解し、臨床判断の参考補助ツールとして利用することに同意します。</span>
        </label>

        <button type="button" id="disclaimer-accept-btn" class="disclaimer-btn-primary" disabled>
          同意してアプリを開始する
        </button>
      </div>
    </div>
  `;

  const checkbox = modalEl.querySelector('#disclaimer-agree-checkbox');
  const acceptBtn = modalEl.querySelector('#disclaimer-accept-btn');

  checkbox.addEventListener('change', () => {
    acceptBtn.disabled = !checkbox.checked;
  });

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    modalEl.classList.remove('open');
    if (onAccepted) onAccepted();
  });

  modalEl.classList.add('open');
}
