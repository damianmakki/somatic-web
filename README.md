# somatic-web

Marketing site for [Somatic](https://ruckuslabs.co/somatic) — the holistic fitness app for iPhone. Hosted on GitHub Pages with Jekyll.

## Local preview

### 1. Install a modern Ruby

macOS ships with Ruby 2.6, which is too old for Jekyll 4. Install a current version via Homebrew:

```bash
brew install ruby
```

Then add Homebrew's Ruby to your shell path. Add this line to `~/.zshrc` (or `~/.bash_profile` if using bash):

```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```

Reload your shell:

```bash
source ~/.zshrc
```

Verify you're on Ruby 3+:

```bash
ruby -v   # should print ruby 3.x.x
```

### 2. Install dependencies (first time only)

```bash
gem install bundler
bundle install
```

### 3. Start the server

```bash
bundle exec jekyll serve --baseurl "" --port 3456
```

Open [http://localhost:3456](http://localhost:3456).

> The `--baseurl ""` flag overrides the production value (`/somatic`) so links resolve correctly at localhost. Do not commit this flag — the value in `_config.yml` is correct for production.

---

## Structure

```
_config.yml          Jekyll config (baseurl, url)
_layouts/
  default.html       Shared page shell: head, nav, footer, scripts
_includes/
  logo-svg.html      Reusable logo SVG (accepts size= param)
  structured-data.html  Homepage JSON-LD schema
src/css/             Stylesheets
index.html           Homepage
help/                Help / FAQ page
terms/               Terms of Use
privacy/             Privacy Policy
template/            Session template deep-link page
```

## Adding a new page

1. Create a directory with an `index.html` inside (e.g. `about/index.html`).
2. Add Jekyll front matter at the top:

```yaml
---
layout: default
title: "Page Title | Somatic"
description: "Short description for search engines."
---
```

3. Write your page content below the closing `---`. The layout injects nav, footer, and shared scripts automatically.

4. If the page needs extra CSS, add `extra_css: /src/css/your-file.css` to the front matter.

## Updating the logo SVG

Edit [`_includes/logo-svg.html`](_includes/logo-svg.html) once — the change propagates to the nav and footer on every page.

## Deployment

Push to `main`. GitHub Pages builds and deploys Jekyll automatically. No CI configuration required.
