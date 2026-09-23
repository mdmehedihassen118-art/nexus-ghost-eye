import { CategoryId, PromptItem } from '@/types';
import { TEMPLATES_BY_CATEGORY } from './templates';

export async function generatePromptsForBusiness(
  category: CategoryId,
  businessName: string
): Promise<PromptItem[]> {
  const cleanBusiness = businessName.trim() || 'My Business';
  const categoryTemplates = TEMPLATES_BY_CATEGORY[category] || TEMPLATES_BY_CATEGORY.marketing;

  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are PromptCraft AI, an expert prompt engineer specializing in enterprise workflows. The user will give a category ("${category}") and a business name ("${cleanBusiness}"). Return exactly 5 custom prompts in valid JSON format as an array of 5 objects with keys: "title", "prompt", "tags" (array of 2-3 strings), and "explanation".`,
            },
            {
              role: 'user',
              content: `Generate 5 custom, professional prompts for business named "${cleanBusiness}" in the category "${category}".`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length >= 5) {
            return parsed.slice(0, 5).map((item, idx) => ({
              id: `${category}-${Date.now()}-${idx}`,
              title: item.title || `Custom Prompt ${idx + 1}`,
              prompt: item.prompt || '',
              category,
              businessName: cleanBusiness,
              tags: Array.isArray(item.tags) ? item.tags : [category],
              explanation: item.explanation || 'Tailored prompt generated for your business.',
            }));
          }
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed or fallback triggered:', err);
    }
  }

  // Fallback to high-quality dynamic template synthesis engine
  return categoryTemplates.map((templateObj, index) => {
    return {
      id: `${category}-${Date.now()}-${index}`,
      title: templateObj.title,
      prompt: templateObj.template(cleanBusiness),
      category,
      businessName: cleanBusiness,
      tags: templateObj.tags,
      explanation: templateObj.explanation,
    };
  });
}
