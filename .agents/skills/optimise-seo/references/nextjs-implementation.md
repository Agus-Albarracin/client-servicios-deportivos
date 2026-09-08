# Next.js Implementation

Use the installed Next.js documentation as the version authority. Read the route and rendering behavior before assuming a metadata or cache pattern applies.

## Metadata and canonicals

Set `metadataBase` at the application root, then generate route-specific titles, descriptions, and `alternates.canonical`. Treat object metadata such as `openGraph`, `twitter`, `robots`, and `alternates` as deliberate route contracts: a child declaration must preserve the values it still needs.

## Sitemap, robots, and redirects

List only canonical URLs that should be indexed. Derive `lastModified` from content changes, not deployment time. Declare the sitemap in `robots.ts`. Use redirects for URL moves, not canonical tags; verify that every redirect reaches its final target in one hop.

## Structured data and response status

Use JSON-LD only for entities represented visibly on the page. Serialize untrusted text safely before embedding it in a script. Ensure absence checks happen early enough to return an actual 404 rather than a successful streamed shell with `noindex`.