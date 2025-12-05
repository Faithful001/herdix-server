import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { createCropHealthTool, createLivestockHealthTool } from './tools';

@Injectable()
export class AgentService {
  private model: ChatGoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: 'gemini-1.5-flash',
      temperature: 0,
    });
  }

  async chat(message: string, image?: string) {
    const tools = [
      createCropHealthTool(this.aiService, image),
      createLivestockHealthTool(this.aiService, image),
    ];

    const toolNode = new ToolNode(tools);
    const modelWithTools = this.model.bindTools(tools);

    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const response = await modelWithTools.invoke(messages);
      return { messages: [response] };
    };

    const shouldContinue = (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage &&
        'tool_calls' in lastMessage &&
        Array.isArray(lastMessage.tool_calls) &&
        lastMessage.tool_calls.length > 0
      ) {
        return 'tools';
      }
      return END;
    };

    const workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', callModel)
      .addNode('tools', toolNode)
      .addEdge(START, 'agent')
      .addConditionalEdges('agent', shouldContinue)
      .addEdge('tools', 'agent');

    const app = workflow.compile();

    const result = await app.invoke({
      messages: [new HumanMessage(message)],
    });

    const lastMessage = result.messages[result.messages.length - 1];
    return {
      response: lastMessage.content,
    };
  }
}
