# Introduction to Computing

**Course:** CICT — Certified Information Communication Technologists
**Level:** Foundation Level
**Last updated:** 28 July 2026
**Syllabus version:** Based on the standard KASNEB CICT Foundation Level Introduction to Computing syllabus topics — computer fundamentals, hardware, software, data representation, and basic networking/security concepts. Authored from general professional ICT knowledge and standard syllabus topic coverage, not copied from any existing notes provider or study guide. Cross-check terminology and emphasis against the current KASNEB syllabus and examiner's reports before the exam.

> **Original work notice.** Every explanation, worked example, and question in this document was written from scratch for this paper. No text has been copied or paraphrased from any KASNEB past paper, textbook, or third-party notes/study guide. The worked example and practice questions are original scenarios.

---

## Contents

1. What is a computer?
2. Classification of computers
3. Generations of computers
4. Computer hardware
5. Computer software
6. The boot process
7. Number systems and data representation
8. Introduction to computer networks
9. Computer viruses and basic security practices
10. Emerging trends in computing
11. Full worked question — number system conversion
12. Practice examination — KASNEB-style paper (original, not a past paper)
13. Marking guide — model answers to the practice examination
14. Exam technique and revision checklist

---

## 1. What is a computer?

A **computer** is an electronic device that accepts data as input, processes that data according to a set of instructions (a program), and produces information as output, typically storing data for later use along the way. This input → process → output → storage cycle is the foundation of everything a computer does, from a simple calculator to a large data-centre server.

---

## 2. Classification of computers

Computers are commonly classified by size and processing power:

- **Supercomputers** — the most powerful category, used for extremely demanding tasks such as weather modelling and scientific simulation.
- **Mainframe computers** — large, powerful systems used by big organisations for bulk transaction processing (e.g. banking, government records).
- **Minicomputers (mid-range systems)** — smaller than mainframes, used by mid-sized organisations for departmental workloads.
- **Microcomputers (personal computers)** — desktops, laptops, tablets and smartphones designed for individual use.
- **Embedded computers** — small, purpose-built computers embedded inside another device (e.g. a washing machine controller or a car's engine management system).

---

## 3. Generations of computers

Computing history is commonly divided into generations, marked by the core technology used to build the machine:

1. **First generation** — vacuum tubes; large, hot, and unreliable.
2. **Second generation** — transistors; smaller, faster, and more reliable than vacuum tubes.
3. **Third generation** — integrated circuits; multiple transistors combined onto a single chip.
4. **Fourth generation** — microprocessors; an entire CPU on a single chip, enabling personal computers.
5. **Fifth generation** — technologies built around artificial intelligence, parallel processing, and natural-language interaction.

---

## 4. Computer hardware

Hardware is the physical, tangible part of a computer system:

- **Central Processing Unit (CPU)** — the "brain" of the computer, made up of a Control Unit (directs the fetch-decode-execute cycle) and an Arithmetic Logic Unit (performs calculations and logical comparisons).
- **Primary memory** — RAM (Random Access Memory, temporary/volatile working memory) and ROM (Read-Only Memory, permanent instructions such as start-up firmware).
- **Secondary storage** — non-volatile storage that retains data when the power is off, e.g. hard disk drives, solid-state drives, and flash/USB drives.
- **Input devices** — devices used to enter data, e.g. keyboard, mouse, scanner.
- **Output devices** — devices used to present processed information, e.g. monitor, printer, speakers.

---

## 5. Computer software

Software is the set of instructions that tells hardware what to do, broadly split into two categories:

- **System software** — manages the computer itself and provides a platform for other software to run on, e.g. the operating system (Windows, Linux, macOS), device drivers, and utility programs.
- **Application software** — programs written to help the user perform a specific task, e.g. word processors, spreadsheets, accounting packages, and web browsers.

---

## 6. The boot process

**Booting** is the sequence of steps a computer follows to start up from being switched off to being ready for use:

1. Power is applied, and the CPU begins executing firmware instructions stored in ROM (commonly BIOS/UEFI).
2. The firmware performs a Power-On Self-Test (POST) to check that key hardware components are present and functioning.
3. The firmware locates and loads the operating system's boot loader from a storage device.
4. The boot loader loads the operating system kernel into memory.
5. The operating system initialises system services and presents the user interface, at which point the computer is ready for use.

---

## 7. Number systems and data representation

Computers represent all data internally using the **binary number system** (base 2), since electronic circuits naturally distinguish only two states (on/off, high/low voltage).

- **Binary (base 2)** — digits 0 and 1 only.
- **Decimal (base 10)** — the everyday number system, digits 0–9.
- **Hexadecimal (base 16)** — digits 0–9 then A–F, commonly used as a compact, human-friendly way to represent binary values (each hex digit represents exactly 4 binary digits).

**A byte** is 8 bits, and is the standard unit for measuring most data sizes (kilobyte, megabyte, gigabyte, and so on, each roughly 1,000 times the previous unit).

---

## 8. Introduction to computer networks

A **network** connects two or more computers so they can share data and resources. Common classifications:

- **LAN (Local Area Network)** — covers a small area such as one office or building.
- **WAN (Wide Area Network)** — spans a large geographic area, potentially connecting networks across cities or countries (the Internet is the largest WAN).
- **MAN (Metropolitan Area Network)** — spans a city-sized area, larger than a LAN but smaller than a WAN.

Basic network hardware includes a **router** (directs data between networks), a **switch** (connects devices within one network), and **network cabling/wireless access points** (the physical/wireless medium data travels over).

---

## 9. Computer viruses and basic security practices

A **computer virus** is a piece of malicious software that attaches itself to legitimate programs or files and spreads when those files are shared or executed, potentially damaging data or disrupting normal operation. Related malware categories include **worms** (spread automatically across networks without needing a host file) and **trojans** (disguise themselves as legitimate software to trick a user into installing them).

Basic protective practices:

- Install and keep updated a reputable antivirus/anti-malware program.
- Keep the operating system and applications patched with the latest security updates.
- Avoid opening attachments or links from unknown or suspicious sources.
- Use strong, unique passwords, and enable multi-factor authentication where available.
- Take regular backups of important data, stored separately from the main system.

---

## 10. Emerging trends in computing

- **Cloud computing** — using computing resources (storage, processing power, software) delivered over the Internet from a remote provider, rather than owning and running all the hardware locally.
- **Artificial intelligence (AI) and machine learning** — systems that can learn patterns from data and make predictions or decisions with reduced direct human programming.
- **Internet of Things (IoT)** — everyday physical devices (appliances, sensors, vehicles) embedded with the ability to connect to a network and exchange data.
- **Big data** — techniques and tools for working with datasets too large or complex for traditional data-processing methods.

---

## 11. Full worked question — number system conversion

**Required:** (a) Convert the decimal number 156 to binary. (b) Convert the binary number 10110 to decimal.

**Solution:**

**(a) 156 (decimal) to binary** — repeatedly divide by 2 and record the remainders:

| Division | Quotient | Remainder |
|---|---|---|
| 156 ÷ 2 | 78 | 0 |
| 78 ÷ 2 | 39 | 0 |
| 39 ÷ 2 | 19 | 1 |
| 19 ÷ 2 | 9 | 1 |
| 9 ÷ 2 | 4 | 1 |
| 4 ÷ 2 | 2 | 0 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |

Reading the remainders from bottom to top: **156 (decimal) = 10011100 (binary)**

**(b) 10110 (binary) to decimal** — sum each digit's place value where the bit is 1:

10110 = (1×2⁴) + (0×2³) + (1×2²) + (1×2¹) + (0×2⁰)
= 16 + 0 + 4 + 2 + 0
= **22 (decimal)**

---

## 12. Practice examination — KASNEB-style paper (original, not a past paper)

> **Note on format.** This section is laid out the way a KASNEB CICT examination paper is laid out — a timed paper with five compulsory 20-mark questions — purely so you can practise under realistic exam conditions. Every question below is an original scenario written for this document. **It is not a reproduction of any actual KASNEB past examination paper.**

**CICT FOUNDATION LEVEL — INTRODUCTION TO COMPUTING (PRACTICE PAPER)**
**TIME ALLOWED: 3 HOURS**

*Instructions to candidates: Answer ALL FIVE questions. Each question carries 20 marks. Show all workings clearly.*

---

**QUESTION ONE**

(a) Define a computer, and describe the input-process-output-storage cycle. *(8 marks)*

(b) Outline FOUR categories used to classify computers by size and processing power, giving one example use of each. *(12 marks)*

*(Total: 20 marks)*

---

**QUESTION TWO**

(a) Distinguish between system software and application software, giving two examples of each. *(8 marks)*

(b) Explain the function of the Control Unit and the Arithmetic Logic Unit within the CPU. *(6 marks)*

(c) Distinguish between RAM and ROM. *(6 marks)*

*(Total: 20 marks)*

---

**QUESTION THREE**

(a) Convert the decimal number 90 to binary, showing your workings. *(8 marks)*

(b) Convert the binary number 11010 to decimal, showing your workings. *(6 marks)*

(c) Explain why computers represent data internally using the binary number system. *(6 marks)*

*(Total: 20 marks)*

---

**QUESTION FOUR**

(a) Outline the steps a computer follows during the boot process. *(10 marks)*

(b) Distinguish between a LAN and a WAN, giving one example of each. *(6 marks)*

(c) State the function of a router in a computer network. *(4 marks)*

*(Total: 20 marks)*

---

**QUESTION FIVE**

(a) Distinguish between a computer virus, a worm, and a trojan. *(9 marks)*

(b) Explain FOUR basic practices an individual computer user should follow to protect against malware. *(8 marks)*

(c) Briefly explain the concept of cloud computing. *(3 marks)*

*(Total: 20 marks)*

---

## 13. Marking guide — model answers to the practice examination

**QUESTION ONE**

(a) *(8 marks)* — A computer is an electronic device that accepts data as input, processes it according to a program's instructions, and produces information as output, with storage allowing data to be retained for later use. This input → process → output → storage cycle underlies everything a computer does.

(b) *(12 marks — 3 marks each, any four)* — Supercomputers (scientific simulation/weather modelling); mainframe computers (bulk transaction processing e.g. banking); minicomputers/mid-range systems (departmental workloads); microcomputers/PCs (individual use — desktops, laptops); embedded computers (a purpose-built controller inside another device).

**QUESTION TWO**

(a) *(8 marks)* — System software manages the computer itself and provides a platform for other software (e.g. an operating system, device drivers). Application software helps the user perform a specific task (e.g. a word processor, a spreadsheet program).

(b) *(6 marks)* — The Control Unit directs the fetch-decode-execute cycle, coordinating the flow of instructions and data. The Arithmetic Logic Unit performs the actual arithmetic calculations and logical comparisons.

(c) *(6 marks)* — RAM is temporary, volatile working memory that loses its contents when power is removed. ROM holds permanent instructions (such as start-up firmware) that are retained even without power.

**QUESTION THREE**

(a) *(8 marks)* — 90 ÷ 2 = 45 r0; 45 ÷ 2 = 22 r1; 22 ÷ 2 = 11 r0; 11 ÷ 2 = 5 r1; 5 ÷ 2 = 2 r1; 2 ÷ 2 = 1 r0; 1 ÷ 2 = 0 r1. Reading remainders bottom to top: **90 = 1011010**.

(b) *(6 marks)* — 11010 = (1×2⁴)+(1×2³)+(0×2²)+(1×2¹)+(0×2⁰) = 16+8+0+2+0 = **26**.

(c) *(6 marks)* — Electronic circuits naturally and reliably distinguish only two states (on/off, or high/low voltage), which map directly onto the two binary digits 0 and 1 — making binary the most reliable and efficient system for digital electronic representation of data.

**QUESTION FOUR**

(a) *(10 marks)* — Power is applied and firmware in ROM (BIOS/UEFI) begins executing; a Power-On Self-Test checks key hardware; the firmware locates and loads the boot loader from storage; the boot loader loads the operating system kernel into memory; the operating system initialises services and presents the user interface.

(b) *(6 marks)* — A LAN covers a small area such as one office or building (e.g. an office network). A WAN spans a large geographic area, potentially across cities or countries (e.g. the Internet).

(c) *(4 marks)* — A router directs data between different networks.

**QUESTION FIVE**

(a) *(9 marks)* — A virus attaches itself to legitimate programs/files and spreads when those files are shared or run. A worm spreads automatically across networks without needing to attach to a host file. A trojan disguises itself as legitimate software to trick a user into installing it.

(b) *(8 marks — 2 marks each, any four)* — Install and keep updated a reputable antivirus program; keep the operating system/applications patched; avoid opening attachments/links from unknown sources; use strong, unique passwords and multi-factor authentication; keep regular backups stored separately.

(c) *(3 marks)* — Cloud computing is the delivery of computing resources (storage, processing power, software) over the Internet from a remote provider, rather than owning and running the hardware locally.

---

## 14. Exam technique and revision checklist

- Number-system conversion questions: always show the full working (the division-remainder table for decimal-to-binary, or the place-value sum for binary-to-decimal) — examiners award marks for method, not just the final answer.
- Hardware questions: keep the CPU's two sub-units (Control Unit vs Arithmetic Logic Unit) and memory types (RAM vs ROM) clearly distinguished — these are frequently confused and frequently tested.
- Software questions: always classify with a reason, not just a label — state *why* something is system software vs application software.
- Security questions: name the specific malware type before describing it (virus vs worm vs trojan) — a correct description under the wrong label loses marks.
- Boot-process and networking questions: answer in a clear ordered sequence or list rather than one long paragraph — this is easier to mark and easier to check your own completeness.

**Quick revision — one line per topic:**
1. A computer's core cycle: input → process → output → storage.
2. Computers are classified by power/size: supercomputer, mainframe, minicomputer, microcomputer, embedded.
3. Computing generations map to the core technology used: vacuum tubes → transistors → integrated circuits → microprocessors → AI-era systems.
4. Hardware = CPU (Control Unit + ALU), memory (RAM/ROM), storage, input/output devices.
5. Software splits into system software (runs the computer) and application software (performs a user task).
6. Booting: power on → POST → load boot loader → load OS kernel → initialise services.
7. Computers use binary internally because electronic circuits reliably distinguish only two states.
8. A byte = 8 bits; hexadecimal is a compact way to represent binary values.
9. Networks are classified by size: LAN (small area), MAN (city-sized), WAN (large/global).
10. Malware types: virus (attaches to files), worm (spreads automatically), trojan (disguised as legitimate software).

---

*End of study notes. This document is intended as original exam-preparation material and should be used alongside the current official KASNEB syllabus and examiner's reports for the paper.*
