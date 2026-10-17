// Gemini AI Service for LetGoo Chatbot & Travel Assistant
// Uses Google Generative Language API (Gemini 3.8 Flash) with multi-turn chat support and fallback

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite'
];

const SYSTEM_INSTRUCTION = `Bạn là "LetGoo AI" - trợ lý du lịch, ẩm thực và lên lịch trình thông minh, thân thiện dành cho giới trẻ và các nhóm bạn tại Việt Nam.

Quy tắc ứng xử và định dạng:
1. Bạn phải giao tiếp tự nhiên, thân mật, hóm hỉnh, am hiểu sâu sắc về ẩm thực và các địa điểm du lịch tại Việt Nam (Hà Nội, TP.HCM, Đà Lạt, Đà Nẵng, Hội An, Phú Quốc, Ninh Bình, Sa Pa, v.v.).
2. Nếu người dùng chỉ chào hỏi (như "hello", "hi", "chào bạn", "bạn là ai", "alo"):
   - Hãy chào lại một cách tự nhiên, vui vẻ, giới thiệu ngắn gọn bạn có thể giúp gì (tìm quán ngon, cafe chill, lên lịch trình du lịch trọn gói).
   - KHÔNG ĐƯỢC tự ý tạo danh sách địa điểm/lịch trình khi người dùng chỉ chào hỏi! (để suggestedPlaces: []).
3. Khi người dùng hỏi gợi ý quán ăn, cafe, địa điểm đi chơi, kinh nghiệm hoặc yêu cầu lên lịch trình:
   - Trò chuyện, phân tích và đưa ra lời khuyên cụ thể, có tâm trong phần "message".
   - Trích xuất các địa điểm cụ thể và có thật vào mảng "suggestedPlaces" để người dùng có thể bấm "Lưu vào Muốn đi".
   - Nếu là yêu cầu lên lịch trình theo mốc giờ (ví dụ: "1 ngày Hà Nội", "2 ngày Đà Lạt"), hãy điền khung giờ vào trường "time".

QUAN TRỌNG: Hãy luôn trả về JSON thuần túy (không bọc trong \`\`\`json) với định dạng:
{
  "message": "Nội dung phản hồi trò chuyện tự nhiên của bạn bằng tiếng Việt",
  "suggestedPlaces": [
    {
      "name": "Tên quán ăn hoặc địa điểm cụ thể",
      "location": "Địa chỉ hoặc khu vực cụ thể",
      "cost": "Chi phí ước tính (ví dụ: 45.000đ hoặc 50.000 - 80.000đ)",
      "time": "Khung giờ gợi ý nếu là lịch trình (ví dụ: 08:00 - 09:30, hoặc để trống \"\")",
      "desc": "Mô tả ngắn gọn điểm đặc sắc hoặc món nên gọi (1-2 câu)",
      "category": "an" // Bắt buộc dùng một trong: "an", "cafe", "dulich", "chill", "workshop"
    }
  ],
  "quickReplies": ["Gợi ý câu hỏi tiếp theo 1", "Gợi ý câu hỏi tiếp theo 2", "Gợi ý câu hỏi tiếp theo 3"]
}`;

/**
 * Chat with Gemini AI
 * @param {Array<{role: 'user'|'assistant', text: string}>} history 
 * @param {string} userMessage 
 * @returns {Promise<{message: string, suggestedPlaces: Array, quickReplies: Array}>}
 */
export async function chatWithGemini(history = [], userMessage = '') {
  if (!userMessage || !userMessage.trim()) return null;

  // Build conversational context
  const conversationContext = history
    .slice(-6) // keep recent turns
    .map(m => `${m.role === 'user' ? 'User' : 'LetGoo AI'}: ${m.text}`)
    .join('\n');

  const fullPrompt = `${SYSTEM_INSTRUCTION}

${conversationContext ? `Lịch sử cuộc trò chuyện gần nhất:\n${conversationContext}\n` : ''}
User: ${userMessage.trim()}`;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        console.warn(`[Gemini Chat] Model ${model} returned HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed && typeof parsed.message === 'string') {
        return {
          message: parsed.message,
          suggestedPlaces: Array.isArray(parsed.suggestedPlaces) ? parsed.suggestedPlaces : [],
          quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : []
        };
      }
    } catch (err) {
      console.warn(`[Gemini Chat] Error with ${model}:`, err.message);
    }
  }

  // Graceful fallback if Gemini API is unreachable or rate limited
  return fallbackChat(userMessage);
}

function fallbackChat(userMessage) {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('chào') || lower.includes('alo')) {
    return {
      message: "Dạ chào bạn! 👋 Mình là LetGoo AI — trợ lý du lịch & ẩm thực của bạn. Hôm nay bạn muốn tìm quán ngon, cafe view đẹp hay cần mình lên trọn gói một lịch trình vi vu?",
      suggestedPlaces: [],
      quickReplies: [
        "Gợi ý quán ốc ngon ở Hà Nội",
        "Lên lịch trình 1 ngày phố cổ 300k",
        "Quán cafe ngắm hoàng hôn Hồ Tây"
      ]
    };
  }

  if (lower.includes('đà lạt') || lower.includes('dalat')) {
    return {
      message: "Đà Lạt mùa này thời tiết se lạnh siêu thích hợp để săn mây và chill hoàng hôn! Đây là một vài địa điểm và lịch trình mình gợi ý cho bạn:",
      suggestedPlaces: [
        {
          name: "Săn mây Cầu Đất & Đồi Chè",
          location: "Thôn Trường Thọ, Cầu Đất, Đà Lạt",
          cost: "60.000đ",
          time: "05:00 - 07:30",
          desc: "Đón bình minh tại thung lũng mây bồng bềnh, nhâm nhi cà phê nóng giữa làn sương sớm.",
          category: "dulich"
        },
        {
          name: "Tiệm Cà Phê Túi Mơ To",
          location: "Hẻm 31 Sào Nam, Phường 11, Đà Lạt",
          cost: "85.000đ",
          time: "10:30 - 13:00",
          desc: "Không gian vườn cúc hoạ mi kinh điển, ngắm trọn thung lũng thơ mộng.",
          category: "cafe"
        },
        {
          name: "Lẩu Gà Lá É Tao Ngộ",
          location: "Số 5 đường 3/4, Phường 3, Đà Lạt",
          cost: "250.000đ",
          time: "19:00 - 21:00",
          desc: "Nồi lẩu nóng hổi xua tan cái lạnh Đà Lạt, thịt gà chắc ngọt đậm đà.",
          category: "an"
        }
      ],
      quickReplies: ["Thêm quán cafe view đẹp Đà Lạt", "Kinh nghiệm đi săn mây Cầu Đất"]
    };
  }

  return {
    message: `Mình đã nhận được yêu cầu: "${userMessage}". LetGoo AI gợi ý bạn có thể khám phá những điểm đến ẩm thực và check-in đặc sắc tại Hà Nội dưới đây:`,
    suggestedPlaces: [
      {
        name: "Phở Bát Đàn Gia Truyền",
        location: "49 Bát Đàn, Hoàn Kiếm, Hà Nội",
        cost: "60.000đ",
        time: "07:30 - 09:00",
        desc: "Phở bò tái lăn gia truyền nước dùng ngọt thanh đậm đà.",
        category: "an"
      },
      {
        name: "Cà phê Giảng",
        location: "39 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội",
        cost: "35.000đ",
        time: "09:30 - 11:00",
        desc: "Cà phê trứng béo ngậy trứ danh khai sinh tại phố cổ Hà Nội.",
        category: "cafe"
      }
    ],
    quickReplies: ["Lên lịch trình 1 ngày chi tiết", "Tìm quán ăn ngon khác"]
  };
}
