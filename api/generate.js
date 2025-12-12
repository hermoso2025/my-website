import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { t1, t2, t3, t4, t5, lang = "en", format = "one" } = req.body || {};

    const userInput = `
[기법&주제]
${t1 || ""}

[배경&블렌딩]
${t2 || ""}

[조명&색감]
${t3 || ""}

[디테일&분위기]
${t4 || ""}

[규격]
${t5 || ""}
`.trim();

    const instruction =
      lang === "ko"
        ? `너는 광고/시네마틱 AI 프롬프트 엔지니어다. 5개 입력을 바탕으로 의미를 바꾸지 말고 중복을 정리해 "최종 프롬프트"를 만들어라.
- 출력은 오직 최종 프롬프트만.
- format="one"이면 한 줄(쉼표 연결), format="block"이면 섹션 라벨 유지.`
        : `You are a professional AI prompt engineer. Refine the 5 fields into a final prompt without changing meaning.
- Output ONLY the final prompt.
- format="one": single line joined by commas. format="block": keep section labels.`;

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: `${instruction}\n\nUSER INPUT:\n${userInput}`
    });

    return res.status(200).json({ text: response.output_text || "" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate", detail: err?.message || String(err) });
  }
}
