export const AI_PATTERNS = [
  {
    provider: "OpenAI",
    name: "openai_api_key",
    regex: /sk-[a-zA-Z0-9]{48}/g,
    description: "OpenAI API Key",
  },
  {
    provider: "OpenAI",
    name: "openai_project_key",
    regex: /sk-proj-[a-zA-Z0-9_\-]{48,}/g,
    description: "OpenAI Project Key",
  },
  {
    provider: "Anthropic",
    name: "anthropic_api_key",
    regex: /sk-ant-[a-zA-Z0-9\-_]{93,}/g,
    description: "Anthropic (Claude) API Key",
  },
  {
    provider: "Google",
    name: "google_ai_key",
    regex: /AIza[0-9A-Za-z\-_]{35}/g,
    description: "Google Gemini / AI Studio / Firebase API Key",
  },
  {
    provider: "HuggingFace",
    name: "huggingface_token",
    regex: /hf_[a-zA-Z0-9]{34,}/g,
    description: "Hugging Face Token",
  },
  {
    provider: "Replicate",
    name: "replicate_api_token",
    regex: /r8_[a-zA-Z0-9]{40}/g,
    description: "Replicate API Token",
  },
  {
    provider: "Perplexity",
    name: "perplexity_api_key",
    regex: /pplx-[a-zA-Z0-9]{48}/g,
    description: "Perplexity AI API Key",
  },
  {
    provider: "Groq",
    name: "groq_api_key",
    regex: /gsk_[a-zA-Z0-9]{40,}/g,
    description: "Groq API Key",
  },
  {
    provider: "VoyageAI",
    name: "voyage_api_key",
    regex: /pa-[a-zA-Z0-9]{43}/g,
    description: "Voyage AI API Key",
  },
  {
    provider: "Fireworks",
    name: "fireworks_api_key",
    regex: /fw_[a-zA-Z0-9]{32,}/g,
    description: "Fireworks AI API Key",
  },
  {
    provider: "Mistral",
    name: "mistral_api_key",
    regex:
      /(?:MISTRAL_API_KEY|mistral[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-zA-Z0-9]{32,})/gi,
    description: "Mistral AI API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "Cohere",
    name: "cohere_api_key",
    regex:
      /(?:CO_API_KEY|COHERE_API_KEY|cohere[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-zA-Z0-9]{40,})/gi,
    description: "Cohere API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "ElevenLabs",
    name: "elevenlabs_api_key",
    regex:
      /(?:ELEVENLABS_API_KEY|XI_API_KEY|elevenlabs[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-f0-9]{32})/gi,
    description: "ElevenLabs API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "AssemblyAI",
    name: "assemblyai_api_key",
    regex:
      /(?:ASSEMBLYAI_API_KEY|assembly[_\-]?ai[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-f0-9]{32})/gi,
    description: "AssemblyAI API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "Together",
    name: "together_api_key",
    regex:
      /(?:TOGETHER_API_KEY|together[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-f0-9]{64})/gi,
    description: "Together AI API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "AI21",
    name: "ai21_api_key",
    regex:
      /(?:AI21_API_KEY|ai21[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-zA-Z0-9]{32,})/gi,
    description: "AI21 Labs API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "DeepInfra",
    name: "deepinfra_api_key",
    regex:
      /(?:DEEPINFRA_API_KEY|deepinfra[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-zA-Z0-9]{20,})/gi,
    description: "DeepInfra API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "Azure",
    name: "azure_openai_key",
    regex:
      /(?:AZURE_OPENAI(?:_API)?_KEY|azure[_\-]?openai[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-f0-9]{32})/gi,
    description: "Azure OpenAI API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "AWS",
    name: "aws_bedrock_key",
    regex: /AKIA[0-9A-Z]{16}/g,
    description: "AWS Access Key (Bedrock/General)",
  },
  {
    provider: "StabilityAI",
    name: "stability_api_key",
    regex: /sk-[a-zA-Z0-9]{32,}(?=.*stability)/gi,
    description: "Stability AI API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "DeepSeek",
    name: "deepseek_api_key",
    regex:
      /(?:DEEPSEEK_API_KEY|deepseek[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-zA-Z0-9\-_]{32,})/gi,
    description: "DeepSeek API Key (context-aware)",
    contextual: true,
  },
  {
    provider: "xAI",
    name: "xai_grok_key",
    regex: /xai-[a-zA-Z0-9]{48,}/g,
    description: "xAI (Grok) API Key",
  },
  {
    provider: "Nvidia",
    name: "nvidia_ngc_key",
    regex: /nvapi-[a-zA-Z0-9\-_]{40,}/g,
    description: "NVIDIA NIM / NGC API Key",
  },
  {
    provider: "OpenRouter",
    name: "openrouter_api_key",
    regex: /sk-or-[a-zA-Z0-9\-_]{40,}/g,
    description: "OpenRouter API Key",
  },
  {
    provider: "Cerebras",
    name: "cerebras_api_key",
    regex:
      /(?:CEREBRAS_API_KEY|cerebras[_\-]?key)[^\S\r\n]*[:=][^\S\r\n]*["']?([a-zA-Z0-9\-_]{32,})/gi,
    description: "Cerebras API Key (context-aware)",
    contextual: true,
  },
] as const;

export type AiPattern = (typeof AI_PATTERNS)[number];
export type Provider = (typeof AI_PATTERNS)[number]["provider"];

export const UNIQUE_PROVIDERS = [
  ...new Set(AI_PATTERNS.map((p) => p.provider)),
] as string[];

export const computeEntropy = (str: string): number => {
  const freq: Record<string, number> = {};
  for (const ch of str) freq[ch] = (freq[ch] ?? 0) + 1;
  return Object.values(freq).reduce((acc, count) => {
    const p = count / str.length;
    return acc - p * Math.log2(p);
  }, 0);
};

export interface PatternMatch {
  provider: string;
  name: string;
  value: string;
  entropy: number;
  description: string;
}

export const scanContent = (content: string): PatternMatch[] => {
  const matches: PatternMatch[] = [];
  const seen = new Set<string>();

  for (const pattern of AI_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let m: RegExpExecArray | null;
    while ((m = regex.exec(content)) !== null) {
      const rawValue = m[1] ?? m[0];
      const value = rawValue.replace(/["'\s]/g, "").trim();
      if (value.length < 16) continue;
      const entropy = computeEntropy(value);
      if (entropy < 3.0) continue;
      const key = `${pattern.provider}:${value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({
        provider: pattern.provider,
        name: pattern.name,
        value,
        entropy: Math.round(entropy * 100) / 100,
        description: pattern.description,
      });
    }
  }

  return matches;
};
