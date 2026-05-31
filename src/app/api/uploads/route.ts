import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { maxImageUploadBytes, maxImageUploadMegabytes, supportedImageTypeLabel, supportedImageTypes } from "@/lib/upload-limits";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "electric-crew-images";

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase Storage needs SUPABASE_SERVICE_ROLE_KEY before file uploads can run." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file received." }, { status: 400 });
  }

  if (!supportedImageTypes.includes(file.type)) {
    return NextResponse.json({ error: `Use ${supportedImageTypeLabel}.` }, { status: 400 });
  }

  if (file.size > maxImageUploadBytes) {
    return NextResponse.json({ error: `Image must be ${maxImageUploadMegabytes} MB or smaller.` }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
