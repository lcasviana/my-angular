import { Injectable } from "@angular/core";
import { ChangeRecord } from "../models/change.interface";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  private dbName = "myAngularDB";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initDatabase();
  }

  private initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = event => {
        console.error("Database error:", event);
        reject("Error opening database");
      };

      request.onsuccess = event => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains("changes")) {
          const changesStore = db.createObjectStore("changes", { keyPath: "id", autoIncrement: true });
          changesStore.createIndex("timestamp", "timestamp", { unique: false });
          changesStore.createIndex("type", "type", { unique: false });
        }
      };
    });
  }

  private async ensureDbReady(): Promise<void> {
    await this.dbReady;
  }

  async addChange(change: Omit<ChangeRecord, "id" | "timestamp">): Promise<number> {
    await this.ensureDbReady();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(["changes"], "readwrite");
      const store = transaction.objectStore("changes");

      const changeRecord: ChangeRecord = {
        ...change,
        timestamp: new Date().toISOString(),
      };

      const request = store.add(changeRecord);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject("Error adding change record");
      };
    });
  }

  async getChanges(): Promise<ChangeRecord[]> {
    await this.ensureDbReady();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(["changes"], "readonly");
      const store = transaction.objectStore("changes");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject("Error getting changes");
      };
    });
  }

  async getChangesByType(type: string): Promise<ChangeRecord[]> {
    await this.ensureDbReady();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(["changes"], "readonly");
      const store = transaction.objectStore("changes");
      const index = store.index("type");
      const request = index.getAll(type);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject("Error getting changes by type");
      };
    });
  }

  async clearChanges(): Promise<void> {
    await this.ensureDbReady();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(["changes"], "readwrite");
      const store = transaction.objectStore("changes");
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject("Error clearing changes");
      };
    });
  }
}
