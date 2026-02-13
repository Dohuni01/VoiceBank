# 🗣️ VoiceBank (소리로 여는 금융)

음성 명령으로 홈/혜택/결제/자산/증권 화면을 오가고, 간단한 금융 동작(충전/송금)을 체험할 수 있는 데모 프로젝트입니다.

## 주요 업그레이드 포인트
- 홈 화면 잔액을 `localStorage`에 저장하여 새로고침 후에도 유지
- 충전/송금 시 입력 정규화 및 상태 메시지(토스트) 추가
- 서브 페이지(혜택/결제/자산/증권)를 실제 정보 카드와 하단 네비게이션으로 개선
- Express 서버에 `/health` 헬스체크 및 OpenAI 키 미설정 안내 추가
- 정적 파일 서빙을 서버에서 바로 처리

## 실행 방법

### 1) 의존성 설치
```bash
cd gpt-voice-server
npm install
```

### 2) 환경 변수 설정
루트 또는 실행 위치에 `.env` 파일을 만들고 아래를 추가하세요.

```bash
OPENAI_API_KEY=your_api_key
PORT=3000
```

### 3) 서버 실행
```bash
node ../server.js
```

실행 후 브라우저에서 아래 경로를 열 수 있습니다.
- `http://localhost:3000/home.html`
- `http://localhost:3000/benefit.html`
- `http://localhost:3000/pay.html`
- `http://localhost:3000/money.html`
- `http://localhost:3000/paper.html`

## API
- `GET /health`: 서버 상태 및 OpenAI 키 설정 여부 반환
- `POST /askgpt`: 음성 인식 텍스트 기반 질의
  - body: `{ "question": "자산창으로 이동해줘" }`

## 참고
- 브라우저의 `SpeechRecognition` 지원 여부에 따라 음성 기능 동작이 달라집니다.
- OpenAI 키가 없더라도 UI는 확인 가능하며, 음성 질의는 안내 메시지를 반환합니다.
