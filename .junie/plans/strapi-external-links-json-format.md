---
sessionId: session-261014-155355-8gmr
---

# Requirements

### Overview & Goals
Provide a structured specification and concrete JSON examples for the `externalLinks` field in Strapi. In the frontend application, news articles display external links and embedded YouTube video resources derived from Strapi data.

### Scope
- **In Scope**:
  - Valid JSON schema and payload examples for Strapi's `externalLinks` field.
  - Recommended format (array of strings) and supported object-based formats (`url` / `link` attributes).
  - Support for YouTube video links (auto-converted to video embeds) and general external links (rendered as resource cards).
  - Frontend parsing and normalization rules in `NewsService`.
- **Out of Scope**:
  - Modifying backend Strapi database migrations or custom backend plugins.

### User Stories
- **As a Content Editor**, I want to paste external URLs (e.g., YouTube videos, reference articles, documentation) into the `externalLinks` JSON field in Strapi so that they are automatically displayed on the article detail page.
- **As a Website Visitor**, I want YouTube links to appear as embedded video players and external references to appear as resource cards on the article page.

### Functional Requirements
- **JSON Field Formats**:
  1. **Array of Strings (Standard & Recommended)**: `["https://url1.com", "https://url2.com"]`
  2. **Array of Objects**: `[{"url": "https://url1.com"}, {"link": "https://url2.com"}]`
  3. **Single String (Fallback)**: `"https://url1.com"`
- **Frontend Normalization**:
  - `NewsService` extracts valid URLs, trims whitespace, and filters empty strings.
- **Frontend Rendering**:
  - Links matching YouTube patterns (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`) are rendered as embedded responsive iframe players (`https://www.youtube-nocookie.com/embed/{id}`).
  - Non-YouTube links are displayed as external resource cards showing the website domain and target URL.


# Technical Design

### Current Implementation
- **Model**: `NewsArticle` in `src/app/website/news/news.models.ts` defines `externalLinks?: string[]` and `externalUrls?: string[]`.
- **Service**: `normalizeArticle()` in `src/app/website/news/news.service.ts` normalizes incoming Strapi attributes (`externalLinks`, `externalUrls`, `externalResources`, `resources`).
- **Component**: `buildResourceLinks()` in `src/app/website/news/news-detail/news-detail.component.ts` transforms normalized URL strings into `ExternalResourceLink` objects, handling YouTube ID extraction and iframe sanitization.

### Strapi JSON Formats & Examples

#### Format 1: Array of Strings (Recommended)
This is the standard and cleanest format to use in Strapi's JSON field:
```json
[
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://sdl.org.mk/publications/annual-report-2024",
  "https://youtu.be/kxyv3hFq4AE"
]
```

#### Format 2: Array of Objects with `url` or `link` Keys
Supported when structured objects are used or exported from third-party tools:
```json
[
  {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Annual Keynote Video"
  },
  {
    "link": "https://sdl.org.mk/publications/annual-report-2024",
    "description": "Annual Report Document"
  }
]
```

#### Format 3: Single String (Fallback)
If only a single link is entered:
```json
"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Strapi Content-Type Configuration
In Strapi (`schema.json` for the Article content-type):
```json
{
  "attributes": {
    "externalLinks": {
      "type": "json"
    }
  }
}
```

### Architecture & Data Flow
```mermaid
graph LR
  Strapi["Strapi Article JSON Field"] -->|API Response| Service["NewsService.normalizeArticle()"]
  Service -->|NewsArticle.externalLinks: string[]| Detail["NewsDetailComponent.buildResourceLinks()"]
  Detail -->|isYoutube == true| Embed["YouTube Iframe Embed"]
  Detail -->|isYoutube == false| Card["Resource Link Card"]
```

### Affected Files
- `src/app/website/news/news.models.ts` — data interfaces for Strapi article responses
- `src/app/website/news/news.service.ts` — Strapi normalization logic
- `src/app/website/news/news-detail/news-detail.component.ts` — link processing & YouTube sanitization
- `src/app/website/news/news-detail/news-detail.component.html` — UI template rendering


# Testing

### Validation Approach
Verify that all supported JSON variations in Strapi correctly normalize in `NewsService` and render properly in `NewsDetailComponent`.

### Key Scenarios
1. **Array of Strings**:
   - Input: `["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://example.com/doc"]`
   - Verify: 1 embedded YouTube iframe with valid `src` and 1 resource link card linking to `https://example.com/doc`.
2. **Array of Objects**:
   - Input: `[{"url": "https://youtu.be/xyz123abc45"}, {"link": "https://sdl.org.mk"}]`
   - Verify: Extracts `url` and `link` strings, correctly embeds YouTube video and renders website card.
3. **Empty or Missing Field**:
   - Input: `null`, `undefined`, `[]`, or `""`
   - Verify: `article.externalLinks` defaults to `[]`, external resources section is hidden in the template.
4. **Invalid / Malformed URLs**:
   - Input: Array with empty strings or non-URL strings like `["   ", "https://example.com"]`
   - Verify: Whitespace-only items are filtered out, valid items render properly without runtime errors.


# Delivery Steps

###   Step 1: Define and validate Strapi Article JSON schema for external links
Establish the required JSON schema and configuration for the `externalLinks` field in Strapi Article content type.

- Configure `externalLinks` as a `JSON` field type in the Strapi `Article` schema definition.
- Document the standard JSON payload formats (array of URL strings and array of objects with `url` or `link` keys).
- Add guidance and validation rules for content editors entering external links in the Strapi Content Manager.

###   Step 2: Verify external link parsing and normalization in NewsService
Ensure `NewsService.normalizeArticle()` accurately parses, cleans, and transforms all Strapi external link JSON payload variants.

- Verify parsing logic in `src/app/website/news/news.service.ts` for array of strings `["https://..."]`, array of objects `[{"url": "https://..."}]`, and single string fallbacks.
- Ensure whitespace trimming, filtering of empty values, and fallback across legacy attribute aliases (`externalUrls`, `externalResources`, `resources`).
- Update unit tests in `src/app/website/news/news.service.spec.ts` covering all supported JSON formats.

###   Step 3: Validate rendering of external links and YouTube embeds in NewsDetailComponent
Validate template rendering of embedded YouTube players and resource link cards in `NewsDetailComponent`.

- Verify YouTube ID extraction and `DomSanitizer` iframe embed generation in `src/app/website/news/news-detail/news-detail.component.ts`.
- Ensure standard external links render cards with domain name titles and external redirect links in `src/app/website/news/news-detail/news-detail.component.html`.
- Update unit tests in `src/app/website/news/news-detail/news-detail.component.spec.ts` to test mixed resource links.