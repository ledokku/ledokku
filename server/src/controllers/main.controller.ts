import { Controller } from '@tsed/di';
import { ContentType, Get } from '@tsed/schema';
import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_NAME,
  TELEMETRY_DISABLED,
} from './../constants';

@Controller('/')
export class MainController {
  @Get('/runtime-config.js')
  @ContentType('application/javascript')
  runtimeConfig(): string {
    return `
        window['runConfig'] = {
          GITHUB_APP_CLIENT_ID: '${GITHUB_APP_CLIENT_ID}',
          TELEMETRY_DISABLED: '${TELEMETRY_DISABLED}',
          GITHUB_APP_NAME: '${GITHUB_APP_NAME}'
        }
    `;
  }
}
