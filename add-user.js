const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Membaca kredensial dari .env.local secara manual
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const key = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || !key) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL atau ANON_KEY tidak ditemukan di .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function addStudent() {
  // Mengambil argumen dari command line
  // Format: node add-user.js <Nama> <NIS> <Kelas> <Password>
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log("⚠️ Penggunaan:");
    console.log("node add-user.js \"Nama Siswa\" \"NIS\" \"Kelas\" \"Password\"");
    console.log("\nContoh:");
    console.log("node add-user.js \"Mawar Melati\" \"99999\" \"X IPA 1\" \"rahasia123\"");
    process.exit(1);
  }

  const [name, nis, studentClass, password] = args;

  console.log(`⏳ Memproses penambahan siswa: ${name} (${nis})...`);

  // Hash password menggunakan bcrypt
  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);

  // Simpan ke database Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: name,
        role: 'siswa',
        nis: nis,
        class: studentClass,
        password_hash: password_hash
      }
    ])
    .select();

  if (error) {
    console.error("❌ Gagal menambahkan siswa:");
    console.error(error.message);
  } else {
    console.log("✅ Berhasil! Siswa baru telah ditambahkan ke Supabase.");
    console.log("- Nama:", data[0].name);
    console.log("- NIS:", data[0].nis);
    console.log("- Kelas:", data[0].class);
  }
}

addStudent();
