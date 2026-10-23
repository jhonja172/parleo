const GEMINI_MODEL = "gemini-3.5-flash-lite";
const MAX_PROMPT_LENGTH = 30000;
const MAX_CONVERSATION_MESSAGES = 30;
const REQUEST_TIMEOUT_MS = 25000;

function validateContents(contents) {
  let totalLength = 0;
  if (!Array.isArray(contents) || contents.length === 0 || contents.length > MAX_CONVERSATION_MESSAGES) {
    return false;
  }

  for (const item of contents) {
    if (
      item === null ||
      typeof item !== "object" ||
      !["user", "model"].includes(item.role) ||
      !Array.isArray(item.parts) ||
      item.parts.length === 0
    ) {
      return false;
    }
    for (const part of item.parts) {
      if (
        part === null ||
        typeof part !== "object" ||
        typeof part.text !== "string" ||
        part.text.length === 0 ||
        part.text.length > MAX_PROMPT_LENGTH
      ) {
        return false;
      }
      totalLength += part.text.length;
      if (totalLength > MAX_PROMPT_LENGTH) {
        return false;
      }
    }
  }
  return true;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({
      error: "La variable de entorno GEMINI_API_KEY no está configurada.",
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

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return response.status(400).json({ error: "El cuerpo de la solicitud no es válido." });
  }

  const hasPrompt = typeof body.prompt === "string";
  const hasContents = body.contents !== undefined;
  if (
    hasPrompt === hasContents ||
    (hasPrompt && (body.prompt.length === 0 || body.prompt.length > MAX_PROMPT_LENGTH)) ||
    (hasContents && !validateContents(body.contents)) ||
    (body.systemInstruction !== undefined &&
      (typeof body.systemInstruction !== "string" ||
        body.systemInstruction.length === 0 ||
        body.systemInstruction.length > 5000))
  ) {
    return response.status(400).json({ error: "El contenido de la solicitud no es válido." });
  }
  if (
    body.systemInstruction !== undefined &&
    body.systemInstruction.length + (hasPrompt ? body.prompt.length : 0) > MAX_PROMPT_LENGTH
  ) {
    return response.status(400).json({ error: "La solicitud supera el tamaño máximo permitido." });
  }

  const generationConfig = {};
  if (body.generationConfig !== undefined) {
    const config = body.generationConfig;
    if (config === null || typeof config !== "object" || Array.isArray(config)) {
      return response.status(400).json({ error: "La configuración de generación no es válida." });
    }
    if (
      config.responseMimeType !== undefined &&
      !["text/plain", "application/json"].includes(config.responseMimeType)
    ) {
      return response.status(400).json({ error: "El formato de respuesta no es válido." });
    }
    if (
      config.thinkingConfig !== undefined &&
      (config.thinkingConfig === null ||
        typeof config.thinkingConfig !== "object" ||
        Array.isArray(config.thinkingConfig) ||
        !["MINIMAL", "LOW", "MEDIUM", "HIGH"].includes(
          config.thinkingConfig.thinkingLevel,
        ))
    ) {
      return response.status(400).json({ error: "El nivel de pensamiento no es válido." });
    }
    if (config.responseMimeType !== undefined) {
      generationConfig.responseMimeType = config.responseMimeType;
    }
    if (config.thinkingConfig !== undefined) {
      generationConfig.thinkingConfig = {
        thinkingLevel: config.thinkingConfig.thinkingLevel,
      };
    }
  }
  if (generationConfig.thinkingConfig === undefined) {
    generationConfig.thinkingConfig = { thinkingLevel: "LOW" };
  }

  const geminiRequest = {
    contents: hasPrompt
      ? [{ role: "user", parts: [{ text: body.prompt }] }]
      : body.contents,
    generationConfig,
  };
  if (body.systemInstruction !== undefined) {
    geminiRequest.systemInstruction = {
      parts: [{ text: body.systemInstruction }],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiRequest),
        signal: controller.signal,
      },
    );
    const payload = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error("Gemini request failed:", geminiResponse.status);
      return response.status(502).json({
        error: payload.error?.message || `Gemini respondió con HTTP ${geminiResponse.status}.`,
      });
    }

    const text = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();
    if (!text) {
      return response.status(502).json({ error: "Gemini devolvió una respuesta vacía." });
    }

    return response.status(200).json({ text });
  } catch (error) {
    if (error.name === "AbortError") {
      return response.status(504).json({
        error: "La solicitud a Gemini tardó demasiado. Inténtalo de nuevo.",
      });
    }
    console.error("Gemini request failed:", error);
    return response.status(502).json({ error: "No se pudo conectar con Gemini." });
  } finally {
    clearTimeout(timeout);
  }
};
