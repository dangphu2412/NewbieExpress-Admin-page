module.exports = {
    development: {
      client: 'mysql',
      connection: { 
        user: 'root', 
        database: 'app' 
      },
      migrations: { 
        directory: 'database/migrations',
        tableName: 'migrations'
      }
    },
    
    production: { client: 'mysql', connection: process.env.DATABASE_URL }
  };