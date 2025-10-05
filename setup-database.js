import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️  No DATABASE_URL found in environment. Exiting without changes (safe guard).');
  process.exit(0);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log('Using DATABASE_URL:', DATABASE_URL.includes('railway') ? '[redacted - railway]' : DATABASE_URL);

async function createTables() {
  const client = await pool.connect();
  try {
    console.log('Tablolar kontrol ediliyor/oluşturuluyor...');

    // USERS
    // routes/login.js ve middleware isadmin alanını bekliyor
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        alias VARCHAR(50) UNIQUE NOT NULL,
        picture TEXT,
        isadmin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // MESSAGES
    // routes/message.js ve routes/post.js message, alias, picture, postimg, likes, created_at kullanıyor
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        alias VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        picture TEXT,
        postimg TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0
      );
    `);

    // MESSAGE_LIKES
    await client.query(`
      CREATE TABLE IF NOT EXISTS message_likes (
        id SERIAL PRIMARY KEY,
        message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
        user_alias VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(message_id, user_alias)
      );
    `);

    // MESSAGE_COMMENTS (routes/message.js kullanıyor)
    await client.query(`
      CREATE TABLE IF NOT EXISTS message_comments (
        id SERIAL PRIMARY KEY,
        message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
        user_alias VARCHAR(50) NOT NULL,
        comment TEXT NOT NULL,
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Schema uyumluluğu için ALTER (tablo var ama sütun eksikse ekle)
    console.log('Sütun uyumluluk kontrolleri yapılıyor...');

    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS isadmin BOOLEAN DEFAULT FALSE;`);
    // Eski kayıtlardaki null değerleri false yap
    await client.query(`UPDATE users SET isadmin = FALSE WHERE isadmin IS NULL;`);

    await client.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS picture TEXT;`);
    await client.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS postimg TEXT;`);
    await client.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;`);
    await client.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
    await client.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS alias VARCHAR(50);`);
    // alias sonradan eklendiyse NOT NULL constraint'i doğrudan koymayalım (var olan null kayıtları bozmasın)
    // isteğe bağlı: null alias kayıtları fixledikten sonra NOT NULL eklenebilir

    // Index'ler (performans)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_alias ON messages(alias);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_message_likes_message_id ON message_likes(message_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_message_comments_message_id ON message_comments(message_id);`);

    console.log('✅ Şema güncel.');
  } catch (error) {
    console.error('❌ Database setup hatası:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();