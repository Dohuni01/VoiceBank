const path = require('path');

function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (error) {
    return require(path.join(__dirname, 'gpt-voice-server', 'node_modules', moduleName));
  }
}

const express = safeRequire('express');
const cors = safeRequire('cors');
const { OpenAI } = safeRequire('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const balance = '1,000,000원';

function createPrompt(question) {
  return `
아래는 사용자가 VoiceBank 홈/자산/결제/혜택/증권 페이지에서 음성명령으로 요청하는 내용이야.

- 만약 사용자가 "페이지 이동"이나 "창 이동" 같은 명령(예: 자산창으로 이동해줘, 결제창으로 가줘, 혜택 보여줘 등)을 했으면
  반드시 아래 중 하나의 파일명만 골라서
  "페이지 이동: [파일명]" 이렇게만 답해줘.
  - home.html (홈)
  - benefit.html (혜택)
  - pay.html (결제)
  - money.html (자산/머니)
  - paper.html (증권/페이퍼)
- 단순히 정보(예: 내 자산 얼마야, 혜택 뭐 있어, 결제 설명해줘 등)를 물어보면 이동 명령 없이 자연스럽게 답해줘.

[자산 정보]
현재 자산은 ${balance}입니다.

[사용자 질문]
${question}
`;
}

app.get('/health', (req, res) => {
  res.json({ ok: true, openaiConfigured: Boolean(OPENAI_API_KEY) });
});

app.post('/askgpt', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    res.status(400).json({ answer: '질문이 없습니다.' });
    return;
  }

  if (!openai) {
    res.json({ answer: '서버에 OPENAI_API_KEY가 설정되지 않았습니다.' });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: createPrompt(question) }],
      max_tokens: 300,
    });

    const answer = completion.choices?.[0]?.message?.content || '응답이 없습니다.';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ answer: `에러 발생: ${err.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중!`);
});
