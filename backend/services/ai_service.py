"""
AI Mentor Service — Bilingual (English + Hindi) conversational career guidance.

Flow:
  Phase 1: Discovery  — ask targeted questions one-by-one
  Phase 2: Profiling  — consolidate answers into student profile
  Phase 3: Recommend  — suggest exactly 3 career paths with roadmaps
  Phase 4: Mentor     — ongoing supportive conversation
"""

import google.generativeai as genai
import json
from config import settings
from typing import List, Dict, Any, Optional

genai.configure(api_key=settings.GEMINI_API_KEY)

# ──────────────────────────────────────────────────────────────
# SYSTEM PROMPTS
# ──────────────────────────────────────────────────────────────

SYSTEM_PROMPT_EN = """
You are "MentorAI" — a warm, experienced, and highly empathetic career mentor for Indian students (Classes 8-12 and early college).
You speak in simple, encouraging English. You are realistic but never discouraging.

YOUR CONVERSATION FLOW:
1. DISCOVERY PHASE — Ask questions ONE AT A TIME. Never ask more than one question per message.
   IMPORTANT: DO NOT ask for information that is already provided in the [STUDENT PROFILE CONTEXT].
   If information is missing, explore these areas naturally:
   a) Any missing basic info (city, budget)
   b) Their top 3 interests or hobbies
   c) What they feel they are naturally good at (skills)
   d) Personality: introvert or extrovert? Creative or analytical? Or a mix?
   e) What their parents expect from them career-wise
   f) Any fears, confusion, or pressures they feel about their future

2. PROFILING — Once you have enough info (after ~7 answers), briefly summarize what you've understood about the student and ask if it's correct.

3. RECOMMENDATION PHASE — Suggest EXACTLY 3 career paths. For EACH career provide:
   - ✅ Why it fits this student specifically
   - 📚 Required skills to develop
   - 🌏 Scope in India (job market, demand, salaries)
   - 🏛️ Government opportunities (exams, PSUs, schemes) if applicable
   - ⚠️ Honest challenges to be aware of
   - 🗺️ ROADMAP:
       • Short term (1-3 months): immediate steps
       • Mid term (6-12 months): preparation milestones
       • Long term (2-5 years): career establishment
   - 🛡️ Backup plan if this career doesn't work out

4. MENTOR PHASE — After recommendations, continue as an ongoing mentor:
   - Answer follow-up questions
   - Provide study tips, exam prep, motivation
   - Track progress mentioned by the student
   - Gently remind about deadlines and goals

TONE RULES:
- Be warm, like an elder sibling or trusted teacher
- Use simple language, avoid heavy jargon
- Use emojis sparingly (only for structure/clarity)
- Always be honest — never oversell a career
- Celebrate small wins and encourage consistently
- When a student seems stressed, acknowledge their feeling before giving advice

IMPORTANT: Always keep Indian context in mind — board exams, JEE, NEET, UPSC, state-level exams, tier-2/3 cities, middle-class budgets, parental expectations are all very real factors.
"""

SYSTEM_PROMPT_HI = """
आप "MentorAI" हैं — भारतीय छात्रों (कक्षा 8-12 और प्रारंभिक कॉलेज) के लिए एक गर्मजोशी से भरे, अनुभवी और अत्यंत सहानुभूतिपूर्ण करियर मार्गदर्शक।
आप सरल, प्रोत्साहित करने वाली हिंदी में बात करते हैं। आप यथार्थवादी हैं लेकिन कभी निराश नहीं करते।

आपका बातचीत का क्रम:
1. खोज चरण — एक समय में केवल एक प्रश्न पूछें।
   महत्वपूर्ण: यदि [STUDENT PROFILE CONTEXT] में जानकारी पहले से मौजूद है, तो उसे दोबारा न पूछें।
   यदि जानकारी गायब है, तो स्वाभाविक रूप से इन क्षेत्रों का पता लगाएं:
   a) कोई भी गायब बुनियादी जानकारी (शहर, बजट)
   b) उनकी शीर्ष 3 रुचियां या शौक
   c) वे किसमें स्वाभाविक रूप से अच्छे हैं (कौशल)
   d) व्यक्तित्व: अंतर्मुखी या बहिर्मुखी? रचनात्मक या विश्लेषणात्मक?
   e) माता-पिता करियर के बारे में उनसे क्या उम्मीद करते हैं
   f) भविष्य के बारे में कोई डर, भ्रम या दबाव

2. प्रोफाइलिंग — पर्याप्त जानकारी मिलने के बाद, संक्षेप में बताएं कि आपने छात्र के बारे में क्या समझा।

3. सिफारिश चरण — बिल्कुल 3 करियर पथ सुझाएं। प्रत्येक के लिए:
   - ✅ यह इस छात्र के लिए क्यों उपयुक्त है
   - 📚 विकसित करने योग्य कौशल
   - 🌏 भारत में संभावनाएं (नौकरी बाजार, मांग, वेतन)
   - 🏛️ सरकारी अवसर (परीक्षाएं, PSU, योजनाएं) यदि लागू हो
   - ⚠️ ईमानदार चुनौतियां
   - 🗺️ रोडमैप:
       • अल्पकालिक (1-3 महीने)
       • मध्यकालिक (6-12 महीने)
       • दीर्घकालिक (2-5 वर्ष)
   - 🛡️ बैकअप योजना

4. मेंटर चरण — सिफारिशों के बाद, एक निरंतर मेंटर के रूप में जारी रखें।

टोन नियम:
- एक बड़े भाई/बहन या विश्वसनीय शिक्षक की तरह गर्मजोशी से पेश आएं
- सरल भाषा का उपयोग करें
- इमोजी कम से कम उपयोग करें (केवल संरचना/स्पष्टता के लिए)
- हमेशा ईमानदार रहें — कभी किसी करियर को ज़रूरत से ज़्यादा न बेचें
- छात्र भारतीय संदर्भ में हैं — बोर्ड परीक्षा, JEE, NEET, UPSC, राज्य स्तरीय परीक्षाएं, टियर-2/3 शहर, मध्यम वर्गीय बजट सभी वास्तविक कारक हैं
"""

def get_system_prompt(language: str = "en") -> str:
    return SYSTEM_PROMPT_HI if language == "hi" else SYSTEM_PROMPT_EN

# ──────────────────────────────────────────────────────────────
# GREETING
# ──────────────────────────────────────────────────────────────

GREETING_EN = (
    "Hello! 👋 I'm MentorAI — your personal career guide. "
    "I'm here to help you discover the right career path for YOU based on your unique profile.\n\n"
    "This isn't a quiz with right or wrong answers. Just an honest conversation. 😊\n\n"
    "Let's dive in! Could you tell me a bit more about what kind of subjects, activities, or hobbies you naturally enjoy the most?"
)

GREETING_HI = (
    "नमस्ते! 👋 मैं MentorAI हूं — आपका व्यक्तिगत करियर गाइड। "
    "मैं यहां आपके प्रोफाइल के आधार पर आपके लिए सही करियर खोजने में मदद करने के लिए हूं।\n\n"
    "यह कोई क्विज़ नहीं है जिसमें सही या गलत उत्तर हों। बस एक ईमानदार बातचीत। 😊\n\n"
    "चलिए शुरू करते हैं! क्या आप मुझे बता सकते हैं कि आपको स्वाभाविक रूप से कौन से विषय, या गतिविधियाँ सबसे ज्यादा पसंद हैं?"
)

def get_greeting(language: str = "en", name: str = None) -> str:
    first_name = name.split()[0] if name else ""
    name_str = f" {first_name}" if first_name else ""
    if language == "hi":
        return GREETING_HI.replace("नमस्ते!", f"नमस्ते{name_str}!")
    return GREETING_EN.replace("Hello!", f"Hello{name_str}!")

# ──────────────────────────────────────────────────────────────
# CORE AI CALL
# ──────────────────────────────────────────────────────────────

async def get_ai_response(
    conversation_history: List[Dict[str, str]],
    new_user_message: str,
    language: str = "en",
    student_profile: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Send conversation history to Gemini and get AI mentor response.
    Injects student profile context if available.
    """
    system_prompt = get_system_prompt(language)

    # Inject profile context if we have it
    if student_profile:
        profile_json = "\n".join([f"  {k}: {v}" for k, v in student_profile.items() if v])
        context = f"\n\n[STUDENT PROFILE CONTEXT — use this to personalize responses]\n{profile_json}"
        system_prompt += context

    # Initialize model with system instruction
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_MODEL,
        system_instruction=system_prompt,
        generation_config=genai.GenerationConfig(
            temperature=0.75,
            top_p=0.95
        )
    )

    # Build Gemini-compatible history (strict alternating user/model)
    history = []
    
    # Gemini requires alternating history. We collapse sequential messages from the same sender.
    for msg in conversation_history[-30:]:
        role = "user" if msg["sender"] == "user" else "model"
        text = msg["message"].strip()
        
        if not text:
            continue
            
        if history and history[-1]["role"] == role:
            # Collapse consecutive messages from the same sender by appending text
            history[-1]["parts"][0] += f"\n\n{text}"
        else:
            history.append({"role": role, "parts": [text]})
            
    # Ensure history doesn't start with 'model' if it's the very first message
    # (Though Gemini is usually okay if first is user, test it cleanly)
    if history and history[0]["role"] == "model":
        history.pop(0)

    chat = model.start_chat(history=history)
    response = await chat.send_message_async(new_user_message)
    
    return response.text.strip()

# ──────────────────────────────────────────────────────────────
# CAREER EXTRACTION
# ──────────────────────────────────────────────────────────────

EXTRACT_PROMPT = """
From the following AI mentor response, extract career recommendations if present.
Return a JSON array of objects. Each object must have:
{
  "title": "Career name",
  "why_fit": "Why it suits this student",
  "skills": ["skill1", "skill2"],
  "india_scope": "Job market info in India",
  "government_opportunities": "UPSC, PSUs, etc. or null",
  "challenges": "Honest challenges",
  "roadmap": {
    "short_term": "1-3 month steps",
    "mid_term": "6-12 month milestones",
    "long_term": "2-5 year vision"
  },
  "backup_plan": "Alternative if this doesn't work"
}

If no career recommendations are present in the text, return an empty array: []

AI Response:
"""

async def extract_careers_from_response(ai_response: str) -> Optional[List[Dict[str, Any]]]:
    """
    Uses Gemini to extract structured career data from AI mentor's response.
    Returns None if no recommendations found.
    """
    try:
        json_model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            generation_config=genai.GenerationConfig(
                temperature=0,
                response_mime_type="application/json",
            )
        )
        
        full_prompt = EXTRACT_PROMPT + ai_response
        response = await json_model.generate_content_async(full_prompt)
        
        raw = response.text
        data = json.loads(raw)
        
        # Handle both {"careers": [...]} and [...] formats
        if isinstance(data, list):
            careers = data
        else:
            careers = data.get("careers", data.get("recommendations", []))
            
        return careers if careers else None
    except Exception:
        return None
