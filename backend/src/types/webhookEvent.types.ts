export type WebhookEvent = {
  created_at: number;
  type: string;
  data: WebhookData;
};

export type WebhookData = {
  object: string;
  hash: string;
  author: {
    object: string;
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    custody_address: string;
    profile: {
      bio: { text: string };
      location: {
        latitude: number;
        longitude: number;
        address: {
          city: string;
          state: string;
          country: string;
          country_code: string;
        };
      };
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: {
      eth_addresses: string[];
      sol_addresses: string[];
    };
    verified_accounts: { platform: string; username: string }[];
    power_badge: boolean;
    experimental: { neynar_user_score: number };
  };
  app: {
    object: string;
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
  };
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  root_parent_url: string | null;
  parent_author: { fid: number | null };
  text: string;
  timestamp: string;
  embeds: {
    url: string;
    metadata: {
      content_type: string;
      content_length: number;
      _status: string;
      image: { width_px: number; height_px: number };
    };
  }[];
  channel: any;
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: any[];
    recasts: any[];
  };
  replies: { count: number };
  mentioned_profiles: {
    object: string;
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: { bio: { text: string | null; mentioned_profiles: any[] } };
    follower_count: number;
    following_count: number;
    verifications: any[];
    verified_addresses: { eth_addresses: any[]; sol_addresses: any[] };
    power_badge: boolean;
  }[];
  mentioned_profiles_ranges: { start: number; end: number }[];
  mentioned_channels: any[];
  mentioned_channels_ranges: any[];
  event_timestamp: string;
};