import { $log, Req } from '@tsed/common';
import { Controller } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { PlatformExpressRequest } from '@tsed/platform-express';
import { ContentType, Header, Post } from '@tsed/schema';
import { handleWebhooks } from '../lib/webhooks/handleWebhooks';

@Controller('/webhooks')
export class WebhookController {
  @Post()
  @ContentType('application/json')
  async onMessage(
    @Header('x-github-event') githubEvent: string,
    @Req() req: PlatformExpressRequest
  ): Promise<any> {
    if (githubEvent === 'push') {
      $log.debug('Webhook', req.body);
      try {
        await handleWebhooks(req as any);
      } catch (e) {
        throw new InternalServerError(e);
      }
    }

    return { success: true };
  }
}
