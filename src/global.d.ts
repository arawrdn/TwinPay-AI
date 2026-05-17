interface Window {
  ethereum?: {
    isMiniPay?: boolean;
    isMetaMask?: boolean;
    request?: (...args: any[]) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  };
}
