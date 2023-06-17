import { Injectable } from '@nestjs/common';
import { LLMChain, OpenAI, PromptTemplate } from 'langchain';
import * as dotenv from 'dotenv';
import { RequestObj } from './app.controller';
dotenv.config();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async fulfillRequest(request: RequestObj): Promise<string> {
    const model = new OpenAI({ temperature: 0.9 });
    const template =
      'Pretend you are a marketing expert that writes marketing posts for platforms like Facebook, Instagram, google, and Pinterest. Your reply must be a valid JSON object, where you will produce 3 different caption variations within an array with the attribute "caption". If we had a previous' +
      'conversation this would be the history: {history}. This is a list of your previous captions that you have used in the past' +
      'try to match the writing style: {previousCaptions}. {userMessage}';
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ['userMessage', 'previousCaptions', 'history'],
    });
    const chain = new LLMChain({ llm: model, prompt: prompt });

    const res = await chain.call({
      userMessage: request.userMessage,
      previousCaptions: request.previousCaptions,
      history: request.history,
    });
    console.log(res.text);
    return res.text;
  }
}
