
export class PostDBService {
    private static instance: PostDBService;
    private dbInstance: IDBDatabase | undefined;

    public constructor() {
        this.dbInstance = undefined;
    }

    public static getInstance(): PostDBService {
        if (!this.instance) {
            this.instance = new PostDBService();
        }
        return this.instance;
    }

    private initDb(ev: Event, resolveFunc: (s: IDBDatabase) => void, reject: (val: any) => void) {
        const db = (ev.target as any).result as IDBDatabase;
        db.createObjectStore('ReadPosts', { keyPath: 'id' });
        db.createObjectStore('DismissedPosts', { keyPath: 'id' });
        const tx = (ev.target as any).transaction as IDBTransaction;
        tx.oncomplete = () => {
            this.dbInstance = db;
            resolveFunc(db);
        };
        tx.onerror = (ev) => {
            this.dbInstance = db;
            reject(ev);
        };
    }

    private getDBRef(): Promise<IDBDatabase | undefined> {
        if (this.dbInstance) {
            return Promise.resolve(this.dbInstance);
        }
        return new Promise((res, rej) => {
            const dbconnect: IDBOpenDBRequest = window.indexedDB.open('devgetDemo', 1);
            dbconnect.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
                this.initDb(ev, res, rej);
            };
            dbconnect.onsuccess = (ev: Event) => {
                const db = (ev.target as any).result;
                this.dbInstance = db;
                res(this.dbInstance);
            };
            dbconnect.onerror = (ev: Event) => {
                rej(ev);
            };
        });
        
    }

    public createDB(): Promise<any> {
        return this.getDBRef();
    }

    public saveRead(id: string): Promise<any> {
        return this.getDBRef().then(() => {
            return new Promise((res, rej) => {
                if (this.dbInstance) {
                    const transaction = this.dbInstance.transaction(["ReadPosts"], "readwrite");
    
                    transaction.onerror = function(event) {
                        rej(event);
                    };
                    // create an object store on the transaction
                    const objectStore = transaction.objectStore("ReadPosts");
                    // add our newItem object to the object store
                    const objectStoreRequest = objectStore.put({id});
        
                    objectStoreRequest.onsuccess = function(event) {
                        res('');
                    };
                    objectStoreRequest.onerror = (ev: Event) => {
                        rej(ev);
                    };
                    return;
                }
                rej(new Error('Not created db'));
            });
        });
    }

    public saveDismissed(id: string): Promise<any> {
        return this.getDBRef().then(() => {
            return new Promise((res, rej) => {
                if (this.dbInstance) {
                    const transaction = this.dbInstance.transaction(["DismissedPosts"], "readwrite");
    
                    transaction.onerror = function(event) {
                        rej(event);
                    };
                    // create an object store on the transaction
                    const objectStore = transaction.objectStore("DismissedPosts");
                    // add our newItem object to the object store
                    const objectStoreRequest = objectStore.put({id: id});
                    objectStoreRequest.onsuccess = function(event) {
                        res('');
                    };
                    objectStoreRequest.onerror = (ev: Event) => {
                        rej(ev);
                    };
                    return;
                }
                rej(new Error('Not created db'));
            });
        });
        
    }

    public saveDismissPosts(ids: string[]): Promise<any> {
        if (!ids || !ids.length) {
            return Promise.resolve(null);
        }
        return this.getDBRef().then(() => {
            return new Promise((res, rej) => {
                if (this.dbInstance) {
                    const transaction = this.dbInstance.transaction(["DismissedPosts"], "readwrite");
    
                    transaction.onerror = function(event) {
                        rej(event);
                    };
                    // create an object store on the transaction
                    const objectStore = transaction.objectStore("DismissedPosts");
                    // add our newItem object to the object store
                    const requests: IDBRequest[] = [];
                    ids.forEach(id => {
                        const obj = objectStore.put({id: id});
                        requests.push(obj);
                        obj.onsuccess = function(event) {
                            let allfinished = true;
                            for (const i in requests) {
                                const req = requests[i];
                                if (req && req.readyState === 'pending') {
                                    allfinished = false;
                                    break;
                                }
                            }
                            if (allfinished) {
                                res('');
                            }
                        };
                        obj.onerror = (ev: Event) => {
                            rej(ev);
                        };
                    });
                    return;
                }
                rej(new Error('Not created db'));
            });
        });
        
    }

    public getDismissedKeys(): Promise<string[]> {
        return this.getDBRef().then(() => {
            return new Promise((res, rej) => {
                if (this.dbInstance) {
                    const transaction = this.dbInstance.transaction(["DismissedPosts"], "readonly");
                    transaction.onerror = function(event) {
                        rej(event);
                    };
                    const objectStore = transaction.objectStore("DismissedPosts");
                    const query = objectStore.getAll();
                    query.onsuccess = function(ev) {
                        res(((ev.target as any).result || []).map((x: any) => x.id));
                    };
                    query.onerror = function(ev) {
                        rej(ev);
                    };
                    return;
                }
                rej(new Error('Not created db'));
            });
        });
        
    }

    public getAllReadKeys(): Promise<string[]> {
        return this.getDBRef().then(() => {
            return new Promise((res, rej) => {
                if (this.dbInstance) {
                    const transaction = this.dbInstance.transaction(["ReadPosts"], "readonly");
                    transaction.onerror = function(event) {
                        rej(event);
                    };
                    const objectStore = transaction.objectStore("ReadPosts");
                    const query = objectStore.getAll();
                    query.onsuccess = function(ev) {
                        res(((ev.target as any).result || []).map((x: any) => x.id));
                    };
                    query.onerror = function(ev) {
                        rej(ev);
                    };
                    return;
                }
                rej(new Error('Not created db'));
            });
        });
    }

}