---
title: "リポジトリをデータベースのようにクエリする"
date: "2026-02-22"
excerpt: "6プラットフォームにまたがる100以上のコンテンツファイルが不透明になっていた。そこでSQLiteインデックスを構築し、リポジトリ全体をコマンドラインからクエリ可能にした。"
---

## 問題

リポジトリには100以上のコンテンツファイルがあった。LinkedInの下書き、Xのスレッド、Substackのニュースレター、Redditの投稿、ウェブサイトのブログ記事、TikTokのスクリプト。6つのプラットフォームにまたがり、下書きと最終稿のステージに分かれている。ディレクトリ構造はきれいだったが、データは不透明だった。ファイルを手作業でスキャンしなければ、基本的な質問にも答えられなかった。

今週、LinkedInの投稿は何件ファイナルになった？ クロスプラットフォームの兄弟コンテンツはどれ？ 2月の総語数は？ デプロイ済みのアセットとソースのまま放置されているアセットはどれ？

ファイルシステムは整理に最適だ。クエリには最悪だ。

## 解決策：派生SQLiteデータベース

`scripts/build_index.py`がリポジトリを走査し、すべてのコンテンツファイルをパースし、結果を`data/index.db`の9テーブルのSQLiteデータベースにロードする。外部依存ゼロ - 標準ライブラリのみ。json、sqlite3、pathlib、re。それだけだ。

このインデックスは派生データだ。gitで管理されたファイルから実行のたびにリビルドされる。データベースを削除し、スクリプトを実行すれば、同じ結果が得られる。信頼の源泉は常にリポジトリだ。データベースはその上に載せたクエリレイヤーにすぎない。

```
$ python3 scripts/build_index.py

Building index: data/index.db
  Content:      80 files indexed
  Daily logs:   11 days indexed
  Skills:       54 indexed
  Assets:       522 visual assets indexed
  Videos:       3 video files indexed
  Content links: 75 series-sibling pairs detected
```

## スキーマ

9つのテーブル。それぞれが異なるコンテンツタイプをインデックスする。

**content** - コアテーブル。すべてのプラットフォームにわたるすべての下書きと最終稿。フィールドにはplatform、stage、title、slug、date、pillar、arc、series、word countが含まれる。メタデータは2つのフォーマットからパースされる：ほとんどのプラットフォームでは引用構文（`> **Key**: Value`）、ウェブサイトの投稿ではYAMLフロントマター。

**daily_logs** - デイリートラッカーからのパフォーマンスメトリクス。output score、レターグレード、語数、出荷数、エージェントコスト、ROI倍率、コミット数。

**sessions** - コンテキストハンドオフの履歴。このテーブルは追記専用で、インデックスのリビルドでも保持される。他のすべてのテーブルはドロップして再作成される。sessionsが永続するのは、派生データではなく歴史的な記録だからだ。

**skills** - ClaudeとCursorのスキルレジストリ。54のスキルがname、description、file path、categoryでインデックスされている。

**content_links** - 関係グラフ。2つのリンクタイプがある：`series_sibling`（同じ日付とslugで異なるプラットフォーム。自動検出）と`cross_platform_note`（Cross-Platform Notesセクションからパースされた明示的な参照）。

**assets** - プログレッションシステム全体の522のビジュアルアセット。ティアアバター、クラスバッジ、ツールアイコン、Nioバリアント、スプライトシート。ファイル名パターンが構造化データにパースされる：`tier-3-idle-256.gif`はasset_type=tier、tier=3、variant=idle、size_px=256になる。

**videos** - ブランド、アスペクト比、フォーマット、デプロイ状況を持つ動画ファイルカタログ。

**thumbnails** - ブランドとバリアント別のサムネイルインベントリ。

## クエリCLI

`scripts/query_index.py`は読み取り専用のインターフェースだ。フィルタリング付きの8つのサブコマンドがある。

```
$ python3 scripts/query_index.py content --platform linkedin --since 2026-02-15
$ python3 scripts/query_index.py stats --latest 3
$ python3 scripts/query_index.py skills --category claude
$ python3 scripts/query_index.py links --date 2026-02-17
$ python3 scripts/query_index.py assets --site shawnos --type tier --tier 3
$ python3 scripts/query_index.py videos --brand gtmos --source-only
```

出力モード：テーブル（デフォルト）、JSON（`--json`）、行数（`--count`）。テーブル出力は人間が読みやすい。JSON出力は他のスクリプトにパイプできる。

## クロスプラットフォームのリンク検出

ここからが面白くなる。このインデックスはファイルをカタログ化するだけでなく、ファイル間の関係を発見する。

**暗黙的な兄弟検出**：プラットフォーム間で同一の（date、slug）を持つファイルは`series_sibling`としてリンクされる。`linkedin/final/2026-02-17_build-your-own-os.md`と`substack/final/2026-02-17_build-your-own-os.md`があれば、こちらが指示しなくても、インデックスはそれらが関連していることを知っている。

**明示的なクロスリファレンス検出**：スクリプトが`## Cross-Platform Notes`セクションをパースし、エイリアス付きのプラットフォームキーワード（LinkedIn、X/Twitter、Reddit）を探し、日付とプラットフォームで既存のコンテンツにマッチさせる。

現在のインデックスで75の兄弟ペアと4つの明示的なクロスリンク。コンテンツグラフは実在し、クエリ可能だ。

## デッドページの検出

この投稿が存在する理由がこれだ。インデックスが自身のギャップを明らかにした。

content_linksからのインバウンドリンクがゼロのファイルをcontentテーブルからクエリする。それらは孤児だ - 存在するが何も参照していないコンテンツ。アウトバウンドリンクがゼロのファイルもクエリする。それらは行き止まりだ - 他に何も接続していないコンテンツ。

それらのクエリを実行したところ、3つの主要システムがブログでまったく取り上げられていないことが判明した。Remotionの動画システム、このSQLiteインデックス自体、そしてコンテンツクラスタートポロジーだ。コンテンツのギャップを見つけるツールが、そのツール自体についてのコンテンツのギャップを明らかにした。

## 再帰的なメタ

この投稿は、それが説明するシステムの直接的な成果だ。SQLiteインデックスがリポジトリをクエリ可能にした。クエリにより、インデックスを取り上げたコンテンツがないことが判明した。だからこの投稿を書いた。インデックスをリビルドすれば、この投稿がその中に現れる。システムが自分自身をドキュメント化する。

これはギミックではない。これがコンテンツエンジニアリングの命題だ。システムがシステムを説明するコンテンツを生産する。新しい機能はすべて新しいコンテンツになる。新しいコンテンツはすべてナレッジグラフを強化する。ループが複利で効いてくる。

`$ python3 scripts/query_index.py content --platform website --stage final`
