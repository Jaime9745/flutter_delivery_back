import db from '../config/config.ts';
import crypto from 'node:crypto';

export interface Rol {
    id: number;
    name: string;
    image: string | null;
    route: string | null;
}

export interface UserData {
    id: string;
    email: string;
    name: string;
    lastname: string;
    image?: string | null;
    phone: string;
    password: string;
    session_token?: string | null;
    roles?: Rol[];
}

export type NewUser = Omit<UserData, 'id' | 'session_token' | 'roles'>;

const User = {
    getAll() {
        const sql = `SELECT * FROM users`;
        return db.manyOrNone<UserData>(sql);
    },

    findById(id: string | number, callback: (err: unknown, user: UserData | null) => void) {
        const sql = `
        SELECT
            id,
            email,
            name,
            lastname,
            image,
            phone,
            password,
            session_token
        FROM
            users
        WHERE
            id = $1`;

            return db.oneOrNone<UserData>(sql, id).then(user => {callback(null, user);})
    },

    findByEmail(email: string) {
        const sql = `
        SELECT
    	U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.session_token,
    	json_agg(
    		json_build_object(
    			'id', R.id,
    			'name', R.name,
    			'image', R.image,
    			'route', R.route
    		)
    	)AS roles
        FROM
            users AS U
        INNER JOIN
    	    user_has_roles as UHR
        ON
    	    UHR.id_user = U.id
        INNER JOIN
    	    roles AS R
        ON
    	    R.id = UHR.id_rol
        WHERE
            U.email = $1
        GROUP BY
    	    U.id`;

        return db.oneOrNone<UserData>(sql, email);
    },

    create(user: NewUser) {
        const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
        user.password = myPasswordHashed;

        const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        `;

        return db.oneOrNone<{ id: string }>(sql, [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            user.password,
            new Date(),
            new Date()
        ]);
    },

    isPasswordMatched(userPassword: string, hash: string) {
        const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
            if (myPasswordHashed === hash){
                return true
            }
            return false;
    }
};

export default User;
