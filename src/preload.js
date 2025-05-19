const { contextBridge } = require('electron');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('preload.js loaded');

function readUsersFile() {
    return new Promise((resolve, reject) => {
        const usersPath = path.join(__dirname, 'users.json');
        fs.promises.readFile(usersPath, 'utf-8')
            .then(data => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.error('Error parsing users.json:', e);
                    reject(new Error('Invalid users.json format'));
                }
            })
            .catch(err => {
                console.error('Error reading users.json:', err);
                reject(new Error('Could not read users.json'));
            });
    });
}

contextBridge.exposeInMainWorld('auth', {
    test: () => 'hello from preload',
    getUsers: readUsersFile
});

contextBridge.exposeInMainWorld('db', {
    getInventory: () => {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'inventory.db');
            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return reject(err);
            });
            db.all('SELECT ITEM_NUM, DESCRIPTION, QIS, [QOH TOTAL] FROM inventory', [], (err, rows) => {
                db.close();
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    addItem: (item) => {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'inventory.db');
            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return reject(err);
            });
            db.run(
                'INSERT INTO inventory (SKU, ITEM_NUM, DESCRIPTION, QIS, [QOH TOTAL]) VALUES (?, ?, ?, ?, ?)',
                [item.sku, item.item_num, item.description, item.qis, item.qis], // QOH TOTAL = QIS for new item
                function(err) {
                    db.close();
                    if (err) return reject(err);
                    resolve({ success: true });
                }
            );
        });
    },
    removeItem: (item_num) => {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'inventory.db');
            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return reject(err);
            });
            db.run(
                'DELETE FROM inventory WHERE ITEM_NUM = ?',
                [item_num],
                function(err) {
                    db.close();
                    if (err) return reject(err);
                    resolve({ success: true });
                }
            );
        });
    },
    getItem: (item_num) => {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'inventory.db');
            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
                if (err) return reject(err);
            });
            db.get(
                'SELECT SKU, ITEM_NUM, DESCRIPTION, QIS FROM inventory WHERE ITEM_NUM = ?',
                [item_num],
                (err, row) => {
                    db.close();
                    if (err) return reject(err);
                    resolve(row);
                }
            );
        });
    },
    updateItem: (item) => {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'inventory.db');
            const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return reject(err);
            });
            db.run(
                'UPDATE inventory SET SKU = ?, DESCRIPTION = ?, QIS = ?, [QOH TOTAL] = ? WHERE ITEM_NUM = ?',
                [item.sku, item.description, item.qis, item.qis, item.item_num],
                function(err) {
                    db.close();
                    if (err) return reject(err);
                    resolve({ success: true });
                }
            );
        });
    },
    saveTemplate: (name, items) => {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath);
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('INSERT INTO templates (name) VALUES (?)', [name], function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        db.close();
                        return reject(err);
                    }
                    const templateId = this.lastID;
                    const stmt = db.prepare('INSERT INTO template_items (template_id, item_num, description, qoh, qis) VALUES (?, ?, ?, ?, ?)');
                    for (const item of items) {
                        stmt.run(templateId, item.item_num, item.description, item.qoh, item.qis);
                    }
                    stmt.finalize(err => {
                        if (err) {
                            db.run('ROLLBACK');
                            db.close();
                            return reject(err);
                        }
                        db.run('COMMIT', err => {
                            db.close();
                            if (err) return reject(err);
                            resolve(templateId);
                        });
                    });
                });
            });
        });
    },
    getTemplates: () => {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath);
            db.all('SELECT id, name FROM templates ORDER BY created_at DESC', [], (err, rows) => {
                db.close();
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTemplateItems: (templateId) => {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath);
            db.all(
                'SELECT item_num, description, qoh, qis FROM template_items WHERE template_id = ?',
                [templateId],
                (err, rows) => {
                    db.close();
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    },
});

const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS template_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        item_num TEXT NOT NULL,
        description TEXT,
        qoh INTEGER,
        qis INTEGER,
        FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
    )`);
});
db.close();
