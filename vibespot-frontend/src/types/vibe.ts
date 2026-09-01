export interface SendVibeRequest {
  receiverId: string;
  emoji: string;
}

export interface SendVibeResponse {
  success: boolean;
  matched: boolean;
  message: string;
  chatRoomId?: string;
}

export interface PendingVibe {
  id: string;

  emoji: string;

  created_at: string;

  sender: {
    id: string;
    username: string;
    avatar_emoji: string;
  };
}

export interface PendingVibesResponse {
  success: boolean;
  count: number;
  pendingVibes: PendingVibe[];
}