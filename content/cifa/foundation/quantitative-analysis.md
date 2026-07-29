# Quantitative Analysis

**Course:** CIFA — Certified Investment and Financial Analysts
**Level:** Foundation Level
**Last updated:** 29 July 2026
**Syllabus version:** Based on the standard KASNEB CIFA Foundation Level Quantitative Analysis syllabus topics — financial mathematics (time value of money), descriptive statistics, probability, and an introduction to regression — oriented toward the needs of a future investment analyst. Authored from general quantitative-methods knowledge and standard syllabus topic coverage, not copied from any existing notes provider or study guide. Cross-check terminology and emphasis against the current KASNEB syllabus and examiner's reports before the exam.

> **Original work notice.** Every explanation, worked example, and question in this document was written from scratch for this paper. No text has been copied or paraphrased from any KASNEB past paper, textbook, or third-party notes/study guide. The scenarios and practice questions are original.

---

## Contents

1. The time value of money
2. Present value and future value
3. Annuities
4. Measures of central tendency
5. Measures of dispersion, including standard deviation
6. Basic probability and probability distributions, introduction
7. Correlation
8. Simple linear regression, introduction
9. Full worked question — present value and standard deviation of returns
10. Practice examination — KASNEB-style paper (original, not a past paper)
11. Marking guide — model answers to the practice examination
12. Exam technique and revision checklist

---

## 1. The time value of money

Money available today is worth more than the same nominal sum in future, because today's money can be invested to earn a return, and because inflation typically erodes future purchasing power. This principle underlies nearly all investment analysis, since cash flows occurring at different points in time cannot be validly compared without adjusting them to a common point in time.

---

## 2. Present value and future value

**Future value:** FV = PV × (1 + r)ⁿ. **Present value:** PV = FV ÷ (1 + r)ⁿ, where **r** is the rate per period and **n** is the number of periods. **Discounting** — converting future cash flows to present value — is the basis of most valuation techniques an investment analyst uses, including bond and equity valuation covered later in the CIFA syllabus.

---

## 3. Annuities

An **annuity** is a series of equal periodic payments. The present value of an ordinary annuity:

PV = A × [1 − (1 + r)⁻ⁿ] ÷ r

where **A** is the periodic payment. Annuities are used to model, among other things, bond coupon payments and regular investment contributions.

---

## 4. Measures of central tendency

**Mean** — sum of values ÷ number of values, sensitive to outliers. **Median** — the middle value of ordered data, unaffected by outliers. **Mode** — the most frequently occurring value. In investment analysis, the mean is commonly used to summarise historical returns, though it can be distorted by a small number of extreme return periods.

---

## 5. Measures of dispersion, including standard deviation

**Range** — highest minus lowest value. **Variance** — the average of squared deviations from the mean. **Standard deviation** — the square root of variance, expressed in the same units as the original data. In investment analysis, the standard deviation of returns is a standard measure of an asset's **volatility** (risk) — a higher standard deviation indicates returns that vary more widely around the average, generally interpreted as higher risk.

---

## 6. Basic probability and probability distributions, introduction

**Probability** measures the likelihood of an event, from 0 (impossible) to 1 (certain): Probability = favourable outcomes ÷ total possible outcomes. For independent events, the probability both occur is the product of their individual probabilities. The **normal distribution** — a symmetric, bell-shaped distribution — is frequently used (as a simplifying assumption) to model the distribution of investment returns, underlying many risk and portfolio models covered later in the CIFA syllabus.

---

## 7. Correlation

The **correlation coefficient (r)** measures the strength and direction of a linear relationship between two variables, ranging from −1 (perfect negative relationship) through 0 (no linear relationship) to +1 (perfect positive relationship). In investment analysis, the correlation between two assets' returns is central to portfolio diversification — combining assets with low or negative correlation can reduce a portfolio's overall risk without necessarily sacrificing expected return.

---

## 8. Simple linear regression, introduction

**Simple linear regression** fits a straight line (y = a + bx) describing how a dependent variable changes as an independent variable changes. In finance, this is the basis of models estimating how a stock's returns move relative to overall market returns (the slope coefficient here is often referred to, in later CIFA papers, as an asset's "beta") — used for both description and, cautiously, forecasting within the range of observed data.

---

## 9. Full worked question — present value and standard deviation of returns

**Scenario.** (a) Compute the present value of KSh 500,000 receivable in 3 years, at a discount rate of 9% per year. (b) An asset's returns over 4 years were: 8%, 12%, 6%, 14%, giving a mean return of 10%. The squared deviations from the mean are: 4, 4, 16, 16. Compute the variance and standard deviation of returns.

**Solution:**

(a) PV = 500,000 ÷ (1.09)³ = 500,000 ÷ 1.295029 = **KSh 386,092** (approximately).

(b) Variance = (4+4+16+16) ÷ 4 = 40 ÷ 4 = **10**. Standard deviation = √10 = **≈ 3.16 percentage points**.

---

## 10. Practice examination — KASNEB-style paper (original, not a past paper)

> **Note on format.** This section is laid out the way a KASNEB CIFA examination paper is laid out — a timed paper with five compulsory 20-mark questions — purely so you can practise under realistic exam conditions. Every question below is an original scenario written for this document. **It is not a reproduction of any actual KASNEB past examination paper.**

**CIFA FOUNDATION LEVEL — QUANTITATIVE ANALYSIS (PRACTICE PAPER)**
**TIME ALLOWED: 3 HOURS**

*Instructions to candidates: Answer ALL FIVE questions. Each question carries 20 marks. Show all workings clearly.*

---

**QUESTION ONE**

(a) Explain the time value of money concept and TWO reasons underlying it. *(8 marks)*

(b) Compute the future value of KSh 250,000 invested at 10% per year for 4 years. *(6 marks)*

(c) Compute the present value of an ordinary annuity paying KSh 60,000 per year for 3 years, at a discount rate of 11% per year. *(6 marks)*

*(Total: 20 marks)*

---

**QUESTION TWO**

An asset's returns over five years were: 10%, 14%, 8%, 16%, 12% (mean = 12%).

(a) Compute the variance of returns, given squared deviations of 4, 4, 16, 16, 0. *(8 marks)*

(b) Compute the standard deviation of returns. *(4 marks)*

(c) Explain what the standard deviation tells an investor about this asset's risk. *(8 marks)*

*(Total: 20 marks)*

---

**QUESTION THREE**

(a) Define "correlation coefficient" and interpret a value of +0.85. *(10 marks)*

(b) Explain why combining assets with low or negative correlation can reduce a portfolio's overall risk. *(10 marks)*

*(Total: 20 marks)*

---

**QUESTION FOUR**

(a) A box contains 6 red and 9 blue tokens. One token is drawn at random. Compute the probability it is (i) red, (ii) blue. *(8 marks)*

(b) Two independent events have probabilities 0.3 and 0.6. Compute the probability both occur. *(4 marks)*

(c) Explain why the normal distribution is commonly used (as a simplifying assumption) to model investment returns. *(8 marks)*

*(Total: 20 marks)*

---

**QUESTION FIVE**

(a) Explain the purpose of simple linear regression, using the example of a stock's returns against market returns. *(12 marks)*

(b) Outline ONE caution when using regression results for forecasting. *(8 marks)*

*(Total: 20 marks)*

---

## 11. Marking guide — model answers to the practice examination

**QUESTION ONE**

(a) *(8 marks)* — Money today is worth more than the same sum in future, because it can be invested to earn a return, and because inflation erodes future purchasing power.

(b) *(6 marks)* — FV = 250,000 × (1.10)⁴ = 250,000 × 1.4641 = **KSh 366,025**.

(c) *(6 marks)* — PV = 60,000 × [1 − (1.11)⁻³] ÷ 0.11 = 60,000 × [1 − 0.731191] ÷ 0.11 = 60,000 × 2.44371 = **KSh 146,623** (approximately).

**QUESTION TWO**

(a) *(8 marks)* — Variance = (4+4+16+16+0) ÷ 5 = 40 ÷ 5 = **8**.

(b) *(4 marks)* — Standard deviation = √8 = **≈2.83 percentage points**.

(c) *(8 marks)* — A higher standard deviation indicates returns vary more widely around the average — interpreted as higher volatility/risk; investors generally require a higher expected return to compensate for bearing higher risk of this kind.

**QUESTION THREE**

(a) *(10 marks)* — The correlation coefficient measures the strength and direction of a linear relationship between two variables, from −1 to +1; +0.85 indicates a strong positive linear relationship — the two variables tend to move in the same direction, strongly.

(b) *(10 marks)* — Combining assets whose returns don't move in lockstep (low/negative correlation) means one asset's poor performance is less likely to coincide with another's, smoothing overall portfolio returns and reducing total risk without necessarily reducing expected return.

**QUESTION FOUR**

(a) *(8 marks)* — Total tokens = 15. (i) P(red) = 6/15 = **0.4**. (ii) P(blue) = 9/15 = **0.6**.

(b) *(4 marks)* — P(both) = 0.3 × 0.6 = **0.18**.

(c) *(8 marks)* — The normal distribution's symmetric, bell-shaped form provides a convenient, well-understood mathematical framework for describing the range and likelihood of possible returns, underlying widely used risk and portfolio models, even though real returns don't always follow it perfectly.

**QUESTION FIVE**

(a) *(12 marks)* — Simple linear regression fits a line describing how a dependent variable (a stock's returns) changes as an independent variable (market returns) changes, allowing an analyst to estimate how sensitive the stock's returns tend to be to overall market movements.

(b) *(8 marks)* — A key caution is that forecasting outside the range of the original observed data (extrapolation) can be unreliable, since the estimated relationship may not hold beyond the data actually observed.

---

## 12. Exam technique and revision checklist

- Time value of money questions: always state the formula (FV/PV/annuity) explicitly before substituting numbers.
- Dispersion questions: compute variance first, then take its square root for standard deviation — don't skip straight to an assumed final answer.
- Correlation questions: always interpret the number in plain words (strength AND direction), not just state the formula/value.
- Probability questions: state total possible outcomes clearly before computing individual probabilities.
- Always connect a quantitative technique back to its investment-analysis application (e.g. standard deviation → risk/volatility) when a question asks for significance or interpretation.

**Quick revision — one line per topic:**
1. FV = PV(1+r)ⁿ; PV = FV ÷ (1+r)ⁿ.
2. Annuity PV = A × [1 − (1+r)⁻ⁿ] ÷ r.
3. Mean, median, mode — mean sensitive to outliers, median is not.
4. Standard deviation = √variance; in finance, a common measure of risk/volatility.
5. Probability = favourable ÷ total outcomes; independent events multiply.
6. Normal distribution: symmetric, bell-shaped; commonly used to model investment returns.
7. Correlation coefficient: −1 to +1; low/negative correlation between assets reduces portfolio risk.
8. Simple linear regression: y = a + bx; caution against extrapolating beyond observed data.

---

*End of study notes. This document is intended as original exam-preparation material and should be used alongside the current official KASNEB syllabus and examiner's reports for the paper.*
