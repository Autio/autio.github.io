"""Build the three-page research brief. Requires ReportLab; checks use stdlib only."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Flowable

HERE = Path(__file__).resolve().parent
NAVY = colors.HexColor("#183248")
TEAL = colors.HexColor("#236c67")
GREY = colors.HexColor("#56636c")
PALE = colors.HexColor("#eef4f5")
AMBER = colors.HexColor("#b47827")
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleR", fontName="Helvetica-Bold", fontSize=25,
                          leading=29, textColor=NAVY, spaceAfter=15))
styles.add(ParagraphStyle(name="SubR", fontName="Helvetica", fontSize=10,
                          leading=14, textColor=GREY, spaceAfter=12))
styles.add(ParagraphStyle(name="HeadR", fontName="Helvetica-Bold", fontSize=12,
                          leading=16, textColor=TEAL, spaceBefore=14, spaceAfter=6))
styles.add(ParagraphStyle(name="BodyR", fontName="Helvetica", fontSize=10.2,
                          leading=14.3, textColor=NAVY, spaceAfter=8))
styles.add(ParagraphStyle(name="SmallR", fontName="Helvetica", fontSize=8.6,
                          leading=12.1, textColor=GREY, spaceAfter=7))
styles.add(ParagraphStyle(name="BoxR", fontName="Helvetica-Bold", fontSize=11.2,
                          leading=16, textColor=NAVY, spaceAfter=0))


def p(text, style="BodyR"):
    return Paragraph(text, styles[style])


def box(text):
    t = Table([[p(text, "BoxR")]], colWidths=[507])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE),
                          ("BOX", (0, 0), (-1, -1), .5, TEAL),
                          ("LEFTPADDING", (0, 0), (-1, -1), 12),
                          ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                          ("TOPPADDING", (0, 0), (-1, -1), 10),
                          ("BOTTOMPADDING", (0, 0), (-1, -1), 10)]))
    return t


class HiddenCycle(Flowable):
    def __init__(self):
        Flowable.__init__(self)
        self.width, self.height = 507, 126

    def draw(self):
        c = self.canv
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(GREY)
        c.drawString(0, 112, "FINE SYSTEM: FOUR DIFFERENT STATES KEEP CHANGING")
        labels = ["(1, 1)", "(1, 2)", "(2, 2)", "(2, 1)"]
        xs = [20, 145, 270, 395]
        for x, label in zip(xs, labels):
            c.setFillColor(PALE)
            c.roundRect(x, 69, 80, 28, 4, fill=1, stroke=0)
            c.setFillColor(NAVY)
            c.setFont("Helvetica-Bold", 11)
            c.drawCentredString(x + 40, 79, label)
        c.setStrokeColor(TEAL)
        c.setLineWidth(1.1)
        for x in xs[:-1]:
            c.line(x + 83, 83, x + 121, 83)
            c.line(x + 121, 83, x + 116, 86)
            c.line(x + 121, 83, x + 116, 80)
        c.line(435, 66, 435, 54)
        c.line(435, 54, 60, 54)
        c.line(60, 54, 60, 66)
        c.line(60, 66, 57, 61)
        c.line(60, 66, 63, 61)
        c.setFillColor(AMBER)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(0, 29, "COARSE DESCRIPTION: ALL FOUR LOOK LIKE (ON, ON)")
        c.setFillColor(GREY)
        c.setFont("Helvetica", 9)
        c.drawString(0, 11, "An unchanging description need not describe an equilibrium.")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#d6e0e4"))
    canvas.line(44, 36, A4[0] - 44, 36)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawString(44, 23, "Reciprocity without losing causality | Research brief | 7 November 2026")
    canvas.drawRightString(A4[0] - 44, 23, str(doc.page))
    canvas.restoreState()


story = [
    p("Reciprocity without<br/>losing causality", "TitleR"),
    p("A first research result on simplifying finite feedback systems", "SubR"),
    box("Proofs and reproducible finite checks completed.<br/>Priority and external mathematical review remain open."),
    p("The question", "HeadR"),
    p("When parts of a system affect one another, can we simplify each part and still preserve what happens when we intervene? Matching each component's input-output rule turns out to be insufficient: a simplification can invent a stable state that the original system cannot occupy."),
    p("The sharp rule", "HeadR"),
    p("Assume the fine system has exactly one solution after every point intervention, including no intervention. A point intervention fixes chosen components and leaves the other equations in force. Assume also that the component rules commute exactly with the chosen simplifications."),
    p("Classify each component as <b>fully retained</b>, <b>wholly erased</b>, or <b>partially simplified</b>. The third kind keeps some distinctions while merging others."),
    box("Every compatible fine system on a given dependency graph is guaranteed to retain its unique interventional solutions if and only if there is no directed cycle entirely among the partially simplified components."),
    p("This is a universal guarantee from the graph and the interface. An individual system may still be safe when this graph test fails. The whole graph can contain feedback cycles; the theorem does not require an acyclic fine system.", "SmallR"),
    p("The smallest failure", "HeadR"),
    p("Two components each have values 0, 1 and 2. The first copies the second; the second applies a swap that fixes 0 and exchanges 1 with 2. Their only equilibrium is (0, 0). Fixing either component always determines the other uniquely."),
    HiddenCycle(),
    p("Now label 0 as OFF and merge 1 and 2 into ON. Each coarse rule copies the other coarse value, so both (OFF, OFF) and (ON, ON) appear to be equilibria. The second has no fine equilibrium behind it. Two three-state components are minimal in the stated loopless class; all minimum failures are this example up to relabelling.", "SmallR"),
    PageBreak(),
    p("Proof, checks and repair", "TitleR"),
    p("Why the rule works", "HeadR"),
    p("Take any proposed coarse equilibrium after an intervention. Temporarily fix all fully retained components to the fine values it specifies. The fine system's intervention guarantee supplies one solution for the remaining components. Wholly erased components have no coarse distinction to get wrong. The partially simplified components form an acyclic subsystem, so their coarse values are forced in order. The temporary fixes can then be removed: injectivity ensures their original equations hold. Every coarse equilibrium therefore comes from the unique fine equilibrium."),
    p("Conversely, a cycle of partially simplified components can hide a binary distinction at each component. Copy those hidden distinctions around the cycle with one reversal. The fine equations cannot close in that region, while merging the distinctions makes them appear to agree. Add a separate fixed state to obtain a fine system with unique solutions under every intervention. This constructs the obstruction on every forbidden cycle."),
    p("Exact finite verification", "HeadR"),
]
rows = [
    ["Search", "Coverage", "Result"],
    ["Two components", "900 systems; all partitions;\n5,206 simple compatible pairs", "18 failures, all minimal\nand equivalent by relabelling"],
    ["Three Boolean components", "4,096 systems; all 8\nidentity/erasure interfaces", "2,928 simple compatible\npairs, all safe"],
    ["Sharpness witnesses", "64 graphs x 27\ninterface-type assignments", "135 forbidden cases;\n135 verified witnesses"],
    ["Retention refinements", "23,276 upgrades of\n7,476 compatible pairs", "Exact descent criterion\nagrees in every case"],
]
table = Table([[p(v, "SmallR") for v in row] for row in rows], colWidths=[137, 188, 182])
table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), PALE),
                          ("VALIGN", (0, 0), (-1, -1), "TOP"),
                          ("LINEBELOW", (0, 0), (-1, 0), .6, TEAL),
                          ("LINEBELOW", (0, 1), (-1, -1), .3, colors.HexColor("#d6e0e4")),
                          ("LEFTPADDING", (0, 0), (-1, -1), 7),
                          ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                          ("TOPPADDING", (0, 0), (-1, -1), 7),
                          ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
story += [table,
    p("Two separately written enumerators agree on their overlapping searches, including every two-component domain subtotal. Independent internal AI reviews found no mathematical defect. These checks corroborate the proofs; they are not a proof assistant verification or external peer review.", "SmallR"),
    p("Retaining detail has dependencies", "HeadR"),
    p("A second proposition gives an exact repair rule for upgrades that retain a whole component. If an upgraded output distinguishes two input values that the interface still merges, that input component must also be retained. Repeating this rule gives a closure under hidden-input dependencies. A valid certificate upgrade must both satisfy this closure and break every cycle among the remaining partial components."),
    p("In the smallest example, retaining one component breaks the graph cycle but makes its mechanism ill-defined at the remaining coarse input. Both components must be retained. The exact optimization counts the union of all forced upgrades, avoiding double-counted dependencies."),
    p("Essential boundary", "HeadR"),
    p("A unique solution without intervention is not enough. Nor does unique solvability under every intervention imply that synchronous or fair asynchronous updates converge. Separate explicit counterexamples and checks are included in the research package.", "SmallR"),
    PageBreak(),
    p("Why Hegel; why Hegelese", "TitleR"),
    p("A philosophical constraint, made testable", "HeadR"),
    p("The project starts from the Hegel Reader's discussion of formal causality (Day 93) and the universal concept (Day 97). The primary anchor is Hegel's Encyclopaedia, sections 154-159. Section 156 argues that merely saying two sides cause one another does not yet explain their mediation within the whole."),
    p("Our mathematical interpretation is limited and explicit: a description of interacting parts should preserve their joint causal possibilities, including the effects of intervention. The false equilibrium example shows how a higher-level unity can be produced merely by hiding a fine-level failure to agree. The theorem states when this cannot happen within the chosen finite model."),
    p("Feedback is not thereby identified with Hegelian freedom, and a fixed point is not the whole Concept. Unique solvability is a modeling assumption, not something deduced from Hegel. Some Reader chapter labels and analogies are unreliable; the interpretation was checked against the original text."),
    p("A concrete prospect for Hegelese", "HeadR"),
    p("Hegelese already checks specified revisions of finite processes. A research extension could ask a further question: does this simplification remain causally faithful when the parts are connected in feedback? An experimental certificate would record the component maps, mechanism equations, a separate justification of fine simplicity, and the acyclic graph on partial components."),
    p("A failed certificate would identify a cycle or a hidden-input distinction that must be retained. It would distinguish a missing structural guarantee from an actual demonstrated semantic failure. This package proposes that interface; it does not change the language or claim that the existing checker implements it."),
    p("What may be new", "HeadR"),
    p("Cyclic causal abstraction, value merging, and the collapse of hidden cycles into apparent fixed points are already studied. The strongest candidate here is the exact universal classification by cycles among maps that are neither injective nor constant, together with its minimal obstruction. The targeted literature audit found no matching theorem. That is a reason for further review, not proof of priority."),
    p("Selected sources and next question", "HeadR"),
    p('Hegel Reader: <link href="https://autio.github.io/hegel-reader/#day-93" color="#236c67">Day 93</link> and <link href="https://autio.github.io/hegel-reader/#day-97" color="#236c67">Day 97</link>. Hegel, <link href="https://www.marxists.org/reference/archive/hegel/works/sl/slactual.htm" color="#236c67">Encyclopaedia, sections 154-159</link>.', "SmallR"),
    p('Lorenz and Tull (2026), <link href="https://arxiv.org/html/2602.16612v1" color="#236c67">Causal and Compositional Abstraction</link>, sections 6 and 8. Bongers et al. (2021), <link href="https://arxiv.org/html/1611.06221v6" color="#236c67">Foundations of Structural Causal Models with Cycles and Latent Variables</link>, sections 5 and 8.', "SmallR"),
    p('Geiger et al. (2025), <link href="https://jmlr.org/papers/v26/23-0058.html" color="#236c67">Causal Abstraction</link>, Definitions 25 and 38. Steggles (2011), <link href="https://publications.info.uaic.ro/files/sacs/XXI2/XXI2_3.pdf" color="#236c67">Abstracting Asynchronous Multi-Valued Networks</link>, Definition 15.', "SmallR"),
    box("Next: characterize safe abstractions for fixed installed mechanisms when the universal graph test fails, and optimize genuinely partial refinements rather than retaining whole components."),
    Spacer(1, 9),
    p("Companion files: theorem.md; minimal-counterexample.md; retention.md; PRIOR-WORK.md; PROOF-REVIEW.md; enumerate_models.py; independent_check.py; exact JSON reports. The full proofs and verification scope are in those files.", "SmallR"),
]

doc = SimpleDocTemplate(str(HERE / "research-brief.pdf"), pagesize=A4,
                        leftMargin=44, rightMargin=44, topMargin=42, bottomMargin=48,
                        title="Reciprocity without losing causality",
                        author="Research memorandum", subject="Finite causal abstraction: first research pass")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(HERE / "research-brief.pdf")
