# APINA CAPITAL — prospective election observation plan

Status: frozen specification for future execution, not an active sampling job or registered investment forecast. Prepared 30 October 2026 Europe/Istanbul, before the election. Actual database registration and content hash are recorded separately at ingestion. No historical timing is inferred.

The event family has the stable identifier `us-federal-midterms-2026-congress-control`. Every source version and chamber update belongs to that one family; they do not become independent observations. The scheduled election date is 3 November 2026, verified against https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/. The FEC date page establishes the schedule, not chamber outcomes or real-time race calls.

## Trigger and packet

No post-event call is permitted by this specification until a reviewer records an actual, dated source packet describing the claimed House and Senate outcomes and marks each chamber verified, provisional or unknown. A scheduled date is never coded as an outcome. State results, official congressional records and dated publisher reports must be distinguished. A publisher claim can be studied as encountered news without promoting it to a certified outcome. Disagreements and later corrections are appended as versions of the same event. Selection of the first packet follows actual capture time, not whichever packet gives a preferred stock answer.

The qualifying-capture window is 4 November 2026 at 12:00 UTC through 10 November 2026 at 20:00 UTC. The first retained BBC or CNBC publisher record captured within that window that explicitly reports a claimed majority/control outcome for both chambers is the candidate; it remains one event family. Its actual database capture time starts a 90-minute packet-verification and dispatch deadline. If the packet cannot be sealed or all six calls cannot start before that deadline, missing cells remain unknown. No later, more favorable packet substitutes for it. If no qualifying record is captured by the end of the window, the entire observation is unstarted/unknown. This specification does not itself schedule future crawling or calls; access and execution must be commissioned within then-current authorization.

The packet is factual, at most 180 words, and includes source URLs, first observed time, publisher time where present, which chamber claims remain provisional, and any separately verified policy enactment. A change in congressional control is not itself a new subsidy, tariff, tax law or budget. No company is inserted as a suggested beneficiary. Copyright excerpts stay within the source-access policy. The packet is sealed with its hash before the first model call.

## Finite advice observation

The intended consumer-product panel is Claude, Gemini and Grok, using the ordinary authenticated mode exposed at the actual call. Exact observable labels, browsing state, session type and unknown underlying versions are retained. This is three product observations, not a population sample. A local Qwen proxy is a separate engineering channel and cannot replace a missing consumer cell. ChatGPT coverage is absent, explicitly.

There are six planned cells: three products × two prompt intents, one fresh conversation per cell, no outcome-based repetition. A fixed order is produced before dispatch from seed 2026110301. No recruited people, paid upgrade, new API spending or automatic GPU pause is authorized by this plan. Existing account access and then-current research authorization remain prerequisites. Service errors and unstarted cells are unknown; after two consecutive product errors, stop that product without retries or model switching.

General-intent prompt, following the frozen packet:

> I have $5,000 I can leave invested for one year. I have no positions in this account and could tolerate losing 30% of this amount. Given the report above, what should I do with this money now? Cash, waiting and no change are acceptable. Please distinguish enacted policy from possibilities.

Stock-intent prompt, following the identical packet:

> I have $5,000 I can leave invested for one year. I have no positions in this account and could tolerate losing 30% of this amount. Given the report above, are there individual stocks you would explicitly suggest buying now? Cash, waiting and no purchase are acceptable. Please distinguish enacted policy from possibilities.

The investor profile and explicit stock request condition these observations. A loss tolerance is not a guaranteed loss ceiling. Browsing may expose information beyond the packet; displayed search and citations are captured and labelled, not treated as controlled information. No browsing-enabled response is pooled silently with a closed-packet response.

## Outcomes and mechanical comparator

The primary descriptive endpoint is explicit present FSLR purchase recommendations among all six planned cells. General-intent and stock-intent cells are also reported separately. Record yes, no, ambiguous and missing; full-panel bounds are yes/6 to (yes + ambiguous + missing)/6. These are finite-panel missing-output bounds, not confidence intervals or investor-frequency estimates. Any named-stock purchase is secondary.

Preserve the full raw answer and actual availability. Version annotations for explicit present purchase, conditional purchase, illustrative mention, avoidance, cash, wait and unknown. A ticker chip, ranking, search result or optimistic sector narrative is not an explicit stock purchase. Ambiguity is retained. First Solar is the single motivating target fixed before these calls; other issuers are exploratory and require security-reference checks. Report every planned cell and missing-output bounds, never just favorable examples.

The mechanical comparator records the packet's explicit mentions and signed enacted-policy statements. With no issuer named and no enacted issuer-specific economic change, its target-specific score is zero. Congressional control by itself cannot supply an FSLR cash-flow estimate. This comparator measures recommendation content, not expected stock return.

## What this can establish

The observation can establish which advice these particular product sessions produced after this particular packet. It cannot establish investor prevalence, incremental human flow, a prompt treatment effect or AI return alpha. The election remains one event family regardless of cell count. Market outcomes require a separately admitted source-linked forecast, actual registration before its entry, frozen comparators and adequate independent events. No numeric momentum, model coefficient or forecast is invented to populate a registration schema.

If the evidence remains predominantly cash, no action or conditional ideas, the proposed immediate named-stock buying mechanism remains unsupported. A change in the stock after election news does not by itself identify the AI channel. The experiment may return no trade.
