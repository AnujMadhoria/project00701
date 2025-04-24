import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js";
import storyRouter from "./routes/story.route.js";
import confessionRouter from "./routes/confession.route.js";
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
// import songRouter from "./routes/song.route.js"
import problemRouter from "./routes/problem.route.js";
// import dmRoutes from "./routes/dmRoutes.js";
//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/story", storyRouter);
// app.use("/api/v1/song", songRouter)
app.use("/api/v1/confession", confessionRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
// after your other routes
// const dmRoutes = require("./routes/dmRoutes");
// app.use("/api/dm", dmRoutes);

// http://localhost:8000/api/v1/users/register

export { app };
