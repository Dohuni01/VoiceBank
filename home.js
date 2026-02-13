const BALANCE_STORAGE_KEY = 'voicebank-balance';
const CHAT_API_URL = 'http://localhost:3000/askgpt';

let balance = 0;
let isRecording = false;
let recognition = null;
let transcriptAll = '';

function formatWon(amount) {
  return `${amount.toLocaleString()}원`;
}

function parseAmount(input) {
  if (!input) return NaN;
  const normalized = String(input).replace(/[^0-9]/g, '');
  return parseInt(normalized, 10);
}

function showStatus(message) {
  const statusEl = document.getElementById('status-message');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.add('show');
  clearTimeout(showStatus.timer);
  showStatus.timer = setTimeout(() => statusEl.classList.remove('show'), 2200);
}

function saveBalance() {
  localStorage.setItem(BALANCE_STORAGE_KEY, String(balance));
}

function loadBalance() {
  const stored = parseInt(localStorage.getItem(BALANCE_STORAGE_KEY) || '0', 10);
  if (!Number.isNaN(stored) && stored >= 0) {
    balance = stored;
  }
}

function updateBalance() {
  document.getElementById('balance').textContent = formatWon(balance);
  saveBalance();
}

function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

window.closeModal = () => closeModal('modal');
window.closeSendModal = () => closeModal('sendModal');

function setupBalanceFeatures() {
  document.getElementById('chargeBtn').addEventListener('click', () => openModal('modal'));
  document.getElementById('sendBtn').addEventListener('click', () => openModal('sendModal'));

  document.querySelectorAll('.quick-charge').forEach((btn) => {
    btn.addEventListener('click', function quickCharge() {
      const amount = parseInt(this.dataset.amount || '0', 10);
      balance += amount;
      updateBalance();
      showStatus(`${formatWon(amount)} 충전 완료`);
      closeModal('modal');
    });
  });

  document.getElementById('customCharge').addEventListener('click', () => {
    const amount = parseAmount(prompt('충전할 금액을 입력하세요.'));
    if (Number.isNaN(amount) || amount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    balance += amount;
    updateBalance();
    showStatus(`${formatWon(amount)} 충전 완료`);
    closeModal('modal');
  });

  document.getElementById('accountInputBtn').addEventListener('click', () => {
    const account = (prompt('계좌번호를 입력하세요:') || '').trim();
    if (!account) {
      alert('계좌번호를 입력해야 합니다.');
      return;
    }

    const intAmount = parseAmount(prompt('송금할 금액을 입력하세요:'));
    if (Number.isNaN(intAmount) || intAmount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    if (intAmount > balance) {
      alert('잔액이 부족합니다.');
      return;
    }

    balance -= intAmount;
    updateBalance();
    showStatus(`${account} 계좌로 ${formatWon(intAmount)} 송금 완료`);
    closeModal('sendModal');
  });

  ['modal', 'sendModal'].forEach((id) => {
    const layer = document.getElementById(id);
    layer.addEventListener('click', (e) => {
      if (e.target.id === id) closeModal(id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('modal');
      closeModal('sendModal');
    }
  });

  loadBalance();
  updateBalance();
}

function setupNavigation() {
  document.getElementById('nav-home').onclick = () => { location.href = 'home.html'; };
  document.getElementById('nav-benefit').onclick = () => { location.href = 'benefit.html'; };
  document.getElementById('nav-pay').onclick = () => { location.href = 'pay.html'; };
  document.getElementById('nav-money').onclick = () => { location.href = 'money.html'; };
  document.getElementById('nav-paper').onclick = () => { location.href = 'paper.html'; };

  document.querySelectorAll('.service-btn').forEach((btn, idx) => {
    btn.onclick = () => {
      const mapping = ['pay.html', 'money.html', 'benefit.html', 'money.html', 'money.html', 'money.html', 'money.html', 'benefit.html'];
      location.href = mapping[idx] || 'home.html';
    };
  });
}

function setupVoiceFeature() {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceBtn = document.getElementById('voice-btn');

  if (!window.SpeechRecognition) {
    voiceBtn.disabled = true;
    voiceBtn.title = '이 브라우저는 음성 인식을 지원하지 않습니다.';
    return;
  }

  recognition = new window.SpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    transcriptAll = '';
    voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
  };

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcriptAll += event.results[i][0].transcript;
    }
  };

  recognition.onerror = () => {
    isRecording = false;
    voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
    showStatus('음성 인식을 다시 시도해주세요.');
  };

  recognition.onend = () => {
    isRecording = false;
    voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';

    const userSpeech = transcriptAll.trim();
    if (!userSpeech) return;

    window.speechSynthesis.cancel();

    fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: userSpeech }),
    })
      .then((r) => r.json())
      .then((data) => {
        const answer = data.answer || '응답이 없습니다.';
        const moveMatch = answer.match(/페이지 이동: (home\.html|benefit\.html|pay\.html|money\.html|paper\.html)/);
        if (moveMatch) {
          location.href = moveMatch[1];
          return;
        }

        const tts = new SpeechSynthesisUtterance(answer);
        tts.lang = 'ko-KR';
        window.speechSynthesis.speak(tts);
      })
      .catch(() => {
        showStatus('음성 서버 연결에 실패했습니다.');
      });
  };

  voiceBtn.onclick = () => {
    window.speechSynthesis.cancel();

    if (!isRecording) {
      recognition.start();
      isRecording = true;
      voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
    } else {
      recognition.stop();
    }
  };
}

setupBalanceFeatures();
setupNavigation();
setupVoiceFeature();
