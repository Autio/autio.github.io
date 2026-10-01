# A Map of Spinoza’s Ethics

**See how an argument is built. Then read it for yourself.**

An interactive map of the logical dependencies in **Part I of Spinoza’s *Ethics*: Concerning God**, paired with the complete text of R. H. M. Elwes’s translation. Follow a proposition back to its premises, trace its consequences, and jump directly from the map to its proof.

**[Open the map →](https://autio.github.io/projects/spinoza_ethics/)** · **[Try Proposition XIV →](https://autio.github.io/projects/spinoza_ethics/#1P14)** · **[Star the source project →](https://github.com/Autio/Ethics)**

## Why a map?

Spinoza presents the *Ethics* in the style of geometry: definitions and axioms support propositions, which in turn support later propositions. Reading straight through can make it difficult to keep those connections in view.

This project brings the structure and the text together. The map helps you ask **“What does this claim rely on?”** and **“What follows from it?”** The reader lets you examine the actual reasoning behind each connection.

## Three ways to explore

| View | Best for | How it works |
| --- | --- | --- |
| **Argument layers** | Following the structure of an argument | Places foundational statements at the top and later claims below the premises they use. |
| **Book order** | Reading alongside the original sequence | Arranges definitions, axioms, propositions, and their corollaries in reading order. |
| **Local dependencies** | Examining one statement closely | Places a selected statement between its immediate premises on the left and its consequences on the right. |

Arrows run **from a recorded premise to the statement that uses it**. Colours distinguish definitions, axioms, propositions, and corollaries.

## Start exploring

1. **Hover over a node** to see its description and highlight its immediate connections. Unrelated nodes fade into the background.
2. **Click a node** to select it and scroll the reader to its passage. A corollary takes you to its exact paragraph.
3. Use **Uses** and **Used by** to move through connected statements, or choose a passage from the selector.
4. Use **Locate in the map** in the reader to return to the corresponding node.

Keyboard users can focus nodes with Tab and activate them with Enter or Space. Focus shows the same preview as hovering. On smaller screens, the reader appears below the map.

You can link directly to a passage—for example, [Proposition XIV](https://autio.github.io/projects/spinoza_ethics/#1P14) or [its second corollary](https://autio.github.io/projects/spinoza_ethics/#1P14C02).

## Keep your own highlights

Select a passage and choose **Highlight passage**. It gains a yellow highlight in the reader and a gold outline in the map. Choose **Remove highlight** to unmark it.

Your highlights are saved in **this browser**, with no account and no server upload. Use **Download highlights** to save a JSON backup, and **Import highlights** to restore it or transfer it to another browser. Import merges the saved passages with your existing collection.

Highlights apply to whole passages. Browser profiles and website origins have separate collections, so the local preview and the live site do not share highlights. Clearing site data removes them; a downloaded JSON file keeps your collection portable.

## Scope and sources

The map contains **65 nodes and 140 directed connections** from the original Part I dataset. The reader includes all eight definitions, seven axioms, and 36 propositions, together with their proofs, notes, corollaries, and the appendix.

- **Project:** Petri Autio; originally published in 2015.
- **Dependency data:** compiled by R. F. Tredwell.
- **English text:** R. H. M. Elwes’s translation, from [Project Gutenberg ebook 3800](https://www.gutenberg.org/ebooks/3800).
- **Original visual reference:** [Friedman’s poster](https://dailynous.com/wp-content/uploads/2014/10/friedman-spinoza-chart.jpg).

The connections represent an editorial reading of the dependencies, rather than a machine-checked verification of the proofs. Short node summaries come from the original dataset and can differ from the wording of the translation. **Parts II–V are not currently mapped or displayed.**

The historical translation is public domain; Gutenberg identifies its ebook as public domain in the USA. The complete downloaded source is retained with its credits and distribution notice. Displayed text preserves the wording while normalising line wrapping.

## Help improve the map

If you find the project useful, **[star Autio/Ethics](https://github.com/Autio/Ethics)** so others can discover it.

Feedback and contributions are welcome:

- **Dependency corrections:** identify the premise and target, cite the relevant proof or corollary, and explain the proposed connection.
- **Text or summary corrections:** cite the passage and distinguish a transcription error from a different interpretation.
- **Interface improvements:** describe the reading task you want to make easier, with a screenshot or example where useful.

[Open an issue in the source project](https://github.com/Autio/Ethics/issues) or contribute a pull request. This folder is the published website copy; [Autio/Ethics](https://github.com/Autio/Ethics) is the standalone project. Changes to the standalone project must also be copied here to update the live page.

## Run locally

The application uses plain HTML, CSS, and JavaScript. No package installation or build step is required.

From the root of **this website repository**, run:

```sh
python3 -m http.server 8000
```

Then open [localhost:8000/projects/spinoza_ethics/](http://localhost:8000/projects/spinoza_ethics/).

Alternatively, run the server inside this folder and open [localhost:8000](http://localhost:8000). Use an HTTP server: opening `index.html` directly as a file can prevent the JSON data from loading.

### Files and maintenance

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Page structure, appearance, and interactions |
| `data/graph.json` | Original Part I nodes and directed connections |
| `data/text.json` | Reading sections and passage anchors |
| `data/elwes-source.txt` | Complete Gutenberg source, credits, and distribution notice |
| `scripts/build_text.py` | Regenerates the reading data and checks every graph node has a text anchor |

From this folder, regenerate and check with:

```sh
python3 scripts/build_text.py
node --check app.js
```

For interface changes, check all three views, hover and keyboard previews, proposition and corollary jumps, fragment links, highlight persistence, JSON export/import, and the narrow-screen layout. Legacy scripts and images remain as historical reference; the current page uses `app.js` and `styles.css`.

## Licence

The application retains the [GNU GPL version 2 licence](LICENSE). The historical translation is public domain, and the retained Gutenberg source includes its own distribution notice. Please preserve the attribution to R. F. Tredwell when reusing the dependency data.
