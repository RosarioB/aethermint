import axios from "axios";
import { config } from "../config/config.js";
import { AgentResponse } from "../types/agent.types.js";

class AgentService {
  async fetchAgent(): Promise<string> {
    try {
      const response = await axios.get(`${config.eliza_url}/agents`);
      return response.data.agents[0].id;
    } catch (error) {
      console.error("Error fetching agent:", error);
      throw error;
    }
  }

  async sendMessageToAgent(
    agentId: string,
    message: string
  ): Promise<AgentResponse> {
    const endpoint = `${config.eliza_url}/${agentId}/message`;
    const payload = {
      text: message,
    };
    try {
      const response: AgentResponse = await axios.post(endpoint, payload);
      if (response.status !== 200) {
        throw new Error(
          `Invalid agent response status: ${response.status} - ${response.statusText}`
        );
      }
      return response;
    } catch (error) {
      console.error("Error sending message to the agent:", error);
      throw error;
    }
  }
}

export default new AgentService();
