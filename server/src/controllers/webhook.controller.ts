import { $log, PlatformRequest, Req } from '@tsed/common';
import { Controller } from '@tsed/di';
import {
  BadRequest,
  InternalServerError,
  Unauthorized,
} from '@tsed/exceptions';
import { ContentType, Header, Post, Returns } from '@tsed/schema';
import { verifyWebhookSecret } from '../lib/webhooks/verifyGithubSecret';
import { GithubRepository } from './../modules/github/data/repositories/github.repository';

@Controller('/webhooks')
export class WebhookController {
  constructor(private githubRepository: GithubRepository) {}

  @Post()
  @ContentType('application/json')
  @Returns(200)
  async onMessage(
    @Header('x-github-event') githubEvent: string,
    @Req() req: PlatformRequest
  ): Promise<any> {
    if (githubEvent === 'push') {
      $log.info('Webhook', req.body);
      try {
        await this.handleWebhooks(req);
      } catch (e) {
        throw new InternalServerError(e);
      }
    }

    return { success: true };
  }

  async handleWebhooks(req: PlatformRequest) {
    if (!req.body) {
      throw new BadRequest('Failed to fetch the request from github');
    }

    const requestVerified = verifyWebhookSecret(req as any);

    if (!requestVerified) {
      throw new Unauthorized('Invalid request');
    }

    return this.githubRepository.deployRepository(
      req.body.installation.id.toString(),
      req.body.repository.id.toString()
    );
  }
}
