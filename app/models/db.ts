import * as Sequelize from 'sequelize'

let db = {
			sequelize: null
		};

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  db.sequelize = new Sequelize(process.env.DATABASE_URL, {
     "dialect":"postgres",
      "ssl": true,
      "dialectOptions": {
            "ssl": true
      },
    protocol: 'postgres',
  });
} else {
  // the application is executed on the local machine
  db.sequelize = new Sequelize("postgres://kqmijsvqwbismx:e2f0d9106a23afa3f874a339632b61d5414329a2cb3a2ee2d41b23fec2769599@ec2-54-221-207-184.compute-1.amazonaws.com:5432/d4ksp8ah9l34pd"
              , {
                 "dialect":"postgres",
                  "ssl": true,
                  "dialectOptions": {
                        "ssl": true
                  },
                protocol: 'postgres',
                pool: {
                    max: 105,
                    min: 0,
                    idle: 20000,
                    acquire: 20000
                }
              });
}

export = db;

