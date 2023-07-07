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
  getHello(request: RequestObj): string {
    return this.appService.getHello();
  }
  @Post()
  async personalAssistant(@Body() request: RequestObj): Promise<string> {
    return await this.appService.fulfillRequest(request);
  }

  @Post('/generateImage/')
  async generateImage(@Body() request: { prompt: string }): Promise<any> {
    return await this.appService.generateImage(request.prompt);
  }
}
