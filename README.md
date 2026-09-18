# ハロプロブログ PWA v0.2

iPhoneの「ホーム画面に追加」で使う個人向けPWAです。確定したUI仕様を実装し、実ブログ取得APIを追加しました。

## 実装済み
- 起動時は「最新記事」／20件＋「さらに読み込む」
- 30日以内の記事を対象（APIが取得できる範囲）
- 48時間以内＋未読のみ NEW
- 記事を開くと既読、既読カードは薄く表示
- お気に入り ☆/★、お気に入り記事の控えめなキラキラ演出
- メンバーカラーをカード左端ラインに表示
- グループ別2列タイル＋48時間未読件数
- メンバーカラー丸付きメンバー絞り込み
- ライト／ダーク手動切替
- 起動／プル更新のカラフルドット演出
- 新着がある時だけ「新しい記事が○件」表示
- 相対時間、タイトル2行省略、左サムネイル
- PWA manifest / Service Worker / iPhone用アイコン
- Cloudflare Worker / Pages Function の実データAPI
- API未接続時はデモデータへ自動フォールバック

## データ取得
`/api/posts` がAmebaの公式ブログRSSとUP-FRONTの研修生リハーサル日記を取得して共通JSONに変換します。
対象ブログはHello! Project公式「ブログ／SNS一覧」に合わせた構成です。

注意：Ameba RSSが返す最新件数には上限があります。そのため、投稿数が非常に多いブログでは「30日分すべて」を取り切れない場合があります。v0.2では安定性を優先してRSSを使用しています。

## Cloudflare Pagesで公開（推奨）
1. このフォルダをGitHubリポジトリへアップロード。
2. Cloudflare Pagesでそのリポジトリを接続。
3. Framework preset: None / Build command: 空欄 / Build output directory: `/`（ルート）としてデプロイ。
4. `functions/api/posts.js` が `/api/posts` として動作します。
5. 発行されたHTTPS URLをiPhoneのSafariで開く。
6. 共有 →「ホーム画面に追加」。

※環境によってPagesのルート構成が合わない場合は、静的ファイルをルートに置いた状態でデプロイしてください。

## Workerを別URLで使う場合
`worker/worker.js` をCloudflare Workersへデプロイし、ブラウザで一度だけ以下を設定できます。
`localStorage.setItem('hp_api','https://YOUR-WORKER.workers.dev'); location.reload();`

## 補足
Ameba側のHTML/RSS仕様変更、外部画像の配信制限などで取得方法は将来調整が必要になる場合があります。メンバーカラーはアプリ内設定値なので、公式変更時は `worker/worker.js` の `COLORS` を更新できます。
