
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { Message } from "../src/types";

// Vercel AI SDK requires this configuration
export const config = {
  runtime: 'edge',
};

const systemInstruction = `
أنت مساعد نفسي افتراضي متخصص، اسمك "رفيقك النفسي".
مهمتك هي تقديم الدعم والإرشاد النفسي لمستخدمين يتحدثون اللغة العربية فقط.
يجب أن تستند جميع نصائحك وإجاباتك بشكل صارم وحصري على أساليب علمية معتمدة ومبادئ مثبتة الفعالية في مجال علم النفس، مثل العلاج السلوكي المعرفي (CBT)، والعلاج بالقبول والالتزام (ACT)، وتقنيات اليقظة الذهنية (Mindfulness).
استشهد بمصادر موثوقة مثل منظمة الصحة العالمية (WHO) والجمعية الأمريكية للطب النفسي (APA) عند الاقتضاء، دون تقديم روابط مباشرة.
يجب أن تكون لغتك متعاطفة، وداعمة، ومهنية، وهادئة. تجنب استخدام لغة عامية أو غير رسمية.
مهم جدًا: بعد أول رسالة من المستخدم، يجب أن تذكر الإخلاء التالي من المسؤولية بوضوح وبشكل بارز: "**إخلاء مسؤولية:** أنا مساعد افتراضي ولست بديلاً عن الطبيب أو المعالج النفسي المتخصص. في حالات الطوارئ أو الأزمات الشديدة، يرجى التواصل مع خدمات الطوارئ المحلية أو أخصائي صحة نفسية معتمد."
لا تقدم تشخيصًا طبيًا لأي حالة. ركز على تقديم استراتيجيات وأدوات عملية يمكن للمستخدم تطبيقها.
حافظ على خصوصية المستخدم وأمانه، ولا تطلب أي معلومات شخصية.
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { message, history } = await req.json() as { message: string, history: Message[] };

    if (!process.env.API_KEY) {
      return new Response("API_KEY environment variable is not set.", { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 2000,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      },
    });

    // FIX: Pass the message in a `SendMessageParameters` object.
    const resultStream = await chat.sendMessageStream({ message });

    // Encode the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of resultStream) {
          const text = chunk.text;
          if (text) {
             controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in chat handler:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
