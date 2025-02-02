import googleTranslate from "googletrans";

export const translateText = async (text, targetLanguage) => {
  console.log(
    "Initiating translation for:",
    text,
    "Target Language:",
    targetLanguage
  );
  try {
    const translated = await googleTranslate.translate(text, {
      to: targetLanguage,
    });
    console.log("Translation completed successfully:", translated.text);
    return translated.text;
  } catch (err) {
    console.error("Error during translation process:", err);
  }
};
