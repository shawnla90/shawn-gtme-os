---
title: "Googleがすべての Workspace APIをラップするCLIをリリースした"
date: "2026-03-06"
excerpt: "gwsはすべてのGoogle Workspace APIをシェルコマンドに変換する新しいCLIで、Claude Code用の89のエージェントスキルを備えている。セットアップし、実際のGTM業務でテストし、27のスキルを選び、一度に全部ロードしてはいけない理由を学んだ。"
---

## gwsとは何か

Googleが`gws`というCLIを静かにリリースした。すべてのWorkspace APIをラップする。Gmail、Drive、Calendar、Sheets、Docs、Tasks。すべて。1つのコマンドラインツール。

しかし本当のポイントはエージェントスキルだ。89個。Claude Code専用に構築されている。`npx skills add`でインストールすれば、コーディングエージェントが受信トレイを読み、カレンダーを確認し、スプレッドシートに追記し、タスクを作成できるようになる。MCPサーバーの設定不要。APIキーのコピペ不要。カスタムミドルウェア不要。

何ヶ月もGoogle APIアクセスをつなぎ合わせてきた。OAuthフロー、MCPサーバー、JSONパース、スコープ管理。動くが、脆くてメンテナンスが面倒だ。`gws`はそのすべてを、ネイティブにJSONを話す単一の認証済みCLIで置き換える。

注意点：正式にサポートされたGoogleプロダクトではない。READMEにそう書いてある。しかし動くし、公式のGoogle Discovery Service上に構築されているため、APIサーフェスは本物だ。

## セットアップ（実際のコマンド）

実行した正確なシーケンスがこれだ。要約なし。実際のコマンドだ。

**ステップ1：GCPプロジェクトを設定する**

```bash
gcloud config set project gen-lang-client-0948745603
```

APIが有効になっている既存のプロジェクトを使う。私のはGemini APIプロジェクトで、すでにGmail APIが有効だった。

**ステップ2：必要なAPIを有効にする**

```bash
gcloud services enable \
  drive.googleapis.com \
  sheets.googleapis.com \
  calendar-json.googleapis.com \
  docs.googleapis.com \
  tasks.googleapis.com
```

Gmail APIはすでに有効だった。残りは1コマンドで済んだ。

**ステップ3：OAuthデスクトップクライアントを作成する**

`gws auth setup`が自動化できない唯一のステップだ。GCPコンソールに手動で行く必要がある：

1. OAuth同意画面を設定する（External、自分のメール、すべての画面を保存して進む）
2. 認証情報を作成、OAuthクライアントID、デスクトップアプリタイプ
3. `client_secret_*.json`ファイルをダウンロード
4. `~/.config/gws/client_secret.json`に配置

`gws auth setup`コマンドはこれを自動でやろうとするが、バリデーションエラーに当たる。コンソールで行う必要がある。3分で済んだ。

**ステップ4：スコープ付きサービスで認証する**

```bash
gws auth login -s drive,gmail,calendar,sheets,tasks,docs
```

ブラウザが開き、サインインし、6つのサービスへのアクセスを許可する。`-s`フラグが重要だ。テストモードのアプリには25スコープの上限がある。使うサービスだけにスコープを絞ることで、余裕を持って制限内に収まる。

**ステップ5：検証する**

```bash
gws auth status
```

認証情報が存在し、どのサービスが認可されているか表示されるはずだ。

## どのスキルをインストールするか（そしてコンテキストウィンドウを壊さない方法）

`gws`には89のエージェントスキルが付属する。全部インストールするな。27個をアクティブスキルディレクトリにインストールすることすらするな。これは身をもって学んだ。

`~/.claude/skills/`内のすべてのスキルは、すべてのセッションでエージェントのコンテキストウィンドウに読み込まれる。27スキルは約50KBの指示で、あいさつする前にClaudeが読む量だ。Reactコンポーネントを編集したりデプロイをデバッグしている時、そのGoogle Workspaceのコンテキストはどれも関係ない。トークンを食うノイズでしかない。

**正しい手法：アクティブコンテキストに1スキルをインストール。残りは駐車する。**

`gws-shared`をアクティブスキルにインストールする。基盤レイヤーだ。認証方法、グローバルフラグの使用、出力のフォーマットをClaudeに教える。約2KB。デフォルトで読み込む必要があるのはこれだけだ。

```bash
npx skills add googleworkspace/cli --skill gws-shared --agent claude-code -y -g
```

その他必要なものは駐車ディレクトリにインストールする：

```bash
# install to global skills repo (not auto-loaded)
npx skills add googleworkspace/cli --skill gws-gmail gws-calendar gws-sheets gws-drive gws-tasks gws-docs --agent claude-code -y -g

# move them out of auto-load
mkdir -p ~/.claude/skills-available
mv ~/.claude/skills/gws-gmail ~/.claude/skills-available/
mv ~/.claude/skills/gws-calendar ~/.claude/skills-available/
# ... etc for each skill
```

GWS集中セッション（受信トレイのトリアージ、カレンダーレビュー、スプレッドシート作業）をしたい時は、必要なものをシンボリックリンクで戻す：

```bash
ln -s ~/.claude/skills-available/gws-gmail ~/.claude/skills/gws-gmail
ln -s ~/.claude/skills-available/gws-gmail-triage ~/.claude/skills/gws-gmail-triage
```

終わったら外す。コンテキストウィンドウは有限だ。メモリとして扱え。ゴミ箱として扱うな。

## 持っておく価値のある27スキル

インストールして駐車したものがこれだ。機能別にグループ化。

**基盤（常に読み込み）**

`gws-shared` - 認証、グローバルフラグ、出力フォーマット。`~/.claude/skills/`に残す唯一のもの。

**コアサービス（6スキル）**

Workspace APIごとに1スキル：`gmail`、`calendar`、`sheets`、`drive`、`tasks`、`docs`。各サービスのあらゆるエンドポイントを呼ぶ能力をClaude Codeに与える。汎用的だが完全。

**ヘルパー（9スキル）**

生のAPIコールを構築する手間を省く、目的別の操作：

- `gmail-send`、`gmail-triage`、`gmail-watch` - メール送信、受信トレイの一括トリアージ、新着メッセージの監視
- `calendar-agenda`、`calendar-insert` - スケジュール確認、イベント作成
- `sheets-read`、`sheets-append` - 範囲の読み取り、行の追記
- `drive-upload` - ファイルのアップロード
- `docs-write` - ドキュメントの作成と編集

実際に手を伸ばすのはこれらだ。コアサービススキルはヘルパーがカバーしないものへのフォールバック。

**ワークフロー（5スキル）**

複数サービスを連鎖させる複合操作：

- `workflow` - 汎用のマルチステップオーケストレーション
- `standup-report` - カレンダー + タスク + Gmailを朝のブリーフに引き出す
- `meeting-prep` - 今後のミーティングのコンテキスト収集
- `email-to-task` - メールをGoogle Tasksに変換
- `weekly-digest` - 全サービスの週次サマリー

**レシピ（6スキル）**

GTMに関連する具体的な自動化：

- `draft-email-from-doc` - Google Docsをメール下書きに変換
- `email-drive-link` - DriveファイルをメールでShareする
- `find-free-time` - カレンダーの空き状況確認
- `create-task-list` - 新しいタスクリストの作成
- `review-overdue-tasks` - 遅延しているものを浮上させる
- `log-deal-update` - ディールノートをトラッキングシートに追記

**スキップしたもの（62スキル）**

Chat、Classroom、Keep、Meet、Admin Reports、Model Armor、Slides、Forms、People、Events。およびそれらすべての関連ヘルパー/レシピ。

GTM業務をしているソロオペレーターや小チームなら、教室管理やアドミンレポートは不要だ。実際のワークフローに合うものをインストールしろ。後からいつでも追加できる。

## 実際のコマンド

実際にはこう見える。

**最新のメールを確認：**

```bash
gws gmail users messages list --params '{"userId":"me","maxResults":1}'
```

**Driveファイルを一覧表示：**

```bash
gws drive files list --params '{"pageSize":5}'
```

**今日のカレンダーを確認：**

```bash
gws calendar calendarList list
```

**タスクリストを一覧表示：**

```bash
gws tasks tasklists list
```

すべてのコマンドがクリーンなJSONを返す。それがポイントだ。Claude Codeがパースし、推論し、マルチステップのワークフローにアダプターコードなしでつなげられる。

## 注意点

**OAuthスコープ制限。** テストモードのアプリは25スコープが上限。6サービスなら余裕を持って収まるが、すべてを一度に有効にしようとすると壁にぶつかる。

**シェルのエスケープ。** Sheetsの範囲は`!`を使う（`Sheet1!A1:B10`のように）。bashでは`!`がヒストリ展開をトリガーする。パラメータはシングルクォートで囲む。

**正式にはサポートされていない。** リポジトリのREADMEに明記されている。これはGoogleプロダクトではない。Google APIの上に構築されたツールだ。今日は動く。6ヶ月後に動くかどうかは、Googleがメンテナンスを続けるかどうかによる。

**27スキルをアクティブコンテキストに読み込むな。** これをやって即座に問題に気づいた。50KBのWorkspaceの指示が、必要かどうかに関わらずすべてのセッションで読み込まれる。`gws-shared`をアクティブに維持し、残りは`skills-available`ディレクトリに駐車し、セッションごとに必要なものをシンボリックリンクで引き入れろ。

**npx skills addはリポジトリをクローンする。** 各スキルのインストールでリポジトリ全体を引く。初回は遅い。受け入れろ。

**JSONパラメータがどこにでも。** すべての`--params`フラグがJSON文字列を受け取る。シェル内のシングルクォートJSONに慣れるか、ファイルからパイプしろ。

## 率直な感想

`gws`は本物の問題を解決する。エージェント用にGoogle Workspace APIをつなぎ合わせることは、GTMインフラ構築で最も面倒な部分の1つだった。OAuthフロー、MCPサーバー設定、スコープ管理、トークンリフレッシュ。すべて価値を生まない摩擦だ。

このツールはその摩擦のほとんどを取り除く。1つのCLI。1つの認証フロー。JSON入力、JSON出力。Claude Codeに直接プラグインする89スキル。

スキルの品質にはバラつきがある。コアサービスのラッパーは堅実だ。ワークフロースキルの一部は初期段階の印象。しかし基盤は正しく、公式のGoogle Discovery Serviceの上に構築されているため、APIカバレッジは手作りではなく完全だ。

Claude Codeをプライマリエージェントとして動かすソロGTMオペレーターにとって、これは私が見つけたGoogle Workspaceインテグレーションへの最もクリーンなパスだ。ワークフローに合うスキルをインストールし、アクティブコンテキストの外に駐車し、実際に必要な時に引き入れろ。コンテキストウィンドウはスタックで最も高価なリソースだ。そのセッションで使っていないサービスの指示で埋めるな。

それが私がやったことだ。そして27個全部を一度にロードした部分はすぐに元に戻した。

shawn ⚡
