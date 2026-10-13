/* ZIXO content + navigation config — edit here, the page updates everywhere. */
window.ZIXO = {
  nav: [
    { label: "Features", href: "#features" },
    { label: "Cards", href: "#cards" },
    { label: "Currencies", href: "#currencies" },
    { label: "Swap", href: "#swap" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
    { label: "Help", href: "#faq" }
  ],
  footer: [
    { title: "Product", links: ["Features", "Cards", "Pay & transfer", "Currencies", "Swap", "Pricing"] },
    { title: "Company", links: ["About", "Careers", "Blog", "Business", "Contact"] },
    { title: "Support", links: ["Help centre", "Security", "Download", "Status"] },
    { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Disclosures"] }
  ],
  tabs: {
    ftab: [
      { id: "send", label: "Send" }, { id: "spend", label: "Spend" },
      { id: "save", label: "Save" }, { id: "track", label: "Track" }
    ],
    cgroup: [{ id: "popular", label: "Popular" }, { id: "fiat", label: "Fiat" }, { id: "crypto", label: "Crypto" }],
    swapmode: [{ id: "buy", label: "Buy" }, { id: "sell", label: "Sell" }],
    ctype: [{ id: "virtual", label: "Virtual" }, { id: "physical", label: "Physical" }, { id: "business", label: "Business" }],
    metric: [{ id: "income", label: "Income" }, { id: "expense", label: "Expense" }],
    range: [{ id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "year", label: "Year" }],
    billing: [{ id: "monthly", label: "Monthly" }, { id: "yearly", label: "Yearly · save 20%" }],
    faqcat: [{ id: "account", label: "Account" }, { id: "cards", label: "Cards" }, { id: "fees", label: "Fees" }, { id: "crypto", label: "Crypto" }]
  },
  features: {
    send: { title: "Send money in seconds", body: "Pay anyone by name, phone or account number. Local transfers settle near-instantly; international ones show the arrival time before you pay.", points: ["Saved contacts and recent payees", "Split bills and request money", "Schedule recurring transfers"] },
    spend: { title: "Spend anywhere, safely", body: "Use your ZIXO card online, in store or with Apple Pay and Google Pay. Every payment shows up the moment it happens.", points: ["Virtual cards for subscriptions", "Per-card spending limits", "Merchant names and logos, not codes"] },
    save: { title: "Save toward real goals", body: "Create pots for rent, travel or an emergency fund. Round up card payments and move spare change automatically.", points: ["Goal-based savings pots", "Round-ups on every card payment", "Lock a pot until a date you choose"] },
    track: { title: "Track every naira and dollar", body: "Categories, budgets and monthly overviews update in real time, so you can spot a habit before it becomes a problem.", points: ["Automatic categories", "Monthly budget alerts", "Export statements as PDF or CSV"] }
  },
  currencies: [
    ["USD","US Dollar","$",1,"fiat",1],["EUR","Euro","€",0.921,"fiat",1],["GBP","British Pound","£",0.786,"fiat",1],
    ["NGN","Nigerian Naira","₦",1548.2,"fiat",1],["GHS","Ghanaian Cedi","₵",15.42,"fiat",1],["KES","Kenyan Shilling","KSh",129.3,"fiat",1],
    ["ZAR","South African Rand","R",18.21,"fiat",0],["CAD","Canadian Dollar","C$",1.371,"fiat",0],["AUD","Australian Dollar","A$",1.512,"fiat",0],
    ["JPY","Japanese Yen","¥",149.6,"fiat",0],["CNY","Chinese Yuan","¥",7.12,"fiat",0],["INR","Indian Rupee","₹",83.9,"fiat",0],
    ["AED","UAE Dirham","د.إ",3.673,"fiat",1],["CHF","Swiss Franc","Fr",0.861,"fiat",0],["SEK","Swedish Krona","kr",10.48,"fiat",0],
    ["NOK","Norwegian Krone","kr",10.71,"fiat",0],["DKK","Danish Krone","kr",6.87,"fiat",0],["PLN","Polish Złoty","zł",3.98,"fiat",0],
    ["SGD","Singapore Dollar","S$",1.341,"fiat",0],["HKD","Hong Kong Dollar","HK$",7.79,"fiat",0],["MXN","Mexican Peso","$",19.42,"fiat",0],
    ["BRL","Brazilian Real","R$",5.58,"fiat",0],["EGP","Egyptian Pound","E£",48.6,"fiat",0],["MAD","Moroccan Dirham","DH",9.86,"fiat",0],
    ["XOF","West African CFA","CFA",604.1,"fiat",0],["UGX","Ugandan Shilling","USh",3684,"fiat",0],["TZS","Tanzanian Shilling","TSh",2712,"fiat",0],
    ["RWF","Rwandan Franc","FRw",1352,"fiat",0],["SAR","Saudi Riyal","﷼",3.751,"fiat",0],["TRY","Turkish Lira","₺",34.2,"fiat",0],
    ["BTC","Bitcoin","₿",0.0000158,"crypto",1],["ETH","Ethereum","Ξ",0.000389,"crypto",1],["USDT","Tether","₮",1.0,"crypto",1],
    ["USDC","USD Coin","$",1.0,"crypto",0],["BNB","BNB","B",0.00166,"crypto",0]
  ],
  swapPairs: [
    { a: "BNB", b: "USDT", rate: 604.0, fee: 0.12, balA: "64.57", balB: "187.52", ca: "#F3BA2F", cb: "#26A17B" },
    { a: "BTC", b: "USDT", rate: 63240, fee: 1.8, balA: "0.0421", balB: "187.52", ca: "#F7931A", cb: "#26A17B" },
    { a: "ETH", b: "USDT", rate: 2571, fee: 0.64, balA: "1.284", balB: "187.52", ca: "#627EEA", cb: "#26A17B" },
    { a: "USDC", b: "USD", rate: 0.9998, fee: 0.0, balA: "520.00", balB: "12,480.55", ca: "#2775CA", cb: "#414140" }
  ],
  cards: {
    virtual:  { cls: "pearl", name: "Virtual", sub: "Pearl", last: "6050", spec: [["Issued","Instantly in-app"],["Best for","Online & subscriptions"],["Limit","$5,000 / month"],["Wallets","Apple Pay · Google Pay"]] },
    physical: { cls: "charcoal", name: "Physical", sub: "Charcoal", last: "1184", spec: [["Delivery","3–5 working days"],["Best for","In-store & ATM"],["ATM","2 free withdrawals / mo"],["Material","Recycled PVC"]] },
    business: { cls: "coral", name: "Business", sub: "Coral", last: "7732", spec: [["Issued","Per team member"],["Best for","Team spend"],["Controls","Per-card limits & MCC"],["Receipts","Auto-match in app"]] }
  },
  plans: [
    { id: "basic", name: "Basic", m: 0, y: 0, note: "Free forever", cta: "Get started", feats: ["Virtual card", "Local transfers free", "Hold 5 currencies", "FX fee 0.8%", "In-app chat support"] },
    { id: "pro", name: "Pro", m: 29.99, y: 287.9, note: "", badge: "Most popular", cta: "Start Pro", feats: ["Virtual + Physical card", "Hold 30+ currencies", "FX fee 0.35%", "Crypto swap access", "Savings pots & round-ups", "Priority support"] },
    { id: "platinum", name: "Platinum", m: 49.99, y: 479.9, note: "", cta: "Go Platinum", feats: ["Metal card + 5 virtual", "Unlimited FX at mid-market", "4 free ATM withdrawals", "Business card add-on", "Spending insights export", "Dedicated account manager"] }
  ],
  faq: {
    account: [
      ["Is ZIXO a bank?", "No. ZIXO is a financial technology company. Accounts and deposits are provided by our licensed banking partner, named in the footer once confirmed."],
      ["What do I need to open an account?", "A smartphone, a valid government ID (passport, national ID or driver's licence) and a quick selfie for identity verification. Most accounts are approved in minutes."],
      ["Can I have more than one currency account?", "Yes. Basic lets you hold 5 currencies; Pro and Platinum let you hold 30+ and switch between them instantly."],
      ["How do I close my account?", "Go to Settings → Account → Close account. Move any remaining balance out first; we'll send a final statement by email."]
    ],
    cards: [
      ["How fast do I get a card?", "Virtual cards are ready the moment your account is verified. Physical cards arrive in 3–5 working days in supported regions."],
      ["What if I lose my card?", "Freeze it from the Cards screen in one tap. If you can't find it, report it lost and we'll cancel it and send a replacement."],
      ["Can I set spending limits?", "Yes — per card, per day and per month. Business cards also support merchant-category controls."]
    ],
    fees: [
      ["Are local transfers free?", "Yes, on every plan. International transfers show the exchange rate and fee before you confirm."],
      ["What is the FX fee?", "0.8% on Basic, 0.35% on Pro and mid-market with no markup on Platinum. Rates shown are draft values pending confirmation."],
      ["Are there hidden fees?", "No. Every fee is shown on the confirmation screen before you pay and listed on the pricing page."]
    ],
    crypto: [
      ["Is crypto swap safe?", "Crypto is held by a regulated custody partner. Prices are volatile and can fall as well as rise — only swap what you can afford to lose."],
      ["Which coins are supported?", "BTC, ETH, BNB, USDT and USDC at launch. Availability depends on your country."],
      ["Is crypto covered by deposit insurance?", "No. Crypto assets are not covered by any deposit insurance or compensation scheme."]
    ]
  }
};
