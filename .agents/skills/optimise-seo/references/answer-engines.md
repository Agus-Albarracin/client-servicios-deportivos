# Answer Engines

Separate search discovery, answer citation, and model training. They are different policies and may use different crawlers.

Define crawler policy from the product’s intent, then verify it against the live domain with the crawler user agent. `robots.txt` communicates preference; CDN or WAF rules can still block a permitted crawler.

`llms.txt` is optional. Add it only when it points to maintained, useful documentation or structured resources. Do not claim it improves ranking or citation by itself. Keep concise, answerable content in server-rendered HTML regardless of crawler policy.