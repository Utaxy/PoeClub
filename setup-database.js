import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createTables() {
    const client = await pool.connect();
    try {
        console.log('Tablolar oluşturuluyor...');
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                google_id VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                alias VARCHAR(50) UNIQUE NOT NULL,
                picture TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                alias VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS message_likes (
                id SERIAL PRIMARY KEY,
                message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(message_id, user_id)
            );
        `);

        console.log('✅ Tablolar başarıyla oluşturuldu!');
    } catch (error) {
        console.error('❌ Database setup hatası:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

createTables();