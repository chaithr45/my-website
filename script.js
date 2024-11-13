async function performOCR(file) {
    try {
        const result = await Tesseract.recognize(file, 'spa+hin+eng', {
            logger: (m) => console.log(m)
        });
        return result.data.text;
    } catch (error) {
        console.error("Error performing OCR:", error);
        return null;
    }
}

async function detectLanguage(text) {
    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: { q: text, langpair: 'en|es' }
        });
        const detectedLang = response.data.responseData.detectedLanguage;
        return detectedLang;
    } catch (error) {
        console.error("Error detecting language:", error);
        return "en";  // Default to English
    }
}

async function translateText(text, targetLang) {
    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: { q: text, langpair: `auto|${targetLang}` }
        });
        return response.data.responseData.translatedText;
    } catch (error) {
        console.error("Error translating text:", error);
        return "Translation failed.";
    }
}

async function handleFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const targetLang = document.getElementById("targetLang").value;

    if (fileInput.files.length === 0) {
        alert("Please select an image or PDF.");
        return;
    }

    const file = fileInput.files[0];

    // Perform OCR to extract text
    const extractedText = await performOCR(file);

    if (extractedText) {
        const detectedLang = await detectLanguage(extractedText);
        console.log("Detected language:", detectedLang);

        // Translate the text if needed
        const translatedText = await translateText(extractedText, targetLang);

        // Display the results
        document.getElementById("output").innerText = `Original Text:\n${extractedText}\n\nTranslated Text:\n${translatedText}`;
    } else {
        document.getElementById("output").innerText = "OCR failed.";
    }
}
