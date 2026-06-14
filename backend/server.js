require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newdatabase";

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// ── Book schema & model ──────────────────────────────────────────────────────

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    PublishedYear: { type: Number, required: true },
    edition: { type: String, required: true },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

// ── Seed ─────────────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    const count = await Book.countDocuments();
    if (count > 0) {
      console.log("Database already seeded, skipping.");
      return;
    }

    const books = [
      {
        title: "The Love Poems of Rumi",
        author: "Jalāl al-Dīn Muḥammad Rūmī",
        price: 1000,
        description:
          "Renowned Rumi expert Nader Khalili offers a beautifully illustrated collection that delves into themes of love, friendship, and spirituality.",
        image:
          "https://img1.od-cdn.com/ImageType-400/1933-1/%7B4C2D8748-62F7-42FB-8492-5DBBA6670F17%7DIMG400.JPG",
        PublishedYear: 2020,
        edition: "1st edition",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        price: 1499,
        description:
          "A guide to building good habits and breaking bad ones with practical strategies.",
        image:
          "https://juliemuircelebrant.com.au/wp-content/uploads/2023/07/Atomic-Habits-1024x768.jpg",
        PublishedYear: 2018,
        edition: "2023 updated edition",
      },
      {
        title: "The Power of Now",
        author: "Eckhart Tolle",
        price: 1799,
        description:
          "A spiritual guide to mindfulness and living in the present moment.",
        image:
          "https://a.storyblok.com/f/181188/473984f850/0997d266dd814851bd59-15db02acfbc704.jpg",
        PublishedYear: 1997,
        edition: "1st edition",
      },
      {
        title: "How to Kill Your Family",
        author: "Bella Mackie",
        price: 599,
        description:
          "This darkly humorous thriller follows Grace Bernard, a woman who embarks on a calculated mission to eliminate her estranged family members.",
        image:
          "https://m.media-amazon.com/images/I/51znppHr51L._AC_UF1000,1000_QL80_.jpg",
        PublishedYear: 2021,
        edition: "1st edition",
      },
      {
        title: "Riyad as-Salihin",
        author: "Imam An-Nawawi",
        price: 1500,
        description:
          "A collection of hadiths on good character, ethics, and spirituality.",
        image:
          "https://m.media-amazon.com/images/I/917pBUKB5BL._UF1000,1000_QL80_.jpg",
        PublishedYear: 1300,
        edition: "1st edition",
      },
      {
        title: "Don't Believe Everything You Think",
        author: "Joseph Nguyen",
        price: 699,
        description:
          "This book explores how our thoughts shape our reality and how overthinking can lead to unnecessary suffering.",
        image:
          "https://m.media-amazon.com/images/I/715qi-cIbML._AC_UF1000,1000_QL80_.jpg",
        PublishedYear: 2023,
        edition: "2nd edition",
      },
      {
        title: "The Art of Letting Go",
        author: "Nick Trenton",
        price: 400,
        description:
          "This book offers practical strategies to help readers break free from overthinking, negative thought patterns, and emotional burdens.",
        image:
          "https://cdn.penguin.co.in/wp-content/uploads/2024/09/9780143465065.jpg",
        PublishedYear: 2023,
        edition: "2nd edition",
      },
      {
        title: "Indians: A Brief History of a Civilization",
        author: "Namit Arora",
        price: 999,
        description:
          "This book takes readers on a journey through India's history by exploring major archaeological and historical sites.",
        image:
          "https://m.media-amazon.com/images/I/71k4PF6MzCL._UF1000,1000_QL80_.jpg",
        PublishedYear: 2021,
        edition: "1st edition",
      },
    ];

    await Book.insertMany(books);
    console.log("Books seeded successfully.");
  } catch (e) {
    console.error("Seed error:", e.message);
  }
};

seedDatabase();

// ── Book routes ───────────────────────────────────────────────────────────────

// GET all books  (supports ?search= query param)
app.get("/api/books", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const allBooks = await Book.find(query);
    res.json(allBooks);
  } catch (e) {
    res.status(500).json({ error: e.message || "Could not retrieve books" });
  }
});

// GET book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: e.message || "Could not retrieve book" });
  }
});

// POST new book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, price, description, image, PublishedYear, edition } =
      req.body;

    if (!title || !author || !price || !description || !image || !PublishedYear || !edition) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const book = await Book.create({ title, author, price, description, image, PublishedYear, edition });
    res.status(201).json(book);
  } catch (e) {
    res.status(500).json({ error: e.message || "Unable to add book" });
  }
});

// PUT update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: e.message || "Unable to update book" });
  }
});

// DELETE book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Unable to delete book" });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
