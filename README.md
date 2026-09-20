# CardioOrigin - 12誘導心電図 心室性期外収縮(PVC) 起源推定ナビゲーター

12誘導心電図（ECG）の特徴から、心室性期外収縮（PVC: Premature Ventricular Contraction）や特発性心室頻拍（VT）の発生起源を高精度に推定し、インタラクティブな心臓解剖マップ上にリアルタイム可視化するWebアプリケーションです。

---

## 主な機能

### 1. ハイブリッド入力システム
- **ステップ診断ガイド (Wizard Mode)**:
  - 下壁誘導の電気軸（下軸 vs 上軸 vs 中間軸）
  - V1誘導の形態（LBBB型 vs RBBB型）
  - 胸部誘導の移行帯（Transition Zone: V1〜V6）
  - I誘導極性（陽性 vs 陰性 vs 二相性）
  - 詳細鑑別スライダー（V2S/V3R振幅比、V2 Transition Ratio、MDI、QRS幅）
- **12誘導波形マトリックス (Matrix Mode)**:
  - 12誘導（I, II, III, aVR, aVL, aVF, V1〜V6）それぞれの波形パターン（R, Rs, rS, QS, qR, rsR', Notched R）を視覚的なミニECGモニターで確認しながら設定可能。

### 2. インタラクティブ心臓解剖マップ (SVG)
- **正面・立体ビュー (Anterior 3D)**: 心臓全体の外観と各部位の立体配置。
- **弁輪・流出路見下ろしビュー (Basal / Short-Axis)**: カテーテルアブレーション術者が3Dマッピングで参照する大動脈弁・肺動脈弁・三尖弁・僧帽弁・ヒス束の隣接解剖図。
- **マルチランク・パルス発光**:
  - 第1位（最有力）：エメラルドグリーンの波紋パルス
  - 第2位（有力候補）：シアンのパルス
  - 第3位（鑑別候補）：パープルのパルス
- 部位をクリックすると、解剖分類・心電図特徴・アブレーション時の注意点（冠動脈近接、房室ブロックリスク等）がポップアップ。

### 3. 説明可能な臨床推論 (Explainable Reasoning)
- 推定に至った判断プロセスをステップ順にバッジ付きで解説。
- Ouyang、Betensky、Tada、Danielsなどの代表的文献に基づく基準を提示。

### 4. 豊富な臨床症例プリセット
ワンクリックで代表的な症例を瞬時に読み込み・検証できます：
1. RVOT 後中隔 (Posterior Septum)
2. RVOT 自由壁 (Free Wall)
3. LVOT 左冠尖 (LCC)
4. LV Summit / 心外膜 (Epicardial)
5. 左室後内側乳頭筋 (PMPM)
6. 特発性左室頻拍 (左脚後枝起源)
7. 三尖弁輪 (TVA)
8. 大動脈僧帽弁移行部 (AMC)

---

## 起動方法

スタンドアロンのモダンWebアプリケーション（HTML5 / Vanilla CSS / ES Modules）として構築されているため、ローカルHTTPサーバーで即座に動作します。

```powershell
# Pythonのビルトインサーバーで起動する場合
python -m http.server 8080

# または Node.js の http-server や npx serve を使用する場合
npx serve .
```

ブラウザで `http://localhost:8080` を開いてご利用ください。
