import { v4 as uuidv4 } from 'uuid';
import { DC_RECIPIENT_FID, CHANNEL_RECIPIENT, CAST_LIMIT_PER_CHANNEL, CAST_LIMIT_PER_USER } from '../config';

export const sendDirectCast = async (content: string): Promise<boolean> => {
  if (!content) return false;
  
  // cast max length is 1024 characters.. splitting in chunks
  const directCasts = splitInChunks(content);
  
  const success = [];
  for (const cast of directCasts) {
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.WC_API_KEY || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipientFid: DC_RECIPIENT_FID,
        message: cast,
        idempotencyKey: uuidv4(),
      })
    }
    const endpoint = "https://api.warpcast.com/v2/ext-send-direct-cast";
    
    try {
      const response = await fetch(endpoint, options);
      const data = await response?.json();
      success.push(data?.result?.success ?? false);
    } catch (err) {
      console.log(err);
      success.push(false);
    }  
  }
  console.log(success);
  return success.length === directCasts.length && !success.includes(false);
};

export const publishCast = async (content: string): Promise<boolean> => {
  if (!content || !process.env.BOT_SIGNER_UUID) return false;
  
  // cast max length is 1024 characters.. splitting in chunks
  const casts = splitInChunks(content); 

  const success = [];  
  let previousCastHash = null;
  for (const cast of casts) {
    const options: any = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        api_key: process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        signer_uuid: process.env.BOT_SIGNER_UUID, 
        text: cast,
        //embeds: [{url: frame}],
        channel_id: CHANNEL_RECIPIENT ?? null,
        parent: previousCastHash
      })
    };
    const endpoint = `https://api.neynar.com/v2/farcaster/cast`;
    
    try {
      const response = await fetch(endpoint, options);
      const data = await response?.json();      
      previousCastHash = data?.cast?.hash ?? null;
      success.push(data?.success ?? false);
    } catch (err) {
      console.log(err);
      success.push(false);
    }  
  } 
  console.log(success);
  return success.length === casts.length && !success.includes(false);
}

export const getRecentUserCasts = async (user: string): Promise<Cast[]> => {
  if (!user) return [] as Cast[];

  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-api-key': process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS' }
  };
    
  const endpoint = `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${user}&limit=${CAST_LIMIT_PER_USER}&include_replies=false`;
  
  try {    
    const response = await fetch(endpoint, options);
    const data = await response?.json();

    return formatCasts(data?.casts ?? []);
  } catch (err) {
    console.log(err);
  }  
  
  return [] as Cast[];
};

export const getRecentChannelCasts = async (channel: string): Promise<Cast[]> => {
  if (!channel) return [] as Cast[];
  
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-api-key': process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS' }
  };
    
  const endpoint = `https://api.neynar.com/v2/farcaster/feed/channels?channel_ids=${channel}&limit=${CAST_LIMIT_PER_CHANNEL}`;
  
  try {    
    const response = await fetch(endpoint, options);
    const data = await response?.json();

    return formatCasts(data?.casts ?? []);
  } catch (err) {
    console.log(err);
  }
  
  return [] as Cast[];
};

export type Cast = {
  username: string;
  text: string;
  channel: string;
  quoted: { author: string; text: string }[],
  url: string
}

const formatCasts = (casts: any[]): Cast[] => {
  if (!casts) return [];
  
  const result: Cast[] = [];
  for (const cast of casts) {
    result.push({
      username: cast?.author?.username,
      text: cast?.text,
      channel: cast?.channel?.id,
      quoted: cast?.embeds
        .filter((x: any) => x?.cast?.text)
        .map((y: any) => ({ 
          author: y?.cast?.author?.username, text: y.cast.text 
      })),
      url: `https://warpcast.com/${cast?.author?.username}/${cast?.hash?.substring(0, 10)}`
    });
  }
  
  return result;
};

const splitInChunks = (contentStr: string): string[] => {
  const content = contentStr.split("\n\n");
  // if the content was not valid JSON.. there is no breaklines..
  if (content.length === 2) return splitStrInChunks(contentStr);
  // split in chunks based on breaklines added when parsing JSON
  // these chunks should fit the cast length perfectly with no middle-word cuts
  const chunks: string[] = [];
  let chunk: string = "";
  for (let i = 0; i < content.length; i++) {
    if ((chunk + content[i] + "\n\n").length < 1000) {
      chunk = chunk + content[i] + "\n\n";
      // lastIteration.. pushing chunk manually
      if (i === content.length) chunks.push(chunk);
    } else {
      chunks.push(chunk);
      chunk = content[i] + "\n\n";
    }
  }
  return chunks;  
}
// these chunks are not perfect and could include middle-word cuts
const splitStrInChunks = (content: string): string[] => {
  const c = content.split("\n\n");
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i+=1000) {
    if (content.length < i+1000) {
      chunks.push(content.substring(i));
    } else {
      chunks.push(content.substring(i, i+1000));
    }
  }
  return chunks;  
}
