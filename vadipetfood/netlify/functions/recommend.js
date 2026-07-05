/**
 * VadiPetFood — AI Beslenme Önerisi (Netlify Function)
 * Endpoint: /.netlify/functions/recommend  [POST]
 *
 * Anthropic API anahtarı bu fonksiyon içinde çalışır —
 * istemciye (tarayıcıya) asla açılmaz.
 *
 * Ortam değişkeni: ANTHROPIC_API_KEY
 * Netlify → Site configuration → Environment variables
 */

export const handler = async (event) => {
  // Sadece POST kabul et
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // CORS — aynı origin'den gelen istekler için
  const headers = {
    "Access-Control-Allow-Origin":  process.env.URL || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const {
      petName, petType, age, weight, neutered, activity,
      allergies, needs, recipe, proteins, vegetables,
    } = payload;

    const prompt = `Sen bir veteriner beslenme uzmanısın. Aşağıdaki profile göre maksimum 2 cümle, samimi ve profesyonel Türkçe beslenme önerisi yaz. Kullanıcıya direkt hitap et (siz). Başka açıklama ekleme.

Profil:
- İsim: ${petName || "belirtilmemiş"}
- Tür: ${petType || "belirtilmemiş"}
- Yaş: ${age || "belirtilmemiş"}
- Kilo: ${weight || "belirtilmemiş"}
- Kısırlaştırıldı: ${neutered || "belirtilmemiş"}
- Aktivite: ${activity || "orta"}
- Alerjiler: ${allergies || "yok"}
- Özel ihtiyaçlar: ${needs || "yok"}
- Seçilen tarif: ${recipe || "belirtilmemiş"} + ${proteins || "—"} + ${vegetables || "—"}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-6",
        max_tokens: 300,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error("Anthropic API hatası:", err);
      return {
        statusCode: 502, headers,
        body: JSON.stringify({ error: "AI servisi yanıt vermedi", text: "" }),
      };
    }

    const data = await anthropicRes.json();
    const text = data.content?.[0]?.text || "";

    return { statusCode: 200, headers, body: JSON.stringify({ text }) };

  } catch (err) {
    console.error("Function hatası:", err);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: err.message, text: "" }),
    };
  }
};
