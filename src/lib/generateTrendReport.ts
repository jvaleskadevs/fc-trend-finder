import { Together } from 'together-ai';
import { TREND_REPORT_SCHEMA } from './schemas';

const META_LLAMA_LLM_MODEL = "meta-llama/Llama-Vision-Free"; // free  model 
//"meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"; // paid model

export const generateTrendReport = async (content: string): Promise<string> => {
  return await genTrendReport(content);
}

const genTrendReport = async (content: string): Promise<string> => {
  const messages = [
    {
      role: "system" as "system",
      content: `Your task is to curate and extract the interesting content and trends from a list of posts in the farcaster social network. Response must be only a valid JSON following this schema strictly: ${TREND_REPORT_SCHEMA}.`
    },
    {
      role: "user" as "user",
      content: `Your task is to select the more relevant posts and extract the interesting content and trends from this list of farcaster posts: {{${content}}}. Ignore posts with no interesting content. Max 15 posts. For each relevant post write a one-or-two-sentence 'description' focusing on the trending content and extract the 'url' of the post. Response must be only valid JSON following this schema strictly: ${TREND_REPORT_SCHEMA}.`
    }
  ];
  
  try {  
    const together = new Together({ apiKey: process.env.TOGETHER_API_KEY || "" });
  
    const response = await together.chat.completions.create({
      model: META_LLAMA_LLM_MODEL,
      messages: messages,
      // @ts-ignore
      //response_format: { type: "json_object", schema: TREND_REPORT_SCHEMA } // not available on free model
    });
    
    const report = response?.choices?.[0]?.message?.content;
    if (!report) return "";
    
    console.log(report);
    
    // the free model does not support JSON format
    // we try to parse the JSON, anyway
    try {
      return formatTrendReport(JSON.parse(report));
    } catch (err) {
      console.log(err);
    }
     
    // if json parsing failed, we fallback to the original string
    return `Farcaster trends for ${getCurrentDate()}\n\n${report}`;
  } catch (err) {
    console.log(err);
  }
  return "";
}

const getCurrentDate = () => {
  return new Date().toLocaleDateString(
    'en-US', 
    { 
      timeZone: 'America/New_York', 
      month: 'numeric', 
      day: 'numeric'
    }
  );
}

const formatTrendReport = (report: any): string => {
  return `Farcaster trends for ${getCurrentDate()}` + "\n\n" + report
    .map((trend: any) => `· ${trend.description}\n${trend.url}`)
    .join('\n\n')
};
