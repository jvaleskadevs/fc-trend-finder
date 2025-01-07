export enum SOURCE_TYPE {
  USER = "user",
  CHANNEL = "channel"
}

export type Source = {
  id: string;
  type: SOURCE_TYPE
}

// list of user FIDS and channels to get content from
export async function getSourcesOfInterestingContent(): Promise<Source[]> {
  return [
    // users by FID
    //{ id: "13505", type: SOURCE_TYPE.USER },
    { id: "3", type: SOURCE_TYPE.USER },
    { id: "2", type: SOURCE_TYPE.USER },
    { id: "5650", type: SOURCE_TYPE.USER },
    { id: "99", type: SOURCE_TYPE.USER },
    { id: "12142", type: SOURCE_TYPE.USER },
    { id: "8", type: SOURCE_TYPE.USER },
    { id: "15983", type: SOURCE_TYPE.USER },
    
    // channels by channelId
    { id: "onchain-blocks", type: SOURCE_TYPE.CHANNEL },
    { id: "farcaster", type: SOURCE_TYPE.CHANNEL },
    { id: "base", type: SOURCE_TYPE.CHANNEL },
    { id: "degen", type: SOURCE_TYPE.CHANNEL },
  ] as Source[];
}
