import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import mysql from "mysql";
import { connect } from "http2";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

var connection;

const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // delay time

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    // console.log(prompt)
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0,
    });
    res.status(200).send({
      content: response.data.choices[0].message.content,
      // content: data,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.post("/generateImage", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "256x256",
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () => {
  console.log("AI server started on http://localhost:5000");

  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chatgpt10",
  });

  console.log("DB connected!")
});

app.post("/insertArticle", async (req, res) => {
  try {
    let { content, cate, keyword, cate_slug } = req.body;
    content = content.replace("'", " ");
    content = content.replace('"', " ");
    content = content.replace('"', " ");
    content = content.replace("`", " ");

    // var connection = mysql.createConnection({
    //   host: "localhost",
    //   user: "mart",
    //   password: "star0629",
    //   database: "chatgpt10",
    // });

    connection.connect(function (err) {
      try {
        // console.log("Connected!");
        var date_ob = new Date();
        var fullDate =
          date_ob.getFullYear() +
          "-" +
          (date_ob.getMonth() + 1) +
          "-" +
          date_ob.getDate();
        var sql =
          `INSERT INTO articles (content, cate, cate_slug, keyword, vote, createdAt) VALUES ( "` +
          content +
          `", "` +
          cate +
          `", "` +
          cate_slug +
          `", "` +
          keyword +
          `", 0, "` +
          fullDate +
          `")`;
      } catch {
        res.status(500).send(err || "Internal Server Error!");
        if (err) throw err;
      }
      // console.log(sql);
      connection.query(sql, function (err, result) {
        try {
          res.status(200).send({
            success: true,
          });
        } catch {
          res.status(500).send(err || "Something went wrong");
          if (err) throw err;
        }
      });
    });
  } catch {
    console.log("error");
  }
});

app.post("/article", async (req, res) => {
  const { slug } = req.body;
  await delay(500)
  // console.log(req.body);
  // var connection = mysql.createConnection({
  //   host: "localhost",
  //   // user: "mart",
  //   // password: "star0629",
  //   user: "root",
  //   password: "",
  //   database: "chatgpt10",
  // });

  connection.connect(function (err) {
    try {
      var sql =
        `SELECT * FROM articles WHERE cate_slug = "` +
        slug +
        `" ORDER BY vote DESC`;
    } catch {
      res.status(500).send(err || "Internal Server Error!");
      if (err) throw err;
    }
    connection.query(sql, function (err, result) {
      // console.log(result)
      try {
        res.status(200).send({
          articles: result,
        });
      } catch {
        res.status(500).send(err || "Something went wrong");
        if (err) throw err;
      }
    });
  });
});

app.post("/topArticle", async (req, res) => {
  // var connection = mysql.createConnection({
  //   host: "localhost",
  //   // user: "mart",
  //   // password: "star0629",
  //   user: "root",
  //   password: "",
  //   database: "chatgpt10",
  // });
  connection.connect(function (err) {
    try {
      var sql = `SELECT * FROM articles ORDER BY vote DESC LIMIT 10`;
    } catch {
      res.status(500).send(err || "Internal Server Error!");
      if (err) throw err;
    }
    connection.query(sql, function (err, result) {
      // console.log(result)
      try {
        res.status(200).send({
          articles: result,
        });
      } catch {
        res.status(500).send(err || "Something went wrong");
        if (err) throw err;
      }
    });
  });
});

app.post("/updateVote", async (req, res) => {
  let { id, count, flag } = req.body;
  let updateCount = 0;
  if (flag) {
    updateCount = count + 1;
  } else {
    updateCount = count - 1;
  }
  // var connection = mysql.createConnection({
  //   host: "localhost",
  //   user: "mart",
  //   password: "star0629",
  //   database: "chatgpt10",
  // });
  connection.connect(function (err) {
    try {
      var sql =
        `UPDATE articles SET vote="` + updateCount + `" WHERE id="` + id + '"';
    } catch {
      res.status(500).send(err || "Internal Server Error!");
      if (err) throw err;
    }
    // console.log(sql);
    connection.query(sql, function (err, result) {
      try {
        res.status(200).send({
          success: true,
        });
      } catch {
        res.status(500).send(err || "Something went wrong");
        if (err) throw err;
      }
    });
  });
});
