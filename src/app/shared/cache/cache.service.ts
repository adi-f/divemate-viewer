import { Injectable } from '@angular/core';

const DIVELOG = 'divelog'

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private db?: IDBDatabase
  constructor() { }


  async saveDivelog(divelog: ArrayBuffer): Promise<void> {
    const db: IDBDatabase = await this.getDb();
    const transaction: IDBTransaction = db.transaction(DIVELOG, 'readwrite');
    await asPromise(transaction.objectStore(DIVELOG).put(divelog, DIVELOG));
  }

  async readDivelog(): Promise<ArrayBuffer> {
    const db: IDBDatabase = await this.getDb();
    const transaction: IDBTransaction = db.transaction(DIVELOG, 'readwrite');
    const request: IDBRequest<ArrayBuffer> = transaction.objectStore(DIVELOG).get(DIVELOG);
    await asPromise(request);
    return request.result;
  }

  async deleteDivelog(): Promise<void> {
    const db: IDBDatabase = await this.getDb();
    const transaction: IDBTransaction = db.transaction(DIVELOG, 'readwrite');
    await asPromise(transaction.objectStore(DIVELOG).delete(DIVELOG));
  }

  private async getDb(): Promise<IDBDatabase> {
      return this.db || await this.open();
  }

  private async open(): Promise<IDBDatabase> {
    const openRequest: IDBOpenDBRequest  = indexedDB.open('DiveMate-Viewer', 1);
      openRequest.onupgradeneeded = upgradeDb;
     await asPromise(openRequest);
     return this.db = openRequest.result;
  }
}

function asPromise<T>(request: IDBRequest<T>): Promise<Event> {
  return new Promise<Event>((resolve, reject) => {
    request.onsuccess = resolve;
    request.onerror = reject;
  })
}

function upgradeDb(this: IDBOpenDBRequest, event: IDBVersionChangeEvent) : void {
  if(event.oldVersion < 1) {
    this.result.createObjectStore(DIVELOG);
  }
}
