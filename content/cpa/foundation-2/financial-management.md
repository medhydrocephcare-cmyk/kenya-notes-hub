# Financial Management

**Course:** CPA — Certified Public Accountant
**Level:** Foundation Level 2
**Last updated:** 28 July 2026
**Syllabus version:** Based on the standard KASNEB CPA Foundation Level 2 Financial Management syllabus structure (time value of money, capital budgeting, sources of finance, and working capital management). Authored from general professional finance knowledge and standard syllabus topic coverage, not copied from any existing notes provider. Cross-check the topic list against the current official KASNEB syllabus gazette before the exam.

> **Original work notice.** Every explanation, example, and question in this document was written from scratch for this paper. No text has been copied or paraphrased from any KASNEB past paper, textbook, or third-party notes website. Practice questions are original scenarios written to test the same competencies KASNEB examines — they are not reproductions of real KASNEB exam questions. All numerical workings in this document have been independently recalculated and verified before publication.

---

## Table of contents

1. Introduction to financial management
2. Time value of money
3. Capital budgeting techniques
4. Sources of finance
5. Cost of capital
6. Working capital management
7. Full worked investment appraisal question
8. Self-assessment question bank (with model answers)
9. Exam technique and revision checklist

---

## 1. Introduction to financial management

**Financial management** is concerned with planning, organising, directing, and controlling the financial activities of an organisation — principally, decisions about how to raise funds (financing) and how to deploy them (investment).

### 1.1 The objective of financial management

The primary objective is generally taken to be **maximisation of shareholder wealth**, rather than simple profit maximisation. Profit maximisation ignores the timing of returns, the risk associated with earning them, and can be manipulated by accounting choices in a single period; wealth maximisation (typically proxied by the market value of the firm's shares) accounts for the size, timing, and risk of cash flows over the long run.

### 1.2 Key financial management decisions

| Decision | Question it answers |
|---|---|
| Investment decision | Which assets/projects should the business invest in? |
| Financing decision | How should those investments be funded — debt, equity, or a mix? |
| Dividend decision | How much profit should be retained for reinvestment vs distributed to shareholders? |
| Working capital decision | How should short-term assets and liabilities be managed to keep operations liquid and efficient? |

---

## 2. Time value of money

A shilling today is worth more than a shilling in the future, because today's shilling can be invested to earn a return. This principle underlies almost all financial management decisions.

### 2.1 Future value

```
FV = PV × (1 + r)^n
```
where PV is the present sum, r is the interest/discount rate per period, and n is the number of periods.

**Worked example:** KSh 50,000 invested today at 12% per annum for 5 years.
```
FV = 50,000 × (1.12)^5 = 50,000 × 1.76234 = KSh 88,117
```

### 2.2 Present value

```
PV = FV ÷ (1 + r)^n
```

**Worked example:** What is the present value of KSh 200,000 to be received in 4 years, at a discount rate of 10%?
```
PV = 200,000 ÷ (1.10)^4 = 200,000 ÷ 1.4641 = KSh 136,603
```

### 2.3 Annuities

An **annuity** is a series of equal cash flows at regular intervals. The present value of an ordinary annuity:

```
PV = CF × [1 − (1 + r)^−n] ÷ r
```

**Worked example:** Present value of KSh 60,000 received at the end of each year for 5 years, discounted at 14%.
```
PV = 60,000 × [1 − (1.14)^−5] ÷ 0.14
   = 60,000 × [1 − 0.51937] ÷ 0.14
   = 60,000 × 3.43308
   = KSh 205,985
```

---

## 3. Capital budgeting techniques

Capital budgeting evaluates whether a long-term investment (a "project") is worth undertaking.

### 3.1 Payback period

The time taken for cumulative cash inflows to recover the initial investment. Simple and liquidity-focused, but ignores the time value of money and any cash flows after the payback point.

### 3.2 Accounting rate of return (ARR)

```
ARR = Average annual accounting profit ÷ Investment (initial or average) × 100
```
Easy to calculate from accounting figures, but ignores the time value of money and uses accounting profit (which includes non-cash items like depreciation) rather than cash flow.

### 3.3 Net present value (NPV)

```
NPV = Σ [CFt ÷ (1 + r)^t]  −  Initial investment
```
Discounts all future cash flows to present value at the firm's required rate of return (cost of capital) and deducts the initial outlay. **Decision rule:** accept a project if NPV ≥ 0 (it is expected to add value); between mutually exclusive projects, prefer the one with the higher NPV.

### 3.4 Internal rate of return (IRR)

The discount rate at which a project's NPV equals zero — the project's own break-even rate of return. **Decision rule:** accept a project if IRR ≥ the firm's cost of capital.

### 3.5 Comparing the techniques

| Technique | Considers time value of money? | Considers all cash flows? | Based on cash or profit? |
|---|---|---|---|
| Payback period | No | No (ignores flows after payback) | Cash |
| ARR | No | Yes | Accounting profit |
| NPV | Yes | Yes | Cash |
| IRR | Yes | Yes | Cash |

**NPV is generally regarded as the technique most consistent with the wealth-maximisation objective**, since it directly measures the expected increase in shareholder value in present-value shillings, using cash flows and an appropriate discount rate.

---

## 4. Sources of finance

| Source | Term | Key feature |
|---|---|---|
| Ordinary share capital (equity) | Permanent | No obligation to pay dividends; shareholders bear residual risk and have voting rights |
| Preference share capital | Typically permanent or redeemable | Fixed dividend rate, ranks ahead of ordinary shares on dividends/liquidation |
| Bank loans / debentures | Medium to long term | Fixed interest obligation regardless of profit; interest is tax-deductible |
| Trade credit | Short term | Credit extended by suppliers, usually interest-free within the credit period |
| Bank overdraft | Short term | Flexible, but typically at a higher interest rate and repayable on demand |
| Retained earnings | Internal | No issue costs, but reduces funds available for distribution to shareholders |

### 4.1 The financing trade-off

**Debt** is generally cheaper than equity (interest is tax-deductible, and lenders demand a lower return than shareholders since debt is less risky), but increases **financial risk** — the obligation to pay interest and principal exists regardless of how the business performs, raising the risk of financial distress if cash flows falter. Equity carries no such fixed obligation but is a more expensive source of finance and dilutes ownership/control.

---

## 5. Cost of capital

### 5.1 Cost of individual sources (brief)

- **Cost of debt** — approximated by the effective interest rate on borrowing, adjusted for the tax shield (interest is tax-deductible), since debt is often analysed on an after-tax basis: `Kd(after-tax) = Kd(before-tax) × (1 − tax rate)`.
- **Cost of equity** — the return shareholders require for bearing the risk of ownership; often estimated using the dividend growth model or the capital asset pricing model at a more advanced level.

### 5.2 Weighted average cost of capital (WACC)

```
WACC = (E ÷ V) × Ke + (D ÷ V) × Kd × (1 − T)
```
where E is the market value of equity, D is the market value of debt, V = E + D, Ke is the cost of equity, Kd is the pre-tax cost of debt, and T is the tax rate.

**Worked example:** A firm has equity valued at KSh 6,000,000 and debt valued at KSh 4,000,000. Cost of equity is 15%, pre-tax cost of debt is 10%, tax rate is 30%.
```
V = 6,000,000 + 4,000,000 = 10,000,000
WACC = (6,000,000 ÷ 10,000,000) × 15% + (4,000,000 ÷ 10,000,000) × 10% × (1 − 0.30)
     = 0.6 × 15% + 0.4 × 7%
     = 9% + 2.8%
     = 11.8%
```
WACC is commonly used as the discount rate in NPV calculations, representing the minimum return a project must earn to satisfy both debt and equity providers.

---

## 6. Working capital management

**Working capital** = current assets − current liabilities. Effective working capital management balances **profitability** (tying up minimal funds in non-earning current assets) against **liquidity** (having enough short-term resources to meet obligations as they fall due).

### 6.1 Components

| Component | Management focus |
|---|---|
| Inventory | Hold enough to avoid stockouts, without tying up excess cash or risking obsolescence |
| Trade receivables | Extend credit to support sales, while controlling the risk of late payment or default |
| Cash | Keep enough for operating needs and unexpected demands, without holding idle excess |
| Trade payables | Take full advantage of supplier credit terms without damaging supplier relationships or losing early-payment discounts |

### 6.2 The cash operating cycle

```
Cash operating cycle = Inventory days + Receivables days − Payables days
```
A shorter cycle means cash is tied up for less time between paying for inputs and collecting from customers, generally improving liquidity.

---

## 7. Full worked investment appraisal question

**Scenario (original):** A company is considering a project requiring an initial investment of KSh 500,000, with no residual value, generating cash inflows of KSh 180,000 per year for 4 years. The company's cost of capital is 12%, and the project is depreciated on a straight-line basis over its 4-year life for accounting purposes.

**Required:** Calculate (a) the payback period, (b) the accounting rate of return (on initial investment), (c) the net present value, and (d) advise whether the project should be accepted using the NPV criterion.

**Model answer:**

**(a) Payback period**
```
Cumulative cash flow:
Year 1: 180,000  (cumulative −320,000)
Year 2: 180,000  (cumulative −140,000)
Year 3: 180,000  (cumulative  40,000)

Payback occurs during Year 3:
Payback = 2 + (140,000 ÷ 180,000) = 2 + 0.78 = 2.78 years (≈ 2 years 9 months)
```

**(b) Accounting rate of return (on initial investment)**
```
Annual depreciation = 500,000 ÷ 4 = 125,000
Average annual accounting profit = 180,000 − 125,000 = 55,000
ARR = 55,000 ÷ 500,000 × 100 = 11%
```

**(c) Net present value at 12%**
```
Year 1: 180,000 ÷ 1.12^1 = 160,714
Year 2: 180,000 ÷ 1.12^2 = 143,495
Year 3: 180,000 ÷ 1.12^3 = 128,121
Year 4: 180,000 ÷ 1.12^4 = 114,394
                            --------
Total present value of inflows      = 546,724
Less: initial investment            = (500,000)
                                       --------
NPV                                  =  46,724
```

**(d) Advice:** Since the project's NPV at the 12% cost of capital is positive (approximately KSh 46,724), it is expected to increase shareholder wealth by that amount in present-value terms and should be **accepted**. (Its IRR is approximately 16.4%, comfortably above the 12% cost of capital, which is consistent with a positive NPV.)

---

## 8. Self-assessment question bank (original questions, with model answers)

**Q1.** Explain why shareholder wealth maximisation is generally preferred over profit maximisation as the objective of financial management. *(3 marks)*

*Model answer:* Profit maximisation focuses on a single period, ignores the timing of returns, ignores risk, and can be distorted by accounting policy choices. Shareholder wealth maximisation, typically measured by the market value of shares, accounts for the size, timing, and risk of cash flows over the long term, better reflecting the true economic benefit to owners.

**Q2.** KSh 90,000 is to be received in 3 years. Calculate its present value at a discount rate of 15%. *(3 marks)*

*Model answer:*
```
PV = 90,000 ÷ (1.15)^3 = 90,000 ÷ 1.520875 = KSh 59,177 (to the nearest shilling)
```

**Q3.** State two limitations of the payback period as an investment appraisal technique. *(2 marks)*

*Model answer:* (i) It ignores the time value of money — cash flows in different years are treated as equally valuable; (ii) it ignores any cash flows occurring after the payback point, potentially rejecting a project with strong long-term returns in favour of one that merely recovers its cost sooner.

**Q4.** Distinguish between the accounting rate of return and the internal rate of return. *(4 marks)*

*Model answer:* The accounting rate of return is based on accounting profit (after depreciation) as a percentage of investment, and does not account for the time value of money. The internal rate of return is based on cash flows and is the discount rate at which a project's net present value equals zero, explicitly accounting for the time value of money — making IRR generally the more theoretically sound measure of a project's return.

**Q5.** A project has an initial cost of KSh 300,000 and is expected to generate net cash inflows of KSh 100,000 per year for 4 years. The cost of capital is 10%. Calculate the NPV and advise whether the project should be accepted (discount factors at 10%: Year 1 = 0.909, Year 2 = 0.826, Year 3 = 0.751, Year 4 = 0.683). *(5 marks)*

*Model answer:*
```
Year 1: 100,000 × 0.909 = 90,900
Year 2: 100,000 × 0.826 = 82,600
Year 3: 100,000 × 0.751 = 75,100
Year 4: 100,000 × 0.683 = 68,300
                           -------
Total present value      = 316,900
Less: initial cost        = (300,000)
                            --------
NPV                        =  16,900
```
Since NPV is positive, the project should be **accepted** — it is expected to increase shareholder wealth by approximately KSh 16,900 in present-value terms.

**Q6.** Explain why debt is generally considered a cheaper source of finance than equity, and state one risk this creates for the business. *(4 marks)*

*Model answer:* Debt is generally cheaper because lenders bear less risk than shareholders (interest and principal must legally be paid, and debt holders rank ahead of shareholders on liquidation), so they require a lower return; additionally, interest is tax-deductible, further reducing its effective cost. The risk this creates is financial risk — the business is obligated to make interest and principal payments regardless of its trading performance, increasing the risk of financial distress or insolvency if cash flows are insufficient in a poor trading period.

**Q7.** A company has equity worth KSh 8,000,000 and debt worth KSh 2,000,000. Cost of equity is 16%, pre-tax cost of debt is 12%, and the tax rate is 30%. Calculate the WACC. *(4 marks)*

*Model answer:*
```
V = 8,000,000 + 2,000,000 = 10,000,000
WACC = (8,000,000 ÷ 10,000,000) × 16% + (2,000,000 ÷ 10,000,000) × 12% × (1 − 0.30)
     = 0.8 × 16% + 0.2 × 8.4%
     = 12.8% + 1.68%
     = 14.48%
```

**Q8.** Define the "cash operating cycle" and explain the effect of a longer cycle on a business's liquidity. *(3 marks)*

*Model answer:* The cash operating cycle is the length of time between paying cash out for inputs (e.g. inventory) and receiving cash in from customers, calculated as inventory days plus receivables days minus payables days. A longer cycle means cash is tied up in the operating process for longer, generally reducing liquidity and increasing the business's need for short-term financing to bridge the gap.

**Q9.** Explain one advantage and one disadvantage of financing a project using retained earnings rather than a new share issue. *(3 marks)*

*Model answer:* Advantage: retained earnings involve no issue costs (e.g. underwriting or listing fees) and do not dilute existing shareholders' control. Disadvantage: using retained earnings reduces the funds available for distribution as dividends, which may be unpopular with shareholders who prefer current income, and retains an opportunity cost — shareholders forgo the return they could have earned by receiving and reinvesting the funds themselves.

**Q10.** Explain why NPV is generally regarded as theoretically superior to the payback period as an investment appraisal technique. *(3 marks)*

*Model answer:* NPV accounts for the time value of money by discounting all cash flows to present value at an appropriate cost of capital, and considers all cash flows over the full life of the project, directly measuring the expected change in shareholder wealth in present-value terms. The payback period ignores the time value of money entirely and disregards any cash flows occurring after the payback point, making it a liquidity indicator rather than a true measure of a project's contribution to shareholder wealth.

---

## 9. Exam technique and revision checklist

- For time value of money questions, **write the formula first, then substitute values** — this makes it easy for an examiner to award method marks even if the final figure is slightly off due to rounding.
- When discount factor tables are provided in a question, **use the given factors** rather than recalculating from the formula, to match the expected answer and avoid rounding mismatches.
- For NPV questions, lay out cash flows **year by year in a table**, and clearly separate the initial outlay (Year 0) from subsequent inflows.
- Always **state the decision explicitly** ("accept" or "reject," and why) after computing NPV or IRR — the calculation alone does not earn the "advise" marks in a question that asks for a recommendation.

**Quick revision summary — one line per topic:**

1. Financial management's objective is generally shareholder wealth maximisation, not simple profit maximisation.
2. FV = PV × (1+r)^n; PV = FV ÷ (1+r)^n; annuities use the annuity PV formula.
3. Payback and ARR ignore the time value of money; NPV and IRR do not.
4. NPV is the present value of all project cash flows less the initial investment; accept if NPV ≥ 0.
5. IRR is the discount rate at which NPV = 0; accept if IRR ≥ cost of capital.
6. Debt is generally cheaper than equity but increases financial risk through fixed obligations.
7. WACC blends the cost of equity and after-tax cost of debt, weighted by market values.
8. Working capital management balances profitability against liquidity.
9. The cash operating cycle = inventory days + receivables days − payables days.
10. Always state a clear accept/reject recommendation when a question asks for advice, not just the calculation.

---

*End of study notes. This document is intended as original exam-preparation material and should be used alongside the current official KASNEB syllabus and examiner's reports for the paper.*
