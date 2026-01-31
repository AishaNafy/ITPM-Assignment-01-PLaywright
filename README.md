# SwiftTranslator – Playwright Test Automation

This repository contains a Playwright automation test suite created to test the SwiftTranslator (Singlish → Sinhala) web application.

🔗 Application URL:  
https://www.swifttranslator.com/

---

## 🎯 Project Objectives
- **Functional Testing:** Verify accurate Singlish to Sinhala translation  
- **UI Testing:** Ensure real-time translation and user interface functionality  
- **Negative Testing:** Validate proper handling of invalid inputs  
- **Automated Testing:** Complete test automation using Playwright framework  

---


## 🧪 Test Case Summary

| Category                                                 | Count |
|------------------------------- |-------|
| Positive Functional Test Cases          |  24 |
| Negative Functional Test Cases       |  10  |
| UI Test Case                                            |   1   |
| Total                                                         | 35 Test Cases |

---

## Positive Functional Test Cases (24)

These test cases validate correct system behavior.

✔ Valid Singlish input is provided  
✔ Sinhala Unicode output is expected  

Examples:
- Simple sentences
- Questions & commands
- Greetings
- Negative sentences
- Mixed English + Sinhala
- Currency & time formats
- Long paragraph input

Expected Outcome:  
Sinhala output should be generated correctly.

---

## Negative Functional Test Cases (10)

These test cases validate system robustness.

Invalid inputs are intentionally used, such as:
- Random text
- Symbols / emojis
- Empty input
- SQL queries
- HTML / script injection
- Pure English text

Expected Outcome:  
Sinhala output should NOT be generated.

⚠️ Note:  
Negative test cases are designed to fail Sinhala generation intentionally.  
This confirms correct handling of invalid inputs.

---

## UI Test Case (1)

Validates:
- Real-time Sinhala output while typing
- Dynamic UI behavior
- No submit button dependency

Expected Outcome: 
Sinhala text appears during typing.

---

## 📂 Files Included for Submission

- ✅ Playwright automation test code (GitHub)
- ✅ Excel sheet containing all 35 test cases
- ✅ ZIP file containing:
  - Test scripts
  - Excel sheet
  - README file

---

## 🛠 Tools & Technologies Used

- Playwright
- JavaScript (Node.js)
- Unicode-based Sinhala validation

---

## 📌 Conclusion

- All 35 test cases implemented as required
- Positive tests validate functionality
- Negative tests validate robustness
- UI test validates real-time behavior

This repository is ready.

---
