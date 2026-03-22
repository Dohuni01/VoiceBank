import React, { useRef, useState, useEffect } from "react";
import Mic from "../components/Mic";
import SwipePage from "../components/SwipePage";

// 카드 데이터
const ACCOUNTS = [ 
  { bank: "카카오뱅크", barcode: "../../banklogo/barcode.png", qr: "../../banklogo/qr.png", cardIcon: "🏦", mainColor: "bg-gradient-to-br from-yellow-200 to-yellow-400" }, 
  { bank: "국민은행", barcode: "../../banklogo/barcode.png", qr: "../../banklogo/qr.png", cardIcon: "💳", mainColor: "bg-gradient-to-br from-indigo-200 to-indigo-400" }, 
  { bank: "토스뱅크", barcode: "../../banklogo/barcode.png", qr: "../../banklogo/qr.png", cardIcon: "📲", mainColor: "bg-gradient-to-br from-yellow-200 to-yellow-500" },
  { bank: "하나은행", barcode: "../../banklogo/barcode.png", qr: "../../banklogo/qr.png", cardIcon: "🍀", mainColor: "bg-gradient-to-br from-green-200 to-emerald-400" },
  { bank: "신한은행", barcode: "../../banklogo/barcode.png", qr: "../../banklogo/qr.png", cardIcon: "🔷", mainColor: "bg-gradient-to-br from-sky-200 to-sky-400" },
];

// 무한 스크롤용 카드 배열
const getLoopedAccounts = () => [
  ACCOUNTS[ACCOUNTS.length - 1],
  ...ACCOUNTS,
  ACCOUNTS[0]
];

export default function Pay() {
  const scrollRef = useRef(null);
  const [centerIdx, setCenterIdx] = useState(1); // (초기 1, 실제카드)
  const [overlay, setOverlay] = useState(null);
  const LOOPED = getLoopedAccounts();

  // 스크롤 중앙 카드 인덱스 감지
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    let minDist = Infinity;
    let newIdx = centerIdx;
    Array.from(el.children).forEach((child, idx) => {
      const childRect = child.getBoundingClientRect();
      const cardCenter = childRect.top + childRect.height / 2;
      const dist = Math.abs(centerY - cardCenter);
      if (dist < minDist) {
        minDist = dist;
        newIdx = idx;
      }
    });
    setCenterIdx(newIdx);
  };

  // 무한루프 스크롤 처리
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timer;
    const onScroll = () => {
      handleScroll();
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (centerIdx === 0) {
          setTimeout(() => {
            if (el.children[ACCOUNTS.length]) {
              el.children[ACCOUNTS.length].scrollIntoView({ behavior: "auto", block: "center" });
              setCenterIdx(ACCOUNTS.length);
              setTimeout(handleScroll, 80);
            }
          }, 300);
        }
        if (centerIdx === ACCOUNTS.length + 1) {
          setTimeout(() => {
            if (el.children[1]) {
              el.children[1].scrollIntoView({ behavior: "auto", block: "center" });
              setCenterIdx(1);
              setTimeout(handleScroll, 80);
            }
          }, 300);
        }
      }, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line
  }, [centerIdx]);

  // 첫 로드시 카드 중앙 배치
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.children[1]) {
      el.children[1].scrollIntoView({ behavior: "auto", block: "center" });
      setCenterIdx(1);
    }
    // eslint-disable-next-line
  }, []);

  // 실제 중앙 카드 (진짜 카드만 0~4, 복제 제외)
  const acc = ACCOUNTS[(centerIdx - 1 + ACCOUNTS.length) % ACCOUNTS.length];
  const bgColor = acc.mainColor || "bg-[#23232A]";

  return (
    <SwipePage>
      {/* 오버레이가 열려 있으면 해당 카드 색, 아니면 현재 중앙 카드 기준 색 */}
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${overlay ? bgColor : bgColor} relative`}>
        {/* 스크롤 카드 목록 */}
        <div
          ref={scrollRef}
          className="w-full max-w-md h-[550px] my-10 overflow-y-scroll snap-y snap-mandatory flex flex-col gap-6 scrollbar-none"
          style={{
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >

          <style>{`
            .scrollbar-none::-webkit-scrollbar { display: none; }
          `}</style>
          {LOOPED.map((account, idx) => {
            const isCenter = idx === centerIdx-1;
            const scale = isCenter ? "scale-110" : "scale-90";
            const opacity = isCenter ? "opacity-100" : "opacity-60";
            const z = isCenter ? "z-10" : "";
            const shadow = isCenter ? "shadow-2xl" : "shadow";
            return (
              <div
                key={`${account.bank}-${idx}`}
                className={`snap-center transition-all duration-200 bg-white rounded-2xl flex flex-col items-center justify-center py-8 ${scale} ${opacity} ${z} ${shadow} cursor-pointer`}
                onClick={() => setOverlay("barcode")}
                style={{
                  minHeight: 320,
                  margin: "0 auto",
                  width: "90%"
                }}
              >
                <div className="text-5xl mb-4">{account.cardIcon}</div>
                <div className="text-5xl font-bold mb-2 text-gray-900">{account.bank}</div>
                <img src={account.barcode} alt="barcode" className="h-10 object-contain mb-2" />
                <img src={account.qr} alt="qr" className="h-20 object-contain" />
              </div>
            );
          })}
        </div>
        {/* 인덱스 표시 */}
        
        <Mic />
        {/* Overlay */}
        {overlay && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${bgColor}`}
            onClick={() => setOverlay(null)}
          >
            <div
              className="flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={acc.barcode}
                alt="바코드 크게"
                className="w-[95vw] h-[24vw] max-w-xl rounded-xl bg-white object-contain shadow-2xl"
                style={{ aspectRatio: "5/1" }}
                draggable={false}
              />
              <img
                src={acc.qr}
                alt="QR코드 크게"
                className="w-[30vw] h-[30vw] max-w-lg rounded-xl bg-white object-contain shadow-2xl mt-8"
                style={{ aspectRatio: "1/1" }}
                draggable={false}
              />
              
              <div className="text-black font-bold text-5xl mt-4">{acc.bank}</div>
            </div>
          </div>
        )}
      </div>
    </SwipePage>
  );
}
