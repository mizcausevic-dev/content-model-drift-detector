# Why We Built This

**content-model-drift-detector** came from a simple but expensive pattern: content systems were changing faster than the delivery surfaces depending on them. Teams could add or rename fields in a CMS quickly, but the downstream damage often showed up later in the wrong place. A frontend template would quietly expect a field that no longer existed. A GraphQL consumer would still assume an older shape. A search or answer-layer packager would keep publishing stale payload assumptions until someone noticed a broken page, empty module, or malformed response in production.

That pattern becomes more common, not less, as organizations move into headless publishing. WordPress plus ACF plus WPGraphQL plus one or more frontends can be a productive stack, but it also creates several contract boundaries where drift can hide. Traditional CMS workflows help authors publish. Frontend tests help engineers catch some regressions. SEO and analytics tools help measure outcomes after the fact. What still tends to be missing is a control surface specifically for **content-model drift as an operational problem**.

We built this repo to make that problem legible before it turns into incident cleanup. The goal was not to create another admin panel or generic schema viewer. The goal was to expose the questions platform and content teams actually need answered:

- which content models changed recently
- which fields are now missing, changed, or orphaned
- which downstream consumers are working from stale assumptions
- which issues should block publish or deploy versus which ones simply need review

Existing tools missed the mark for understandable reasons. CMS interfaces show the current model, not necessarily the contract risk it creates. Frontend test suites usually tell you that something broke, but not how editorial change created the mismatch. Search, preview, and AEO tooling often assume the content shape is already trustworthy. The gap is not a lack of visibility into any one system. The gap is the lack of a shared, operator-friendly view across **content model**, **consumer**, and **release risk**.

That shaped the design philosophy behind **content-model-drift-detector**:

- **operator-first**
  so the output reads like a review queue, not a developer-only schema dump
- **platform-legible**
  so frontend, content, and release teams can all see why the issue matters
- **contract-aware**
  so the repo focuses on downstream consumers, not just the CMS source of truth
- **delivery-minded**
  so breaking drift is treated like a release risk, not a documentation problem

The current version models WordPress and headless content contracts using sample data, but the intent is broader. The repo is a demonstration of how content operations and platform reliability can meet in one place. Next on the roadmap is richer schema diffing, publish-gate simulation, and export paths that can feed CI or deployment checks directly.
