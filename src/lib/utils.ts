import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toSquareLettersAndNumbers = (text: string): string => {
  const squareCharMap: { [key: string]: string } = {
    A: "🅰",
    B: "🅱",
    C: "🅲",
    D: "🅳",
    E: "🅴",
    F: "🅵",
    G: "🅶",
    H: "🅷",
    I: "🅸",
    J: "🅹",
    K: "🅺",
    L: "🅻",
    M: "🅼",
    N: "🅽",
    O: "🅾",
    P: "🅿",
    Q: "🆀",
    R: "🆁",
    S: "🆂",
    T: "🆃",
    U: "🆄",
    V: "🆅",
    W: "🆆",
    X: "🆇",
    Y: "🆈",
    Z: "🆉",
    "0": "0️⃣",
    "1": "1️⃣",
    "2": "2️⃣",
    "3": "3️⃣",
    "4": "4️⃣",
    "5": "5️⃣",
    "6": "6️⃣",
    "7": "7️⃣",
    "8": "8️⃣",
    "9": "9️⃣",
    " ": " ", // Preserve spaces
  };

  return text
    .toUpperCase()
    .split("")
    .map((char) => squareCharMap[char] || char) // Map supported chars or return as-is
    .join("");
};


export const toRoundLettersAndNumbers = (text: string): string => {
  const squareCharMap: { [key: string]: string } = {
    A: "🅐", // Uppercase enclosed A
    B: "🅑", // Uppercase enclosed B
    C: "🅒",
    D: "🅓",
    E: "🅔",
    F: "🅕",
    G: "🅖",
    H: "🅗",
    I: "🅘",
    J: "🅙",
    K: "🅚",
    L: "🅛",
    M: "🅜",
    N: "🅝",
    O: "🅞", // Uppercase enclosed O
    P: "🅟", // Uppercase enclosed P
    Q: "🅠",
    R: "🅡",
    S: "🅢",
    T: "🅣",
    U: "🅤",
    V: "🅥",
    W: "🅦",
    X: "🅧",
    Y: "🅨",
    Z: "🅩",
    "0": "⓪",
    "1": "①",
    "2": "②",
    "3": "③",
    "4": "④",
    "5": "⑤",
    "6": "⑥",
    "7": "⑦",
    "8": "⑧",
    "9": "⑨",
    " ": " ",
  };

  return text
    .toUpperCase()
    .split("")
    .map((char) => squareCharMap[char] || char) // Map supported chars or return as-is
    .join("");
};