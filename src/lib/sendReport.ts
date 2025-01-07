import { publishCast, sendDirectCast } from './neynar';

export async function sendReport(report: string): Promise<boolean> {
  if (!report) return false;
  const resultDirectCast = await sendDirectCast(report);
  console.log("Direct casts result: ", resultDirectCast);
  const resultPublicCast = await publishCast(report);
  console.log("Public casts result: ", resultPublicCast);
  return resultDirectCast && resultPublicCast;
}
