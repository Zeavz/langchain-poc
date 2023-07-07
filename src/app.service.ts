import { Injectable } from '@nestjs/common';
import { LLMChain, OpenAI, PromptTemplate } from 'langchain';
import * as dotenv from 'dotenv';
import { RequestObj } from './app.controller';
import * as process from "process";
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async fulfillRequest(request: RequestObj): Promise<string> {
    const model = new OpenAI({ temperature: 0.9 });
    const template =
      'Pretend you are a marketing expert that writes marketing posts for platforms like Facebook, Instagram, google, and Pinterest. Your reply must only be a valid JSON object, ' +
      'where you will produce 3 different caption variations within an array with the attribute "caption". If we had a previous' +
      'conversation this would be the history, it will be in an array format where each index will represent who spoke starting with the user message ' +
      'being every even index starting at 0 and your replies being the odd indexes: {history}. This is a list of your previous captions that you have used in the past' +
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
    console.log('-----------------------------------------');
    let toReturn = res.text;
    while (toReturn[0] !== '{') {
      toReturn = toReturn.substring(1);
    }
    return res.text;
  }

  async generateImage(request: string): Promise<any> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const promptTemplate =
      'Pretend you are a marketing expert that creates images for platforms like Facebook, Instagram, google, and Pinterest ads. Your photos' +
      'must be photorealstic and not include any words.';

    const finalPrompt = promptTemplate + request;

    try {
      const response = await openai.createImage({
        prompt: finalPrompt,
        n: 1,
        size: '512x512',
      });
      return response.data.data;
    } catch (err) {
      return 'failed...';
    }
  }
}
