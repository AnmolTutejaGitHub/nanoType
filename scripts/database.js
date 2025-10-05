class User {
    constructor(username,email,password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.history = [];
        this.createdAt = new Date().toISOString();
    }
    
    addToHistory(typingSession) {
        this.history.push({
            wpm: typingSession.wpm,
            accuracy: typingSession.accuracy,
            timestamp: new Date().toISOString(),
            duration: typingSession.duration || 60
        });
    }
}

class DatabaseManager {
  constructor() {
    this.db = null;
  }


  async init() {
    return new Promise((resolve,reject) => {
      const request = indexedDB.open("nanoTypeDB",1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
          const store = db.createObjectStore("users",{ keyPath: "username" });
          store.createIndex("email", "email", { unique: true });
        }
      };
    });
  }

  async addUser(user) {
    const tx = this.db.transaction("users","readwrite");
    const store = tx.objectStore("users");
    return new Promise((resolve,reject) => {
      const req = store.add(user);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getUser(username) {
    const tx = this.db.transaction("users","readonly");
    const store = tx.objectStore("users");
    return new Promise((resolve,reject) => {
      const req = store.get(username);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async getUserByEmail(email) {
    const tx = this.db.transaction("users","readonly");
    const store = tx.objectStore("users");
    const index = store.index("email");
    return new Promise((resolve, reject) => {
      const req = index.get(email);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async updateUser(user) {
    const tx = this.db.transaction("users","readwrite");
    const store = tx.objectStore("users");
    return new Promise((resolve,reject) => {
      const req = store.put(user);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  async getAllUsers() {
        const transaction = this.db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

window.dbManager = new DatabaseManager();

window.dbManager.init().then(() => {
    console.log('Database initialized successfully');
}).catch((err) => {
    console.error('Database initialization failed:',err);
});