# ハロプロブログ v0.3 — Cloudflare Workers版

Cloudflare Workers Static Assets + `/api/posts` を1つのWorkerで動かす構成です。

## GitHubへ差し替えるファイル
このZIPを展開し、**中身をリポジトリのルートへ**アップロードしてください。

ルート直下が次の形になればOKです。

- `wrangler.jsonc`
- `package.json`
- `src/index.js`
- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `public/sw.js`
- `public/manifest.webmanifest`
- `public/demo.json`
- `public/icons/...`

CloudflareのDeploy commandは `npx wrangler deploy` のままで構いません。
`wrangler.jsonc` により `public/` が静的アセットとして配信され、`/api/*` だけWorkerコードが先に処理します。

## 更新後の確認
1. GitHubへのcommit後、Cloudflareの新しいDeploymentが成功するまで待つ。
2. `https://hellopro-blog.wao219219.workers.dev/` を開く。
3. API確認: `https://hellopro-blog.wao219219.workers.dev/api/posts` を開き、JSONが表示されることを確認。
4. 古いService Workerの影響を避けるため、初回はシークレットウィンドウまたはサイトデータ削除後の確認を推奨。
