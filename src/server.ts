import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import  users  from "../data/users.json";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Registrierte Nutzer
const registeredUsers = new Map<string, string>([
  ["alice", "1234"],
  ["bob", "secret"],
  ["charlie", "qwerty"],
]);

// Sessions
const sessions = new Map<string, string>();

// Tweets
const tweets: {
  id: number;
  text: string;
  author: string;
}[] = [];

// Erweiterung für Request
interface AuthRequest extends Request {
  user?: string;
}

// ---------- Aufgaben von gestern ----------

// Startseite
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server läuft!");
});

// Echo
app.get("/echo", (req: Request, res: Response) => {
  res.status(200).send("Echo");
});

// Health
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Greet
app.get("/greet", (req: Request, res: Response) => {
  const name = req.query.name as string;
  const lang = req.query.lang;

  const message =
    lang === "en"
      ? `Hello ${name}`
      : `Hallo ${name}`;

  res.status(200).json({ message });
});

// Users
app.get("/users", (req: Request, res: Response) => {
  res.status(200).json(users);
});

// ---------- Aufgabe 1 ----------
// Login

app.post("/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  const storedPassword = registeredUsers.get(username);

  if (!storedPassword || storedPassword !== password) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const sessionId = crypto.randomUUID();

  sessions.set(sessionId, username);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
  });

  res.json({
    message: "Login succeeded",
  });
});
// ---------- Aufgabe 2 ----------
// Me

app.get("/me", (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;

  const user = sessions.get(sessionId);

  if (!user) {
    return res.status(401).json({
      error: "Not signed in",
    });
  }

  res.json({
    user,
  });
});

app.post("/auth/logout", (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  res.clearCookie("sessionId");

  res.json({
    success: true,
    message: "Logged out",
  });
});

// ---------- Aufgabe 4 ----------
// Middleware

function checkAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const sessionId = req.cookies.sessionId;

  const user = sessions.get(sessionId);

  if (!user) {
    return res.status(401).json({
      error: "Please sign in",
    });
  }

  req.user = user;

  next();
}
// Tweet erstellen

app.post(
  "/tweets",
  checkAuth,
  (req: AuthRequest, res: Response) => {
    const tweet = {
      id: tweets.length,
      text: req.body.text,
      author: req.user!,
    };

    tweets.push(tweet);

    res.status(201).json(tweet);
  }
);
// ---------- Aufgabe 5 ----------
// Tweet löschen

app.delete(
  "/tweets/:id",
  checkAuth,
  (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);

    const tweet = tweets.find((t) => t.id === id);

    if (!tweet) {
      return res.status(404).json({
        error: "Tweet not found",
      });
    }

    if (tweet.author !== req.user) {
      return res.status(403).json({
        error: "Not allowed",
      });
    }

    const index = tweets.findIndex((t) => t.id === id);

    tweets.splice(index, 1);

    res.json({
      success: true,
    });
  }
);

// Server starten

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});