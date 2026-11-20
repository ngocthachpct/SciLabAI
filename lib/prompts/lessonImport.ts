import type {
  ContentKind,
  ContentSubject,
  CustomImportContext,
} from "@/lib/content";
import { SUBJECT_LABEL_VI, type Lesson } from "@/lib/lessons";
import { SIM_PARAM_META, SIM_TYPE_LABEL_VI, SIM_TYPE_SUBJECT } from "@/lib/sim";
import type { SimType } from "@/lib/sim";

/** Shared reagent catalog block for all chemistry import modes (ids must match lib/reagents.ts). */
export function reagentCatalogBlock(): string {
  return [
    "CATALOG HÓA CHẤT HỢP LỆ (CHỈ dùng id trong bảng này, không tự tạo id mới):",
    "id | formula | nameVi | group",
    "hcl | HCl | Axit clohiđric | acid_base",
    "h2so4 | H2SO4 | Axit sunfuric loãng | acid_base",
    "naoh | NaOH | Natri hiđroxit | acid_base",
    "caoh2 | Ca(OH)2 | Nước vôi trong | acid_base",
    "cuso4 | CuSO4 | Đồng(II) sunfat | salt",
    "bacl2 | BaCl2 | Bari clorua | salt",
    "na2co3 | Na2CO3 | Natri cacbonat | salt",
    "agno3 | AgNO3 | Bạc nitrat | salt",
    "nacl | NaCl | Natri clorua | salt",
    "fecl3 | FeCl3 | Sắt(III) clorua | salt",
    "fe | Fe | Sắt | metal",
    "zn | Zn | Kẽm | metal",
    "mg | Mg | Magie | metal",
    "cu | Cu | Đồng | metal",
  ].join("\n");
}

function lessonContext(lesson: Lesson): string {
  const pairs = lesson.defaultPairs.map(([a, b]) => `${a} + ${b}`).join("\n");
  return [
    `Bài học mục tiêu trong app:`,
    `- lesson_id: ${lesson.id}`,
    `- grade: ${lesson.grade}`,
    `- subject: ${lesson.subject} (${SUBJECT_LABEL_VI[lesson.subject]})`,
    `- title: ${lesson.title}`,
    `- description: ${lesson.description}`,
    lesson.defaultPairs.length > 0
      ? "- defaultPairs gợi ý (có thể điều chỉnh theo tài liệu, nhưng vẫn phải ∈ catalog):\n" +
        pairs
      : "- defaultPairs: không áp dụng cho môn này (pairs phải là []).",
  ].join("\n");
}

function customContext(ctx: CustomImportContext): string {
  return [
    "Ngữ cảnh bài tự tạo (không gắn bài SGK catalog):",
    `- grade: lớp ${ctx.grade}`,
    `- subject: ${ctx.subject} (${SUBJECT_LABEL_VI[ctx.subject]})`,
    `- kind: ${ctx.kind}`,
    "Đọc tài liệu và tạo nội dung phù hợp khối lớp + môn + chức năng; title/note do AI đặt theo tài liệu.",
  ].join("\n");
}

function sharedRules(subject: ContentSubject): string {
  const base = [
    `Bạn là giáo viên ${SUBJECT_LABEL_VI[subject]} THCS Việt Nam.`,
    "Chỉ dùng kiến thức đúng chương trình THCS; không bịa nội dung.",
    "Giọng thân thiện học sinh lớp 8–9, tiếng Việt.",
    "Chỉ trả về JSON thuần (không markdown, không giải thích ngoài JSON).",
  ];

  if (subject === "chemistry") {
    return [
      ...base,
      "Mọi id hóa chất phải thuộc catalog. pair dùng {\"a\":\"id\",\"b\":\"id\"}, a ≠ b.",
      "Không hướng dẫn điều chế chất nguy hiểm ngoài đời; chỉ giải thích bản chất.",
    ].join("\n");
  }

  return [
    ...base,
    "Môn này không dùng hóa chất: trường pairs phải là []; dùng trường sim cho thí nghiệm mô phỏng.",
    "Không đưa công thức, số liệu hoặc kết luận sai; ưu tiên giải thích trọng tâm và ví dụ chuẩn.",
  ].join("\n");
}

function simCatalogBlock(subject: ContentSubject): string {
  const types = (Object.keys(SIM_TYPE_SUBJECT) as SimType[])
    .filter((type) => SIM_TYPE_SUBJECT[type] === subject)
    .map((type) => {
      const params = SIM_PARAM_META[type]
        .map((p) => `${p.key} [${p.min}..${p.max}], bước ${p.step}${p.unit ? `, đơn vị ${p.unit}` : ""}`)
        .join("; ");
      return `- ${type} (${SIM_TYPE_LABEL_VI[type]}): ${params}`;
    });
  return [
    "CATALOG MÔ PHỎNG HỢP LỆ (chỉ chọn 1 type trong danh sách này):",
    ...types,
    "Trường sim gồm: type, params (đối tượng số các tham số ở trên), tasks (1–5 nhiệm vụ; mỗi task có id, prompt, target là tập tham số cần đạt, hint tùy chọn).",
    "Giá trị params phải nằm trong khoảng cho phép; target phải khớp với một bộ params cụ thể.",
  ].join("\n");
}

function simSchemaHint(subject: ContentSubject): Record<string, unknown> {
  const types = (Object.keys(SIM_TYPE_SUBJECT) as SimType[]).filter(
    (type) => SIM_TYPE_SUBJECT[type] === subject
  );
  const first = types[0] ?? "force-motion";
  return {
    type: types.join("|"),
    params: Object.fromEntries(
      SIM_PARAM_META[first].map((p) => [p.key, `số ${p.min}..${p.max}`])
    ),
    tasks: [
      {
        id: `${first}-01`,
        prompt: "Yêu cầu ngắn gọn bằng tiếng Việt ≤200",
        target: Object.fromEntries(
          SIM_PARAM_META[first].map((p) => [p.key, "số trong khoảng"])
        ),
        hint: "tùy chọn ≤200",
      },
    ],
  };
}

function schemaForKind(
  kind: ContentKind,
  cardIdPrefix: string,
  subject: ContentSubject
): string {
  const simHint = subject === "chemistry" ? undefined : simSchemaHint(subject);
  if (kind === "theory") {
    return JSON.stringify(
      {
        kind: "theory",
        title: "string ≤120",
        note: "string ≤600",
        grade: "8|9",
        subject,
        pairs: subject === "chemistry" ? [{ a: "reagent_id", b: "reagent_id" }] : [],
        sim: simHint,
        theory: {
          summary: "tóm tắt ≤800",
          sections: [{ heading: "≤120", body: "≤1200", tip: "optional ≤300" }],
          remember: ["điểm cần nhớ ≤200"],
        },
      },
      null,
      2
    );
  }
  if (kind === "flashcards") {
    return JSON.stringify(
      {
        kind: "flashcards",
        title: "Ôn tập — ...",
        note: "string ≤600",
        grade: "8|9",
        subject,
        pairs: subject === "chemistry" ? [{ a: "reagent_id", b: "reagent_id" }] : [],
        sim: simHint,
        cards: [
          {
            id: `${cardIdPrefix}-01`,
            front: "Câu hỏi ≤280?",
            back: "Đáp án ≤500",
            tag: "Lý thuyết|Thí nghiệm|Không phản ứng|An toàn|Quiz|Công thức|Bài tập|Ví dụ",
          },
        ],
      },
      null,
      2
    );
  }
  return JSON.stringify(
    {
      kind: "lab",
      title: "string ≤120",
      note: "string ≤600",
      grade: "8|9",
      subject,
      pairs: subject === "chemistry" ? [{ a: "reagent_id", b: "reagent_id" }] : [],
      sim: simHint,
    },
    null,
    2
  );
}

function taskForKind(kind: ContentKind, subject: ContentSubject): string[] {
  if (kind === "theory") {
    return [
      "CHỨC NĂNG: theory — tạo giáo án lý thuyết để lưu DB và trang Học lý thuyết tái sử dụng.",
      "Nhiệm vụ: đọc tài liệu, viết lý thuyết đúng trọng tâm (không lan man).",
      subject === "chemistry"
        ? "Đồng thời chọn 1–8 pairs thí nghiệm minh họa (nếu có) để sau này mở Lab."
        : "Không dùng pairs; kèm 1 đối tượng sim phù hợp để các chế độ học dùng chung.",
      "Yêu cầu theory.sections: 2–6 mục; theory.remember: 3–6 ý ngắn.",
    ];
  }
  if (kind === "flashcards") {
    return [
      "CHỨC NĂNG: flashcards — tạo bộ câu hỏi/đáp án flash card để lưu DB.",
      "Mỗi thẻ: front = CÂU HỎI rõ (không dùng 'Ghi nhớ #1'); back = đáp án + giải thích ngắn.",
      "Phân bố: 3–5 Lý thuyết, 3–6 bài tập/ví dụ (hoặc thí nghiệm nếu Hóa), 1–2 An toàn/Không phản ứng nếu có — tổng 8–14 thẻ.",
      subject === "chemistry"
        ? "Cũng trả pairs (1–12) để bộ nội dung dùng lại được ở Lab."
        : "Không dùng pairs; kèm 1 đối tượng sim phù hợp để chuyển sang Lab không tốn lượt AI.",
      "tag chỉ một trong: Lý thuyết | Thí nghiệm | Không phản ứng | An toàn | Quiz | Công thức | Bài tập | Ví dụ",
      subject === "chemistry"
        ? "Phương trình cân bằng; ↓ kết tủa; ↑ khí."
        : "Công thức và kết quả tính toán phải chính xác theo chương trình THCS.",
    ];
  }
  return [
    "CHỨC NĂNG: lab — tạo bộ thí nghiệm để lưu DB và mở Phòng thí nghiệm.",
    "Nhiệm vụ: đọc tài liệu, chọn 1–12 cặp thí nghiệm phù hợp.",
    "Ưu tiên hiện tượng rõ (kết tủa, khí, đổi màu, tỏa nhiệt). Có thể thêm ≤2 cặp không phản ứng.",
    subject === "chemistry"
      ? "Chỉ dùng hóa chất trong catalog."
      : "Chọn đúng 1 type trong CATALOG MÔ PHỎNG; params phải nằm trong khoảng; tạo 2–4 tasks với target khớp bộ params cụ thể; pairs phải là [].",
  ];
}

function assemblePrompt(
  kind: ContentKind,
  contextBlock: string,
  fileText: string,
  cardIdPrefix: string,
  subject: ContentSubject
): string {
  const blocks = [
    sharedRules(subject),
    "",
    ...taskForKind(kind, subject),
    "",
    contextBlock,
    "",
  ];

  if (subject === "chemistry") {
    blocks.push(reagentCatalogBlock(), "");
  } else {
    blocks.push(simCatalogBlock(subject), "");
  }

  blocks.push(
    "Schema JSON BẮT BUỘC (khớp lesson_content.payload):",
    schemaForKind(kind, cardIdPrefix, subject),
    "",
    "NỘI DUNG TÀI LIỆU:",
    "```",
    fileText,
    "```"
  );

  return blocks.join("\n");
}

/** Catalog-linked import. */
export function buildImportPrompt(
  kind: ContentKind,
  lesson: Lesson,
  fileText: string
): string {
  return assemblePrompt(
    kind,
    lessonContext(lesson),
    fileText.slice(0, 8000),
    lesson.id,
    lesson.subject
  );
}

/** Free-standing user content: grade + subject + kind + file (no catalog lesson). */
export function buildCustomImportPrompt(
  ctx: CustomImportContext,
  fileText: string
): string {
  return assemblePrompt(
    ctx.kind,
    customContext(ctx),
    fileText.slice(0, 8000),
    `u${ctx.grade}`,
    ctx.subject
  );
}

/**
 * Derive another kind from an existing saved payload (no original file).
 * Used when switching mode on an AI-created lesson.
 */
export function buildSiblingKindPrompt(
  targetKind: ContentKind,
  sourceJson: string,
  subject: ContentSubject
): string {
  const blocks = [
    sharedRules(subject),
    "",
    ...taskForKind(targetKind, subject),
    "",
    "Nhiệm vụ đặc biệt: dựa trên NỘI DUNG ĐÃ LƯU bên dưới (cùng một bài học của học sinh),",
    `tạo bản payload mới với kind="${targetKind}". Giữ title/note/grade/subject nhất quán nếu hợp lý.`,
    subject === "chemistry"
      ? "Tái sử dụng pairs đã có khi phù hợp; chỉ đổi/bổ sung nếu cần cho kind mới."
      : "Giữ pairs = []; tái sử dụng sim đã có nếu phù hợp, nếu không hãy tạo sim mới theo CATALOG MÔ PHỎNG.",
    "",
  ];

  if (subject === "chemistry") {
    blocks.push("Không bịa hóa chất ngoài catalog.", "", reagentCatalogBlock(), "");
  } else {
    blocks.push(simCatalogBlock(subject), "");
  }

  blocks.push(
    "Schema JSON BẮT BUỘC:",
    schemaForKind(targetKind, "sib", subject),
    "",
    "NỘI DUNG ĐÃ LƯU (JSON):",
    "```json",
    sourceJson.slice(0, 8000),
    "```"
  );

  return blocks.join("\n");
}
