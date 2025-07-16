const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const errorBox = document.getElementById("errorText");
const copyBtn = document.getElementById("copyBtn");
const radios = document.getElementsByName("caseOption");

// External function for grammar check
async function detectErrorsWithAPI(text) {
  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text: text,
      language: "en-US",
    }),
  });

  const data = await response.json();
  return data.matches.map((match) => {
    const errorText = text.substring(match.offset, match.offset + match.length);
    const suggestion = match.replacements[0]?.value || "No suggestion";
    return `"${errorText}" → "${suggestion}" (${match.message})`;
  });
}

// Main function
async function transformText() {
  const text = inputText.value;
  const selectedOption = Array.from(radios).find((r) => r.checked).value;

  let result = "";

  switch (selectedOption) {
    case "uppercase":
      result = text.toUpperCase();
      break;
    case "lowercase":
      result = text.toLowerCase();
      break;
    case "capitalise":
      result = text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      break;
    default:
      result = text;
  }

  outputText.value = result;

  // Auto-copy to clipboard
  if (result.trim()) {
    outputText.select();
    document.execCommand("copy");
  }

  // Grammar/spelling check
  if (text.trim() === "") {
    errorBox.value = "";
    return;
  }

  const issues = await detectErrorsWithAPI(text);
  errorBox.value =
    issues.length > 0
      ? "Possible issues:\n" + issues.join("\n")
      : "No spelling or grammar issues detected.";
}

// Event listeners
inputText.addEventListener("input", transformText);
radios.forEach((radio) => radio.addEventListener("change", transformText));
copyBtn.addEventListener("click", () => {
  outputText.select();
  document.execCommand("copy");
});
