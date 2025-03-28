export interface AgentResponse {
  status: number;
  statusText: string;
  data: AgentResponseData[];
}

export interface AgentResponseData {
  user?: string;
  text: string;
  action?: string;
  content?: AgentResponseContent;
}

export interface AgentResponseContent {
  success: boolean;
  nftId: string;
  hash: string;
  recipient: string;
  recipientAddress: string;
  tokenUri: string;
  imageUrl: string;
  txUrl: string;
}
