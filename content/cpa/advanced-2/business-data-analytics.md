# Business Data Analytics

**Course:** CPA — Certified Public Accountant
**Level:** Advanced Level (CA35P — Practical Paper)
**Last updated:** 30 July 2026
**Syllabus version:** Based on the standard KASNEB CPA Advanced Level Business Data Analytics syllabus structure — using data analytics to support financial reporting, financial management, management accounting, auditing and tax/public finance decisions. Authored from general data-analytics and professional-accounting knowledge and standard syllabus topic coverage, not copied from any existing notes provider, textbook, or third-party study guide. Cross-check terminology and emphasis against the current KASNEB syllabus and examiner's reports before the exam.

> **Original work notice.** Every explanation, worked example, and question in this document was written from scratch for this paper. No text has been copied or paraphrased from any KASNEB past paper, textbook, or third-party notes/study guide. The scenarios and practice questions are original.

---

## Unit overview

**Unit description.** This paper is aimed at enabling a candidate to use information technology to support decision-making through business analytics. It builds the digital competency needed to prepare and analyse financial statements, forecast results, and apply data-driven techniques across the accounting specialisations — financial reporting, financial management, management accounting, auditing, and taxation/public finance. Because it sits at Advanced Level, the paper assumes genuine fluency in the underlying technical subject matter already built up through Foundation and Intermediate level papers, and layers a data-analytics lens on top of it, rather than teaching those subjects from scratch.

**Prerequisite.** A candidate attempting this paper is expected to have passed all other CPA examination papers, with core knowledge of quantitative techniques, financial accounting and reporting, and financial management already secure, together with knowledge in their chosen specialisation areas (management accounting, audit, tax, or public financial management). The paper is sat over three hours, typically in a controlled, computer-based environment.

**Learning outcomes.** A candidate who passes this paper should be able to:

- Discuss fundamental aspects of big data and data analytics, including a structured data-analytics lifecycle framework, data visualisation principles, and emerging issues in the field.
- Apply data analytics to the preparation of financial statements, financial statement analysis and forecasting, sensitivity/scenario analysis, and dashboard-based presentation of financial data.
- Apply data analytics to financial management — time value of money analysis, capital project evaluation, and sensitivity/scenario analysis around investment decisions.
- Apply data analytics to management accounting — cost estimation, break-even analysis, budget preparation, and flexible budgeting under varying assumptions.
- Apply data analytics to auditing — trend analysis, fraud-risk indicators, tests of control, and model review/validation considerations.
- Apply data analytics to taxation and public financial management, including tax estimation and analysis of public-sector financial data.

---

## Contents

1. Data concepts and the data lifecycle
2. Big data and types of data analytics
3. Categories of data-analytics tools
4. Principles of data visualisation
5. Data analytics in financial accounting and reporting
6. Data analytics in financial management
7. Data analytics in management accounting
8. Data analytics in auditing
9. Data analytics in taxation and public financial management
10. Emerging issues and limitations in data analytics
11. Full worked question — regression-based cost estimation and break-even
12. Practice examination — KASNEB-style paper (original, not a past paper)
13. Marking guide — model answers to the practice examination
14. Exam technique and revision checklist

---

## 1. Data concepts and the data lifecycle

Before analysing data, it helps to distinguish three levels at which data can be described: a **conceptual data model** describes, in business terms, what entities matter and how they relate (e.g. "customers place orders"); a **logical data model** adds structure — attributes, keys, relationships — without committing to a specific technology; a **physical data model** specifies exactly how the data is actually stored in a particular database system.

Data moves through a **lifecycle**: identifying which data sources are relevant to a business question, modelling what specific data is actually required, obtaining it (extracting from source systems), recording it (structuring and storing it reliably), using it to support a business decision, and eventually removing it once it's no longer needed or permitted to be retained. Treating analytics as a lifecycle — rather than a one-off technical exercise — is what keeps a business's data genuinely fit for repeated decision-making rather than a single report.

---

## 2. Big data and types of data analytics

**Big data** refers to data characterised by scale and complexity beyond what traditional tools comfortably handle, commonly described through several "V" characteristics: **volume** (sheer quantity), **velocity** (speed of generation and required processing), **variety** (structured, semi-structured and unstructured formats), **veracity** (trustworthiness/quality), and **value** (the actual business benefit realised from analysing it).

Data analytics itself is commonly classified into three types: **descriptive analytics** answers "what happened" (summarising historical data — e.g. last quarter's sales by region); **predictive analytics** answers "what is likely to happen" (using historical patterns to forecast future outcomes — e.g. forecasting next quarter's revenue); **prescriptive analytics** answers "what should we do about it" (recommending a specific course of action given the predicted outcome — e.g. recommending an inventory reorder point). Each successive type builds on the one before it, and each requires progressively more sophisticated technique and, generally, more reliable underlying data.

---

## 3. Categories of data-analytics tools

Tools relevant to a professional accountant's data-analytics work generally fall into three broad categories: **data cleaning/preparation tools** (correcting, standardising and structuring raw data before analysis — since poor-quality input data undermines every subsequent step); **data management tools** (databases and cloud storage platforms that hold data reliably and make it queryable at scale); and **reporting/visualisation tools** (turning cleaned, stored data into charts, dashboards and summaries a decision-maker can actually use). A competent analyst doesn't need to master every tool in every category — but does need to understand which category a given task requires, and why skipping the cleaning step in particular tends to undermine everything that follows.

---

## 4. Principles of data visualisation

**Data visualisation** is the graphical representation of data to make patterns, trends and comparisons easier to grasp than raw numbers alone would allow. Visualisations broadly serve three purposes: **comparison** (e.g. a bar chart comparing sales across regions), **composition** (e.g. a pie or stacked-bar chart showing how a total breaks into parts), and **relationship** (e.g. a scatter plot showing how two variables move together). Good data visualisation is accurate (doesn't distort scale or proportion in a misleading way), clear (a viewer can grasp the main point quickly, without needing extensive explanation), and relevant (shows what the decision at hand actually requires, rather than every metric available simply because it exists).

---

## 5. Data analytics in financial accounting and reporting

Applying data analytics to financial reporting involves more than simply producing the statement of profit or loss, statement of financial position and statement of cash flows — it involves actively analysing them using ratios, common-size statements, and trend/cross-sectional comparisons, then presenting the results visually through charts and dashboards rather than dense tables alone. It also extends into **forecasting**: preparing forecast financial statements under specified assumptions, then testing how sensitive the forecast is to changes in those assumptions (**sensitivity analysis**, varying one assumption at a time) or to entirely different plausible futures (**scenario analysis**, varying several assumptions together to model a coherent "best case," "base case," and "worst case").

---

## 6. Data analytics in financial management

The same time-value-of-money techniques covered at Intermediate level — present value, future value, loan amortisation — become data-analytics exercises when applied at scale: building a loan amortisation schedule for hundreds of individual loans, or running **net present value (NPV)** and **internal rate of return (IRR)** calculations across many competing capital projects simultaneously, then visualising the comparison on a single dashboard. Sensitivity and scenario analysis matter especially here — a project's NPV computed under a single fixed set of assumptions tells a decision-maker far less than seeing how that NPV shifts as the discount rate, revenue growth assumption, or cost inflation assumption is varied across a plausible range.

---

## 7. Data analytics in management accounting

Data analytics sharpens several core management accounting techniques. **Cost estimation** can move beyond simple high-low estimation to **regression analysis**, using historical cost and activity data to estimate the fixed and variable components of a cost more reliably (the regression's intercept approximates the fixed element; its slope approximates the variable cost per unit). This feeds directly into **break-even analysis**, **budget preparation**, and — critically — **flexible budgeting**: preparing a budget that adjusts fixed and variable elements to different actual activity levels, then running sensitivity/scenario analysis across the resulting variances to see which assumptions matter most to the final numbers.

---

## 8. Data analytics in auditing

Auditors increasingly use data analytics to strengthen evidence-gathering well beyond traditional sampling. **Trend analysis** across key financial-statement line items can flag unusual movements worth investigating. **Three-way matching** (comparing a purchase order, goods-received note and supplier invoice for consistency) can be automated and run across an entire population of transactions rather than a small sample. **Fraud-detection** techniques look for statistically unusual patterns (e.g. an unusually high concentration of transactions just below an approval threshold). **Tests of control** — particularly around segregation of duties — can be strengthened by analysing which combinations of user accounts actually processed a given transaction across a full population, rather than inferring control effectiveness from a handful of manually selected samples. Where a model itself is used to flag risk (e.g. a fraud-scoring model), the auditor must also consider **model review and validation** — whether the model's own assumptions and outputs are themselves reliable enough to rely on.

---

## 9. Data analytics in taxation and public financial management

In taxation, data analytics supports computing tax payable for individuals and companies at scale, and preparing supporting schedules (e.g. wear-and-tear/capital allowance schedules) efficiently and consistently across many taxpayers or asset registers. In public financial management, analytics supports analysing public-sector financial statements, preparing and analysing government budgets (including variances against approved budgets), and analysing trends in public debt and revenue across county and national government — all of which benefit from the same visualisation and dashboard principles used elsewhere in the paper, adapted to a public-sector audience of oversight bodies and the public.

---

## 10. Emerging issues and limitations in data analytics

Several emerging issues deserve explicit attention: **scepticism and professional judgement** — an analytics output is only as reliable as the data and assumptions behind it, and a professional accountant must retain healthy scepticism rather than treating a model's output as automatically correct; **ethical issues** — including the risk of analytics being used in ways that mislead stakeholders, whether intentionally or through careless model design; **data security and data protection** — since analytics often involves aggregating sensitive financial and personal data, which must be protected and used only for legitimate purposes; and **performance/technical limitations** — analytics tools and models have real limits (e.g. a regression model estimated on a narrow historical range shouldn't be trusted to forecast far outside that range).

---

## 11. Full worked question — regression-based cost estimation and break-even

**Scenario.** A company's monthly production costs and output over six months were: (units, cost): (1,000, KSh 420,000), (1,200, KSh 460,000), (1,400, KSh 500,000), (1,600, KSh 540,000), (1,800, KSh 580,000), (2,000, KSh 620,000). A simple linear regression of cost on units gives an estimated fixed cost of KSh 220,000 and a variable cost of KSh 200 per unit. The selling price per unit is KSh 400.

**Required:** (a) State the estimated cost equation. (b) Compute the contribution per unit and the break-even point in units. (c) If the company budgets to produce and sell 1,500 units next month, compute the budgeted profit.

**Solution:**

(a) Cost equation: **Total cost = 220,000 + (200 × units)**.

(b) Contribution per unit = Selling price − Variable cost = 400 − 200 = **KSh 200**. Break-even units = Fixed cost ÷ Contribution per unit = 220,000 ÷ 200 = **1,100 units**.

(c) At 1,500 units: Total contribution = 1,500 × 200 = 300,000. Profit = Total contribution − Fixed cost = 300,000 − 220,000 = **KSh 80,000**.

---

## 12. Practice examination — KASNEB-style paper (original, not a past paper)

> **Note on format.** This section is laid out the way a KASNEB CPA examination paper is laid out — a timed paper with five compulsory 20-mark questions — purely so you can practise under realistic exam conditions. Every question below is an original scenario written for this document. **It is not a reproduction of any actual KASNEB past examination paper.**

**CPA ADVANCED LEVEL — BUSINESS DATA ANALYTICS (PRACTICE PAPER)**
**TIME ALLOWED: 3 HOURS**

*Instructions to candidates: Answer ALL FIVE questions. Each question carries 20 marks. Show all workings clearly.*

---

**QUESTION ONE**

(a) Distinguish between a conceptual, a logical and a physical data model. *(9 marks)*

(b) Outline the stages of the data lifecycle. *(8 marks)*

(c) Define "big data." *(3 marks)*

*(Total: 20 marks)*

---

**QUESTION TWO**

(a) Distinguish between descriptive, predictive and prescriptive analytics, with one example of each. *(12 marks)*

(b) Outline the three broad purposes of data visualisation (comparison, composition, relationship), with one example chart type for each. *(8 marks)*

*(Total: 20 marks)*

---

**QUESTION THREE**

A company's monthly costs and output over four months were used to estimate a regression cost equation: Total cost = 150,000 + (180 × units). The selling price per unit is KSh 350.

(a) Compute the contribution per unit and the break-even point in units. *(8 marks)*

(b) If budgeted sales are 1,200 units, compute the budgeted profit. *(6 marks)*

(c) Explain ONE advantage of regression-based cost estimation over simple high-low estimation. *(6 marks)*

*(Total: 20 marks)*

---

**QUESTION FOUR**

(a) Explain how data analytics can strengthen an auditor's testing of segregation of duties. *(10 marks)*

(b) Explain what is meant by "model review and validation" in the context of a fraud-detection model used by an auditor. *(10 marks)*

*(Total: 20 marks)*

---

**QUESTION FIVE**

(a) Explain how sensitivity analysis and scenario analysis differ, using a capital project's NPV as an example. *(10 marks)*

(b) Outline THREE emerging issues relevant to the use of data analytics in professional accounting practice. *(10 marks)*

*(Total: 20 marks)*

---

## 13. Marking guide — model answers to the practice examination

**QUESTION ONE**

(a) *(9 marks)* — Conceptual: business-level entities/relationships, no technical detail. Logical: adds attributes/keys/relationships, technology-independent. Physical: specifies actual storage implementation in a given database system.

(b) *(8 marks)* — Identifying data sources, modelling requirements, obtaining data, recording data, using data for decisions, removing data.

(c) *(3 marks)* — Data characterised by scale/complexity beyond traditional tools, commonly described via volume, velocity, variety, veracity and value.

**QUESTION TWO**

(a) *(12 marks)* — Descriptive: what happened, e.g. last quarter's sales summary. Predictive: what's likely to happen, e.g. a sales forecast. Prescriptive: what to do about it, e.g. a recommended reorder point.

(b) *(8 marks)* — Comparison (e.g. bar chart), composition (e.g. pie/stacked-bar chart), relationship (e.g. scatter plot).

**QUESTION THREE**

(a) *(8 marks)* — Contribution = 350 − 180 = **KSh 170**. Break-even = 150,000 ÷ 170 = **≈883 units**.

(b) *(6 marks)* — Total contribution = 1,200 × 170 = 204,000. Profit = 204,000 − 150,000 = **KSh 54,000**.

(c) *(6 marks)* — Regression uses all available data points rather than just the two extreme observations used in high-low estimation, generally producing a more reliable, representative estimate of the fixed and variable cost components.

**QUESTION FOUR**

(a) *(10 marks)* — Analytics can examine which combinations of user accounts processed each transaction across the entire population, rather than a small manually selected sample, identifying any instances where duties that should be segregated were actually performed by the same individual.

(b) *(10 marks)* — Model review and validation means critically assessing whether the fraud-detection model's own assumptions, inputs and outputs are reliable enough to be relied upon as audit evidence, rather than accepting a flagged result automatically as proof of fraud.

**QUESTION FIVE**

(a) *(10 marks)* — Sensitivity analysis varies one assumption at a time (e.g. only the discount rate) to see its individual effect on NPV; scenario analysis varies several assumptions together to model a coherent alternative future (e.g. a full "worst case" combining lower revenue growth and higher costs).

(b) *(10 marks — up to 4 marks each)* — Professional scepticism about model reliability; ethical risks of misleading stakeholders; data security/data protection; technical/performance limitations of tools and models (any three).

---

## 14. Exam technique and revision checklist

- Always distinguish descriptive/predictive/prescriptive analytics with a concrete accounting example for each — a very commonly tested distinction.
- Regression cost-estimation questions: state the estimated cost equation explicitly before computing contribution/break-even from it.
- Auditing-analytics questions: connect the specific technique (trend analysis, three-way matching, segregation-of-duties testing) to a concrete audit objective, not just a generic "it helps auditors."
- Sensitivity vs scenario analysis: the key distinguishing point is "one assumption at a time" versus "several assumptions together" — anchor every answer to that distinction.
- Emerging-issues questions: name specific issues (scepticism, ethics, data security, technical limitations) rather than a vague "technology has risks."

**Quick revision — one line per topic:**
1. Data models: conceptual (business terms) → logical (structured, tech-independent) → physical (actual storage).
2. Data lifecycle: identify sources → model requirements → obtain → record → use → remove.
3. Big data: volume, velocity, variety, veracity, value.
4. Analytics types: descriptive (what happened), predictive (what's likely), prescriptive (what to do).
5. Visualisation purposes: comparison, composition, relationship.
6. Regression cost estimation: intercept ≈ fixed cost, slope ≈ variable cost per unit.
7. Sensitivity analysis (one assumption) vs scenario analysis (several assumptions together).
8. Auditing analytics: trend analysis, three-way matching, fraud detection, segregation-of-duties testing, model review/validation.

---

*End of study notes. This document is intended as original exam-preparation material and should be used alongside the current official KASNEB syllabus and examiner's reports for the paper.*
