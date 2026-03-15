/**
 * ShawnOS - Context Wiki Data (Japanese, Part 3)
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 *
 * Entries: claude-md, skill-trees, multi-model-optimization,
 *          cli-first-philosophy, co-work-sessions
 */

import type { ContextWikiEntry, ContextWikiCategory } from './context-wiki'

export const PART3: ContextWikiEntry[] = [
  {
    id: 'claude-md',
    title: 'CLAUDE.md',
    subtitle: 'AIチームメイトが毎回のセッション前に読むオンボーディングドキュメント',
    category: 'code',
    description:
      '効果的な CLAUDE.md ファイルの書き方。プロジェクトルートに配置する設定ファイルで、すべてのAIセッションに対して環境のデフォルト値、コードスタイル、動作ルールを設定します。',
    keywords: [
      'claude md file',
      'claude.md',
      'claude code configuration',
      'ai onboarding document',
      'claude md context engineering',
      'project root ai config',
    ],
    difficulty: 'beginner',
    related: [
      'context-repository',
      'skills',
      'grounding',
      'context-engineering',
    ],
    sections: [
      {
        heading: 'CLAUDE.md の役割',
        type: 'prose',
        content:
          'CLAUDE.md ファイルはプロジェクトルートに配置されます。Claude がセッションを開始するとき、最初に読み込むファイルです。AIチームメイトのためのオンボーディングドキュメントだと考えてください。Claude が他のファイルを読む前に、あなたのプロンプトを処理する前に、コードを確認する前に、まず CLAUDE.md を読みます。これにより、システム全体で最も優先度の高いコンテキストとなります。ここに書いた内容が、その後のすべてのやり取りに影響を与えます。',
      },
      {
        heading: '設定の階層構造',
        type: 'pattern',
        content:
          'AIの設定には3つの階層があり、順番に読み込まれます。\n\nCLAUDE.md が最初に読み込まれます。環境のデフォルト値、パッケージ管理ルール、コードスタイルの設定、言語のデフォルト設定。これが基盤です。作業内容に関係なく、すべてのセッションに適用されます。\n\nスキルは呼び出し時に読み込まれます。/deploy と入力すると、デプロイスキルファイルがコンテキストに読み込まれます。/tracker と入力すると、トラッカースキルが読み込まれます。スキルはワークフロー固有のもので、トリガーしない限り読み込まれません。\n\nルールは対応するファイルを開いたときに読み込まれます。ブログ記事を開くと、ブログのフォーマットルールが読み込まれます。コンポーネントを編集すると、コンポーネントパターンルールが読み込まれます。ルールはファイル固有のもので、編集中の内容に基づいて有効になります。\n\nこの階層は重要です。CLAUDE.md がベースラインを設定します。スキルがワークフローのコンテキストを追加します。ルールがファイル固有のコンテキストを追加します。これらが組み合わさることで、あなたが何も説明しなくても、Claude は全体像を把握できます。',
      },
      {
        heading: 'CLAUDE.md に入れるべき内容',
        type: 'pro-tip',
        content:
          'CLAUDE.md は、すべてのセッションに適用される内容に集中させましょう。環境の詳細：OS、シェル、主要なプログラミング言語。パッケージ管理ルール：インストール方法、権限の扱い方、バージョンの確認方法。コードスタイルのデフォルト：JavaScript より TypeScript 優先、フォーマットの設定、インポートの規約。\n\nワークフロー固有の指示を CLAUDE.md に入れてはいけません。それはスキルファイルに属します。ファイル固有のパターンを CLAUDE.md に入れてはいけません。それはルールファイルに属します。CLAUDE.md は短く、汎用的であるべきです。特定の場面でしか適用されないルールは、ここには属しません。\n\n私の CLAUDE.md は数段落です。環境情報、パッケージ管理ルール、言語のデフォルト設定。それだけです。それ以外はすべてスキルとルールに配置し、毎回のセッションでコンテキストウィンドウを消費するのではなく、必要に応じて読み込まれるようにしています。',
      },
      {
        heading: 'よくある間違い：CLAUDE.md への詰め込みすぎ',
        type: 'anti-pattern',
        content:
          'ワークフローのドキュメント全体、コーディング標準、スタイルガイド、プロジェクトアーキテクチャをすべて CLAUDE.md に入れている人を見たことがあります。ファイルが500行以上に膨れ上がります。問題は、Claude が毎回のセッションでそのすべてを読み込むことです。たとえ90%が現在のタスクと無関係でも。これはコンテキストウィンドウの空間を無駄にし、異なるワークフローの指示が互いに矛盾する場合、実際にモデルを混乱させることがあります。\n\nCLAUDE.md はスリムに保ちましょう。汎用的なデフォルトのみ。それ以外はすべてスキル（ワークフロー用）とルール（ファイルパターン用）に移動しましょう。こうすることで、Claude は記録したすべての情報の洪水ではなく、現在のタスクに必要なコンテキストだけを取得します。',
      },
    ],
  },

  {
    id: 'skill-trees',
    title: 'スキルツリー',
    subtitle: '構築したすべてをRPGスタイルで可視化する',
    category: 'code',
    description:
      'GTM OS 全体をマッピングするRPGスタイルのスキルツリーの構築方法。リポジトリのスキャン、能力の分類、見えないものを見えるようにする。AIのためではなく、あなた自身のために。',
    keywords: [
      'skill tree ai',
      'rpg skill tree gtm',
      'skill tree visualization',
      'ai capabilities map',
      'skill tree context engineering',
      'gamification gtm',
    ],
    difficulty: 'advanced',
    related: ['python-for-gtm', 'skills', 'context-repository', 'taxonomy'],
    sections: [
      {
        heading: 'なぜスキルツリーを構築するのか',
        type: 'prose',
        content:
          'リポジトリ全体をスキャンするスキルツリーを構築しました。コンテンツ制作、GTM運営、ボイスシステム、エージェントスキル、インフラストラクチャ。すべてをRPGの進行ツリーにマッピングします。AIに役立つからではなく、自分自身に役立つからです。自分の能力がツリーとしてマッピングされるのを見ると、どこが強くてどこにギャップがあるかがわかります。また、システム全体を具体的なものにしてくれます。誰かにスキルツリーを見せれば、構築したシステムの規模をすぐに理解してもらえます。Markdownファイルの抽象的なリポジトリが、能力の視覚的なインベントリに変わるのです。',
      },
      {
        heading: 'スキャンの仕組み',
        type: 'pattern',
        content:
          '/skilltree スキルはリポジトリをスキャンし、見つけたすべてを分類します。コンテンツはタイプ別にカウントされます：ブログ記事、LinkedIn の下書き、X の投稿、Substack の記事。GTM運営はワークフロー別にカウントされます：パートナーのオンボーディング、キャンペーンの立ち上げ、Web訪問者の識別セットアップ。スキルはカテゴリ別にカウント・一覧表示されます：コンテンツスキル、デプロイスキル、パートナースキル、データスキル。インフラストラクチャの評価：monorepo構造、デプロイパイプライン、cronジョブ、MCP統合。\n\n各カテゴリは量と深さに基づいてレベルが付けられます。コンテンツが0-5個ならレベル1かもしれません。50個以上で複数のフォーマットがあればレベル10かもしれません。レベルは科学的なものではありません。モチベーションのためです。「コンテンツ：レベル7」を見ると、レベル8を目指したくなります。',
      },
      {
        heading: '見えないものを見えるようにする',
        type: 'pro-tip',
        content:
          'スキルツリーの最大の価値は、自分の進捗を自分自身に見えるようにすることです。毎日構築していると、実際にどれだけ作ったかを見失いがちです。リポジトリは成長し、スキルは増え、コンテンツは積み重なります。しかし、可視化しない限り、すべてがバックグラウンドノイズのように感じられます。\n\nスキルツリーはそのノイズをシグナルに変えます。40以上のスキル、100以上のコンテンツ、5つのMCP統合、3つのウェブサイト。アニメーションスプライト付きのRPG進行システム。私がツリーを見るとき、自分が構築したシステムが見えます。他の人がそれを見るとき、自分が構築できるシステムが見えます。それが本当の価値です。データそのものではなく、可視性です。',
      },
    ],
  },

  {
    id: 'multi-model-optimization',
    title: 'マルチモデルAI最適化',
    subtitle: 'ビルド時の静的データを活用して4つのAIモデルを1日1ドル未満で運用する方法',
    category: 'infrastructure',
    description:
      'マルチモデルAIスタックの実践ガイド。タスクを適切なモデルにルーティングする方法、ビルド時に静的JSONを生成してVercelでダッシュボードを動作させる方法、品質を犠牲にせずAPIコストを99%削減する方法。',
    keywords: [
      'multi model ai optimization',
      'ai model cost optimization',
      'ollama local model',
      'build time static json',
      'vercel static data generation',
      'ai agent cost reduction',
      'multi model stack',
      'ai model routing',
    ],
    difficulty: 'advanced',
    related: [
      'model-selection',
      'cron-jobs',
      'deployments-vercel',
      'skills',
    ],
    sections: [
      {
        heading: '単一モデルの問題',
        type: 'prose',
        content:
          'ほとんどの人は一つのAIモデルをすべてに使います。それは額縁を掛けるのに大ハンマーを使うようなものです。使えますが、過剰に支払い、過剰に構築しています。私は Claude Opus で毎日104回のcron APIコールを実行していました。出力価格は $75/100万トークン。WhatsApp の自己チャットループがカスケード返信を生成していました。請求額は1日50ドル。ローカルの14Bモデルで処理できる作業に対してです。解決策はAIの使用をやめることではなく、一つの質問に基づいて各タスクを適切なモデルにルーティングすることでした：人間がその出力を読むのか？',
      },
      {
        heading: '4モデル体制',
        type: 'pattern',
        content:
          '<strong>1. Ollama / Qwen 2.5 14B（無料、ローカル）</strong><br/>Mac Mini M4 Pro で実行。すべての反復的なcronタスクを処理：コミット追跡、RSSモニタリング、ダッシュボードデータ生成、ステータスレポート。これらのタスクは1日4回以上実行されます。Opus の価格では、96回のAPIコールが構造化データ抽出に本物のお金を燃やしていたことになりますが、14Bモデルで十分に処理できます。M4 Pro と24GBメモリで約9GB VRAMで動作します。<br/><br/><strong>2. Claude Sonnet 4（$15/100万出力トークン）</strong><br/>すべての会話、オーケストレーション、エージェント連携。これがメインエージェントです。チャット、WhatsApp、Discord、メモリ管理。Sonnet は Opus より5倍安いですが、会話処理は同等です。品質の差が出るのは長文コンテンツ制作のみです。<br/><br/><strong>3. Claude Opus 4（$75/100万出力トークン）</strong><br/>コンテンツ制作専用。ブログ記事、Substack のエッセイ、LinkedIn の下書き、深い分析。コンテンツ制作はモデルの品質が出力の品質に直接影響する領域です。2000語のエッセイではその差を感じられます。コミットの要約では？差はゼロです。<br/><br/><strong>4. Claude Code / Opus 4.6（無料、Max サブスクリプション）</strong><br/>インフラストラクチャ層。デバッグ、デプロイ、Git操作、アーキテクチャの判断、他のモデルの出力に対する品質レビュー。サブスクリプションで無制限に使用可能。トークン単位の課金なし。重い作業を行う場所です。',
      },
      {
        heading: '判断フレームワーク',
        type: 'formula',
        content:
          'モデルを決める質問は一つ：出力の品質は人間の読者にとって重要か？<br/><br/><strong>cronジョブ（追跡、モニタリング、更新）</strong> -> Ollama ローカル。頻繁に実行、出力は構造化データ、品質は重要ではない。<br/><strong>会話、ルーティング、メモリ</strong> -> Sonnet。リアルタイムのやり取りに十分、Opus より5倍安い。<br/><strong>ブログ記事、エッセイ、コンテンツ</strong> -> Opus。品質が製品であり、人間が読む。<br/><strong>インフラストラクチャ、デバッグ、デプロイ</strong> -> Claude Code。サブスクリプションで無料、完全なコードベースコンテキストが必要。<br/><br/>人間が出力を読まないなら、動作する最も安いモデルを使う。人間が出力を読むなら、予算内で最も良いモデルを使う。インフラに関わるなら、Claude Code を使う。',
      },
      {
        heading: 'ビルド時の静的JSONパターン',
        type: 'pattern',
        content:
          'これが Vercel でダッシュボードを動作させる重要なアーキテクチャパターンです。問題：<code>~/.openclaw/workspace/HEARTBEAT.md</code> のようなローカルファイルを読んだり <code>execSync("git log")</code> を実行するAPIルートは、ローカルでは完璧に動作しますが、Vercel では完全に壊れます。ビルドサーバーはあなたのラップトップのファイルシステムにアクセスできません。<br/><br/>解決策：ビルド時に静的JSONを生成する。JSONをコミットする。Vercel がそれを配信する。<br/><br/>ジェネレータースクリプトがすべてのローカルデータソース（Markdownファイル、cronジョブ設定、Gitログ）を読み取り、構造化JSONを <code>public/data/*.json</code> に書き出します。APIルートは絶対パスではなく、これらのJSONファイルから読み取ります。ジェネレーターは <code>prebuild</code> で実行されるため、毎回のデプロイで最新データを取得できます。cronジョブがデータを再生成し、コミットしてプッシュします。プッシュが更新されたデータでの Vercel の再ビルドをトリガーします。<br/><br/>5つのJSONファイルでダッシュボード全体をカバーします：<code>tasks.json</code> は HEARTBEAT.md のチェックボックスから、<code>calendar.json</code> は Git コミットとcronスケジュールから、<code>memories.json</code> はワークスペースのメモリファイルから、<code>team.json</code> はcronジョブのモデル統計から、<code>status.json</code> はステータス更新のMarkdownから。',
      },
      {
        heading: 'APIルートの変更内容',
        type: 'code',
        content:
          '変更前：すべてのAPIルートにハードコードされた絶対パスとシェルコマンドがありました。<br/><br/><code>const heartbeatPath = "/Users/shawnos.ai/.openclaw/workspace/HEARTBEAT.md"</code><br/><code>execSync("git log --since=...", { cwd: "/Users/shawnos.ai/shawn-gtme-os" })</code><br/><code>const jobsPath = "/Users/shawnos.ai/.openclaw/cron/jobs.json"</code><br/><br/>変更後：すべてのAPIルートは相対的な静的JSONファイルから読み取ります。<br/><br/><code>const dataPath = path.join(process.cwd(), "public/data/tasks.json")</code><br/><code>const data = JSON.parse(fs.readFileSync(dataPath, "utf8"))</code><br/><code>return data.tasks || []</code><br/><br/>execSync なし。絶対パスなし。ファイルシステム依存なし。どこでも動作します。ジェネレータースクリプトがビルド時にすべてのローカルファイルシステムアクセスを処理するため、本番環境のAPIはそれを必要としません。',
      },
      {
        heading: 'データの鮮度を保つ',
        type: 'pattern',
        content:
          'ジェネレーターは2つの場所で実行されます。まず、package.json の <code>prebuild</code> が <code>next build</code> の前に実行されるため、毎回のデプロイで最新データを取得できます。次に、ローカルマシン上のcronジョブがジェネレーターを実行し、新しいJSONをコミットし、GitHub にプッシュします。プッシュが Vercel のデプロイをトリガーします。<br/><br/>データの鮮度はcronの頻度に依存します。30分ごとなら、ダッシュボードが30分以上古くなることはありません。ステータスダッシュボードには十分です。WebSocket やリアルタイムサブスクリプションは必要ありません。cronとGitプッシュと再ビルドの組み合わせは、シンプルで信頼性が高く、無料です。',
      },
      {
        heading: '実際にどれだけ節約できたか',
        type: 'pro-tip',
        content:
          '変更前：すべて Opus。毎日104回のcron APIコール、出力価格 $75/100万トークン。WhatsApp の自己チャットループがカスケード返信を生成。APIコスト 約50ドル/日。<br/><br/>変更後：96回のcronコールを無料のローカル Ollama に移行。残り8回のAPIコールを Sonnet（$15/100万）で。コンテンツ制作は Opus で1日1-2回。自己チャットループを3秒のデバウンスで解消。APIコスト 約0.50ドル/日。<br/><br/>99%のコスト削減です。重要な部分では同じ出力品質を維持。ダッシュボードは Vercel で動作します。チーム名簿は実際のcronジョブデータからのモデル統計を表示します。タスクボードは HEARTBEAT.md の実際のチェックボックスを読み取ります。モックデータなし。ローカル依存なし。本番投入です。',
      },
      {
        heading: 'よくある間違い',
        type: 'anti-pattern',
        content:
          '<strong>すべてに Opus を使う。</strong>最大の金食い虫です。ほとんどのタスクにフロンティアレベルの推論能力は不要です。14Bのローカルモデルで構造化データの抽出は十分に処理できます。<br/><br/><strong>サーバーレス関数からローカルファイルを読む。</strong>本番サーバーはあなたのラップトップではありません。絶対パスは Vercel、AWS Lambda、その他どのクラウドプラットフォームでも必ず失敗します。デプロイ前にデータを生成しましょう。<br/><br/><strong>データがない場合のフォールバックがない。</strong>クラッシュする代わりに、常に空の配列を返しましょう。tasks.json がまだ存在しなければ、[] を返す。ダッシュボードはエラーを出すのではなく、空の状態でレンダリングされるべきです。<br/><br/><strong>APIルートでGitコマンドを実行する。</strong>execSync("git log") はローカルでは動作しますが、Gitリポジトリがない本番環境では失敗します。ビルド時に移動しましょう。<br/><br/><strong>リフレッシュの過剰設計。</strong>ステータスダッシュボードに WebSocket は不要です。cronとGitプッシュと再ビルドの組み合わせで、シンプルかつ信頼性があります。',
      },
    ],
  },

  {
    id: 'cli-first-philosophy',
    title: 'CLIファースト哲学',
    subtitle: 'ターミナルアクセスがなぜ最も重要か、そして自然言語CLIがすべてを変える理由',
    category: 'foundations',
    description:
      'GTMエンジニアのためのCLIファースト哲学。CLIアクセスが最も摩擦が少ない理由、MCPがコンテキストを消費する仕組み、現在CLIを持つツール、そしてClaude Codeによる自然言語CLIの未来。',
    keywords: [
      'cli first',
      'cli philosophy',
      'terminal first',
      'cli vs gui',
      'natural language cli',
      'claude code cli',
      'cli access gtm',
    ],
    sections: [
      {
        heading: 'なぜCLIアクセスが最も重要なのか',
        type: 'prose',
        content:
          'CLIアクセスは、意図から行動までの最も摩擦の少ない経路です。コマンドを入力し、結果を得る。メニューをクリックする必要なし。ページの読み込みを待つ必要なし。ダッシュボードをナビゲートする必要なし。テキスト入力、テキスト出力。<br/><br/>AIエージェントにとって、これはさらに重要です。AIエージェントはテキストを処理します。CLIはテキストを出力します。インターフェースがネイティブなのです。Claude Code が Vercel CLI コマンドを実行するとき、出力を直接読み取ります。ブラウザの自動化なし。スクリーンショットの解析なし。DOMの走査なし。テキストだけです。<br/><br/>MCPは外部ツールへのプログラマティックなアクセスを提供しましたが、コストが伴います。各MCPサーバーはツール定義をコンテキストウィンドウに読み込みます。5つのMCPサーバーがそれぞれ20のツールを持てば、質問する前に20,000-50,000トークンを消費します。マシン上のCLIバイナリは、使用するまでコンテキストコストがゼロです。計算は明確です：ほとんどの操作で、CLIアクセスはより安く、より速く、より信頼性があります。',
      },
      {
        heading: '現在CLIを持つツール',
        type: 'pattern',
        content:
          'CLIのエコシステムは急速に拡大しています。Vercel CLI はサイトのデプロイとインフラの管理を行います。Salesforce CLI (sf) は最も成熟した GTM CLI で、ターミナルから完全なCRM操作が可能です。HubSpot CLI (hs) はCRMオブジェクトとレポートを処理します。GitHub CLI (gh) はリポジトリ、PR、issues を管理します。Attio はCLIアクセスを構築中です。Cargo.ai はターミナルコマンドでパイプライン操作を公開しています。<br/><br/>パターン：CLIを提供するすべてのプラットフォームは、プログラマティックアクセスがファーストクラスであることを示しています。人間のオペレーターだけでなく、自動化のために構築しているのです。使っているツールにCLIがない場合は、APIを確認しましょう。APIがあれば、Claude Code は直接呼び出せます。CLIはAPIコールの便利なラッパーに過ぎません。',
      },
      {
        heading: '自然言語CLIの未来',
        type: 'pro-tip',
        content:
          'Claude Code は自然言語CLIです。sf data query "SELECT Id FROM Account WHERE CreatedDate = TODAY" を覚える代わりに、「今日作成されたすべてのSalesforceアカウントを取得して」と言えばいいのです。Claude Code がコマンドを書き、実行し、出力を解釈します。<br/><br/>これによりCLIを使える人が変わります。構文を覚える必要なし。man ページを読む必要なし。意図を自然言語で記述すれば、エージェントが適切なツールの適切なコマンドに翻訳します。<br/><br/>複合効果：新しくリリースされるCLIはすべて、即座にアクセス可能になります。新しいツールがCLIと共にリリースされた？Claude Code はCLIパターンに関するトレーニング知識に基づいて、初日から使えます。「このツールが存在する」と「このツールを使える」の間の障壁がゼロになります。',
      },
    ],
    related: ['terminal-and-cli', 'mcp-servers', 'context-engineering'],
    difficulty: 'beginner',
  },

  {
    id: 'co-work-sessions',
    title: 'Claude Code コワーク',
    subtitle: '共有フォルダセッションが受動的なドキュメントを能動的なプレイブックに変える',
    category: 'modes',
    description:
      'Claude Code コワークセッションの仕組み。共有フォルダのコンテキスト、SDRが今どう働くべきか、能動的プレイブック対受動的ドキュメント、そしてリポジトリがオンボーディングそのものである理由。',
    keywords: [
      'claude code co-work',
      'co-work sessions',
      'shared ai context',
      'active playbooks',
      'team ai workflow',
      'claude code collaboration',
      'repo as onboarding',
    ],
    sections: [
      {
        heading: 'コワークセッションとは',
        type: 'prose',
        content:
          'コワークセッションは、共有リポジトリを参照する Claude Code のインスタンスです。すべてのチームメンバーが同じコンテキストを取得します：CLAUDE.md のルール、スキル、データファイル、ボイスシステム。AIはセッション開始時にプレイブックを読み込みます。単に保存するだけでなく、実行します。<br/><br/>従来のチームドキュメントは腐敗します。6ヶ月前に書かれた Confluence ページ。誰も更新しない Notion wiki。バージョンが競合する Google Docs。コワークフォルダは異なります。なぜならドキュメントがそのまま自動化だからです。見込み客の調査方法を記述するスキルファイルが、同時にその調査を実行します。エンリッチメントを説明するワークフローが、同時にエンリッチメントを実行します。',
      },
      {
        heading: 'SDRが今どう働くべきか',
        type: 'pattern',
        content:
          '以下を含むフォルダを用意します：CLAUDE.md（チームルール、ボイス、ガードレール）、scripts/（エンリッチメント、スコアリング、キャンペーン自動化）、skills/（リサーチ、アウトリーチ、パイプラインレビュー）、data/（ターゲットアカウント、エンリッチメント結果）。<br/><br/>新しいSDRが参加。フォルダで Claude Code を開く。「Acme社をアウトバウンド用にリサーチして」と言う。エージェントがリサーチスキルを実行します - Exa インテリジェンスを取得し、Apollo でエンリッチメントし、Attio の履歴を確認し、ブリーフを作成します。SDRはオンボーディングドキュメントを一つも読む前に、成果物を出しています。<br/><br/>これが能動的プレイブックモデルです。リポジトリがオンボーディングそのものです。コンテキストはハンドオフファイルを通じてセッション間で蓄積されます。すべてのセッションが前回の上に構築されます。',
      },
      {
        heading: '能動的プレイブック vs 受動的ドキュメント',
        type: 'pro-tip',
        content:
          '受動的ドキュメント：「見込み客を調査するには、LinkedIn を確認し、資金調達を調べ、BuiltWith でテックスタックを確認し、Google Docs にまとめる。」<br/><br/>能動的プレイブック：Claude Code が読み取り、実行するスキルファイル。ブラウザで LinkedIn を確認し、Exa から資金調達情報を取得し、API経由で BuiltWith を照会し、リサーチフォルダにサマリーを書き込みます。同じワークフロー。一方は人間がステップに従う必要があります。もう一方は人間が「この会社をリサーチして」と言うだけです。<br/><br/>組織内のすべての受動的ドキュメントが変換の候補です。ステップを特定し、スキルファイルとして記述し、テストし、共有フォルダにデプロイする。ドキュメントが自動化になります。何をすべきか知っていることと、実際にやることの間のギャップがゼロになります。',
      },
    ],
    related: ['skills', 'context-handoffs', 'parallel-agents'],
    difficulty: 'intermediate',
  },
]

export const CATEGORIES_JA: {
  id: ContextWikiCategory
  label: string
  description: string
  prompt: string
}[] = [
  {
    id: 'foundations',
    label: '基礎概念',
    description:
      'コンテキストエンジニアリングとは何か、コンテキストリポジトリの構築方法、AIが実際に活用するための知識の整理方法',
    prompt: '$ cd ~/context-wiki/foundations/',
  },
  {
    id: 'modes',
    label: 'モードとワークフロー',
    description:
      'プランモード、エージェントモード、並列実行、スキル、モデル選択の考え方',
    prompt: '$ cd ~/context-wiki/modes/',
  },
  {
    id: 'infrastructure',
    label: 'インフラストラクチャ',
    description:
      'GTMエンジニアのためのGit、GitHub、デプロイ、monorepo、スケジュール自動化',
    prompt: '$ cd ~/context-wiki/infrastructure/',
  },
  {
    id: 'code',
    label: 'コードと自動化',
    description:
      'Pythonスクリプト、MCPサーバー、プロジェクト設定、スキルツリーの可視化',
    prompt: '$ cd ~/context-wiki/code/',
  },
]
