module.exports = {
	development: {
		username: "postgres",
		password: "root",
		database: "klimed_dev",
		host: "127.0.0.1",
		dialect: "postgres",
		logging: false,
		pool: { max: 20, min: 0 }
	},
	test: {
		username: "postgres",
		password: "root",
		database: "klimed_test",
		host: "127.0.0.1",
		dialect: "postgres",
		logging: false,
		pool: { max: 20, min: 0 }
	},
	production: {
		username: "postgres",
		password: "root",
		database: "klimed",
		host: "127.0.0.1",
		dialect: "postgres",
		logging: false,
		pool: { max: 20, min: 0 }
	}
};
