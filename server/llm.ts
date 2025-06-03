export async function getChatCompletion(messages: {role: string; content: string;}[]): Promise<string> {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM_API_KEY not configured");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
