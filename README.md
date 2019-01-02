# html posts to markdown

A node.js tool to extract html posts from webpages, extract them to markdown and save them.

## Setup

1) Clone the repository
2) Run ```npm install ```

## Usage

```bash
node index.js --url="https://justmarkup.com" --postSelector=".main .article h2 a" --titleSelector=".article h1" --contentSelector=".article .entry-content" --dir="/posts/"
```

## Options

| Option                | Default                   | Description |
| :-------------------- | :------                   | :----------------
| `--url`               | https://justmarkup.com    | The entry page containing links to the posts
| `--postSelector`      | .main .article h2 a       | The selector for all the links to your posts
| `--titleSelector`     | .article h1               | The selector for the title of your post
| `--contentSelector`   | .article .entry-content   | The selector for the content wrapper of your post
| `--dir`               | /posts/                   | The directory where the posts should be saved