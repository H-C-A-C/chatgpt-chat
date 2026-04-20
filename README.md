# ChatGPT Chat App

Node.js + Express で構築したChatGPT APIのチャットアプリ。

## 概要
OpenAI APIを使って、ブラウザ上でChatGPTと会話できる
シンプルなチャットアプリケーションです。
AI活用型Webサービスの学習・実装として制作しました。

## 技術スタック
- Node.js
- Express
- OpenAI API
- HTML / CSS / JavaScript(Vanilla)

## 機能
- ブラウザUIからChatGPTへリアルタイムで質問・回答取得
- 環境変数でAPIキーを管理(.env)
- 会話履歴の保持

## セットアップ
1. 依存パッケージのインストール:`npm install`
2. `.env.example`を参考に`.env`を作成しOpenAI APIキーを設定
3. サーバー起動:`node server.js`
4. ブラウザで`http://localhost:3000`にアクセス

## 制作の意図
ライティング・編集業務の効率化にAIを活用するワークフローを、
自分自身で実装・運用できる形にするための学習プロジェクトです。
