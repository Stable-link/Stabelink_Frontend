import { createThirdwebClient, defineChain } from "thirdweb";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID ?? "";

export const thirdwebClient = createThirdwebClient({
  clientId: clientId || "YOUR_CLIENT_ID", // Get from https://thirdweb.com/dashboard
});

// Etherlink Shadownet (chainId 127823) - same as backend
export const etherlinkShadownet = defineChain({
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: { name: "Tezos", symbol: "XTZ", decimals: 18 },
  rpc: "https://node.shadownet.etherlink.com",
  blockExplorers: [
    {
      name: "Etherlink Explorer",
      url: "https://shadownet.explorer.etherlink.com",
    },
  ],
});
