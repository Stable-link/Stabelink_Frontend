/**
 * InvoicePayments contract (Etherlink).
 * Address from VITE_INVOICE_PAYMENTS_ADDRESS; USDC from VITE_USDC_ADDRESS.
 */

export const INVOICE_PAYMENTS_ADDRESS =
  (import.meta.env.VITE_INVOICE_PAYMENTS_ADDRESS as string) ||
  "0x53849FBA026AFFF682F578B38e3133C2D582E8A9";

export const USDC_ADDRESS =
  (import.meta.env.VITE_USDC_ADDRESS as string) || "";

export const FAUCET_ADDRESS =
  (import.meta.env.VITE_FAUCET_ADDRESS as string) || "";

/** Must match InvoicePayments constructor; required for createInvoice splits. */
export const PLATFORM_FEE_RECIPIENT =
  (import.meta.env.VITE_PLATFORM_FEE_RECIPIENT as string) || "";

// Minimal ABI for createInvoice, withdraw, balances
export const INVOICE_PAYMENTS_ABI = [
  {
    type: "function",
    name: "createInvoice",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "token", type: "address", internalType: "address" },
      {
        name: "splits",
        type: "tuple[]",
        internalType: "struct InvoicePayments.Split[]",
        components: [
          { name: "recipient", type: "address", internalType: "address" },
          { name: "percentage", type: "uint16", internalType: "uint16" },
        ],
      },
    ],
    outputs: [{ name: "invoiceId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balances",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

// Faucet ABI
export const FAUCET_ABI = [
  {
    type: "function",
    name: "claim",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "canClaim",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "canClaim", type: "bool" },
      { name: "timeUntilClaim", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

// ERC20 ABI for checking token balance
export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const;
