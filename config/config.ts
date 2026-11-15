import pgPromise from 'pg-promise';

const options = {
    query:(e: unknown) => {}
}

const pgp = pgPromise(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue: string){
    return stringValue;
});

const dataBaseConfig = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': 'admin'
};

const db = pgp(dataBaseConfig);
export default db;
