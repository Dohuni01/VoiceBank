import React, { useState } from "react";
import SwipePage from "../components/SwipePage";
import Mic from "../components/Mic";

const payMoney = 1_643_056;

const CHARGE_BUTTONS = [
  { label: "100만원", value: 1000000 },
  { label: "50만원", value: 500000 },
  { label: "30만원", value: 300000 },
  { label: "20만원", value: 200000 },
  { label: "10만원", value: 100000 },
  { label: "직접 입력하기", value: "custom" },
];

const HISTORY = [
  { month: 5, detail: "5월: 충전 100,000원" },
  { month: 4, detail: "4월: 충전 300,000원" },
  { month: 3, detail: "3월: 충전 200,000원" },
  { month: 2, detail: "2월: 충전 400,000원" },
  { month: 1, detail: "1월: 충전 150,000원" },
];

export default function Benefit() {
  const [mode, setMode] = useState("main"); // main, charge, history
  const [custom, setCustom] = useState("");
  const [focus, setFocus] = useState({ idx: null, type: null });

  // 텍스트만 확대
  const getTextSize = (type, idx = null) => {
    const focused = focus.type === type && (focus.idx === idx || idx === null);
    switch (type) {
      case "title":
        return focused ? "text-5xl" : "text-3xl";
      case "money":
        return focused ? "text-3xl" : "text-lg";
      case "modeBtn":
        return focused ? "text-4xl" : "text-2xl";
      case "historyList":
        return focused ? "text-2xl" : "text-lg";
      case "chargeBtn":
        return focused ? "text-3xl" : "text-xl";
      case "maxMsg":
        return focused ? "text-xl" : "text-sm";
      default:
        return "";
    }
  };

  return (
    <SwipePage>
      <div className="flex flex-col items-center min-h-screen bg-[#ece9f9] px-4 pt-10 transition-colors duration-300">
        {/* 상단 Pay머니 영역 */}
        <div className="w-full max-w-md flex flex-col items-center bg-white rounded-2xl shadow-md px-6 py-7 mb-8">
          <div
            className={`text-3xl font-extrabold text-[#251c4c] mb-1 transition-transform duration-200 cursor-pointer ${getTextScale("title")}`}
            onPointerDown={() => setFocus({ type: "title" })}
            onPointerUp={() => setFocus({ type: null })}
            onPointerLeave={() => setFocus({ type: null })}
            onMouseEnter={() => setFocus({ type: "title" })}
            onMouseLeave={() => setFocus({ type: null })}
          >
            페이머니
          </div>
          <div
            className={`text-lg text-gray-700 font-bold mb-2 transition-transform duration-200 cursor-pointer ${getTextScale("money")}`}
            onPointerDown={() => setFocus({ type: "money" })}
            onPointerUp={() => setFocus({ type: null })}
            onPointerLeave={() => setFocus({ type: null })}
            onMouseEnter={() => setFocus({ type: "money" })}
            onMouseLeave={() => setFocus({ type: null })}
          >
            {payMoney.toLocaleString()}원
          </div>
        </div>

        {/* 머니내역/충전 버튼 */}
        <div className="w-full max-w-md flex gap-3 mb-8">
          <button
            className={`
              flex-1 py-3 rounded-xl font-bold text-2xl shadow transition
              ${mode === "history"
                ? "bg-[#5742b6] text-white"
                : "bg-white text-[#5742b6] hover:bg-[#ede6ff]"}
              ${getTextScale("modeBtn", 0)}
            `}
            onClick={() => setMode("history")}
            onPointerDown={() => setFocus({ type: "modeBtn", idx: 0 })}
            onPointerUp={() => setFocus({ type: null })}
            onPointerLeave={() => setFocus({ type: null })}
            onMouseEnter={() => setFocus({ type: "modeBtn", idx: 0 })}
            onMouseLeave={() => setFocus({ type: null })}
          >
            머니내역
          </button>
          <button
            className={`
              flex-1 py-3 rounded-xl font-bold text-2xl shadow transition
              ${mode === "charge"
                ? "bg-[#5742b6] text-white"
                : "bg-white text-[#5742b6] hover:bg-[#ede6ff]"}
              ${getTextScale("modeBtn", 1)}
            `}
            onClick={() => setMode("charge")}
            onPointerDown={() => setFocus({ type: "modeBtn", idx: 1 })}
            onPointerUp={() => setFocus({ type: null })}
            onPointerLeave={() => setFocus({ type: null })}
            onMouseEnter={() => setFocus({ type: "modeBtn", idx: 1 })}
            onMouseLeave={() => setFocus({ type: null })}
          >
            충전
          </button>
        </div>

        {/* 본문 영역 */}
        <div className="w-full max-w-md flex-1 flex flex-col items-center">
          {/* 머니내역 모드 */}
          {mode === "history" && (
            <div className="w-full flex flex-col gap-4">
              {HISTORY.map((item, idx) => (
                <div
                  key={item.month}
                  className={`
                    flex items-center gap-4 bg-white px-5 py-4 rounded-lg shadow
                    transition-transform duration-200 cursor-pointer
                    ${getTextScale("historyList", idx)}
                  `}
                  onPointerDown={() => setFocus({ type: "historyList", idx })}
                  onPointerUp={() => setFocus({ type: null })}
                  onPointerLeave={() => setFocus({ type: null })}
                  onMouseEnter={() => setFocus({ type: "historyList", idx })}
                  onMouseLeave={() => setFocus({ type: null })}
                >
                  <div className="text-2xl font-bold text-[#857661]">{item.month}월</div>
                  <div className="text-gray-700 text-base">{item.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* 충전 모드 */}
          {mode === "charge" && (
            <div className="w-full flex flex-col items-center">
              <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full mb-6">
                {CHARGE_BUTTONS.slice(0, 5).map((btn, idx) => (
                  <button
                    key={btn.label}
                    className={`
                      h-20 rounded-2xl bg-white text-[#5742b6] font-bold text-xl shadow hover:bg-[#ede6ff] transition
                      transition-transform duration-200 cursor-pointer
                      ${getTextScale("chargeBtn", idx)}
                    `}
                    onPointerDown={() => setFocus({ type: "chargeBtn", idx })}
                    onPointerUp={() => setFocus({ type: null })}
                    onPointerLeave={() => setFocus({ type: null })}
                    onMouseEnter={() => setFocus({ type: "chargeBtn", idx })}
                    onMouseLeave={() => setFocus({ type: null })}
                  >
                    {btn.label}
                  </button>
                ))}
                <button
                  key={CHARGE_BUTTONS[5].label}
                  className={`
                    h-20 rounded-2xl bg-white text-[#5742b6] font-bold text-base shadow hover:bg-[#ede6ff] transition col-span-3
                    transition-transform duration-200 cursor-pointer
                    ${getTextScale("chargeBtn", 5)}
                  `}
                  onClick={() => setCustom("직접입력")}
                  onPointerDown={() => setFocus({ type: "chargeBtn", idx: 5 })}
                  onPointerUp={() => setFocus({ type: null })}
                  onPointerLeave={() => setFocus({ type: null })}
                  onMouseEnter={() => setFocus({ type: "chargeBtn", idx: 5 })}
                  onMouseLeave={() => setFocus({ type: null })}
                >
                  {CHARGE_BUTTONS[5].label}
                </button>
              </div>
              {/* 직접 입력시 입력창 노출 (옵션) */}
              {custom && (
                <input
                  type="number"
                  className="w-full py-3 px-4 rounded-lg border mt-2 text-lg"
                  placeholder="금액 입력 (원)"
                  value={custom === "직접입력" ? "" : custom}
                  onChange={e => setCustom(e.target.value)}
                  // 확대 효과 예시 (입력창 전체)
                  style={{
                    transition: "transform 0.2s",
                    transform:
                      focus.type === "customInput" ? "scale(1.15)" : "scale(1)",
                  }}
                  onFocus={() => setFocus({ type: "customInput" })}
                  onBlur={() => setFocus({ type: null })}
                />
              )}
              <div
                className={`text-sm text-gray-500 mt-2 transition-transform duration-200 cursor-pointer ${getTextScale("maxMsg")}`}
                onPointerDown={() => setFocus({ type: "maxMsg" })}
                onPointerUp={() => setFocus({ type: null })}
                onPointerLeave={() => setFocus({ type: null })}
                onMouseEnter={() => setFocus({ type: "maxMsg" })}
                onMouseLeave={() => setFocus({ type: null })}
              >
                최대 1,839,120원 충전 가능
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto w-full flex justify-center pb-8">
          <Mic />
        </div>
      </div>
    </SwipePage>
  );
}
