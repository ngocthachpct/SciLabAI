import { NextRequest, NextResponse } from "next/server";
import {
  CONTENT_KIND_LABEL_VI,
  ContentKindSchema,
  GradeSchema,
  LessonPayloadSchema,
  SubjectSchema,
  type ContentKind,
} from "@/lib/content";
import { getDb, DB_NOT_CONFIGURED_MESSAGE } from "@/lib/db";

export const runtime = "nodejs";

interface DemoRow {
  id: number;
  lesson_id: string | null;
  grade: string | null;
  subject: string | null;
  source: string;
  kind: string;
  file_name: string | null;
  payload: unknown;
  created_at: string;
}

/** GET /api/demo-contents?grade=&subject=&kind= — public sample lessons. */
export async function GET(req: NextRequest) {
  const grade = GradeSchema.safeParse(req.nextUrl.searchParams.get("grade"));
  const subject = SubjectSchema.safeParse(req.nextUrl.searchParams.get("subject"));
  const kind = ContentKindSchema.safeParse(req.nextUrl.searchParams.get("kind"));

  if (!grade.success || !subject.success || !kind.success) {
    return NextResponse.json(
      { error: "bad_query", message: "Cần grade / subject / kind hợp lệ." },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "no_database", message: DB_NOT_CONFIGURED_MESSAGE },
      { status: 503 }
    );
  }

  try {
    const rows = (await db`
      SELECT id, lesson_id, grade, subject, source, kind, file_name, payload, created_at
      FROM lesson_content
      WHERE source = 'demo'
        AND owner_user_id IS NULL
        AND grade = ${grade.data}
        AND subject = ${subject.data}
        AND kind = ${kind.data}
      ORDER BY created_at DESC, id DESC
      LIMIT 40
    `) as unknown as DemoRow[];

    return NextResponse.json({
      contents: rows.map((r) => {
        const parsed = LessonPayloadSchema.safeParse(r.payload);
        const k = (ContentKindSchema.safeParse(r.kind).success
          ? r.kind
          : "theory") as ContentKind;
        return {
          id: r.id,
          lesson_id: r.lesson_id,
          grade: r.grade,
          subject: r.subject,
          source: r.source,
          kind: k,
          kind_label: CONTENT_KIND_LABEL_VI[k],
          file_name: r.file_name,
          title: parsed.success ? parsed.data.title : "Bài mẫu",
          note: parsed.success ? parsed.data.note : "",
          created_at: r.created_at,
        };
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "db_error", message: "Không tải được bài mẫu." },
      { status: 500 }
    );
  }
}
