//create pool here
import s from "sequelize"
const { Sequelize, DataTypes } = s

const { PGUSER, PGPORT, PGDATABASE, PGPASSWORD } = process.env

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  port: PGPORT,
  host: "localhost",
  dialect: "postgres",
})

sequelize
  .authenticate()
  .then(() => {
    console.log("connected")
  })
  .catch((e) => console.log(e))

const experience = sequelize.define("experience", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  area: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
})
const profile = sequelize.define("profile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  surname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  area: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

const posts = sequelize.define("posts", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
const user = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  surname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})
// const user = sequelize.define("user", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   surname: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// })
const comments = sequelize.define("comments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})
const likes = sequelize.define("likes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
})
user.hasMany(posts)
posts.belongsTo(user)

user.hasMany(profile)
profile.belongsTo(user)

posts.hasMany(comments)
comments.belongsTo(posts)

user.hasMany(comments)
comments.belongsTo(user)

user.hasMany(likes)
likes.belongsTo(user)

posts.hasMany(likes)
likes.belongsTo(posts)

// user.hasMany(experience)
// experience.belongsTo(user)

profile.hasMany(experience)
experience.belongsTo(profile)

export { posts, profile, experience, user, comments, likes }
export default sequelize



