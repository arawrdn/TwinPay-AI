/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Wallet, Shield, Zap, Target } from "lucide-react";
import { UserProfile } from "../types";

interface WalletCardProps {
  profile: UserProfile;
  address: string;
}

export default function WalletCard({ profile, address }: WalletCardProps) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="text-[10px] uppercase text-muted font-bold tracking-widest">Vault Balances</div>
        <div className="text-[9px] font-mono opacity-40 uppercase tracking-tighter" title={address}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center group">
          <span className="text-sm text-ghost group-hover:text-white transition-colors">CELO (Native)</span>
          <span className="text-sm font-bold tracking-tight font-mono text-celo-gold">{(profile.current_balance).toLocaleString(undefined, { minimumFractionDigits: 4 })}</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-sm text-ghost group-hover:text-white transition-colors">cUSD (MiniPay)</span>
          <span className="text-sm font-bold tracking-tight font-mono">{(profile.current_balance * 0.7).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-sm text-ghost group-hover:text-white transition-colors">USDT</span>
          <span className="text-sm font-bold tracking-tight font-mono">{(profile.current_balance * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-sm text-ghost group-hover:text-white transition-colors">cEUR</span>
          <span className="text-sm font-bold tracking-tight font-mono">{(profile.current_balance * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="h-[1px] bg-line my-4"></div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F4F4F7]">Net Balance</span>
          <span className="text-lg font-bold text-celo-green font-mono">
            ${profile.current_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
