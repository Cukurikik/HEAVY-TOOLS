import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideServer, ServerConfig} from '@angular/platform-server';
import {appConfig} from './app.config';
import {serverRoutes} from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServer(),
    ServerConfig.fromObject({ routes: serverRoutes })
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);