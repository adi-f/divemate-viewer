import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject } from 'rxjs';

// https://www.oauth.com/oauth2-servers/signing-in-with-google/create-an-application/
// https://www.npmjs.com/package/angular-oauth2-oidc
// https://github.com/manfredsteyer/angular-oauth2-oidc/blob/master/projects/sample/src/app/auth.google.config.ts
 
  const authCodeFlowConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin + '/connect',
    clientId: unobfuscate('jlmnnninjmmfq(:5fkkhge<4l./j9/l4k0m+(+m-*6e*mp=..+p7//729)+9,;/0*90*p;/1'),
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    dummyClientSecret: unobfuscate("ET5Nqn5l?h$Y68(MIkXk&l'6"),
    scope: 'openid profile email https://www.googleapis.com/auth/drive.readonly',
    showDebugInformation: true
  };

  export const enum LoginState {
    UNKNOWN = 'UNKNOWN',
    LOGGED_OUT = 'LOGGED_OUT',
    LOGGED_IN = 'LOGGED_IN'
  }

  const enum GDKind {
    FILE = 'drive#file'
  }

  const enum GDMimeType {
    FOLDER = 'application/vnd.google-apps.folder',
    BINARY_FILE = 'application/octet-stream',
  }

  interface GDFileList {
    files: GDFile[]
  }

  interface GDFile {
    kind: GDKind;
    id: string
    name: string
    mimeType: GDMimeType
  }

@Injectable({
  providedIn: 'any'
})
export class GoogleService {

  loginState$: Subject<LoginState> = new BehaviorSubject<LoginState>(LoginState.UNKNOWN)

  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  async setup(): Promise<void> {
    this.oauthService.configure(authCodeFlowConfig);
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.loginState$.next(this.oauthService.hasValidAccessToken() ? LoginState.LOGGED_IN : LoginState.LOGGED_OUT);
    console.log(this.oauthService.getAccessToken())
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  async readDiveMateDb(): Promise<ArrayBuffer> {
    const fileId = await this.findDiveMateDbFileId();
    return this.readBinaryFile(fileId);
  }

  private async readBinaryFile(fileId: string): Promise<ArrayBuffer> {
    return this.getApiV3(`/files/${fileId}?alt=media`, 'arraybuffer');
  }

  private async findDiveMateDbFileId(): Promise<string> {
    const diveMateFolder: GDFile[] = await this.listFileOf('root', isDiveMateFolder);
    const diveMateDbs: GDFile[] = (await Promise.all(diveMateFolder.map(folder =>  this.listFileOf(folder.id, isDiveMateDb)))).flatMap(array => array);
    if(diveMateDbs.length === 0) {
      throw Error('No file DiveMate/DiveMate.ddb found in your Google Drive');
    } else if(diveMateDbs.length > 1) {
      throw Error(`Found ${diveMateDbs.length} DiveMate/DiveMate.ddb files your Google Drive, don't know which one to take`)
    } else {
      return diveMateDbs[0].id;
    }
  }

  private async listFileOf(folderId: string, filter: (file: GDFile) => boolean = () => true): Promise<GDFile[]> {
    const result: GDFileList = await this.getApiV3(`/files?q='${folderId}' in parents`).then(result => result.files.filter(filter));
    return result.files.filter(filter);
  }

  private async getApiV3(query:string, responseType: 'json' | 'arraybuffer' = 'json'): Promise<any> {
    return this.httpClient.get('https://www.googleapis.com/drive/v3' + query, {
      observe: 'body',
      responseType: responseType as any,
      headers: {Authorization: 'Bearer ' + this.oauthService.getAccessToken()}
    }).toPromise();
  }
}

function isDiveMateFolder(file: GDFile): boolean {
  return file.name === 'DiveMate' && isFolder(file)
}

function isDiveMateDb(file: GDFile): boolean {
  return file.name === 'DiveMate.ddb' && isBinaryFile(file)
}

function isFolder(file: GDFile): boolean {
  return file.kind === GDKind.FILE && file.mimeType === GDMimeType.FOLDER;
}

function isBinaryFile(file: GDFile): boolean {
  return file.kind === GDKind.FILE && file.mimeType === GDMimeType.BINARY_FILE;
}

function unobfuscate(str : string): string {
  // obfuscating is no security, but prevents from harvesting robots...
  const base = '~'.charCodeAt(0) + ' '.charCodeAt(0);
  let result = '';
  for(let i = 0; i < str.length; i++) {
    const charCode = base - str.charCodeAt(i);
    result += String.fromCharCode(charCode);
  }
  return result;
}