const MAX_TEXT_LENGTH = 15000;
const REQUEST_TIMEOUT_MS = 28000;
const SUPPORTED_RATES = [0.7, 0.85, 1];

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;
  if (!speechKey || !speechRegion) {
    return response.status(500).json({
      error:
        "Configura AZURE_SPEECH_KEY y AZURE_SPEECH_REGION para habilitar la voz.",
    });
  }
  if (!/^[a-z0-9-]+$/i.test(speechRegion)) {
    return response.status(500).json({
      error: "La región configurada para Azure Speech no es válida.",
    });
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return response.status(400).json({ error: "El cuerpo debe ser JSON válido." });
    }
  }

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.text !== "string" ||
    !body.text.trim() ||
    body.text.length > MAX_TEXT_LENGTH
  ) {
    return response.status(400).json({
      error: `El texto debe tener entre 1 y ${MAX_TEXT_LENGTH} caracteres.`,
    });
  }

  const rate = body.rate === undefined ? 0.85 : Number(body.rate);
  if (!SUPPORTED_RATES.includes(rate)) {
    return response.status(400).json({ error: "La velocidad seleccionada no es válida." });
  }

  const ssml =
    `<speak version="1.0" xml:lang="fr-CA">` +
    `<voice name="fr-CA-AntoineNeural">` +
    `<prosody rate="${Math.round(rate * 100)}%">${escapeXml(body.text.trim())}</prosody>` +
    `</voice></speak>`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const speechResponse = await fetch(
      `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/ssml+xml",
          "Ocp-Apim-Subscription-Key": speechKey,
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        },
        body: ssml,
        signal: controller.signal,
      },
    );

    if (!speechResponse.ok) {
      console.error("Azure Speech request failed:", speechResponse.status);
      return response.status(502).json({
        error: `El servicio de voz respondió con HTTP ${speechResponse.status}.`,
      });
    }

    const audio = Buffer.from(await speechResponse.arrayBuffer());
    if (audio.length === 0) {
      return response.status(502).json({ error: "El servicio de voz devolvió audio vacío." });
    }

    response.setHeader("Content-Type", "audio/mpeg");
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).send(audio);
  } catch (error) {
    if (error.name === "AbortError") {
      return response.status(504).json({
        error: "La solicitud de voz tardó demasiado. Inténtalo de nuevo.",
      });
    }
    console.error("Azure Speech request failed:", error);
    return response.status(502).json({ error: "No se pudo conectar con Azure Speech." });
  } finally {
    clearTimeout(timeout);
  }
};
