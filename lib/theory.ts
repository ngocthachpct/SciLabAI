/**
 * Static SGK-aligned theory for each lesson (THCS tone, Vietnamese UI).
 * Mark uncertain chemistry with TODO(verify) in comments only.
 */

export interface TheorySection {
  heading: string;
  body: string;
  tip?: string;
}

export interface LessonTheory {
  lessonId: string;
  summary: string;
  sections: TheorySection[];
  remember: string[];
}

export const LESSON_THEORY: Record<string, LessonTheory> = {
  "hh8-1": {
    lessonId: "hh8-1",
    summary:
      "Hiđrô (H₂) là khí không màu, nhẹ hơn không khí. Ở phòng thí nghiệm, thường thu khí H₂ khi kim loại hoạt động mạnh tác dụng với axit loãng.",
    sections: [
      {
        heading: "Cách tạo khí hiđrô",
        body: "Kim loại đứng trước hiđrô trong dãy hoạt động (như Mg, Zn, Fe) tác dụng với axit loãng (HCl, H₂SO₄) tạo muối và khí H₂ sủi bọt. Ví dụ: Zn + 2HCl → ZnCl₂ + H₂↑.",
        tip: "Nhìn thấy bọt khí trắng mờ bay lên — đó chính là H₂ đang thoát ra.",
      },
      {
        heading: "Khi nào không có khí H₂?",
        body: "Kim loại đứng sau hiđrô (như Cu, Ag) không đẩy được H⁺ khỏi axit loãng ở điều kiện thường. Vì vậy Cu + HCl không phản ứng — không có bọt khí.",
      },
      {
        heading: "An toàn với khí H₂",
        body: "Khí hiđrô dễ cháy, hỗn hợp với không khí có thể nổ khi gặp lửa. Trong lab ảo chỉ quan sát; ngoài đời thật phải tránh nguồn lửa.",
      },
    ],
    remember: [
      "Kim loại mạnh + axit loãng → muối + H₂↑",
      "Cu không tạo H₂ với HCl loãng",
      "H₂ nhẹ hơn không khí và dễ cháy",
    ],
  },
  "hh8-2": {
    lessonId: "hh8-2",
    summary:
      "Muối cacbonat (CO₃²⁻) gặp axit sẽ tạo khí CO₂ — hiện tượng sủi bọt rất dễ nhận biết trong phòng thí nghiệm.",
    sections: [
      {
        heading: "Axit gặp muối cacbonat",
        body: "Axit cung cấp H⁺, muối cacbonat cung cấp CO₃²⁻. Hai ion này tạo thành H₂CO₃ rồi phân hủy thành CO₂↑ và H₂O. Ví dụ: Na₂CO₃ + 2HCl → 2NaCl + CO₂↑ + H₂O.",
        tip: "Thử thổi khí CO₂ vào nước vôi trong (Ca(OH)₂) — dung dịch sẽ đục vì tạo CaCO₃↓.",
      },
      {
        heading: "Không phải muối nào cũng sủi bọt",
        body: "Muối clorua như NaCl không có ion cacbonat nên gặp HCl không tạo CO₂. Không sủi bọt không có nghĩa thí nghiệm sai — đôi khi đúng là không phản ứng!",
      },
    ],
    remember: [
      "Axit + muối cacbonat → muối mới + CO₂↑ + H₂O",
      "Sủi bọt trắng = khí CO₂",
      "NaCl + HCl: không phản ứng đặc trưng",
    ],
  },
  "hh8-3": {
    lessonId: "hh8-3",
    summary:
      "Sắt (Fe) là kim loại hoạt động trung bình: tan trong axit loãng, đẩy được đồng khỏi muối đồng, và ion Fe³⁺ tạo kết tủa nâu đỏ với OH⁻.",
    sections: [
      {
        heading: "Sắt với axit",
        body: "Fe tác dụng với HCl loãng tạo FeCl₂ và khí H₂. Hiện tượng: sủi bọt, dung dịch dần đổi màu nhạt.",
      },
      {
        heading: "Sắt đẩy đồng",
        body: "Fe đứng trước Cu trong dãy hoạt động nên Fe + CuSO₄ → FeSO₄ + Cu↓. Dung dịch xanh của Cu²⁺ nhạt dần, đồng đỏ gạch bám trên thanh sắt.",
      },
      {
        heading: "Nhận biết Fe³⁺",
        body: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl. Kết tủa Fe(OH)₃ màu nâu đỏ là dấu hiệu đặc trưng của ion Fe³⁺.",
        tip: "Hai kim loại trộn với nhau (Fe + Zn) ở dạng rắn không phản ứng trong lab này.",
      },
    ],
    remember: [
      "Fe + axit loãng → muối sắt + H₂↑",
      "Fe đẩy Cu²⁺ khỏi dung dịch CuSO₄",
      "Fe(OH)₃↓ nâu đỏ nhận biết Fe³⁺",
    ],
  },
  "hh9-1": {
    lessonId: "hh9-1",
    summary:
      "Axit + bazơ → muối + nước (trung hòa, thường tỏa nhiệt). Muối có thể nhận biết bằng phản ứng tạo kết tủa đặc trưng với thuốc thử.",
    sections: [
      {
        heading: "Phản ứng trung hòa",
        body: "Ion H⁺ từ axit kết hợp với ion OH⁻ từ bazơ tạo nước: H⁺ + OH⁻ → H₂O. Ví dụ: HCl + NaOH → NaCl + H₂O. Cốc ấm lên vì phản ứng tỏa nhiệt.",
      },
      {
        heading: "Nhận biết ion bằng kết tủa",
        body: "Ag⁺ + Cl⁻ → AgCl↓ (trắng). Ba²⁺ + SO₄²⁻ → BaSO₄↓ (trắng). Đây là cách nhận biết ion clorua và sunfat trong chương trình THCS.",
      },
      {
        heading: "Khi trộn muối với bazơ cùng gốc?",
        body: "NaCl + NaOH không tạo kết tủa hay khí mới — hai chất này không phản ứng trao đổi đặc trưng ở điều kiện phòng.",
      },
    ],
    remember: [
      "Trung hòa: axit + bazơ → muối + H₂O (tỏa nhiệt)",
      "AgCl↓ trắng: có ion Cl⁻",
      "BaSO₄↓ trắng: có ion SO₄²⁻",
    ],
  },
  "hh9-2": {
    lessonId: "hh9-2",
    summary:
      "Muối có thể tham gia phản ứng trao đổi với bazơ hoặc muối khác nếu tạo ra kết tủa, khí hoặc chất điện li yếu.",
    sections: [
      {
        heading: "Điều kiện phản ứng trao đổi",
        body: "Hai dung dịch muối (hoặc muối–bazơ) phản ứng khi sản phẩm có kết tủa, khí hoặc nước. Ví dụ CuSO₄ + 2NaOH → Cu(OH)₂↓ xanh lam + Na₂SO₄.",
      },
      {
        heading: "Một số kết tủa hay gặp",
        body: "AgCl↓ trắng, BaCO₃↓ trắng, CaCO₃↓ trắng, Fe(OH)₃↓ nâu đỏ, Cu(OH)₂↓ xanh lam. Màu và dạng kết tủa giúp nhận biết ion.",
        tip: "Trong lab ảo, quan sát màu kết tủa rồi đối chiếu với phương trình ion rút gọn.",
      },
    ],
    remember: [
      "Trao đổi xảy ra nếu có kết tủa / khí / nước",
      "Cu(OH)₂↓ xanh lam; Fe(OH)₃↓ nâu đỏ",
      "Đọc phương trình ion rút gọn để thấy bản chất",
    ],
  },
  "hh9-3": {
    lessonId: "hh9-3",
    summary:
      "Dãy hoạt động hóa học xếp kim loại theo khả năng đẩy nhau khỏi hợp chất. Kim loại mạnh hơn đẩy kim loại yếu hơn khỏi dung dịch muối.",
    sections: [
      {
        heading: "Phản ứng thế kim loại",
        body: "Nếu kim loại A đứng trước kim loại B trong dãy hoạt động thì A có thể đẩy B khỏi muối của B. Ví dụ: Fe + CuSO₄ → FeSO₄ + Cu↓; Zn + CuSO₄ → ZnSO₄ + Cu↓.",
      },
      {
        heading: "Kim loại với axit",
        body: "Kim loại đứng trước H cũng đẩy được H⁺ khỏi axit loãng tạo H₂. Mg, Zn phản ứng mạnh; Cu đứng sau H nên không tạo H₂ với H₂SO₄ loãng ở điều kiện thường.",
      },
      {
        heading: "Ví dụ nâng cao trong lab",
        body: "Zn + 2AgNO₃ → Zn(NO₃)₂ + 2Ag↓ — kẽm đẩy bạc vì Zn mạnh hơn Ag. Đây là cặp hay dùng để thử AI / cache trong SciLab AI.",
      },
    ],
    remember: [
      "Kim loại mạnh đẩy kim loại yếu khỏi muối",
      "Đứng trước H → có thể tạo H₂ với axit loãng",
      "Cu không đẩy H khỏi axit loãng",
    ],
  },
  // TODO(verify): nội dung Vật lý 8 cần giáo viên rà soát trước khi dùng chính thức.
  "vl8-1": {
    lessonId: "vl8-1",
    summary:
      "Lực là đại lượng vectơ đặc trưng cho tác dụng của vật này lên vật khác. Lực không duy trì chuyển động mà làm thay đổi vận tốc hoặc làm vật biến dạng.",
    sections: [
      {
        heading: "Biểu diễn một lực",
        body: "Một lực được biểu diễn bằng mũi tên: gốc mũi tên là điểm đặt lực, phương và chiều của mũi tên là phương, chiều của lực, độ dài mũi tên biểu thị độ lớn theo tỉ xích. Đơn vị đo lực là niutơn (N).",
        tip: "Vẽ đúng điểm đặt và chiều mũi tên quan trọng hơn việc vẽ đẹp.",
      },
      {
        heading: "Hai lực cân bằng",
        body: "Hai lực cân bằng cùng đặt lên một vật, cùng phương, ngược chiều và có độ lớn bằng nhau. Khi chỉ chịu hai lực cân bằng, vật đang đứng yên sẽ tiếp tục đứng yên, vật đang chuyển động thẳng đều sẽ tiếp tục chuyển động thẳng đều.",
      },
      {
        heading: "Lực và sự thay đổi chuyển động",
        body: "Khi có lực tác dụng, vật có thể thay đổi tốc độ, đổi hướng chuyển động hoặc bị biến dạng. Mọi vật đều có quán tính: xu hướng giữ nguyên trạng thái đứng yên hoặc chuyển động thẳng đều.",
        tip: "Xe phanh gấp, người bị lao về phía trước là biểu hiện của quán tính.",
      },
    ],
    remember: [
      "Lực là đại lượng vectơ: điểm đặt, phương, chiều, độ lớn",
      "Hai lực cân bằng cùng phương, ngược chiều, cùng độ lớn",
      "Lực làm thay đổi vận tốc hoặc làm vật biến dạng",
    ],
  },
  // TODO(verify): nội dung Vật lý 8 cần giáo viên rà soát trước khi dùng chính thức.
  "vl8-2": {
    lessonId: "vl8-2",
    summary:
      "Áp suất đặc trưng cho tác dụng của áp lực lên một diện tích. Chất lỏng gây áp suất theo mọi phương, còn lực đẩy Ác-si-mét quyết định vật nổi hay chìm.",
    sections: [
      {
        heading: "Áp suất chất rắn",
        body: "Áp suất p = F/S, trong đó F là áp lực (N) và S là diện tích bị ép (m²). Đơn vị áp suất là paxcan (Pa), 1 Pa = 1 N/m². Cùng một áp lực, diện tích tiếp xúc càng nhỏ thì áp suất càng lớn.",
        tip: "Mũi kim nhọn tạo áp suất lớn để xuyên qua vải dễ hơn.",
      },
      {
        heading: "Áp suất chất lỏng và khí quyển",
        body: "Chất lỏng gây áp suất theo mọi phương lên đáy bình và thành bình. Ở độ sâu h, áp suất chất lỏng là p = d.h với d là trọng lượng riêng của chất lỏng. Khí quyển cũng gây áp suất lên mọi vật trên Trái Đất.",
      },
      {
        heading: "Lực đẩy Ác-si-mét",
        body: "Một vật nhúng trong chất lỏng chịu lực đẩy Ác-si-mét hướng thẳng đứng lên: F = d.V, với V là thể tích phần chất lỏng bị vật chiếm chỗ. Vật nổi khi lực đẩy lớn hơn trọng lượng, lơ lửng khi hai lực cân bằng và chìm khi lực đẩy nhỏ hơn trọng lượng.",
      },
    ],
    remember: [
      "p = F/S; đơn vị Pa",
      "Áp suất chất lỏng p = d.h",
      "FÁc-si-mét = d.V; vật nổi khi F > P",
    ],
  },
  // TODO(verify): nội dung Vật lý 9 cần giáo viên rà soát trước khi dùng chính thức.
  "vl9-1": {
    lessonId: "vl9-1",
    summary:
      "Định luật Ôm cho biết cường độ dòng điện qua dây dẫn tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở: I = U/R.",
    sections: [
      {
        heading: "Định luật Ôm",
        body: "Cường độ dòng điện I (ampe, A) qua một đoạn dây dẫn tỉ lệ thuận với hiệu điện thế U (vôn, V) giữa hai đầu đoạn dây và tỉ lệ nghịch với điện trở R (ôm, Ω): I = U/R.",
        tip: "Muốn giảm dòng điện trong mạch, có thể tăng điện trở hoặc giảm hiệu điện thế.",
      },
      {
        heading: "Đoạn mạch nối tiếp",
        body: "Trong đoạn mạch nối tiếp: I = I₁ = I₂; U = U₁ + U₂; R = R₁ + R₂. Hiệu điện thế giữa hai đầu mỗi điện trở tỉ lệ thuận với điện trở đó.",
      },
      {
        heading: "Đoạn mạch song song",
        body: "Trong đoạn mạch song song: I = I₁ + I₂; U = U₁ = U₂; 1/R = 1/R₁ + 1/R₂. Cường độ dòng điện qua mỗi nhánh tỉ lệ nghịch với điện trở của nhánh đó.",
      },
    ],
    remember: [
      "I = U/R; U đo bằng vôn kế, I đo bằng ampe kế",
      "Nối tiếp: R = R₁ + R₂, I như nhau",
      "Song song: U như nhau, 1/R = 1/R₁ + 1/R₂",
    ],
  },
  // TODO(verify): nội dung Vật lý 9 cần giáo viên rà soát trước khi dùng chính thức.
  "vl9-2": {
    lessonId: "vl9-2",
    summary:
      "Thấu kính hội tụ có tác dụng hội tụ chùm tia ló. Ảnh tạo bởi thấu kính phụ thuộc vị trí vật so với tiêu điểm và có thể là ảnh thật hoặc ảnh ảo.",
    sections: [
      {
        heading: "Các khái niệm cơ bản",
        body: "Thấu kính hội tụ thường có dạng rìa mỏng, giữa dày. Trục chính là đường thẳng đi qua quang tâm O; tiêu điểm F nằm trên trục chính; khoảng cách OF gọi là tiêu cự f.",
      },
      {
        heading: "Dựng ảnh của một điểm sáng",
        body: "Dùng ba tia đặc biệt: tia tới song song trục chính cho tia ló qua tiêu điểm; tia tới qua quang tâm truyền thẳng; tia tới qua tiêu điểm cho tia ló song song trục chính. Giao điểm của các tia ló (hoặc đường kéo dài) là ảnh.",
        tip: "Vật ngoài tiêu cự cho ảnh thật ngược chiều; vật trong tiêu cự cho ảnh ảo cùng chiều, lớn hơn vật.",
      },
      {
        heading: "Công thức và ứng dụng",
        body: "Với thấu kính hội tụ, quan hệ giữa tiêu cự f, khoảng cách vật d và khoảng cách ảnh d' là 1/f = 1/d + 1/d'. Thấu kính hội tụ được dùng trong máy ảnh, kính lúp, kính hiển vi và mắt.",
      },
    ],
    remember: [
      "Thấu kính hội tụ: rìa mỏng, giữa dày",
      "Vật ngoài tiêu cự → ảnh thật ngược chiều",
      "Vật trong tiêu cự → ảnh ảo cùng chiều, lớn hơn",
    ],
  },
  // TODO(verify): nội dung Toán 8 cần giáo viên rà soát trước khi dùng chính thức.
  "toan8-1": {
    lessonId: "toan8-1",
    summary:
      "Bảy hằng đẳng thức đáng nhớ giúp khai triển và rút gọn biểu thức nhanh, chính xác. Cần nhận dạng đúng dạng để chọn công thức phù hợp.",
    sections: [
      {
        heading: "Bình phương của một tổng, một hiệu",
        body: "(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b². Dấu của hạng tử giữa phụ thuộc vào dấu trong ngoặc.",
      },
      {
        heading: "Hiệu hai bình phương",
        body: "a² − b² = (a − b)(a + b). Đây là công thức thường dùng để phân tích đa thức thành nhân tử.",
        tip: "Nhận ra dạng a² − b² sẽ giúp tính nhanh các biểu thức như 101² − 99².",
      },
      {
        heading: "Lập phương của tổng, hiệu và tổng/hiệu hai lập phương",
        body: "(a + b)³ = a³ + 3a²b + 3ab² + b³; (a − b)³ = a³ − 3a²b + 3ab² − b³; a³ + b³ = (a + b)(a² − ab + b²); a³ − b³ = (a − b)(a² + ab + b²).",
      },
    ],
    remember: [
      "(a ± b)² = a² ± 2ab + b²",
      "a² − b² = (a − b)(a + b)",
      "a³ ± b³ = (a ± b)(a² ∓ ab + b²)",
    ],
  },
  // TODO(verify): nội dung Toán 8 cần giáo viên rà soát trước khi dùng chính thức.
  "toan8-2": {
    lessonId: "toan8-2",
    summary:
      "Phương trình bậc nhất một ẩn có dạng ax + b = 0 với a ≠ 0. Dùng quy tắc chuyển vế và nhân để đưa phương trình về dạng x = −b/a.",
    sections: [
      {
        heading: "Hai quy tắc biến đổi phương trình",
        body: "Quy tắc chuyển vế: chuyển một hạng tử từ vế này sang vế kia phải đổi dấu. Quy tắc nhân: nhân (hoặc chia) cả hai vế với cùng một số khác 0 thì phương trình không đổi nghiệm.",
      },
      {
        heading: "Các bước giải",
        body: "Bước 1: quy đồng, bỏ mẫu nếu có. Bước 2: chuyển các hạng tử chứa x về một vế, hằng số về vế kia. Bước 3: thu gọn và chia hệ số của x. Bước 4: kết luận tập nghiệm.",
        tip: "Kiểm tra lại bằng cách thay nghiệm vào phương trình ban đầu.",
      },
      {
        heading: "Bài toán có lời văn",
        body: "Chọn ẩn và đặt điều kiện thích hợp, biểu diễn các đại lượng chưa biết theo ẩn, lập phương trình từ quan hệ trong đề, giải phương trình rồi đối chiếu điều kiện trước khi kết luận.",
      },
    ],
    remember: [
      "ax + b = 0 (a ≠ 0) ⇔ x = −b/a",
      "Chuyển vế đổi dấu",
      "Luôn kiểm tra nghiệm với đề bài",
    ],
  },
  // TODO(verify): nội dung Toán 9 cần giáo viên rà soát trước khi dùng chính thức.
  "toan9-1": {
    lessonId: "toan9-1",
    summary:
      "Hàm số bậc nhất có dạng y = ax + b với a ≠ 0. Hệ số a quyết định chiều biến thiên, b quyết định giao điểm với trục tung.",
    sections: [
      {
        heading: "Định nghĩa và tính chất",
        body: "Hàm số bậc nhất y = ax + b xác định với mọi x thuộc ℝ. Nếu a > 0 hàm số đồng biến; nếu a < 0 hàm số nghịch biến.",
      },
      {
        heading: "Đồ thị",
        body: "Đồ thị là một đường thẳng cắt trục tung tại điểm (0; b). Để vẽ, xác định hai điểm phân biệt, thường chọn giao với trục tung và giao với trục hoành (nếu có).",
        tip: "Hai đường thẳng y = ax + b và y = a'x + b' song song khi a = a', b ≠ b'; trùng nhau khi a = a', b = b'.",
      },
      {
        heading: "Vị trí tương đối và ứng dụng",
        body: "Hai đường thẳng cắt nhau khi a ≠ a'. Giao điểm được tìm bằng cách giải phương trình ax + b = a'x + b'. Hàm số bậc nhất dùng để mô tả nhiều quan hệ tỉ lệ trong thực tế.",
      },
    ],
    remember: [
      "y = ax + b (a ≠ 0)",
      "a > 0: đồng biến; a < 0: nghịch biến",
      "Song song: a = a', b ≠ b'",
    ],
  },
  // TODO(verify): nội dung Toán 9 cần giáo viên rà soát trước khi dùng chính thức.
  "toan9-2": {
    lessonId: "toan9-2",
    summary:
      "Trong tam giác vuông, các hệ thức lượng liên hệ cạnh góc vuông, cạnh huyền, đường cao và hình chiếu. Tỉ số lượng giác giúp tính cạnh và góc.",
    sections: [
      {
        heading: "Hệ thức về cạnh và đường cao",
        body: "Với tam giác ABC vuông tại A, đường cao AH: b² = ab', c² = ac', h² = b'c', ah = bc, 1/h² = 1/b² + 1/c² và a² = b² + c² (định lí Pythagore).",
      },
      {
        heading: "Tỉ số lượng giác của góc nhọn",
        body: "sin = cạnh đối/cạnh huyền; cos = cạnh kề/cạnh huyền; tan = cạnh đối/cạnh kề; cot = cạnh kề/cạnh đối. Với hai góc phụ nhau: sin góc này bằng cos góc kia, tan góc này bằng cot góc kia.",
        tip: "Nhớ SOH – CAH – TOA để chọn đúng tỉ số.",
      },
      {
        heading: "Giải tam giác vuông",
        body: "Khi biết hai yếu tố (trong đó có ít nhất một cạnh), có thể dùng hệ thức lượng và tỉ số lượng giác để tìm các cạnh, góc còn lại. Kết quả thường làm tròn theo yêu cầu của đề.",
      },
    ],
    remember: [
      "b² = ab', c² = ac', h² = b'c'",
      "sin = đối/huyền; cos = kề/huyền; tan = đối/kề",
      "Hai góc phụ nhau: sin = cos, tan = cot",
    ],
  },
};

export function getLessonTheory(lessonId: string | null | undefined): LessonTheory | null {
  if (!lessonId) return null;
  return LESSON_THEORY[lessonId] ?? null;
}
