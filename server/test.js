const express = require("express");
const User = require("./models/User");
const emailToUserName = require("./utils/emailToUserName");
const requiredAuth = require("./middlewares/requiredAuth");
const fetchMe = require("./middlewares/fetchMe");
const Role = require("./models/Role");
const FollowUser = require("./models/FollowUser");
const Topic = require("./models/Topic");
const toSlug = require("./utils/toSlug");
const FollowTopic = require("./models/FollowTopic");
const Article = require("./models/Article");
const Like = require("./models/Like");
const Comment = require("./models/Comment");
const Notification = require("./models/Notification");

const router = express.Router();

// register users
router.post("/register", async (req, res) => {
  const { number } = req.body;

  const role = await Role.findOne({ slug: "user" });
  if (!role) {
    return res.status(404).json({
      success: false,
    });
  }

  for (let i = 0; i < number; i++) {
    const email = `user${i}@example.com`;
    const username = emailToUserName(email);

    const user = new User({
      avatar: username,
      fullname: username,
      username,
      email,
      role: role._id,
    });

    await user.save();
  }
  res.status(200).json({
    success: true,
  });
});

// add topics
router.post("/topics", async (req, res) => {
  const { number } = req.body;
  for (let i = 0; i < number; i++) {
    const name = `topic${i}`;
    const slug = toSlug(name);

    const topic = new Topic({
      name,
      slug,
    });

    await topic.save();
  }
  res.status(200).json({
    success: true,
  });
});

// add articles
router.post("/articles", requiredAuth, fetchMe, async (req, res) => {
  const { me } = req;
  const { number } = req.body;

  for (let i = 0; i < number; i++) {
    const title = `article${i}`;
    const slug = toSlug(title);

    const article = new Article({
      author: me._id,
      title,
      preview: title,
      slug,
      img: title,
      content: title,
      topics: [
        "653779c4a66936c1e02463ba",
        "653779c4a66936c1e02463bc",
        "653779c4a66936c1e02463be",
        "653779c4a66936c1e02463c0",
        "653779c4a66936c1e02463c2",
      ],
    });

    await article.save();
  }
  res.status(200).json({
    success: true,
  });
});

// all users like article
router.post("/users/like/:slug", async (req, res) => {
  const { number } = req.body;
  const { slug } = req.params;

  for (let i = 0; i < number; i++) {
    const username = `user${i}`;
    const article = await Article.findOne({ slug });
    const user = await User.findOne({ username });
    if (user && article) {
      const like = new Like({
        article: article._id,
        user: user._id,
      });
      await like.save();
    }
  }
  res.status(200).json({
    success: true,
  });
});

// all users comment article
router.post("/users/comment/:slug", async (req, res) => {
  const { number } = req.body;
  const { slug } = req.params;

  for (let i = 0; i < number; i++) {
    const username = `user${i}`;
    const article = await Article.findOne({ slug });
    const user = await User.findOne({ username });
    const comment = new Comment({
      article: article._id,
      author: user._id,
      content: `comment ${i}`,
    });
    await comment.save();
  }
  res.status(200).json({
    success: true,
  });
});

//   all users follow me
router.post("/users/follow/me", requiredAuth, fetchMe, async (req, res) => {
  const { me } = req;

  for (let i = 0; i < 1000000; i++) {
    const user = await User.findOne({ username: `user${i}` });
    const followUser = new FollowUser({
      follower: user._id,
      following: me._id,
    });

    await followUser.save();
  }
  res.status(200).json({
    success: true,
  });
});

// me follow all user
router.post("/me/follow/users", requiredAuth, fetchMe, async (req, res) => {
  const { me } = req;

  for (let i = 0; i < 1000000; i++) {
    const user = await User.findOne({ username: `user${i}` });
    const followUser = new FollowUser({
      follower: me._id,
      following: user._id,
    });

    await followUser.save();
  }
  res.status(200).json({
    success: true,
  });
});

// me follow all topics
router.post("/me/follow/topics", requiredAuth, fetchMe, async (req, res) => {
  const { me } = req;

  for (let i = 0; i < 1000000; i++) {
    const topic = await Topic.findOne({ slug: `topic${i}` });
    if (topic) {
      const follow = new FollowTopic({
        follower: me._id,
        topic: topic._id,
      });

      await follow.save();
    }
  }
  res.status(200).json({
    success: true,
  });
});

// users follow all topics
router.post("/users/follow/topics", async (req, res) => {
  const topic = await Topic.findOne({ slug: `topic0` });
  for (let i = 0; i < 1000000; i++) {
    const user = await User.findOne({ username: `user${i}` });
    const follow = new FollowTopic({
      follower: user._id,
      topic: topic._id,
    });
    await follow.save();
  }
  res.status(200).json({
    success: true,
  });
});

// notifications to me
router.post("/notifications/to/me", requiredAuth, fetchMe, async (req, res) => {
  const { me } = req;
  for (let i = 0; i < 1000000; i++) {
    const notification = new Notification({
      recipient: me._id,
      content: `notification ${i}`,
    });

    await notification.save();
  }
  res.status(200).json({
    success: true,
  });
});

module.exports = router;
