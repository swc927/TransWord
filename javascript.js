const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const radios = document.getElementsByName("caseOption");

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
  const issues = data.matches.map((match) => {
    const errorText = text.substring(match.offset, match.offset + match.length);
    const suggestion = match.replacements[0]?.value || "No suggestion";
    return `"${errorText}" → "${suggestion}" (${match.message})`;
  });

  return issues;
}

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
  }

  outputText.value = result;

  const errorBox = document.getElementById("errorText");
  if (text.trim() === "") {
    errorBox.value = "";
    return;
  }

  const issues = await detectErrorsWithAPI(text);

  if (issues.length > 0) {
    errorBox.value = "Possible issues:\n" + issues.join("\n");
  } else {
    errorBox.value = "No spelling or grammar issues detected.";
  }
}

inputText.addEventListener("input", transformText);
radios.forEach((radio) => radio.addEventListener("change", transformText));

copyBtn.addEventListener("click", () => {
  outputText.select();
  document.execCommand("copy");
});
