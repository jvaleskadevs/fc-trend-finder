import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

const TREND_REPORT_ZOD_SCHEMA = z.array(z.object({
    description: z.string().describe("A short sentence describing the content of the cast."),
    url: z.string().describe("The url of the cast.")
  })).describe("Trend report schema with interesting casts from farcaster.");

export const TREND_REPORT_SCHEMA = zodToJsonSchema(
  TREND_REPORT_ZOD_SCHEMA,
  { name: "TREND_REPORT_ZOD_SCHEMA", nameStrategy: 'title' }
);
