export interface Debater {
  id: string;
  name: string;
  title: string;
  avatar: string;
  votes: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "voting" | "scheduled" | "live" | "completed";
  votingEndsAt: string;
  debateAt: string | null;
  forSide: {
    label: string;
    debaters: Debater[];
  };
  againstSide: {
    label: string;
    debaters: Debater[];
  };
  totalVotes: number;
  createdAt: string;
}
