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
## 🏗️ Project Structure

```
IT23321236/
├── playwright-report
├── test-results
├── tests/
│   └── translation.spec.ts   # Playwright test suite
├── package.json              # Node.js dependencies
├── playwright.config.ts      # Playwright configuration
├── playwright-report/        # Test execution reports
└── README.md                 # Project documentation
```


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
## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash https://github.com/AishaNafy/ITPM-Assignment-01-PLaywright
   cd itpm-playwright-testing
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

### Running Tests

#### Run all tests
```bash
npx playwright test
```

#### Run tests on Chromium only
```bash
npx playwright test --project=chromium
```

#### Run specific test cases
```bash
# Run positive tests only
npx playwright test --grep "Pos_Fun"

# Run negative tests only
npx playwright test --grep "Neg_Fun"

# Run UI tests only
npx playwright test --grep "Pos_UI"
```

#### View test reports
```bash
npx playwright show-report
```

#### Run tests in headed mode (visible browser)
```bash
npx playwright test --headed
```

---

## 🛠 Tools & Technologies Used

- **Language**: JavaScript
- **Testing**: Playwright, TypeScript
- **Package Manager**: npm
- **Version Control**: Git

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)
- Test timeout: 30 seconds
- Browser: Chromium (default)
- Retries: 0 (for accurate failure reporting)
- Parallel execution: Enabled (6 workers)

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

**Aisha Nafy** ! **[Aisha_Nafy](https://www.linkedin.com/in/aisha-nafy/)** 
- Student ID: IT23321236
- Course: IT3040 - IT Project Management
- Institution: SLIIT

## 📅 Project Timeline

- **Project Start**: January 2026
- **Development Phase**: Test case design and implementation
- **Testing Phase**: Comprehensive automated testing
- **Completion**: January 2026

## 🔗 Related Links

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [SLIIT Official Website](https://www.sliit.lk/)

---

**Note**: This project is part of the IT3040 - IT Project Management course assignment at SLIIT.

---
