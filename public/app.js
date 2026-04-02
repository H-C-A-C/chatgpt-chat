const messagesEl = document.getElementById('messages');
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const welcome = document.getElementById('welcome');

// file://から開かれた場合はExpressサーバーの絶対URLを使用
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

// 会話履歴（サーバーに送る配列）
let history = [];

// --- テキストエリアの自動リサイズ ---
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
});

// --- Enter で送信、Shift+Enter で改行 ---
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', clearChat);

// --- メッセージ追加 ---
function appendMessage(role, text) {
  welcome.classList.add('hidden');

  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  scrollToBottom();
  return msg;
}

// --- タイピングインジケーター ---
function showTyping() {
  welcome.classList.add('hidden');

  const msg = document.createElement('div');
  msg.className = 'message ai typing';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = '<div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  scrollToBottom();
  return msg;
}

// --- スクロール ---
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// --- 送信処理 ---
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || sendBtn.disabled) return;

  // UI リセット
  userInput.value = '';
  userInput.style.height = 'auto';
  setLoading(true);

  // ユーザーメッセージ表示
  appendMessage('user', text);

  // 履歴に追加
  history.push({ role: 'user', content: text });

  // タイピング表示
  const typingEl = showTyping();

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    typingEl.remove();

    if (!res.ok) {
      appendMessage('ai', `エラー: ${data.error || 'サーバーエラーが発生しました'}`);
      // エラー時は履歴から最後のユーザーメッセージを削除
      history.pop();
    } else {
      appendMessage('ai', data.reply);
      history.push({ role: 'assistant', content: data.reply });
    }
  } catch (err) {
    typingEl.remove();
    appendMessage('ai', 'ネットワークエラーが発生しました。サーバーが起動しているか確認してください。');
    history.pop();
  } finally {
    setLoading(false);
    userInput.focus();
  }
}

// --- ローディング状態 ---
function setLoading(bool) {
  sendBtn.disabled = bool;
  userInput.disabled = bool;
}

// --- リセット ---
function clearChat() {
  history = [];
  messagesEl.innerHTML = '';
  welcome.classList.remove('hidden');
}
