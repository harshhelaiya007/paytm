const express = require('express');
const JWT_SECRET = require('../config');
const { User } = require('../db');
const z = require('zod');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middlewear');
const {Account} = require('../db');

const userRouter = express.Router();

const signupSchema = z.object({
  username: z.string().min(3),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

userRouter.get('/', (req, res) => {
  res.send('User route is working dummy route');
});

userRouter.post('/register', async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.status(411).send({ message: 'Email already taken / Incorrect inputs' });
  }
  const existingUser = User.findOne({ username: body.username });
  if (existingUser._id) {
    return res.status(411).send({ message: 'Email already taken' });
  }

  const dbUser = await User.create(body);
  const userId = dbUser._id;

  /// ----- Create new account ------

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
  })

  /// -----  ------


  const token = jwt.sign({ id: dbUser._id }, JWT_SECRET);
  res.status(201).send({ message: 'User created', data: dbUser, token: token });
});

userRouter.put('/update', authMiddleware, async (req, res) => {
  const body = req.body;
  const { success } = updateBody.safeParse(body);
  if (!success) {
    return res.status(411).send({ message: 'Incorrect inputs' });
  }
  await User.findByIdAndUpdate(req.userId, body);
  res.status(200).send({ message: 'User updated successfully' });

});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";


  const users = await User.find({
    $or: [{
      firstName: {
        "$regex": filter
      }
    }, {
      lastName: {
        "$regex": filter
      }
    }]
  })

  res.json({
    user: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id
    }))
  })
})

module.exports = userRouter;
