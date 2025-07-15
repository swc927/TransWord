const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const radios = document.getElementsByName("caseOption");

function transformText() {
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
    case "capitalise": // CHANGED FROM "camelcase"
      result = text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      break;
  }

  outputText.value = result;
}

inputText.addEventListener("input", transformText);
radios.forEach((radio) => radio.addEventListener("change", transformText));

copyBtn.addEventListener("click", () => {
  outputText.select();
  document.execCommand("copy");
});
