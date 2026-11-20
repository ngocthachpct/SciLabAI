import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { config as loadEnv } from "dotenv";

loadEnv();

const DEFAULT_SIMS = JSON.parse(
  readFileSync(new URL("../lib/sim-defaults.json", import.meta.url), "utf8")
);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Thieu DATABASE_URL. Hay cau hinh .env truoc (xem .env.example).");
  process.exit(1);
}

const sql = neon(url);

const DEMO_LESSONS = [
  {
    id: "hh8-1",
    grade: "8",
    subject: "chemistry",
    title: "Hiđrô và tính chất của hiđrô",
    note: "Bài mẫu: thử phản ứng của kim loại với axit loãng và nhận biết khí H2.",
    pairs: [["hcl", "zn"], ["hcl", "mg"], ["h2so4", "mg"], ["h2so4", "fe"], ["cu", "hcl"]],
    summary: "Hiđrô là khí không màu, nhẹ nhất, cháy được với ngọn lửa xanh. Kim loại đứng trước hiđrô trong dãy hoạt động hóa học có thể đẩy hiđrô ra khỏi axit loãng.",
    sections: [
      { heading: "Tính chất vật lý", body: "H2 không màu, không mùi, ít tan trong nước, nhẹ hơn không khí. Khí H2 cháy với ngọn lửa xanh, tỏa nhiệt, tạo thành nước.", tip: "Khi đốt H2 cần kiểm tra độ tinh khiết để tránh nổ." },
      { heading: "Điều chế trong phòng thí nghiệm", body: "Cho kim loại như Zn, Mg tác dụng với axit HCl hoặc H2SO4 loãng. Ví dụ: Zn + 2HCl → ZnCl2 + H2↑.", tip: "Không dùng axit đặc HNO3 vì có tính oxi hóa mạnh, không giải phóng H2." },
      { heading: "Thử khí hiđrô", body: "Đưa que diêm đang cháy lại gần miệng ống nghiệm: khí H2 cháy với tiếng nổ nhẹ nếu hỗn hợp có lẫn không khí." },
    ],
    remember: ["H2 nhẹ hơn không khí", "Cháy tạo H2O", "Zn + 2HCl → ZnCl2 + H2↑", "Cu không tác dụng với HCl loãng"],
    cards: [
      { front: "Khí H2 có màu gì?", back: "Không màu, không mùi.", tag: "Lý thuyết" },
      { front: "Sản phẩm khi cháy H2 trong không khí?", back: "Nước (H2O) và tỏa nhiệt.", tag: "Công thức" },
      { front: "Viết phản ứng Zn với HCl loãng", back: "Zn + 2HCl → ZnCl2 + H2↑", tag: "Công thức" },
      { front: "Vì sao Cu không phản ứng với HCl loãng?", back: "Cu đứng sau H trong dãy hoạt động hóa học.", tag: "Lý thuyết" },
      { front: "Cách thử khí H2?", back: "Đưa ngọn lửa lại gần: cháy với tiếng nổ nhẹ.", tag: "Thí nghiệm" },
    ],
  },
  {
    id: "hh8-2",
    grade: "8",
    subject: "chemistry",
    title: "Axit và muối cacbonat",
    note: "Bài mẫu: nhận biết khí CO2 bằng nước vôi trong khi axit tác dụng với cacbonat.",
    pairs: [["hcl", "na2co3"], ["h2so4", "na2co3"], ["hcl", "nacl"]],
    summary: "Axit tác dụng với muối cacbonat tạo muối mới, nước và khí CO2. Khí CO2 làm đục nước vôi trong do tạo canxi cacbonat không tan.",
    sections: [
      { heading: "Phản ứng đặc trưng", body: "Na2CO3 + 2HCl → 2NaCl + H2O + CO2↑. Hiện tượng: sủi bọt khí không màu, không mùi.", tip: "Có khí thoát ra là dấu hiệu nhận biết nhóm CO3^2-." },
      { heading: "Thử CO2", body: "Dẫn khí vào nước vôi trong Ca(OH)2: dung dịch bị đục do CaCO3 kết tủa. CO2 + Ca(OH)2 → CaCO3↓ + H2O." },
      { heading: "So sánh với NaCl", body: "NaCl là muối trung tính, không chứa ion cacbonat nên không sủi bọt khi thêm HCl loãng." },
    ],
    remember: ["Có CO3^2- + axit → CO2↑", "CO2 làm đục nước vôi trong", "Na2CO3 + 2HCl → 2NaCl + H2O + CO2↑", "NaCl + HCl không phản ứng"],
    cards: [
      { front: "Hiện tượng khi thêm HCl vào Na2CO3?", back: "Sủi bọt khí CO2.", tag: "Thí nghiệm" },
      { front: "Viết phản ứng H2SO4 với Na2CO3", back: "Na2CO3 + H2SO4 → Na2SO4 + H2O + CO2↑", tag: "Công thức" },
      { front: "Thử khí CO2 bằng gì?", back: "Nước vôi trong, bị đục.", tag: "Thí nghiệm" },
      { front: "HCl + NaCl có phản ứng không?", back: "Không, cùng ion Cl- nên không tạo chất mới.", tag: "Không phản ứng" },
    ],
  },
  {
    id: "hh8-3",
    grade: "8",
    subject: "chemistry",
    title: "Sắt và hợp chất của sắt",
    note: "Bài mẫu: sắt tác dụng với axit, đẩy đồng ra khỏi dung dịch muối và tạo kết tủa Fe(OH)3.",
    pairs: [["fe", "hcl"], ["cuso4", "fe"], ["fecl3", "naoh"], ["fe", "zn"]],
    summary: "Sắt là kim loại hoạt động trung bình. Sắt tác dụng với axit loãng giải phóng H2, đẩy đồng ra khỏi dung dịch CuSO4. Ion Fe3+ tạo kết tủa nâu đỏ với NaOH.",
    sections: [
      { heading: "Sắt với axit", body: "Fe + 2HCl → FeCl2 + H2↑. Sản phẩm là muối sắt(II), dung dịch có màu xanh nhạt.", tip: "Sắt không đẩy được kẽm vì Zn hoạt động mạnh hơn Fe." },
      { heading: "Sắt với muối đồng", body: "Fe + CuSO4 → FeSO4 + Cu. Đồng bám vào thanh sắt, dung dịch xanh dần nhạt đi." },
      { heading: "Phản ứng của FeCl3", body: "FeCl3 + 3NaOH → Fe(OH)3↓ + 3NaCl. Kết tủa Fe(OH)3 màu nâu đỏ." },
    ],
    remember: ["Fe + 2HCl → FeCl2 + H2↑", "Fe đẩy Cu khỏi CuSO4", "Fe(OH)3 kết tủa nâu đỏ", "Fe không đẩy Zn"],
    cards: [
      { front: "Fe + HCl tạo muối gì?", back: "FeCl2 (sắt II) và H2.", tag: "Công thức" },
      { front: "Cho thanh sắt vào CuSO4 thấy gì?", back: "Có đồng đỏ bám, dung dịch nhạt màu xanh.", tag: "Thí nghiệm" },
      { front: "Màu kết tủa Fe(OH)3?", back: "Nâu đỏ.", tag: "Lý thuyết" },
      { front: "Fe có đẩy được Zn khỏi ZnSO4 không?", back: "Không, Zn mạnh hơn Fe.", tag: "Không phản ứng" },
    ],
  },
  {
    id: "hh9-1",
    grade: "9",
    subject: "chemistry",
    title: "Axit, bazơ và muối",
    note: "Bài mẫu: phản ứng trung hòa và các phép thử ion Cl-, SO4^2- bằng kết tủa đặc trưng.",
    pairs: [["hcl", "naoh"], ["h2so4", "naoh"], ["agno3", "hcl"], ["bacl2", "h2so4"], ["agno3", "nacl"], ["nacl", "naoh"]],
    summary: "Axit tác dụng với bazơ tạo muối và nước. Ion Cl- được nhận biết bằng AgNO3 tạo AgCl trắng; ion SO4^2- được nhận biết bằng BaCl2 tạo BaSO4 trắng không tan trong axit.",
    sections: [
      { heading: "Trung hòa", body: "HCl + NaOH → NaCl + H2O. Dùng chỉ thị màu để nhận biết điểm trung hòa.", tip: "Phản ứng trung hòa luôn tạo muối và nước." },
      { heading: "Nhận biết Cl-", body: "AgNO3 + NaCl → AgCl↓ + NaNO3. Kết tủa AgCl màu trắng, không tan trong HNO3." },
      { heading: "Nhận biết SO4^2-", body: "BaCl2 + H2SO4 → BaSO4↓ + 2HCl. Kết tủa trắng BaSO4 không tan trong axit." },
    ],
    remember: ["Axit + bazơ → muối + nước", "AgCl: kết tủa trắng", "BaSO4: kết tủa trắng không tan axit", "NaCl + NaOH không phản ứng"],
    cards: [
      { front: "Sản phẩm của HCl + NaOH?", back: "NaCl và H2O.", tag: "Công thức" },
      { front: "Thuốc thử nhận biết ion Cl-?", back: "Dung dịch AgNO3, tạo AgCl trắng.", tag: "Thí nghiệm" },
      { front: "Thuốc thử nhận biết ion SO4^2-?", back: "Dung dịch BaCl2, tạo BaSO4 trắng.", tag: "Thí nghiệm" },
      { front: "NaCl + NaOH có phản ứng không?", back: "Không, không tạo khí/kết tủa/nước.", tag: "Không phản ứng" },
    ],
  },
  {
    id: "hh9-2",
    grade: "9",
    subject: "chemistry",
    title: "Tính chất hóa học của muối",
    note: "Bài mẫu: phản ứng trao đổi giữa các dung dịch muối tạo kết tủa và phản ứng với axit.",
    pairs: [["cuso4", "naoh"], ["agno3", "nacl"], ["bacl2", "na2co3"], ["caoh2", "na2co3"], ["hcl", "na2co3"], ["fecl3", "naoh"], ["bacl2", "h2so4"]],
    summary: "Muối có thể phản ứng với bazơ, axit hoặc muối khác theo cơ chế trao đổi ion. Phản ứng xảy ra khi tạo kết tủa, khí hoặc nước.",
    sections: [
      { heading: "Muối + bazơ", body: "CuSO4 + 2NaOH → Cu(OH)2↓ + Na2SO4. Cu(OH)2 có màu xanh dương.", tip: "Nhớ màu kết tủa để nhận nhanh ion kim loại." },
      { heading: "Muối + muối", body: "AgNO3 + NaCl → AgCl↓ + NaNO3; BaCl2 + Na2CO3 → BaCO3↓ + 2NaCl." },
      { heading: "Muối + axit", body: "Na2CO3 + 2HCl → 2NaCl + H2O + CO2↑. Có khí CO2 thoát ra." },
    ],
    remember: ["Điều kiện: có kết tủa/khí/nước", "Cu(OH)2 xanh dương", "AgCl trắng", "BaCO3 trắng"],
    cards: [
      { front: "Màu kết tủa Cu(OH)2?", back: "Xanh dương.", tag: "Lý thuyết" },
      { front: "AgNO3 + NaCl tạo kết tủa gì?", back: "AgCl màu trắng.", tag: "Công thức" },
      { front: "BaCl2 + Na2CO3 tạo gì?", back: "BaCO3 kết tủa trắng.", tag: "Công thức" },
      { front: "Điều kiện phản ứng trao đổi trong dung dịch?", back: "Tạo kết tủa, khí hoặc nước.", tag: "Lý thuyết" },
    ],
  },
  {
    id: "hh9-3",
    grade: "9",
    subject: "chemistry",
    title: "Dãy hoạt động hóa học của kim loại",
    note: "Bài mẫu: kim loại mạnh đẩy kim loại yếu ra khỏi dung dịch muối và tác dụng với axit.",
    pairs: [["cuso4", "fe"], ["cuso4", "zn"], ["zn", "agno3"], ["hcl", "zn"], ["hcl", "mg"], ["cu", "h2so4"]],
    summary: "Kim loại đứng trước trong dãy hoạt động hóa học có khả năng đẩy kim loại đứng sau ra khỏi dung dịch muối của chúng. Kim loại đứng trước H tác dụng được với axit loãng.",
    sections: [
      { heading: "Dãy hoạt động", body: "K, Na, Ca, Mg, Al, Zn, Fe, Sn, Pb, (H), Cu, Hg, Ag, Au. Càng đứng đầu, kim loại càng hoạt động mạnh.", tip: "Chỉ cần nhớ các mốc chính: Mg, Zn, Fe, H, Cu, Ag." },
      { heading: "Phản ứng thế", body: "Zn + CuSO4 → ZnSO4 + Cu; Fe + CuSO4 → FeSO4 + Cu. Kim loại yếu hơn bị đẩy ra dưới dạng đơn chất." },
      { heading: "Với axit", body: "Mg và Zn phản ứng mạnh với HCl loãng giải phóng H2. Cu đứng sau H nên không phản ứng với HCl loãng." },
    ],
    remember: ["Zn > Fe > H > Cu > Ag", "Kim loại trước đẩy kim loại sau", "Trước H mới tác dụng axit loãng", "Cu không tác dụng HCl loãng"],
    cards: [
      { front: "Fe có đẩy Cu khỏi CuSO4 không?", back: "Có, vì Fe hoạt động mạnh hơn Cu.", tag: "Lý thuyết" },
      { front: "Zn + CuSO4 → ?", back: "ZnSO4 + Cu", tag: "Công thức" },
      { front: "Kim loại nào tác dụng với HCl loãng: Cu hay Zn?", back: "Zn (đứng trước H).", tag: "Lý thuyết" },
      { front: "Ag có đẩy Cu khỏi CuSO4 không?", back: "Không, Ag yếu hơn Cu.", tag: "Không phản ứng" },
    ],
  },
  {
    id: "vl8-1",
    grade: "8",
    subject: "physics",
    title: "Lực và chuyển động",
    note: "Bài mẫu lý thuyết Lý 8: biểu diễn lực, cân bằng lực và định luật I Newton.",
    pairs: [],
    summary: "Lực là tác dụng của vật này lên vật khác, có thể làm vật biến dạng hoặc thay đổi vận tốc. Hai lực cân bằng cùng tác dụng lên một vật thì vật giữ nguyên trạng thái nghỉ hoặc chuyển động thẳng đều.",
    sections: [
      { heading: "Biểu diễn lực", body: "Lực được biểu diễn bằng mũi tên: gốc là điểm đặt, hướng là hướng tác dụng, độ dài tỉ lệ với độ lớn lực. Đơn vị là niuton (N).", tip: "Khi vẽ lực, luôn ghi rõ điểm đặt và hướng." },
      { heading: "Hai lực cân bằng", body: "Hai lực cân bằng phải cùng tác dụng lên một vật, cùng đường tác dụng, ngược hướng và có độ lớn bằng nhau." },
      { heading: "Định luật I Newton", body: "Nếu không có lực hoặc tổng các lực tác dụng lên vật bằng 0, vật tiếp tục đứng yên hoặc chuyển động thẳng đều." },
    ],
    remember: ["Đơn vị lực: N", "Cân bằng: cùng vật, cùng đường, ngược hướng, bằng nhau", "Lực có thể làm biến dạng", "Lực có thể đổi vận tốc"],
    cards: [
      { front: "Đơn vị đo lực là gì?", back: "Niuton (N).", tag: "Lý thuyết" },
      { front: "Điều kiện để hai lực cân bằng?", back: "Cùng vật, cùng đường tác dụng, ngược hướng, độ lớn bằng nhau.", tag: "Lý thuyết" },
      { front: "Lực có thể gây ra những tác dụng gì?", back: "Làm vật biến dạng hoặc thay đổi vận tốc.", tag: "Lý thuyết" },
      { front: "Vật chuyển động thẳng đều khi nào?", back: "Khi tổng các lực tác dụng lên vật bằng 0.", tag: "Công thức" },
    ],
  },
  {
    id: "vl8-2",
    grade: "8",
    subject: "physics",
    title: "Áp suất và lực đẩy Ác-si-mét",
    note: "Bài mẫu lý thuyết Lý 8: áp suất, công thức p = F/S và điều kiện nổi – chìm.",
    pairs: [],
    summary: "Áp suất bằng lực ép vuông góc trên một đơn vị diện tích. Vật chìm trong chất lỏng chịu lực đẩy Ác-si-mét hướng thẳng đứng lên, có độ lớn bằng trọng lượng chất lỏng bị chiếm chỗ.",
    sections: [
      { heading: "Áp suất", body: "p = F/S, đơn vị là niuton trên mét vuông (N/m²) hay pascal (Pa). Giảm diện tích bị ép thì áp suất tăng.", tip: "Dao sắc cắt dễ hơn vì diện tích tiếp xúc nhỏ." },
      { heading: "Áp suất chất lỏng", body: "p = d·h (với d là trọng lượng riêng, h là độ sâu). Áp suất tăng theo độ sâu, không phụ thuộc hình dạng bình chứa." },
      { heading: "Lực đẩy Ác-si-mét", body: "Fđ = d·V, hướng thẳng đứng lên. Vật nổi khi Fđ ≥ P; chìm khi Fđ < P." },
    ],
    remember: ["p = F/S", "Đơn vị áp suất: Pa", "p = d·h", "Fđ = d·V"],
    cards: [
      { front: "Công thức áp suất?", back: "p = F/S.", tag: "Công thức" },
      { front: "Áp suất tăng khi nào?", back: "Tăng lực ép hoặc giảm diện tích bị ép.", tag: "Lý thuyết" },
      { front: "Công thức lực đẩy Ác-si-mét?", back: "Fđ = d·V.", tag: "Công thức" },
      { front: "Điều kiện vật nổi?", back: "Lực đẩy Ác-si-mét không nhỏ hơn trọng lượng vật.", tag: "Lý thuyết" },
    ],
  },
  {
    id: "vl9-1",
    grade: "9",
    subject: "physics",
    title: "Điện học: Định luật Ôm",
    note: "Bài mẫu lý thuyết Lý 9: cường độ dòng điện, hiệu điện thế, điện trở và định luật Ôm.",
    pairs: [],
    summary: "Cường độ dòng điện tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của dây, với điều kiện nhiệt độ không đổi.",
    sections: [
      { heading: "Các đại lượng", body: "Cường độ dòng điện I đo bằng ampe kế, đơn vị A. Hiệu điện thế U đo bằng vôn kế, đơn vị V. Điện trở R đo bằng ôm kế, đơn vị Ω.", tip: "Ampe kế mắc nối tiếp, vôn kế mắc song song." },
      { heading: "Định luật Ôm", body: "I = U/R. Nếu U tăng thì I tăng; nếu R tăng thì I giảm (nhiệt độ không đổi)." },
      { heading: "Điện trở dây dẫn", body: "R = ρ·l/S. Dây dài hơn thì điện trở lớn hơn; dây tiết diện lớn hơn thì điện trở nhỏ hơn." },
    ],
    remember: ["I = U/R", "Đơn vị: A, V, Ω", "Ampe kế nối tiếp", "Vôn kế song song"],
    cards: [
      { front: "Phát biểu định luật Ôm?", back: "I = U/R với nhiệt độ không đổi.", tag: "Công thức" },
      { front: "Ampe kế mắc thế nào trong mạch?", back: "Nối tiếp với đoạn mạch cần đo.", tag: "Lý thuyết" },
      { front: "Vôn kế mắc thế nào?", back: "Song song với hai đầu đoạn mạch.", tag: "Lý thuyết" },
      { front: "Điện trở dây dẫn phụ thuộc vào gì?", back: "Chiều dài, tiết diện, vật liệu và nhiệt độ.", tag: "Công thức" },
    ],
  },
  {
    id: "vl9-2",
    grade: "9",
    subject: "physics",
    title: "Quang học: Thấu kính hội tụ",
    note: "Bài mẫu lý thuyết Lý 9: tính chất ảnh tạo bởi thấu kính hội tụ và công thức thấu kính.",
    pairs: [],
    summary: "Thấu kính hội tụ làm tụtia sáng song song về điểm tiêu. Tùy vị trí vật so với tiêu điểm mà ảnh tạo ra có thể thật hoặc ảo, lớn hơn hoặc nhỏ hơn vật.",
    sections: [
      { heading: "Điểm tiêu và tiêu cự", body: "Tia sáng song song với trục chính sau khi đi qua thấu kính hội tụ sẽ đi qua tiêu điểm F. Khoảng cách từ quang tâm O đến F là tiêu cự f.", tip: "Ba tia đặc trưng giúp dựng ảnh nhanh." },
      { heading: "Dựng ảnh", body: "Tia qua quang tâm đi thẳng; tia song song trục chính đi qua F; tia qua F đi song song trục chính. Giao điểm của các tia cho biết vị trí ảnh." },
      { heading: "Công thức thấu kính", body: "1/f = 1/u + 1/v, với u là khoảng cách vật, v là khoảng cách ảnh. Ảnh thật có v dương theo quy ước đơn giản ở lớp 9." },
    ],
    remember: ["Thấu kính hội tụ có f > 0", "Vật ngoài 2F cho ảnh thật, nhỏ hơn", "Vật trong F cho ảnh ảo, lớn hơn", "1/f = 1/u + 1/v"],
    cards: [
      { front: "Tia song song trục chính đi qua thấu kính hội tụ thì đi đâu?", back: "Đi qua tiêu điểm F.", tag: "Lý thuyết" },
      { front: "Công thức thấu kính?", back: "1/f = 1/u + 1/v.", tag: "Công thức" },
      { front: "Đặt vật trong khoảng OF thì ảnh thế nào?", back: "Ảnh ảo, cùng chiều, lớn hơn vật.", tag: "Lý thuyết" },
      { front: "Đặt vật ngoài 2F thì ảnh thế nào?", back: "Ảnh thật, ngược chiều, nhỏ hơn vật.", tag: "Lý thuyết" },
    ],
  },
  {
    id: "toan8-1",
    grade: "8",
    subject: "math",
    title: "Hằng đẳng thức đáng nhớ",
    note: "Bài mẫu Toán 8: bảy hằng đẳng thức và cách vận dụng vào rút gọn biểu thức.",
    pairs: [],
    summary: "Hằng đẳng thức đáng nhớ là các đẳng thức được sử dụng nhiều để nhân đơn thức, bình phương, lập phương và phân tích đa thức thành nhân tử.",
    sections: [
      { heading: "Bình phương của tổng và hiệu", body: "(a + b)² = a² + 2ab + b²; (a - b)² = a² - 2ab + b². Nhớ dấu của số hạng giữa.", tip: "Số hạng giữa bằng 2 lần tích của hai số." },
      { heading: "Hiệu hai bình phương", body: "a² - b² = (a - b)(a + b). Đây là công cụ phân tích nhân tử rất hay dùng." },
      { heading: "Lập phương", body: "(a + b)³ = a³ + 3a²b + 3ab² + b³; (a - b)³ = a³ - 3a²b + 3ab² - b³." },
    ],
    remember: ["(a+b)² = a²+2ab+b²", "(a-b)² = a²-2ab+b²", "a²-b² = (a-b)(a+b)", "a³+b³ = (a+b)(a²-ab+b²)"],
    cards: [
      { front: "Viết (x + 3)²", back: "x² + 6x + 9.", tag: "Công thức" },
      { front: "Phân tích x² - 25", back: "(x - 5)(x + 5).", tag: "Bài tập" },
      { front: "Công thức a³ - b³?", back: "(a - b)(a² + ab + b²).", tag: "Công thức" },
      { front: "Tính nhanh 99²", back: "(100 - 1)² = 9801.", tag: "Ví dụ" },
    ],
  },
  {
    id: "toan8-2",
    grade: "8",
    subject: "math",
    title: "Phương trình bậc nhất một ẩn",
    note: "Bài mẫu Toán 8: quy tắc chuyển vế, giải phương trình và bài toán có lời văn.",
    pairs: [],
    summary: "Phương trình bậc nhất một ẩn có dạng ax + b = 0 (a ≠ 0). Ta dùng các phép biến đổi tương đương để đưa về dạng x = -b/a.",
    sections: [
      { heading: "Dạng tổng quát", body: "ax + b = 0 với a ≠ 0 có nghiệm duy nhất x = -b/a. Nếu a = 0 cần xét riêng.", tip: "Luôn kiểm tra điều kiện a ≠ 0." },
      { heading: "Quy tắc chuyển vế", body: "Chuyển một hạng số từ vế này sang vế kia thì đổi dấu. Nhân hoặc chia cả hai vế cho cùng một số khác 0 thì được phương trình tương đương." },
      { heading: "Bài toán có lời văn", body: "Gọi ẩn, lập phương trình theo mối quan hệ đề bài, giải và kiểm tra điều kiện thực tế của nghiệm." },
    ],
    remember: ["ax + b = 0, a ≠ 0", "x = -b/a", "Chuyển vế đổi dấu", "Kiểm tra nghiệm"],
    cards: [
      { front: "Giải 3x - 6 = 0", back: "x = 2.", tag: "Bài tập" },
      { front: "Nghiệm của ax + b = 0?", back: "x = -b/a (a ≠ 0).", tag: "Công thức" },
      { front: "Khi chuyển vế thì làm gì với dấu?", back: "Đổi dấu số hạng được chuyển.", tag: "Lý thuyết" },
      { front: "Vì sao phải kiểm tra nghiệm trong bài toán thực tế?", back: "Nghiệm âm hoặc không nguyên có thể không phù hợp với đề.", tag: "Lý thuyết" },
    ],
  },
  {
    id: "toan9-1",
    grade: "9",
    subject: "math",
    title: "Hàm số bậc nhất và đồ thị",
    note: "Bài mẫu Toán 9: hàm số y = ax + b, tính đồng biến – nghịch biến và cách vẽ đồ thị.",
    pairs: [],
    summary: "Hàm số bậc nhất có dạng y = ax + b (a ≠ 0), đồ thị là một đường thẳng. Hệ số a quyết định chiều biến thiên, b quyết định giao điểm với trục tung.",
    sections: [
      { heading: "Đồ thị", body: "Đồ thị của y = ax + b là đường thẳng cắt trục tung tại điểm (0; b). Để vẽ, lấy thêm một điểm nữa rồi nối hai điểm.", tip: "Chọn x = 0 và x = 1 để tính nhanh." },
      { heading: "Chiều biến thiên", body: "Nếu a > 0, hàm số đồng biến trên R. Nếu a < 0, hàm số nghịch biến trên R." },
      { heading: "Giao điểm với trục hoành", body: "Cho y = 0 thì ax + b = 0, suy ra x = -b/a. Đó là hoành độ giao điểm với trục Ox." },
    ],
    remember: ["y = ax + b, a ≠ 0", "a > 0: đồng biến", "a < 0: nghịch biến", "Cắt Oy tại (0; b)"],
    cards: [
      { front: "Đồ thị hàm số bậc nhất là gì?", back: "Một đường thẳng.", tag: "Lý thuyết" },
      { front: "Hàm số y = -2x + 3 đồng biến hay nghịch biến?", back: "Nghịch biến vì a = -2 < 0.", tag: "Ví dụ" },
      { front: "Đồ thị cắt trục tung tại điểm nào?", back: "(0; b).", tag: "Công thức" },
      { front: "Tìm hoành độ giao điểm với Ox của y = 2x - 4", back: "x = 2.", tag: "Bài tập" },
    ],
  },
  {
    id: "toan9-2",
    grade: "9",
    subject: "math",
    title: "Hệ thức lượng trong tam giác vuông",
    note: "Bài mẫu Toán 9: định lý Pythagore, hệ thức đường cao và tỉ số lượng giác.",
    pairs: [],
    summary: "Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông. Đường cao từ đỉnh góc vuông và các tỉ số lượng giác cho phép giải tam giác vuông.",
    sections: [
      { heading: "Định lý Pythagore", body: "a² + b² = c², với c là cạnh huyền. Đây là nền tảng để tính cạnh còn biết hai cạnh.", tip: "Xác định đúng cạnh huyền (đối diện góc vuông)." },
      { heading: "Hệ thức đường cao", body: "Nếu h là đường cao từ đỉnh góc vuông chia cạnh huyền thành p và q thì h² = p·q, a² = c·p, b² = c·q." },
      { heading: "Tỉ số lượng giác", body: "sin A = đối/huyền, cos A = kề/huyền, tan A = đối/kề, cot A = kề/đối." },
    ],
    remember: ["a² + b² = c²", "h² = p·q", "sin A = đối/huyền", "tan A = đối/kề"],
    cards: [
      { front: "Tam giác vuông có hai cạnh góc vuông 3 và 4, cạnh huyền?", back: "5.", tag: "Bài tập" },
      { front: "Hệ thức đường cao h² bằng gì?", back: "p·q (hai đoạn cạnh huyền).", tag: "Công thức" },
      { front: "sin A trong tam giác vuông?", back: "Cạnh đối chia cạnh huyền.", tag: "Công thức" },
      { front: "tan A bằng gì?", back: "Cạnh đối chia cạnh kề.", tag: "Công thức" },
    ],
  },
];

function simFor(lesson) {
  return lesson.subject === "chemistry" ? undefined : DEFAULT_SIMS[lesson.id];
}

function theoryPayload(lesson) {
  return {
    kind: "theory",
    title: lesson.title,
    note: lesson.note,
    pairs: [],
    sim: simFor(lesson),
    grade: lesson.grade,
    subject: lesson.subject,
    theory: {
      summary: lesson.summary,
      sections: lesson.sections,
      remember: lesson.remember,
    },
  };
}

function flashcardsPayload(lesson) {
  return {
    kind: "flashcards",
    title: `Flashcard — ${lesson.title}`,
    note: lesson.note,
    pairs: [],
    sim: simFor(lesson),
    grade: lesson.grade,
    subject: lesson.subject,
    cards: lesson.cards.map((card, index) => ({
      ...card,
      id: `demo-${lesson.id}-c${index + 1}`,
    })),
  };
}

function labPayload(lesson) {
  return {
    kind: "lab",
    title: `Lab — ${lesson.title}`,
    note: lesson.note,
    pairs: lesson.pairs.map(([a, b]) => ({ a, b })),
    sim: simFor(lesson),
    grade: lesson.grade,
    subject: lesson.subject,
  };
}

let count = 0;
for (const lesson of DEMO_LESSONS) {
  const kinds = [
    { kind: "theory", payload: theoryPayload(lesson) },
    { kind: "flashcards", payload: flashcardsPayload(lesson) },
  ];
  if (lesson.pairs.length > 0 || DEFAULT_SIMS[lesson.id]) {
    kinds.push({ kind: "lab", payload: labPayload(lesson) });
  }

  for (const row of kinds) {
    const seedKey = `demo:${lesson.id}:${row.kind}`;
    const bundleId = `demo:${lesson.id}`;
    await sql`
      INSERT INTO lesson_content
        (lesson_id, owner_user_id, grade, subject, source, kind, file_name, payload, created_at, seed_key, bundle_id)
      VALUES
        (${lesson.id}, NULL, ${lesson.grade}, ${lesson.subject}, 'demo', ${row.kind}, NULL, ${JSON.stringify(row.payload)}::jsonb, NOW(), ${seedKey}, ${bundleId})
      ON CONFLICT (seed_key) WHERE seed_key IS NOT NULL DO UPDATE SET
        lesson_id = EXCLUDED.lesson_id,
        grade = EXCLUDED.grade,
        subject = EXCLUDED.subject,
        kind = EXCLUDED.kind,
        payload = EXCLUDED.payload,
        bundle_id = EXCLUDED.bundle_id,
        created_at = NOW()
    `;
    count += 1;
  }
}

console.log(`Da seed ${count} bai mau vao lesson_content.`);
