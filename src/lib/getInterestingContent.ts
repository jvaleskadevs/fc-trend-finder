import { Source, SOURCE_TYPE } from './getSourcesOfInterestingContent';
import { getRecentUserCasts, getRecentChannelCasts, Cast } from './neynar';

export const getInterestingContent = async (sources: Source[]): Promise<Cast[]> => {
  let content: Cast[] = [];
  for (const source of sources) {
    if (source.type === SOURCE_TYPE.USER) {
      // source is a user FID
      const casts = await getRecentUserCasts(source.id);
      content = [...content, ...casts];
    } else if (source.type === SOURCE_TYPE.CHANNEL) {
      // source is a channelId
      const casts = await getRecentChannelCasts(source.id);
      content = [...content, ...casts];
    }
  }
  return content;
}
