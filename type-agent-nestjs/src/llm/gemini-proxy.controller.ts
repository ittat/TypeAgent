import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';


@Controller('gemini-proxy')
export class GeminiProxyController {
  private readonly targetUrl = 'https://generativelanguage.googleapis.com';

  @All("*")
  async handleProxy(@Req() req: Request, @Res() res: Response) {
    try {
      const { method, url, headers, body } = req;
      
      // 移除可能导致问题的请求头
      delete headers.host;
      delete headers['content-length'];
      
      // 构建目标URL
      const targetPath = url.replace('/gemini-proxy', '');
      const fullUrl = `${this.targetUrl}${targetPath}`;


 
      // 发送代理请求
      const response = await axios({
        method,
        url: fullUrl,
        headers,
        data: body,
        responseType: 'stream',
        proxy: {
          host: process.env.PROXY_HOST!,
          port: parseInt(process.env.PROXY_PROT!),
          protocol: process.env.PROXY_PROTOCOL!,
        }
      });


      // 设置响应头
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      // 发送响应
      response.data.pipe(res);
    } catch (error) {
      // console.error('Proxy error:', error);
      res.status(error.response?.status || 500).json({
        error: 'Proxy request failed',
        message: error.message
      });
    }
  }
}