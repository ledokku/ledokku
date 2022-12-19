import {
  $log,
  BodyParams,
  PlatformRequest,
  RawBodyParams,
  Req,
} from '@tsed/common';
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
    @Header('x-hub-signature-256') secret: string,
    @BodyParams('installation') installation: any,
    @BodyParams('repository') repository: any,
    @RawBodyParams()
    rawBody: Buffer
  ): Promise<any> {
    if (githubEvent === 'push') {
      try {
        await this.handleWebhooks(
          secret,
          rawBody,
          installation.id.toString(),
          repository.id.toString()
        );
      } catch (e) {
        throw new InternalServerError(e);
      }
    }

    return { success: true };
  }

  async handleWebhooks(
    secret: string,
    rawBody: Buffer,
    installation: string,
    repository: string
  ) {
    const requestVerified = verifyWebhookSecret(secret, rawBody);

    if (!requestVerified) {
      throw new Unauthorized('Invalid request');
    }

    return this.githubRepository.deployRepository(installation, repository);
  }
}
