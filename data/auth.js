import SQ from 'sequelize'
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
    // table이름이 users이지만 user라고 한이유는 자동으로 s가 붙게된다.
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT()
        },
        // regdate: 날짜타입, 현재시간을 자동으로 등록
        regdate: {
            type: DataTypes.DATE(),
            defaultValue: DataTypes.NOW()
        }

    },
    // false로 주게되면 우리가 사용하는 일반 타임스탬프로 적용됨
    { timestamps: false }
)


export async function searchID(username) {
    // return db.execute("select * from users where username=?", [username]).then((result) => result[0][0]);

    // username: username인걸 찾아달라
    return User.findOne({ where: { username } })
}

export async function findById(id) {
    // return db.execute("select id from users where id=?", [id]).then((result) => result[0][0]);
    // return User.findOne({ where: { username } }) 이걸 아이디로 바꿔도 되지만 다른방법

    // 프라이머리 키에서 id를 찾아달라
    return User.findByPk(id);
}

export async function createUser(user) {
    // const { username, password, name, email, url } = user;
    // return db.execute("insert into users(username,password,name,email,url) values(?,?,?,?,?)", [username, password, name, email, url]).then((result) => result[0].insertID);

    return User.create(user).then((data) => data.dataValues.id);
}

export async function login(user) {
    // return users.find((users) => users.username === user.username && users.password === user.password);
    return db.execute("select id from users where username=? and password=?", [user.username, user.password]).then((result) => result[0][0]);
}