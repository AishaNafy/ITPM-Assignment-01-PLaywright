const { test, expect } = require("@playwright/test");

// ---------------------
// TEST DATA
// ---------------------
const positiveCases = [
  { id: "Pos_Fun_001", input: "mama gedhara yanavaa.", desc: "Simple present tense", length: "S" },
  { id: "Pos_Fun_002", input: "mata bath oonee.", desc: "Simple need statement", length: "S" },
  { id: "Pos_Fun_003", input: "api paasal yanavaa.", desc: "Simple plural statement", length: "S" },

  { id: "Pos_Fun_004", input: "mama gedhara yanavaa, haebaeyi vahina nisaa dhaenna yannee naee.", desc: "Compound with conjunction", length: "M" },
  { id: "Pos_Fun_005", input: "api kaeema kanna yanavaa saha passe chithrapatayakuth balanavaa.", desc: "Compound with comma", length: "M" },

  { id: "Pos_Fun_006", input: "oya enavaanam mama balan innavaa.", desc: "Conditional complex", length: "S" },
  { id: "Pos_Fun_007", input: "vaessa unath api yanna epaeyi.", desc: "Cause-effect", length: "S" },

  { id: "Pos_Fun_008", input: "oyaata kohomadha?", desc: "Simple question", length: "S" },
  { id: "Pos_Fun_009", input: "meeka hariyata vaeda karanavaadha?", desc: "Question with object", length: "M" },

  { id: "Pos_Fun_010", input: "vahaama enna.", desc: "Command", length: "S" },
  { id: "Pos_Fun_011", input: "issarahata yanna.", desc: "Polite command", length: "S" },

  { id: "Pos_Fun_012", input: "mama ehema karannee naehae.", desc: "Negative present", length: "S" },
  { id: "Pos_Fun_013", input: "api heta ennee naehae.", desc: "Negative future", length: "S" },

  { id: "Pos_Fun_014", input: "aayuboovan!", desc: "Greeting", length: "S" },
  { id: "Pos_Fun_015", input: "suba udhaeesanak!", desc: "Time-based greeting", length: "S" },

  { id: "Pos_Fun_016", input: "karuNaakaralaa eka poddak balanna.", desc: "Polite request", length: "M" },
  { id: "Pos_Fun_017", input: "hari, mama karannam.", desc: "Positive response", length: "S" },

  { id: "Pos_Fun_018", input: "Zoom meeting ekak thiyennee.", desc: "Embedded brand term", length: "S" },
  { id: "Pos_Fun_019", input: "Documents tika attach karalaa mata email ekak evanna.", desc: "Tech term in sentence", length: "M" },

  { id: "Pos_Fun_020", input: "Rs. 5343 USD 1500", desc: "Currency", length: "S" },
  { id: "Pos_Fun_021", input: "7.30 AM 12.00 noon", desc: "Time formats", length: "S" },

  { id: "Pos_Fun_022", input: "ela machan! supiri!!", desc: "Informal greeting", length: "S" },
  { id: "Pos_Fun_023", input: "appatasiri, mata beheth bonna amathaka vunaa kiyahankoo.", desc: "Colloquial complaint", length: "M" },

  {
    id: "Pos_Fun_024",
    input:
      "dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaee m heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara, ehi samastha dhiga pramaNaya kiloomiitar 300k pamaNa vana bava pravaahana,mahaamaarga saha naagarika sQQvarDhana amaathYA bimal rathnaayaka saDHahan kaLeeya.",
    desc: "Paragraph input",
    length: "L",
  },
];

const negativeCases = [
  { id: "Neg_Fun_001", input: "asdfghjkl", desc: "Random typing", length: "S" },
  { id: "Neg_Fun_002", input: "mamagedharayanavaamatapaankannaooenehetaapiyanavaa", desc: "No spaces stress test", length: "M" },
  { id: "Neg_Fun_003", input: "@#$%^&*()", desc: "Symbols only", length: "S" },
  { id: "Neg_Fun_004", input: "", desc: "Empty field", length: "S" },
  { id: "Neg_Fun_005", input: "a".repeat(120), desc: "Long single char", length: "L" },
  { id: "Neg_Fun_006", input: "I am not Singlish at all 12345", desc: "Pure English", length: "M" },
  { id: "Neg_Fun_007", input: "mama gedhara yanavaa,,,", desc: "Excessive punctuation", length: "S" },
  { id: "Neg_Fun_008", input: '<script>alert("test")</script>', desc: "HTML injection", length: "S" },
  { id: "Neg_Fun_009", input: "😊🙂🌍", desc: "Emojis", length: "S" },
  { id: "Neg_Fun_010", input: "SELECT * FROM users", desc: "SQL statement", length: "S" },
];

// ---------------------
// CONFIG + HELPERS
// ---------------------
const APP_URL = "https://www.swifttranslator.com/";

// Sinhala unicode range (primary)
const SINHALA_REGEX = /[\u0D80-\u0DFF]/;

function timeoutFor(length) {
  if (length === "L") return 15000;
  if (length === "M") return 10000;
  return 8000;
}

// Find the real input (avoid random input fields)
async function findInputField(page) {
  const candidates = [
    page.locator('textarea[placeholder*="Singlish" i]'),
    page.locator('input[placeholder*="Singlish" i]'),
    page.getByRole("textbox"),
    page.locator("textarea"),
    page.locator('input[type="text"], input:not([type])'),
  ];

  for (const loc of candidates) {
    const count = await loc.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const el = loc.nth(i);
      try {
        if (!(await el.isVisible())) continue;
        // try to focus (means it's interactable usually)
        await el.click({ timeout: 1000 });
        return el;
      } catch {
        // ignore and continue
      }
    }
  }

  throw new Error("Input field not found. Site UI changed heavily.");
}

/**
 * Scan the whole page and return the "best" Sinhala output text found.
 * We check:
 *  - textarea/input values (excluding the input box)
 *  - visible text content in common containers
 */
async function scanSinhalaOutput(page, inputLocator) {
  return await page.evaluate(
    ({ sinStart, sinEnd }) => {
      const SIN = new RegExp(`[\\u${sinStart}-\\u${sinEnd}]`);

      // helper: get visible text safely
      const isVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };

      // 1) Inputs/textareas values
      const inputs = Array.from(document.querySelectorAll("textarea, input"));
      const values = [];
      for (const el of inputs) {
        if (!isVisible(el)) continue;
        const val = (el.value || "").trim();
        if (val && SIN.test(val)) values.push(val);
      }
      if (values.length) {
        // pick the longest Sinhala-containing value (likely output)
        values.sort((a, b) => b.length - a.length);
        return values[0];
      }

      // 2) Visible text content in common output containers
      const containers = Array.from(document.querySelectorAll("pre, div, p, span, section, article"));
      const texts = [];
      for (const el of containers) {
        if (!isVisible(el)) continue;
        const t = (el.innerText || el.textContent || "").trim();
        if (!t) continue;
        // avoid huge full-page blocks (menus)
        if (t.length > 8000) continue;
        if (SIN.test(t)) texts.push(t);
      }
      if (texts.length) {
        texts.sort((a, b) => b.length - a.length);
        return texts[0];
      }

      return "";
    },
    { sinStart: "0D80", sinEnd: "0DFF" }
  );
}

async function waitForSinhala(page, inputField, lengthType) {
  const t = timeoutFor(lengthType);

  // baseline: before input, likely no Sinhala in output area
  const before = await scanSinhalaOutput(page, inputField);

  // wait until Sinhala appears AND output changes
  const result = await expect
    .poll(
      async () => {
        const out = await scanSinhalaOutput(page, inputField);
        return { out, hasSinhala: SINHALA_REGEX.test(out), changed: out !== before && out.length > 0 };
      },
      { timeout: t }
    )
    .toMatchObject({ hasSinhala: true, changed: true })
    .then(async () => await scanSinhalaOutput(page, inputField));

  return result;
}

// ---------------------
// TEST SUITE
// ---------------------
test.describe("SwiftTranslator Singlish to Sinhala Tests (DOM-scan based)", () => {
  test.setTimeout(60000);

  // POSITIVE
  for (const tc of positiveCases) {
    test(`${tc.id}: ${tc.desc}`, async ({ page }) => {
      console.log(`\n[POS] ${tc.id} - ${tc.desc}`);
      console.log(`Input: ${tc.input}`);

      await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

      const inputField = await findInputField(page);
      await expect(inputField).toBeVisible();

      

      await inputField.fill(tc.input);

      const out = await waitForSinhala(page, inputField, tc.length);

      

      console.log(`Output (detected): ${out}`);
      expect(out).toBeTruthy();
      expect(out.length).toBeGreaterThan(0);
      expect(SINHALA_REGEX.test(out)).toBeTruthy();
    });
  }

  // NEGATIVE
  for (const tc of negativeCases) {
    test(`${tc.id}: ${tc.desc}`, async ({ page }) => {
      console.log(`\n[NEG] ${tc.id} - ${tc.desc}`);
      console.log(`Input: ${tc.input}`);

      await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

      const inputField = await findInputField(page);
      await expect(inputField).toBeVisible();

      await inputField.fill(tc.input);

      // give some time to translate if it tries
      await page.waitForTimeout(Math.min(timeoutFor(tc.length), 3000));

      const out = await scanSinhalaOutput(page, inputField);
      console.log(`Output (detected): ${out}`);

      // negative definition: should NOT produce Sinhala characters for garbage inputs
      expect(SINHALA_REGEX.test(out)).toBeFalsy();

      // also ensure page didn’t crash
      expect(await page.title()).toBeTruthy();
    });
  }

  // UI TEST
  test("Pos_UI_001: Real-time output updates (Sinhala appears while typing)", async ({ page }) => {
    console.log("\n[UI] Real-time updates");

    await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

    const inputField = await findInputField(page);
    await expect(inputField).toBeVisible();

    const steps = ["m", "ma", "mama", "mama gedhara", "mama gedhara yanavaa"];
    for (let i = 0; i < steps.length; i++) {
      await inputField.fill(steps[i]);
      await page.waitForTimeout(700);
  
    }

    const out = await scanSinhalaOutput(page, inputField);
    console.log(`UI detected output: ${out}`);
    expect(SINHALA_REGEX.test(out)).toBeTruthy();

    await inputField.fill("");
    await page.waitForTimeout(500);
    
  });
});
