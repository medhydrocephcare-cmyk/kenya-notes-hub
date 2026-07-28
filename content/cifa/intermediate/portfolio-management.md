# Portfolio Management

**Course:** CIFA — Certified Investment and Financial Analysts
**Level:** Intermediate Level
**Last updated:** 28 July 2026
**Syllabus version:** Based on the standard KASNEB CIFA Intermediate Level Portfolio Management syllabus topics — risk and return, diversification, portfolio theory, and the Capital Asset Pricing Model (CAPM). Authored from general professional investment-analysis knowledge and standard syllabus topic coverage, not copied from any existing notes provider or study guide. Cross-check terminology and emphasis against the current KASNEB syllabus and examiner's reports before the exam.

> **Original work notice.** Every explanation, worked example, and question in this document was written from scratch for this paper. No text has been copied or paraphrased from any KASNEB past paper, textbook, or third-party notes/study guide. The worked examples and practice questions use original, invented figures.

---

## Contents

1. What is portfolio management?
2. Return and risk of a single asset
3. Diversification and portfolio risk
4. Return and risk of a two-asset portfolio
5. The efficient frontier
6. The Capital Asset Pricing Model (CAPM)
7. Systematic vs unsystematic risk
8. Active vs passive portfolio management
9. Full worked question — two-asset portfolio risk and return
10. Practice examination — KASNEB-style paper (original, not a past paper)
11. Marking guide — model answers to the practice examination
12. Exam technique and revision checklist

---

## 1. What is portfolio management?

**Portfolio management** is the process of selecting, combining, and monitoring a group of investments (a "portfolio") to meet an investor's objectives, given their risk tolerance, return requirements, and time horizon. Rather than judging each investment purely in isolation, portfolio management studies how investments behave **together** — because combining assets that don't move in perfect lockstep with each other can reduce overall portfolio risk without necessarily sacrificing expected return. This insight is the foundation of modern portfolio theory.

---

## 2. Return and risk of a single asset

- **Expected return** — the probability-weighted average of an asset's possible returns, representing the return an investor should anticipate on average.
- **Risk (standard deviation)** — a statistical measure of how much an asset's actual returns are expected to vary around its expected return; a higher standard deviation means greater uncertainty/volatility.

In general, investors require a higher expected return to compensate for taking on higher risk — this trade-off is central to investment decision-making.

---

## 3. Diversification and portfolio risk

**Diversification** is the practice of holding a variety of assets whose returns do not move in perfect lockstep, so that a poor return on one asset can be offset by a better return on another, smoothing overall portfolio performance.

The key statistical concept behind diversification is **correlation** — a measure (ranging from −1 to +1) of how two assets' returns move in relation to each other:

- **Correlation of +1 (perfect positive correlation)** — the two assets move exactly together; combining them gives no diversification benefit.
- **Correlation of −1 (perfect negative correlation)** — the two assets move exactly opposite to each other; combining them can, in principle, eliminate portfolio risk entirely.
- **Correlation of 0** — the two assets' returns are unrelated; combining them still reduces overall portfolio risk, just not as dramatically as with negative correlation.

In practice, most real-world asset pairs have correlations somewhere between 0 and +1, so diversification reduces, but rarely eliminates, portfolio risk.

---

## 4. Return and risk of a two-asset portfolio

For a portfolio of two assets, A and B, with weights wA and wB (wA + wB = 1):

**Portfolio expected return** = wA × E(RA) + wB × E(RB)

**Portfolio risk (standard deviation)** depends not just on each asset's own standard deviation, but also on the **covariance** (or correlation) between them:

Portfolio variance = wA²σA² + wB²σB² + 2·wA·wB·σA·σB·ρAB

where ρAB is the correlation coefficient between assets A and B. Notice that a lower (or negative) correlation reduces the third term, which is exactly why diversification works: combining imperfectly-correlated assets produces a portfolio whose risk is **less** than the simple weighted average of the individual assets' risks.

---

## 5. The efficient frontier

The **efficient frontier** is the set of portfolios that offer the highest possible expected return for each given level of risk (or, equivalently, the lowest possible risk for each given level of expected return). Portfolios that lie below or to the right of the efficient frontier are considered **inefficient**, because an investor could find an alternative portfolio offering a better risk-return combination.

An investor's ideal portfolio on the efficient frontier depends on their individual risk tolerance: a more risk-averse investor will choose a point on the frontier with lower risk (and lower expected return), while a more risk-tolerant investor will choose a point further along with higher risk and higher expected return.

---

## 6. The Capital Asset Pricing Model (CAPM)

CAPM is a model used to determine the expected/required return on an asset, given its systematic risk relative to the overall market:

**E(Ri) = Rf + βi × [E(Rm) − Rf]**

Where:
- **E(Ri)** = expected/required return on asset i
- **Rf** = risk-free rate of return
- **βi** = the asset's beta, measuring its sensitivity to overall market movements
- **E(Rm)** = expected return on the overall market
- **[E(Rm) − Rf]** = the market risk premium — the extra return investors require, on average, for bearing market risk rather than investing risk-free

**Interpreting beta:**
- **β = 1** — the asset tends to move in line with the market.
- **β > 1** — the asset is more volatile than the market (amplifies market movements).
- **β < 1** — the asset is less volatile than the market (dampens market movements).
- **β = 0** — the asset's returns are, on average, uncorrelated with market movements (theoretically behaves like the risk-free asset from a systematic-risk standpoint).

---

## 7. Systematic vs unsystematic risk

- **Systematic (market/non-diversifiable) risk** — risk affecting the entire market (e.g. interest rate changes, inflation, a general economic downturn) that cannot be eliminated through diversification, since it affects nearly all assets to some degree.
- **Unsystematic (specific/diversifiable) risk** — risk specific to an individual company or industry (e.g. a factory fire, a product recall, a management scandal) that CAN be substantially reduced or eliminated by holding a sufficiently diversified portfolio, since such risks are largely independent across different companies.

This distinction matters because CAPM (Section 6) prices only **systematic** risk (via beta) — the theory holds that a well-diversified investor is not compensated with extra expected return for bearing unsystematic risk, since that risk could have been diversified away at no cost.

---

## 8. Active vs passive portfolio management

- **Active management** — the manager actively selects securities and times markets, aiming to outperform (beat) a chosen benchmark, based on the belief that markets are not perfectly efficient and mispricings can be identified and exploited.
- **Passive management** — the manager aims simply to replicate the performance of a chosen benchmark/index (e.g. through an index fund), based on the belief that consistently beating the market after costs is very difficult, so a low-cost approach that matches the market is preferable for most investors.

Active management generally incurs higher fees (research, trading, manager expertise) than passive management, so an active manager must outperform their benchmark by more than their added cost, just to match a passive alternative net of fees.

---

## 9. Full worked question — two-asset portfolio risk and return

**Scenario.** An investor is considering a portfolio of two shares:

- Share X: expected return 14%, standard deviation 20%
- Share Y: expected return 9%, standard deviation 12%
- Correlation coefficient between X and Y: 0.30
- Portfolio weights: 60% in Share X, 40% in Share Y

**Required:** Compute (a) the portfolio's expected return, and (b) the portfolio's standard deviation.

**Solution:**

**(a) Portfolio expected return**

E(Rp) = wX × E(RX) + wY × E(RY)
= (0.60 × 14%) + (0.40 × 9%)
= 8.4% + 3.6%
= **12.0%**

**(b) Portfolio standard deviation**

Portfolio variance = wX²σX² + wY²σY² + 2·wX·wY·σX·σY·ρXY

= (0.60² × 20²) + (0.40² × 12²) + (2 × 0.60 × 0.40 × 20 × 12 × 0.30)

= (0.36 × 400) + (0.16 × 144) + (2 × 0.24 × 240 × 0.30)

= 144 + 23.04 + 34.56

= 201.6

Portfolio standard deviation = √201.6 = **14.20%** (approximately)

**Interpretation:** the portfolio's risk (14.20%) is lower than a simple weighted average of the two assets' individual risks (0.60 × 20% + 0.40 × 12% = 16.8%), demonstrating the diversification benefit from combining two assets that are not perfectly correlated (ρ = 0.30, well below 1).

---

## 10. Practice examination — KASNEB-style paper (original, not a past paper)

> **Note on format.** This section is laid out the way a KASNEB CIFA examination paper is laid out — a timed paper with five compulsory 20-mark questions — purely so you can practise under realistic exam conditions. Every question below is an original scenario written for this document. **It is not a reproduction of any actual KASNEB past examination paper.**

**CIFA INTERMEDIATE LEVEL — PORTFOLIO MANAGEMENT (PRACTICE PAPER)**
**TIME ALLOWED: 3 HOURS**

*Instructions to candidates: Answer ALL FIVE questions. Each question carries 20 marks. Show all workings clearly.*

---

**QUESTION ONE**

(a) Define "expected return" and "standard deviation" as applied to a single asset. *(6 marks)*

(b) Explain the general relationship between risk and expected return that investors require. *(6 marks)*

(c) Explain the concept of diversification and why it can reduce overall portfolio risk. *(8 marks)*

*(Total: 20 marks)*

---

**QUESTION TWO**

(a) Explain what a correlation coefficient of +1, 0, and −1 each imply about the diversification benefit of combining two assets. *(9 marks)*

(b) Explain the "efficient frontier." *(6 marks)*

(c) Explain how an investor's individual risk tolerance affects their choice of portfolio on the efficient frontier. *(5 marks)*

*(Total: 20 marks)*

---

**QUESTION THREE**

A portfolio consists of two shares:
- Share P: expected return 16%, standard deviation 25%
- Share Q: expected return 10%, standard deviation 15%
- Correlation coefficient between P and Q: 0.20
- Portfolio weights: 50% in Share P, 50% in Share Q

Required:

(a) Compute the portfolio's expected return. *(6 marks)*

(b) Compute the portfolio's standard deviation. *(10 marks)*

(c) Comment on whether this portfolio shows a diversification benefit, with reference to your answer in (b). *(4 marks)*

*(Total: 20 marks)*

---

**QUESTION FOUR**

(a) State the Capital Asset Pricing Model (CAPM) formula, defining each term. *(8 marks)*

(b) A share has a beta of 1.4. The risk-free rate is 8% and the expected market return is 14%. Compute the share's required return under CAPM. *(6 marks)*

(c) Explain what a beta greater than 1 implies about a share's volatility relative to the market. *(6 marks)*

*(Total: 20 marks)*

---

**QUESTION FIVE**

(a) Distinguish between systematic risk and unsystematic risk, giving one example of each. *(8 marks)*

(b) Explain why CAPM compensates investors only for systematic risk, and not unsystematic risk. *(6 marks)*

(c) Distinguish between active and passive portfolio management, stating one advantage of each approach. *(6 marks)*

*(Total: 20 marks)*

---

## 11. Marking guide — model answers to the practice examination

**QUESTION ONE**

(a) *(6 marks)* — Expected return is the probability-weighted average of an asset's possible returns. Standard deviation is a statistical measure of how much actual returns are expected to vary around the expected return, indicating volatility/uncertainty.

(b) *(6 marks)* — Investors generally require a higher expected return to compensate for bearing higher risk — a fundamental trade-off underlying investment decision-making.

(c) *(8 marks)* — Diversification means holding assets whose returns do not move in perfect lockstep, so a poor return on one can be offset by a better return on another. Because portfolio risk depends not just on individual asset risk but also on the correlation between assets, combining imperfectly correlated assets reduces overall portfolio risk below the simple weighted average of individual risks.

**QUESTION TWO**

(a) *(9 marks — 3 marks each)* — Correlation +1: assets move exactly together, no diversification benefit. Correlation 0: returns unrelated, diversification still reduces risk. Correlation −1: assets move exactly opposite, can in principle eliminate portfolio risk entirely.

(b) *(6 marks)* — The efficient frontier is the set of portfolios offering the highest expected return for each given level of risk (or lowest risk for each given expected return); portfolios below/right of it are inefficient since a better risk-return combination exists.

(c) *(5 marks)* — A more risk-averse investor chooses a lower-risk, lower-return point on the frontier; a more risk-tolerant investor chooses a higher-risk, higher-return point further along it.

**QUESTION THREE**

(a) *(6 marks)* — E(Rp) = (0.50 × 16%) + (0.50 × 10%) = 8% + 5% = **13%**.

(b) *(10 marks)* — Variance = (0.5² × 25²) + (0.5² × 15²) + (2 × 0.5 × 0.5 × 25 × 15 × 0.20) = (0.25×625) + (0.25×225) + (0.5×375×0.20) = 156.25 + 56.25 + 37.5 = 250. Standard deviation = √250 = **15.81%** (approximately).

(c) *(4 marks)* — Yes — the portfolio's risk (15.81%) is below the simple weighted average of the two shares' individual risks (0.5×25% + 0.5×15% = 20%), showing a clear diversification benefit from the low correlation (0.20).

**QUESTION FOUR**

(a) *(8 marks)* — E(Ri) = Rf + βi[E(Rm) − Rf]. Rf = risk-free rate; βi = asset's sensitivity to market movements; E(Rm) = expected market return; [E(Rm) − Rf] = market risk premium.

(b) *(6 marks)* — E(Ri) = 8% + 1.4 × (14% − 8%) = 8% + 1.4×6% = 8% + 8.4% = **16.4%**.

(c) *(6 marks)* — A beta greater than 1 means the share is more volatile than the market — it tends to amplify market movements, rising more than the market in a rally and falling more than the market in a downturn.

**QUESTION FIVE**

(a) *(8 marks)* — Systematic risk affects the whole market (e.g. an interest rate rise) and cannot be diversified away. Unsystematic risk is specific to a company/industry (e.g. a factory fire at one company) and can be reduced/eliminated through diversification.

(b) *(6 marks)* — Because unsystematic risk can be eliminated at no cost simply by holding a sufficiently diversified portfolio, a well-diversified investor is not compensated with extra expected return for bearing it — only systematic risk, which cannot be diversified away, is priced (via beta) under CAPM.

(c) *(6 marks)* — Active management selects securities/times the market aiming to beat a benchmark; advantage: potential to outperform if mispricings are correctly identified. Passive management replicates a benchmark/index; advantage: lower cost, and avoids the risk of consistently underperforming the market after fees.

---

## 12. Exam technique and revision checklist

- Two-asset portfolio risk questions: compute variance FIRST using the full formula (including the correlation/covariance term), then take the square root at the very end to get standard deviation — taking the square root too early is a common error.
- Always compare your computed portfolio standard deviation against the simple weighted-average risk to comment on the diversification benefit — examiners frequently ask for this interpretation, not just the number.
- CAPM questions: write out the formula first with each term labelled, then substitute values — this makes partial-credit marking easier if your final arithmetic slips.
- Beta questions: always frame beta relative to the market (>1 amplifies, <1 dampens, =1 matches) rather than describing it only as "risk," which is imprecise.
- Systematic vs unsystematic risk questions: always tie the answer back to diversification — unsystematic is "diversifiable," systematic is not — since that's the entire reason the distinction matters for CAPM.

**Quick revision — one line per topic:**
1. Portfolio management studies how investments behave together, not just in isolation.
2. Expected return = probability-weighted average return; standard deviation = measure of volatility around it.
3. Diversification works because combining imperfectly correlated assets reduces risk below the weighted average.
4. Portfolio variance = wA²σA² + wB²σB² + 2wAwBσAσBρAB.
5. The efficient frontier is the best available risk-return combinations; choice along it depends on risk tolerance.
6. CAPM: E(Ri) = Rf + βi[E(Rm) − Rf].
7. Beta measures an asset's sensitivity to market movements (>1 amplifies, <1 dampens).
8. Systematic risk is market-wide and non-diversifiable; unsystematic risk is firm-specific and diversifiable.
9. CAPM prices only systematic risk, since unsystematic risk can be diversified away for free.
10. Active management aims to beat a benchmark (higher cost); passive management aims to match it (lower cost).

---

*End of study notes. This document is intended as original exam-preparation material and should be used alongside the current official KASNEB syllabus and examiner's reports for the paper.*
