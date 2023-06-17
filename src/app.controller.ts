import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export type RequestObj = {
  userMessage: string;
  previousCaptions: string[];
  history: string[];
};
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(request: RequestObj): Promise<string> {
    const test = 'I want a caption about hammers';
    return await this.appService.fulfillRequest(request);
  }
  @Post()
  async personalAssistant(@Body() request: RequestObj): Promise<string> {
    return await this.appService.fulfillRequest(request);
  }
}
