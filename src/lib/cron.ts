import { getSourcesOfInterestingContent } from './getSourcesOfInterestingContent';
import { getInterestingContent } from './getInterestingContent';
import { generateTrendReport } from './generateTrendReport';
import { sendReport } from './sendReport';

export const handleCron = async (): Promise<void> => {
  try {
    // get the sources.. aka interesting users and channels
    const sources = await getSourcesOfInterestingContent();
    // get recent casts from sources
    const casts = await getInterestingContent(sources);
    // write a report with the interesting content from the casts
    const report = await generateTrendReport(JSON.stringify(casts));    
    // send the report to the user
    const response = await sendReport(report);     
    // print the results
    console.log(response ? 
      "Trends have been found, notified and published successfully." : 
      "Something was wrong."
    );
  } catch (err) {
    console.log(err);
  }
}
