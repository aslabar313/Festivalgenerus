import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Read .env or .env.local manually if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      content.split("\n").forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) process.env[key] = value.trim();
        }
      });
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur di .env / .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const accounts = [
  {
    username: "superadmin",
    full_name: "Super Admin PPG",
    role: "admin",
    organization: "PPG Magetan Timur",
  },
  {
    username: "wakilketua",
    full_name: "Wakil Ketua Panitia",
    role: "admin",
    organization: "PPG Magetan Timur",
  },
  {
    username: "sekretaris",
    full_name: "Sekretaris Utama",
    role: "panitia",
    organization: "PPG Magetan Timur",
  },
  {
    username: "bendahara",
    full_name: "Bendahara Utama",
    role: "bendahara",
    organization: "PPG Magetan Timur",
  },
  {
    username: "timacara",
    full_name: "Tim Divisi Acara",
    role: "panitia",
    organization: "PPG Magetan Timur",
  },
];

const PASSWORD = "ppgmagtim123";

async function seedAccounts() {
  console.log("🚀 Menghubungkan ke Supabase & Mendaftarkan 5 Akun Utama...\n");

  for (const acc of accounts) {
    const syntheticEmail = `${acc.username}@festivalgenerus.internal`;
    console.log(`Mengirim pendaftaran untuk: ${acc.username} (${syntheticEmail})...`);

    const { data, error } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: PASSWORD,
      options: {
        data: {
          username: acc.username,
          full_name: acc.full_name,
          role: acc.role,
          organization: acc.organization,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("User already exists")) {
        console.log(`ℹ️  Akun "${acc.username}" sudah terdaftar.`);
      } else {
        console.error(`❌ Gagal mendaftarkan ${acc.username}:`, error.message);
      }
    } else {
      console.log(`✅ Berhasil mendaftarkan "${acc.username}"! ID: ${data.user?.id}`);
    }
  }

  console.log("\n🎉 Selesai! Semua 5 akun utama siap digunakan dengan kata sandi: " + PASSWORD);
}

seedAccounts();
