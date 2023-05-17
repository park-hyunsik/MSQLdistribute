// import * as userRepository from "../data/auth.js"
// import {db} from "../db/database.js"
import SQ, { Sequelize } from 'sequelize'
import { sequelize } from '../db/database.js';
import { User } from './auth.js';

const DataTypes = SQ.DataTypes;

const Tweet = sequelize.define(
    // table이름이 users이지만 user라고 한이유는 자동으로 s가 붙게된다.
    'tweet',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
        // createdAt: {
        //     type: DataTypes.DATE(),
        //     defaultValue: DataTypes.NOW()
        // },
        // userId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: User,
        //         key: 'id'
        //     }
        // }
    },
    // { timestamps: false }
    // false로 주게되면 우리가 사용하는 일반 타임스탬프로 적용됨
)

// 일대다 관계 설정
// User.hasMany(Tweet);
// 조인시키기
Tweet.belongsTo(User);

const INCLUDE_USER = {
    attributes: [
        'id',
        'text',
        'createdAt',
        'userId',
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.col('user.username'), 'username'],
        [Sequelize.col('user.url'), 'url'],
    ],
    include: {
        model: User,
        attributes: [],
    }
}

const ORDER_DESC = {
    order: [['createAt', 'DESC']]
}
// const Join = await Tweet.findAll({
//     where: {
//         include: [{
//             model: User,
//             attributes: ['id'],
//             required: false
//         }]
//     }
// })

// const SELECT_JOIN = "select tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.email, us.url from tweets as tw left outer join users as us on tw.userId = us.id";
// const ORDER_DESC = "order by tw.createdAt desc";

export async function getAllByUsername(username) {
    // return db.execute(`${SELECT_JOIN} WHERE US.USERNAME=? ${ORDER_DESC}`, [username]).then((result) => result[0]);
    // return Join.findAll({ where: { username } })
    return Tweet.findAll({ username }).then((data) => {
        console.log('------------- 유저네임 -------------')
        console.log(data)
        console.log('------------- 유저네임 끝 -------------')
        return data
    })
}

export async function getAll() {
    // return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => result[0]);
    return Tweet.findAll({ ...INCLUDE_USER }, { ...ORDER_DESC }).then((data) => {
        console.log('------------- 겟올 -------------')
        console.log(data)
        console.log('------------- 겟올 끝 -------------')
        return data
    })
}

export async function getById(id) {
    // return db.execute(`${SELECT_JOIN} WHERE TW.ID=?`, [id]).then((result) => result[0][0]);
    console.log('------------- 겟바이 아이디 -------------')
    return Tweet.findOne({
        where: { id },
        ...INCLUDE_USER
    })
}

export async function addTweet(text, userId) {
    // return db.execute("insert into tweets (text, createdAt,userId) values (?,?,?)", [text, new Date(), userId]).then((result) => console.log(result));
    return Tweet.create({ text, userId }).then((data) => {
        console.log('------------- 트윗 추가 -------------')
        console.log(data);
        console.log('------------- 트윗 추가 끝 -------------')
        return data;
    })
}

export async function setTweet(id, text) {
    // return db.execute("update tweets SET text=? where id=?", [text, id]).then(() => getById(id));
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
        tweet.text = text;
        console.log('------------- 없데이트 -------------');
        console.log(text);
        console.log('------------- 없데이트 끝 -------------');
        return tweet.save()
    })
}

export async function deleteTweet(id) {
    // return db.execute("delete from tweets where id=?", [id]);
    console.log('------------- 딜리트 -------------');
    return Tweet.findByPk(id).then((tweet) => {
        console.log(tweet);
        console.log('------------- 딜리트 -------------');
        tweet.destroy();
    })
}