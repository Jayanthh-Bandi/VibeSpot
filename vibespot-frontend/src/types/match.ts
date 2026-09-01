export interface MatchNotification {
  matchId: string;

  otherUser: {
    id: string;
    username: string;
    avatar_emoji: string;
  };
}