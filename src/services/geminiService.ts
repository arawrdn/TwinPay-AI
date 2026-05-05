/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { 
  TwinPayMode, 
  UserProfile, 
  TransactionInput, 
  PersonalityResponse, 
  DecisionResponse, 
  CompareResponse, 
  AutoModeResponse 
} from "../types.ts";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY is missing. TwinPay AI will not be able to process logic.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are "TwinPay AI", a deterministic financial AI that makes transaction decisions and prepares execution data for Celo Mainnet via MiniPay.

You MUST ALWAYS return valid JSON only. No extra text.

BLOCKCHAIN CONTEXT:
* Network: Celo Mainnet
* Wallet: MiniPay, Metamask, Phantom (Celo Support)
* Tokens: CELO, cUSD, USDT, cEUR
* Transactions must be simple, safe, and user-confirmed unless auto_mode is enabled

SECURITY AUDIT (Address Verification):
* You MUST analyze the "recipient" address. 
* "address_valid": true if it looks like a standard Hex address (42 chars, starts with 0x).
* "suspicious_score": 
    0: Known safe format.
    50: Unusual pattern or zero address.
    100: Obviously invalid or malicious-looking.
* "risk_summary": A very brief note about the address safety (e.g., "Address format valid", "Warning: Checksum mismatch", "Suspicious: High-risk pattern").

STRICT OUTPUT RULES:
* Always valid JSON
* No missing fields
* No null values (use 0 or "")
* No extra keys outside schema
* Keep reasoning short (max 1 sentence)
* Confidence between 0 and 1

GLOBAL LOGIC:
* Conservative → minimize spending (strict limits)
* Balanced → reasonable spending
* Aggressive → flexible spending
* Compare price vs budget
* Never suggest negative values

FAILSAFE:
* If recipient missing → set execute=false
* If price invalid → set execute=false
* Always return safe transaction plan
`;

export async function twinPayAI(
  mode: TwinPayMode,
  data: {
    user_profile?: UserProfile;
    transaction?: TransactionInput;
    user_input?: string;
    comparison?: { actual_amount: number; ai_amount: number };
    auto_settings?: { auto_limit: number };
  }
): Promise<any> {
  if (!API_KEY) throw new Error("TwinPay AI requires a Gemini API Key.");

  const prompt = JSON.stringify({ mode, ...data });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    return JSON.parse(text);
  } catch (error) {
    console.error("TwinPay AI Error:", error);
    throw error;
  }
}

// Shortcut methods for better DX

export async function generatePersonality(userInput: string): Promise<PersonalityResponse> {
  return twinPayAI("generate_personality", { user_input: userInput });
}

export async function makeDecision(
  profile: UserProfile, 
  tx: TransactionInput
): Promise<DecisionResponse> {
  return twinPayAI("decision", { user_profile: profile, transaction: tx });
}

export async function compareSpending(
  actual: number, 
  aiAmount: number
): Promise<CompareResponse> {
  return twinPayAI("compare", { comparison: { actual_amount: actual, ai_amount: aiAmount } });
}

export async function checkAutoMode(
  profile: UserProfile, 
  limit: number
): Promise<AutoModeResponse> {
  return twinPayAI("auto_mode", { user_profile: profile, auto_settings: { auto_limit: limit } });
}
