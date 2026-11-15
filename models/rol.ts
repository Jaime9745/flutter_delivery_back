import db from '../config/config.ts';

const rol = {
    create(id_user: string | number, id_rol: number) {
        const sql = `
        INSERT INTO
            user_has_roles(
                id_user,
                id_rol,
                created_at,
                updated_at
            )
        VALUES($1, $2, $3, $4)
        `;

        return db.none(sql, [
            id_user,
            id_rol,
            new Date(),
            new Date()
        ]);
    }
};

export default rol;
