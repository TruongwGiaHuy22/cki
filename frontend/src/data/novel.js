const images = import.meta.glob("../assets/*.{png,jpg,jpeg,webp}", { eager: true });
const coverMap = {};
for (const path in images) {
  const fileName = path.split("/").pop(); 
  coverMap[fileName] = images[path].default;
}

export const novels = [
 {
    id: 1,
    title: "Chuyển Sinh Thành Slime",
    cover: coverMap["noname5.jpg"],
    type: "Truyện dịch",
    sangTacInfo: {
      author: "Fuse",
      words: "495.527",
      description: "Một thanh niên ( 37 tuổi vẫn còn tem) bị đâm bởi tên cướp đang trên đường tháo chạy sau khi cứu (kouhai) đồng nghiệp lẫn người tình của anh ta sang hai bên. Khi anh ấy nằm sấp mặt chờ chết, máu chảy đầm đìa dưới dất, anh ta nghe thấy một tiếng nói. Tiếng nói này lạ lẫm và diễn giải nỗi uất hận khi chết mà còn chưa được nện lần nào bằng cách cho anh ấy kỹ năng đặc biệt [Đại Hiền Nhân]!Có phải anh ta đang bị đem ra làm trò cười?",
      chapterMain: "ARC Cuộc Xâm Lược Của Đế Quốc",
      chapterSub: "Chap 137: Một năm Phát triển"
    },
    genres: ["Fantasy", "Isekai"],
    status: "Đang tiến hành",
    chapters: [
      { id: 101, title: "Chap 138: Lời mời đến từ Hội Đồng" },
      { id: 102, title: "Chap 139: Toàn Văn của buổi Hội nghị" }
    ]
  },
  {
    id: 2,
    title: "Chuyển sinh thành triệu hồi sư",
    cover: coverMap["st1.jpg"],
    type: "Sáng tác",
    sangTacInfo: {
      author: "Hamuo",
      words: "8.347",
      description: "Kenichi đột nhiên tìm được một trò chơi không tựa đề, hứa hẹn những thử thách không gì sánh bằng cùng tiềm năng chưa từng có. Anh không do dự lựa chọn độ khó ‘hell mode’. Và hãy nhìn xem, anh nhận thấy mình đã chuyển sinh đến một thế giới khác trên tư cách một nông nô.Giờ đây được gọi là Allen, mục tiêu của anh là khai phá bí mật bên trong class Triệu Hồi Sư đầy bí ẩn mà mà không nhờ những tiện ích của hướng dẫn chơi, trợ giúp của game, hay các diễn đàn trực tuyến, anh sẽ nắm lấy con đường để đến với đỉnh cao của thế giới mới.",
      chapterMain: "ARC 1: Mở màn",
      chapterSub: "Chương 17: Yến tiệc "
    },
    genres: ["Romance", "Drama"],
    status: "Tạm ngưng",
    chapters: [
      { id: 201, title: "Chương 17: Yến tiệc ①" }
    ]
  },
  {
  id: 3,
  title: "Bạn Gái Nga",
  cover: coverMap["aii1.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "燦々SUN",
    words: "9.065",
    description: "Cô nàng bàn bên Aria-san thi thoảng lại thả thính tôi bằng tiếng Nga. Cơ mà, cô ấy không biết rằng tôi hiểu được tiếng Nga.",
    chapterMain: " Chương 1: Không phải việc bỏ lỡ một lượt quay gacha miễn phí rất chi là khó chịu sao",
    chapterSub: "Chương mở đầu: Nàng công chúa cô độc và cậu bạn hàng xóm lười biếng"
  },

  genres: ["AI"],
  status: "Đang tiến hành",
  chapters: [
    { id: 301, title: "Chương 1: Không phải việc bỏ lỡ một lượt quay gacha miễn phí rất chi là khó chịu sao" }
  ]
},
  {
  id: 4,
  title: "Another Story",
  cover: coverMap["ai2.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Translator Team A",
    words: "12,300",
    description: "Câu chuyện kể về hành trình của một nhân vật vô danh bị cuốn vào những biến cố vượt xa trí tưởng tượng của mình. Từ một người bình thường, cậu dần phải đối mặt với những thế lực bí ẩn, những trận chiến không cân sức và cả những lựa chọn có thể thay đổi số phận của nhiều người. Bản dịch được thực hiện bởi AI nhằm mang đến trải nghiệm nhanh chóng và dễ tiếp cận hơn cho người đọc.",
    chapterMain: "Chương 1: Khởi đầu",
    chapterSub: "Một hành trình không thể quay đầu"
  },

  genres: ["Fantasy", "Action"],
  status: "Đang tiến hành",
  chapters: [
    { id: 401, title: "Chương 1: Khởi đầu" }
  ]
},

{
  id: 5,
  title: "Của ta thanh xuân yêu đương câu chuyện quả nhiên có vấn đề",
  cover: coverMap["ai3.jpg"],
  type: "AI",

  sangTacInfo: {
    author: " Watari Wataru",
    words: "9,850",
    description: "Học sinh cấp 3 Hachiman trời sinh tính không được tự nhiên, không khuất phục tại cô độc, không có nửa người bạn, lại càng không dùng đề bạn gái. Đối với những cái...kia hưởng thụ lấy thanh xuân bạn học cùng lớp, hắn nguyền rủa: Bọn họ đều là lừa đảo, toàn bộ bạo cho ta tạc a! Về tương lai mộng tưởng, hắn tuyên bố muốn làm Ăn bám —— như vậy một tên bị đạo sư mang đến toàn bộ trường học đệ nhất thiếu nữ đẹp Yukino gia nhập Câu lạc bộ phụng dưỡng . Bình thường không có gì lạ Hachiman cùng thiếu nữ đẹp kỳ diệu gặp gỡ bất ngờ  Này làm sao xem đều giống một hồi tình yêu hài kịch a! Nhưng mà, Yukino cùng Hachiman cá tính thượng chỗ thiếu hụt lại để cho bọn hắn không cách nào sát ra tình yêu hỏa hoa. Đây là thứ nhất tràn ngập sai lầm thanh xuân câu chuyện!",
    chapterMain: " Chương 1: Nói tóm lại Hikigaya Hachiman là cái hikikomori",
    chapterSub: "Chương mở đầu"
  },

  genres: ["Comedy", "Drama","Romance"],
  status: "Tạm ngưng",
  chapters: [
    { id: 501, title: " Chương 1: Nói tóm lại Hikigaya Hachiman là cái hikikomori" }
  ]
},

{
  id: 6,
  title: "Phá Đảo Dị Giới Cùng Nữ Thần Không Tín Đồ",
  cover: coverMap["ai4.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Oosaki Airu",
    words: "135.626",
    description: "Takatsuki Makoto, một học sinh trung học bình thường và là game thủ RPG hạng nặng. Tuy nhiên, cuộc đời cậu thay đổi khi cả lớp cậu đều mất tích sau một trận bão tuyết và chuyển đến thế giới khác, vùng đất của các vị Thần, ma thuật và quái vật. Tất cả mọi người đều được ban phước với các chỉ số mạnh mẽ lẫn kỹ năng độc đáo. Nhưng đời đâu như là mơ, chỉ số của Makoto hóa ra rất thảm hại và kỹ năng của cậu là siêu yếu so với các bạn cùng lớp... Cậu thậm chí còn bị mắc kẹt với tư cách là một pháp sư tập sự. Tệ hơn nữa, cậu chỉ còn sống được thêm có mười năm!.",
    chapterMain: "Tập 1: Tối Nhược Pháp Sư Trong Số Bạn Đồng Học",
    chapterSub: "Chương 1: Takatsuki Makoto lạc trôi đến dị giới"
  },

  genres: ["Comedy", "Adventure"],
  status: "Đang tiến hành",
  chapters: [
    { id: 601, title: "Tập 1: Tối Nhược Pháp Sư Trong Số Bạn Đồng Học" }
  ]
},
 {
  id: 7,
  title: "Netoge no Yome ga Ninki Idol datta ken ~Cool-kei no kanojo wa genjitsu demo yome no tsumori de iru~",
  cover: coverMap["ai55.jpg"],
  type: "AI",

  sangTacInfo: {
    author: " Aboun (あボーン)",
    words: "9,240",
    description: "Ayanokouji Kazuto là một cậu học sinh cao trung bình thường. Cậu có sở thích là chơi game vào thời gian rảnh của mình. Một ngày, cậu phát hiện ra danh tính thật của người bạn thân mà cậu đã kết hôn trong game. Người đó không ai khác chính là Rinka Mizuki, một idol và cũng là người bạn cùng lớp của cậu. Trong khi Mizuki Rinka cố gắng để cư xử với cậu như một người vợ, cậu phải trải qua một cuộc sống hằng ngày mệt mỏi.",
    chapterMain: "Tập 1: Mình, là Mizuki Rinka",
    chapterSub: "Chương 4: Sự ra hiệu và cái nhìn liếc"
  },

  genres: ["Romance", "Comedy"],
  status: "Đang tiến hành",
  chapters: [
    { id: 703, title: "Tập 1: Mình, là Mizuki Rinka" }
  ]
},
  {
  id: 8,
  title: "Fantasy Quest",
  cover: coverMap["ai6.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Aether Core",
    words: "12,580",
    description: "Trong một thế giới nơi phép thuật và khoa học cùng tồn tại, con người không còn đơn thuần tin vào những điều huyền bí như trước nữa. Thay vào đó, họ tìm cách lý giải chúng bằng những công thức và quy luật. Nhưng vẫn có những vùng đất mà ngay cả trí tuệ nhân tạo cũng không thể giải mã. Nhân vật chính – một người vô tình bị cuốn vào hành trình kỳ lạ – phải đối mặt với những thử thách không chỉ đến từ thế giới bên ngoài mà còn từ chính niềm tin của bản thân. Liệu cậu sẽ tin vào dữ liệu hay tin vào trái tim mình? Và khi ranh giới giữa thực tại và ảo tưởng dần mờ đi, đâu mới là con đường đúng đắn?",
    chapterMain: "Chương 5: Cánh cổng bị lãng quên",
    chapterSub: "Một lựa chọn có thể thay đổi cả thế giới"
  },

  genres: ["Fantasy", "Adventure"],
  status: "Đang tiến hành",
  chapters: [
    { id: 805, title: "Chương 5: Cánh cổng bị lãng quên" }
  ]
},
  {
  id: 9,
  title: "Tôi bị tên senpai NTR mất bạn gái, nên tôi NTR lại bạn gái của hắn",
  cover: coverMap["ai7.jpg"],
  type: "AI",

  sangTacInfo: {
    author: " Shinden Mihiro",
    words: "15,320",
    description: "Isshiki Yuu, một anh chàng tân sinh viên, có một cô bạn gái tên là Mitsumoto Karen. Tuy nhiên vào một ngày nọ, Yuu phát hiện Karen đang ngoại tình với senpai của cậu, Kamokura Tetsuya. Đắm chìm trong sự phẫn nộ, tuyệt vọng, buồn bã, cậu đã gọi cho Sakurajima Touko, người được mệnh danh là Mỹ Nhân Số Một Trường Đại Học, và cũng là bạn gái của Kamokura. Touko-senpai xin hãy ngoại tình với em. Nhưng Touko đã trả lời rằng thật không thể tha thứ chuyện bọn họ ngoại tình, hai người họ sẽ phải nếm mùi chạm đáy của nỗi đau. Và kế hoạch của chị ấy là khi mà hắn đã mê mẩn chị đến quên cả trời đất, chị sẽ đá hắn và qua đêm với một người đàn ông khác ngay trước mặt hắn.",
    chapterMain: "Arc 1: Trả thù đôi gian phu dâm phụ",
    chapterSub: "Chương 1: Bạn gái tôi ngoại tình với tên senpai (Phần đầu)"
  },

  genres: ["Netorare", "Drama","Romance"],
  status: "Đang tiến hành",
  chapters: [
    { id: 904, title: "Arc 1: Trả thù đôi gian phu dâm phụ" }
  ]
},
  {
  id: 10,
  title: "Lý do cô bé thiên tài nhảy lớp không thân thiết bất kỳ ai lại chỉ làm nũng với mình tôi",
  cover: coverMap["ai8.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Yagami Kagami",
    words: "11,870",
    description: "Lớp của tôi có một cô bé thiên tài nhảy lớp. Ngoại hình của cô bé dễ thương như một nàng công chúa, nhưng tính cách lại rất lạnh lùng và không muốn giao tiếp với ai. Cô bé chỉ mở lòng với người chị gái được gọi là 'Thánh mẫu' trong trường. Tôi đã nghĩ vậy, cho đến một ngày, không biết vì sao tôi cho cô ấy một ít kẹo, và cô ấy bỗng nhiên trở nên rất thân thiết với tôi!? Cô công chúa thiên tài, vốn rất khó tiếp cận, lại tỏ ra vô cùng dễ thương và làm nũng tôi. Tình cảm của cô ấy không có dấu hiệu dừng lại, và cô ấy còn cố gắng gán tôi với chị gái để trở thành em vợ tôi...!? Đây là câu chuyện về cô bé thiên tài, vì sự cô đơn mà trở nên khác biệt, người chị gái ngây thơ và lo lắng cho cô bé, và một cậu bé bình thường như bao người khác.",
    chapterMain: "Arc 1: Cô bé thiên tài cùng lớp suốt ngày tỏ ra dễ thương chỉ với mình tôi",
    chapterSub: "Chương 1 - Cô bé thiên tài hóa ra lại dễ chiều hơn tôi tưởng"
  },

  genres: ["Shounen", "Romance"],
  status: "Hoàn thành",
  chapters: [
    { id: 1006, title: "Arc 1: Cô bé thiên tài cùng lớp suốt ngày tỏ ra dễ thương chỉ với mình tôi" }
  ]
},
  {
  id: 11,
  title: "Shimotsuki-san wa Mob ga Suki",
  cover: coverMap["ai9.jpg"],
  type: "AI",
  sangTacInfo: {
    author: "Yagami Kagami",
    words: "13,450",
    description: "Tan trường, Nakayama Koutarou quay lại trường để lấy món đồ mình để quên và tình cờ bắt gặp Shimotsuki Shiho đang ngủ trong một phòng học trống vắng. Người ta vẫn đồn rằng cô là người nhận được sự chú ý đặc biệt từ Ryuzaki Ryoma, chàng trai nổi tiếng với dàn harem trong lớp, nhưng gương mặt cô luôn lạnh lùng, chưa từng ai thấy cô cười. Vậy mà lúc này, những ngón tay trắng ngần ấy lại đang khẽ nắm lấy bàn tay của Koutarou, mở ra một mối quan hệ bí mật giữa một nữ chính và một mob.",
    chapterMain: "ARC 1:Thiếu nữ trầm lặng chỉ nói nhiều với mỗi mình tôi",
    chapterSub: "Chương 1: Chỉ khi trước tôi, cô gái trầm lặng mới trở nên luôn miệng"
  },

  genres: ["Fantasy", "Adventure"],
  status: "Đang tiến hành",
  chapters: [
    { id: 1107, title: "ARC 1:Thiếu nữ trầm lặng chỉ nói nhiều với mỗi mình tôi" }
  ]
},
  {
  id: 12,
  title: "Tensei shitara doragon no tamago datta ~ saikyō igai mezasane ~e ~",
  cover: coverMap["ai10.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Nekoko",
    words: "10,220",
    description: "Tôi tỉnh đậy ở một khu rừng vô danh trong hình dạng một quả trứng. Nơi này giống như một thế giới giả tưởng, những sinh vật kỳ lạ và hung hãn khắp xung quanh. Giống như trong game, dường như tôi có thể kiểm tra chỉ số của tôi và kẻ thù. Tôi muốn săn những con quái vật, thu thập danh hiệu để lên cấp và tiến hóa trở thành một con rồng mạnh mẽ hơn. Rồi tôi nghe thấy một giọng nói bí ẩn ở trong đầu mình: “Hãy hướng đến mục tiêu trở thành kẻ mạnh nhất!.",
    chapterMain: "ARC- Một quả trứng biết đi",
    chapterSub: "Chương 23 - Một tên nào đó đã hóa khờ"
  },

  genres: ["Romance", "Drama"],
  status: "Hoàn thành",
  chapters: [
    { id: 1204, title: "Chương 23 - Một tên nào đó đã hóa khờ" }
  ]
},
  {
  id: 13,
  title: "Dạo Bước Nơi Dị Giới",
  cover: coverMap["ai11.jpg"],
  type: "AI",

  sangTacInfo: {
    author: " Arukuhito",
    words: "16,780",
    description: "Sora, một học sinh bình thường, bất ngờ bị triệu hồi sang dị giới với tư cách là một trong bảy “anh hùng được chọn” – những kẻ được kỳ vọng sẽ đánh bại Ma Vương và cứu lấy thế giới. Thế nhưng, trong khi sáu người còn lại đều sở hữu danh hiệu lộng lẫy cùng chỉ số áp đảo, thì Sora lại gần như trắng tay: không cấp độ, không danh hiệu, và chỉ có đúng một kỹ năng nghe qua đã thấy vô dụng — đi bộ bao lâu cũng không biết mệt.",
    chapterMain: "ARC 2: Tín hiệu từ khoảng không vô tận",
    chapterSub: "Chương 2:Không phải mọi tín hiệu đều là lời chào"
  },

  genres: ["Sci-Fi", "Adventure"],
  status: "Đang tiến hành",
  chapters: [
    { id: 1308, title: "Chương 2:Không phải mọi tín hiệu đều là lời chào" }
  ]
},
  {
  id: 14,
  title: "Re:Zero kara Hajimeru Isekai Seikatsu",
  cover: coverMap["ai12.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Tappei Nagatsuki",
    words: "12,960",
    description: "Câu chuyện xoay quanh cậu thiếu niên tên là Natsuki Subaru và năng lực trở về sau cái chết. Cậu nhận được sau khi bị dịch chuyển tới một thế giới song song, thứ giúp cậu quay ngược thời gian để thay đổi số phận nghiệt ngã của chính cậu và những người xung quanh, cũng như cứu giúp người mà cậu yêu quý chính là Emilia.",
    chapterMain: "Arc 1: Ngày đầu tiên dữ dội",
    chapterSub: "Chương 1: Đồng 10 yên có rãnh không thể sử dụng"
  },

  genres: ["Fantasy", "Mystery"],
  status: "Đang tiến hành",
  chapters: [
    { id: 1406, title: "Arc 1: Ngày đầu tiên dữ dội" }
  ]
},
  {
  id: 15,
  title: "Shinmai Maou no Keiyakusha Testament",
  cover: coverMap["ai13.jpg"],
  type: "AI",

  sangTacInfo: {
    author: "Tetsuto Uesu",
    words: "9,880",
    description: "Ngươi đã nói muốn muội muội đúng không đối với cao trung học sinh Tojo Basara tuyên bố nếu cưới phụ thân mang về hai sắp sửa trở thành nghĩa muội nữ hài tử cùng nhau ở chung. Nhưng hắn bản thân lại bởi rằng nước ngoài đi công tác mà rời khỏi. Mio với Maria, đây hai vị thiếu nữ hiện tại phụ thân rời nhà sau khi, thái độ biến đổi, muốn đàn áp Basara. Hai người đích thực thật thân phận nguyên lai là tân binh ma vương với mộng quỷ dâm yêu! Nhưng, hiện tại cùng Basara ký kết master-slave quan hệ khế ước thời điểm sai lầm làm cho thành nghịch khế ước, Basara địa vị biến thành chủ nhân! ?.",
    chapterMain: "ARC 1: Prologue: Có muội muội thời gian",
    chapterSub: " Chương 4: Thẳng đến ngươi bi thương tan biến mới thôi"
  },

  genres: ["Action", "Drama"],
  status: "Hoàn thành",
  chapters: [
    { id: 1505, title: "ARC 1: Prologue: Có muội muội thời gian" }
  ]
},
  {
    id: 16,
    title: "Bleach",
    cover: coverMap["ai14.jpg"],
    type: "AI",
    sangTacInfo: {
      author: " Makoto Matsubara",
      words: "36,562",
      description: "WE DO knot ALWAYS LOVE YOU là cuốn tiểu thuyết được chấp bút bởi Matsubara Makoto và có sự cộng tác với Kubo Tite. Cốt truyện lấy bối cảnh ba năm sau khi kết thúc Huyết Chiến Ngàn Năm, kể về tiến độ tái thiết của Thi Hồn Giới, cùng với đó là quá trình phát triển tình cảm rồi đi đến đám cưới của Abarai Renji và Kuchiki Rukia.",
      chapterMain: "ARC 1: hồi ức của renji",
      chapterSub: "Chương 3: Trận chiến của Hikone/ Shunsui vs Tokinada"
    },
    genres: ["Mystery", "Fantasy"],
    status: "Đang tiến hành",
    chapters: [
      { id: 1601, title: "ARC 1: Hồi ức của Renji" }
    ]
  },

  {
    id: 17,
    title: "Empire of Shadows",
    cover: coverMap["ai15.jpg"],
    type: "Truyện dịch",
    sangTacInfo: {
      author: "Nak",
      words: "??",
      description: "Đế chế bóng tối là một câu chuyển giả tưởng xoay vòng quanh cuộc đời của nak nơi đây là vương quốc athanor nơi cậu sinh ra và lớn lên khi vừa tròn 16 tuổi sức mạnh tiềm ẩn bên trong cậu bốc phát năng lượng tinh linh của thứ nguyên vệ thần đã chảy trong người cậu điều đó ám chỉ rằng cậu là người được thanh gươm ấy lựa chọn, cùng với đó là những cuộc gặp gỡ...",
      chapterMain: "ARC 1: Thức tỉnh triệu hồi Tinh Linh vệ thần",
      chapterSub: "đang cập nhập"
    },
    genres: ["Fantasy", "Dark"],
    status: "Đang tiến hành",
    chapters: [
      { id: 1701, title: "ARC 1: Thức tỉnh triệu hồi Tinh Linh vệ thần" }
    ]
  },

  {
    id: 18,
    title: "The Only Holy Sword User in the World: But After Being Called Useless, I Awakened and Became the Strongest.",
    cover: coverMap["st2.jpg"],
    type: "Sáng tác",
    sangTacInfo: {
      author: "Unknown",
      words: "??",
      description: "Rouse là người duy nhất sở hữu Thần Kiếm nhưng bị coi là phế vật vì thanh kiếm ban đầu chỉ có cán mà không có lưỡi, dẫn đến việc anh bị đồng đội phản bội và đuổi đi. Trong lúc ngặt nghèo, anh vô tình thức tỉnh sức mạnh thực sự của kiếm, giúp nó biến hình thành vũ khí tối thượng với kỹ năng gian lận cực hạn, từ đó bắt đầu hành trình bá đạo, thu phục dàn mỹ nhân và khiến những kẻ từng coi thường mình phải hối hận.",
      chapterMain: "ARC 1: Thức tỉnh sức mạnh thực sự của thần kiếm",
      chapterSub: "Chương 1: Rouse bị đồng đội phản bội"
    },
    genres: ["Romance", "Slice of Life"],
    status: "Hoàn thành",
    chapters: [
      { id: 1801, title: "ARC 1: Thức tỉnh sức mạnh thực sự của thần kiếm" }
    ]
  },

  {
    id: 19,
    title: "Dị Giới Cùng Chiếc Smartphone",
    cover: coverMap["st3.jpg"],
    type: "AI",
    sangTacInfo: {
      author: "Patora Fuyuhara",
      words: "5.230",
      description: "Nội dung kể về một anh main giống như bao anh main khác khi đang trên đường về nhà lại bị… sét đánh lăn đùng ra chết Điều đáng nói ở đây là sau khi chết anh main lại bị triệu tập đến trước mặt Thượng đế với lý do: ...",
      chapterMain: "ARC 1: Tiếng Gọi Từ Thế Giới Khác",
      chapterSub: "Chương 1: Anh main chết và bị triệu tập"
    },
    genres: ["Sci-Fi", "War"],
    status: "Đang tiến hành",
    chapters: [
      { id: 1901, title: "ARC 1: Tiếng Gọi Từ Thế Giới Khác" }
    ]
  },

  {
    id: 20,
    title: "Anh hùng và Hiền nhân, Tái sinh và Đính ước",
    cover: coverMap["st4.jpeg"],
    type: "Truyện dịch",
    sangTacInfo: {
      author: "Fujiki Washiro",
      words: "378.876",
      description: "Reid tái sinh vào thế giới nơi ma pháp ngự trị và vẫn giữ được sức mạnh từ kiếp trước. Tại đây, anh tình cờ hội ngộ với Elria, nhưng thay vì một lời thách thức, cô lại bất ngờ đề nghị anh kết hôn với mình khiến Reid không khỏi ngỡ ngàng.",
      chapterMain: "ARC 1: tái sinh và đính ước ",
      chapterSub: "Chương 1: Reid tái sinh và gặp Elria"
    },
    genres: ["Fantasy", "Action"],
    status: "Đang tiến hành",
    chapters: [
      { id: 2001, title: "ARC 1: tái sinh và đính ước " }
    ]
  },

  {
    id: 21,
    title: "Senketsu Oujo, Minna Korosu",
    cover: coverMap["st5.jpg"],
    type: "Sáng tác",
    sangTacInfo: {
      author: "kiki",
      words: "50,123",
      description: "Mary là công chúa bị gia đình phản bội và sát hại cùng người chị gái duy nhất trong một âm mưu chính trị tàn độc. Ngay giây phút cận kề cái chết, cô thức tỉnh năng lực Tử Thần cho phép nuốt chửng xác chết để cường hóa sức mạnh bản thân. Hồi sinh từ cõi chết, Mary bắt đầu hành trình tàn sát và trả thù đẫm máu những kẻ đã hủy hoại cuộc đời mình.",
      chapterMain: "ARC 1: Tiếng khóc chào đời cất lên là bởi người đã chết",
      chapterSub: "Chương 1: 001 Điều trân quý vuột mất khỏi tầm tay"
    },
    genres: ["Slice of Life", "Drama"],
    status: "Hoàn thành",
    chapters: [
      { id: 2101, title: "ARC 1: Tiếng khóc chào đời cất lên là bởi người đã chết" }
    ]
  },

  {
    id: 22,
    title: "The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat",
    cover: coverMap["st6.jpg"],
    type: "AI",
    sangTacInfo: {
      author: "Rui Tsukiyo",
      words: "378.876",
      description: "Sát thủ vĩ đại nhất Trái Đất khi về già đã bị chính tổ chức của mình phản bội và sát hại. Tuy nhiên, một Nữ Thần đã cho ông cơ hội chuyển sinh vào một thế giới kiếm và ma thuật với điều kiện: ông phải ám sát Anh Hùng của thế giới đó để ngăn chặn thảm họa diệt vong.",
      chapterMain: "ARC 1: Nhập Môn",
      chapterSub: "Chương 2: Sát thủ trở thành con trai của một quý tộc."
    },
    genres: ["Mystery", "AI"],
    status: "Đang tiến hành",
    chapters: [
      { id: 2202, title: "ARC 1: Nhập Môn" },
    ]
  },

  {
    id: 23,
    title: "Kamen rider Den-0",
    cover: coverMap["st7.jpg"],
    description: "Bố mày đến đây ....",
    genres: ["Fantasy", "Supernatural"],
    status: "Đang tiến hành",
    type: "Truyện dịch",
    featured: false,
    top: "month",
    chapters: [
      { id: 2301, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 24,
    title: "Urban Vietnamese Drama",
    cover: coverMap["st8.jpg"],
    description: "Kịch đô thị Việt Nam...",
    genres: ["Drama", "Romance"],
    status: "Hoàn thành",
    type: "Sáng tác",
    featured: true,
    top: null,
    chapters: [
      { id: 2401, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 25,
    title: "AI Space Explorers",
   cover: coverMap["st9.jpg"],
    description: "Khám phá vũ trụ với AI...",
    genres: ["Sci-Fi", "Adventure"],
    status: "Đang tiến hành",
    type: "AI",
    featured: false,
    top: "week",
    chapters: [
      { id: 2501, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 26,
    title: "Warriors of Light",
    cover: coverMap["st10.png"],
    description: "Chiến binh ánh sáng...",
    genres: ["Fantasy", "Action"],
    status: "Đang tiến hành",
    type: "Truyện dịch",
    featured: true,
    top: "month",
    chapters: [
      { id: 2601, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 27,
    title: "Family Bonds",
    cover: coverMap["st11.jpg"],
    description: "Mối quan hệ gia đình...",
    genres: ["Drama", "Family"],
    status: "Hoàn thành",
    type: "Sáng tác",
    featured: true,
    top: null,
    chapters: [
      { id: 2701, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 28,
    title: "AI Time Travelers",
    cover: coverMap["bialn.png"],
    description: "Du hành thời gian với AI...",
    genres: ["Sci-Fi", "Time Travel"],
    status: "Đang tiến hành",
    type: "AI",
    featured: true,
    top: "week",
    chapters: [
      { id: 2801, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 29,
    title: "Ancient Ruins",
   cover: coverMap["bialn.png"],
    description: "Di tích cổ đại...",
    genres: ["Adventure", "Mystery"],
    status: "Đang tiến hành",
    type: "Truyện dịch",
    featured: true,
    top: "month",
    chapters: [
      { id: 2901, title: "Chương 1", content: "Nội dung..." },
    ],
  },
  {
    id: 30,
    title: "Modern Vietnamese Love",
    cover: coverMap["bialn.png"],
    description: "Tình yêu hiện đại Việt...",
    genres: ["Romance", "Contemporary"],
    status: "Hoàn thành",
    type: "Sáng tác",
    featured: true,
    top: "week",
    chapters: [
      { id: 3001, title: "Chương 1", content: "Nội dung..." },
    ],
  },

  {
  id: 31,
  title: "Cái Chết của Một Dũng Sĩ Mặt Nạ",
  cover: coverMap["nonamem6.jpg"],
  type: "Sáng tác",

  sangTacInfo: {
    author: "Tuyệt Đối Sảng Văn Nhân",
    words: "25,440",
    description: "Để tồn tại trong thế giới này, con người buộc phải đeo lên mình những chiếc mặt nạ. Một chính trị gia che giấu tham vọng, một người nổi tiếng che giấu sự cô độc, hay đơn giản là một người bình thường che giấu con người thật của mình trước xã hội. Nhưng chuyện gì sẽ xảy ra nếu một ngày, tất cả những chiếc mặt nạ đó bị bóc xuống? Khi cái tôi thật sự lộ diện, liệu đó là sự giải thoát... hay là khởi đầu của bi kịch? Đây là câu chuyện về một 'dũng sĩ' mang danh nghĩa cứu rỗi, nhưng lại dần đánh mất chính bản thân mình trong vô vàn lớp mặt nạ chồng chéo.",
    chapterMain: "Chương 5: Sinh nhật (16 - 17 tuổi)",
    chapterSub: "Khởi đầu: Mặt nạ, vũ khí, quái vật và những ngày mưa tầm tã"
  },

  genres: ["Drama"],
  status: "Đang tiến hành",
  chapters: []
},
  {
    id: 34,
    title: "Hào Quang Kẻ Phản Diện",
    cover: coverMap["bialn.png"],
    type: "Sáng tác",
    sangTacInfo: {
      author: "Shirayuki",
      words: "12,500",
      description: "Một câu chuyện về sự trỗi dậy của những kẻ bị lãng quên trong lịch sử. Khi ánh hào quang luôn thuộc về kẻ chiến thắng, những con người đứng trong bóng tối lại mang trong mình những khát vọng cháy bỏng. Họ không phải anh hùng, cũng chẳng phải phản diện đơn thuần, mà là những kẻ bị số phận ép buộc phải thay đổi thế giới theo cách riêng của mình, dù cái giá phải trả có thể là tất cả.",
      chapterMain: "Chương 9: Sự sụp đổ của vương triều",
      chapterSub: "Khởi đầu của một hành trình trong bóng tối"
    },
    genres: ["Drama"],
    status: "Đang tiến hành",
    chapters: [{ id: 3401, title: "Chương 9: Sự sụp đổ của vương triều" }],
},
  {
    id: 35,
    title: "Lời Nguyền Của Gió",
    cover: coverMap["noname4.jpg"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Tran Dinh Khanh",
      words: "9,800",
      description: "Tiếng gió rít qua khe cửa mang theo những bí mật từ ngàn năm trước. Mỗi cơn gió không chỉ là âm thanh của thiên nhiên mà còn là lời thì thầm của quá khứ chưa được giải mã. Khi một người vô tình nghe thấy những âm thanh kỳ lạ ấy, họ dần bị cuốn vào một vòng xoáy của những lời nguyền cổ xưa, nơi sự thật và ảo giác đan xen, khiến mọi thứ trở nên đáng sợ hơn bao giờ hết",
      chapterMain: "Chương 1: Tiếng gọi đêm thanh vắng",
      chapterSub: "Âm thanh từ cơn gió cổ xưa"
    },

    genres: ["Mystery", "Horror"],
    status: "Hoàn thành",
    chapters: [{ id: 3501, title: "Chương 1: Tiếng gọi đêm thanh vắng" }],
},
  {
    id: 36,
    title: "Chạm Tay Vào Nắng",
    cover: coverMap["noname3.jpg"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Truong Gia Huy",
      words: "15,200",
      description: "Thanh xuân là những ngày chạy theo bóng hình một người dưới sân trường. Đó là những khoảnh khắc ngây ngô, những rung động đầu đời và cả những lần bỏ lỡ không thể quay lại. Giữa nắng vàng rực rỡ và những cơn mưa bất chợt, câu chuyện về tuổi trẻ dần được viết nên bằng những kỷ niệm vừa ngọt ngào vừa day dứt, khiến người ta mãi mãi không thể quên.",
      chapterMain: "Chương 8: Mùa hạ năm ấy",
      chapterSub: "Những rung động đầu tiên"
    },
    genres: ["Romance", "School Life"],
    status: "Đang tiến hành",
    chapters: [{ id: 3601, title: "Chương 8: Mùa hạ năm ấy" }],
},
  {
    id: 37,
    title: "Hệ Thống Công Tước Giả Mạo",
    cover: coverMap["bialn.png"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Nanami",
      words: "12,500",
      description: "Xuyên không vào thân xác một kẻ trác táng, anh phải tìm cách sống sót trong một thế giới đầy rẫy âm mưu. Với một hệ thống không hoàn chỉnh và đầy lỗi, mọi quyết định đều có thể dẫn đến hậu quả không thể lường trước. Liệu anh có thể thay đổi số phận của bản thân hay sẽ bị cuốn theo dòng chảy nghiệt ngã của thế giới mà mình không hề thuộc về?",
      chapterMain: "Chương 9: Tỉnh dậy ở nơi xa lạ",
      chapterSub: "Hệ thống công tước giả mạo"
    },
    genres: ["Isekai", "Comedy"],
    status: "Đang tiến hành",
    type: "Sáng tác",
    chapters: [{ id: 3701, title: "Chương 9: Tỉnh dậy ở nơi xa lạ" }],
  },
  {
    id: 38,
    title: "Đêm Trắng Tại Đà Lạt",
    cover: coverMap["noname8.jpg"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Tran Dinh Khanh",
      words: "10,800",
      description: "Sương mù che khuất những tội ác đang dần được hé lộ. Thành phố tưởng chừng yên bình lại ẩn chứa những bí mật đen tối mà không ai dám đối mặt. Khi một vụ án kỳ lạ xảy ra giữa đêm khuya, từng lớp sự thật dần bị bóc tách, kéo theo những con người vô tội vào vòng xoáy nguy hiểm, nơi mà ranh giới giữa nạn nhân và thủ phạm trở nên mờ nhạt.",
      chapterMain: "Chương 3: Bản tin sáng sớm",
      chapterSub: "Đêm Trắng Tại Đà Lạt"
    },

    genres: ["Detective", "Thriller"],
    status: "Hoàn thành",
    type: "Sáng tác",
    chapters: [{ id: 3801, title: "Chương 3: Bản tin sáng sớm" }],
  },
  {
    id: 39,
    title: "Vị Thần Lang Thang",
    cover: coverMap["st5.jpg"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Kengo ichika",
      words: "13,700",
      description: "Một vị thần bị tước đi quyền năng, phải làm thuê để kiếm sống giữa thế giới loài người. Từ một thực thể được tôn thờ trở thành kẻ bị sai vặt, anh phải học cách thích nghi với cuộc sống đầy rắc rối và hài hước. Những tình huống dở khóc dở cười liên tục xảy ra, nhưng ẩn sau đó là hành trình tìm lại giá trị của bản thân và ý nghĩa thật sự của sức mạnh.",
      chapterMain: "Chương 10: 5 xu cho một điều ước",
      chapterSub: "Cuộc sống mới của một vị thần"
    },

    genres: ["Urban Fantasy", "Comedy"],
    status: "Đang tiến hành",
    chapters: [{ id: 3901, title: "Chương 10: 5 xu cho một điều ước" }],
},
  {
    id: 40,
    title: "Phía Sau Cánh Cửa",
    cover: coverMap["noname2.png"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Bui Nguyen Hoa Tranh",
      words: "15,200",
      description: "Mỗi cánh cửa đều dẫn đến một chiều không gian khác nhau. Không ai biết phía sau cánh cửa tiếp theo là gì—một thế giới kỳ diệu hay một cơn ác mộng không lối thoát. Khi một người tình cờ sở hữu chiếc chìa khóa có thể mở ra những cánh cửa ấy, họ bị cuốn vào hành trình khám phá vô tận, nơi mỗi lựa chọn đều có thể thay đổi hoàn toàn thực tại.",
      chapterMain: "Chương 8: Chìa khóa vạn năng",
      chapterSub: "Phía sau cánh cửa"
    },

    genres: ["Sci-Fi", "Adventure"],
    status: "Đang tiến hành",
    type: "Sáng tác",
    chapters: [{ id: 4001, title: "Chương 8: Chìa khóa vạn năng" }],
  },
  {
    id: 41,
    title: "Giai Điệu Cuối Cùng",
    cover: coverMap["noname1.png"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Uzumaki Menma",
      words: "12,500",
      description: "Tiếng đàn piano vang lên giữa đống đổ nát của một thành phố hậu tận thế. Trong thế giới nơi mọi thứ đã sụp đổ, âm nhạc trở thành thứ duy nhất giữ lại chút nhân tính còn sót lại. Câu chuyện theo chân một người nghệ sĩ cô độc, người dùng những giai điệu cuối cùng để kể lại ký ức, hy vọng và cả nỗi tuyệt vọng của một thế giới đã mất.",
      chapterMain: "Chương 23: Nốt nhạc đơn độc",
      chapterSub: "Giai điệu cuối cùng"
    },

    genres: ["Drama", "Tragedy"],
    status: "Hoàn thành",
    type: "Sáng tác",
    chapters: [{ id: 4101, title: "Chương 23: Nốt nhạc đơn độc" }],
  },
 {
    id: 42,
    title: "Ký Ức Của Những Vì Sao",
    cover: coverMap["thiensu.jpg"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Sagiri",
      words: "17,800",
      description: "Chúng ta đều là những hạt bụi sao đang tìm đường về nhà. Giữa vũ trụ rộng lớn và vô tận, con người chỉ là những sinh vật nhỏ bé nhưng lại mang trong mình những ước mơ không giới hạn. Khi một hành trình khám phá không gian bắt đầu, những bí mật về nguồn gốc, ký ức và định mệnh dần được hé lộ, khiến mọi thứ trở nên sâu sắc và đầy cảm xúc hơn bao giờ hết.",
      chapterMain: "Chương 10: Bầu trời không có tuổi",
      chapterSub: "Hành trình giữa các vì sao"
    },

    genres: ["Sci-Fi", "Poetic"],
    status: "Đang tiến hành",
    chapters: [{ id: 4201, title: "Chương 10: Bầu trời không có tuổi" }],
},
  {
    id: 43,
    title: "Bí Mật Dòng Sông Hàn",
    cover: coverMap["aya.jpg"],
    type: "Sáng tác",

    sangTacInfo: {
      author: "Unknown Author",
      words: "11,600",
      description: "Những câu chuyện chưa kể về thành phố bên bờ sông. Không chỉ là những con phố đông đúc hay ánh đèn lung linh, nơi đây còn chứa đựng vô vàn mảnh đời với những câu chuyện riêng biệt. Từ những cuộc gặp gỡ tình cờ đến những chia ly không lời từ biệt, tất cả tạo nên một bức tranh đời sống chân thực, nơi mỗi con người đều để lại dấu ấn của riêng mình",
      chapterMain: "Chương 2: Chuyến tàu cuối cùng",
      chapterSub: "Những mảnh đời giao nhau"
    },

    genres: ["Slice of Life"],
    status: "Hoàn thành",
    chapters: [{ id: 4301, title: "Chương 2: Chuyến tàu cuối cùng" }],
},
{
    id: 44,
    title: "The Lost Kingdom",
    cover: coverMap["bialn.png"],
    type: "Truyện dịch",
    sangTacInfo: {
      author: "Unknown",
      words: "??",
      description: "Một vương quốc cổ đại bị lãng quên...",
      chapterMain: "Chương 1: Cánh cổng cổ đại",
      chapterSub: ""
    },
    genres: ["Fantasy", "Adventure"],
    status: "Đang tiến hành",
    chapters: [
      { id: 4401, title: "Chương 1: Cánh cổng cổ đại" }
    ]
  },

  {
    id: 45,
    title: "Shadow of the Assassin",
    cover: coverMap["bialn.png"],
    type: "Truyện dịch",
    sangTacInfo: {
      author: "Unknown",
      words: "??",
      description: "Trong thế giới ngầm đầy rẫy những âm mưu...",
      chapterMain: "Chương 1: Hợp đồng cuối cùng",
      chapterSub: ""
    },
    genres: ["Action", "Thriller"],
    status: "Hoàn thành",
    chapters: [
      { id: 4501, title: "Chương 1: Hợp đồng cuối cùng" }
    ]
  },
{
  id: 32,
  title: "Thiên Mệnh Vĩnh Cửu",
  cover: coverMap["noname9.jpg"],
  type: "Sáng tác",

  sangTacInfo: {
    author: "Veris Hinata",
    words: "41,048",
    description: "Saphir chỉ là một nữ sinh bình thường, cho đến khi cô vô tình trở thành vật chứa của một thực thể cổ xưa đến từ một chủng tộc đang đứng bên bờ tuyệt diệt. Sức mạnh mà cô nắm giữ không chỉ là một món quà, mà còn là một lời nguyền. Khi những ký ức không thuộc về mình bắt đầu xâm chiếm tâm trí, Saphir phải đối mặt với một lựa chọn: trao trả sức mạnh để cứu lấy một chủng tộc xa lạ, hay giữ nó lại để bảo vệ thế giới mà cô đang sống? Nhưng liệu mọi thứ có đơn giản như vậy, khi ranh giới giữa con người và thần linh dần trở nên mờ nhạt?",
    chapterMain: "Chương 9: Lễ hội mùa đông (tiếp)",
    chapterSub: "Ánh sáng, lời hứa và những bí mật chưa được hé lộ"
  },

  genres: ["Fantasy"],
  status: "Đang tiến hành",
  chapters: [
    { id: 3209, title: "Chương 9: Lễ hội mùa đông (tiếp)" }
  ]
},

{
  id: 33,
  title: "Anh muốn hoàn thành phản ứng hóa học trong tim em",
  cover: coverMap["noname7.jpg"],
  type: "Sáng tác",

  sangTacInfo: {
    author: "Mayuki Neko nè",
    words: "7,910",
    description: "Có người từng hỏi tôi: 'Bạn thấy điều gì lãng mạn trong hóa học?' Thành thật mà nói, tôi chẳng thấy gì cả. Tôi chỉ thấy những trang báo cáo dài dằng dặc, những công thức khô khan và những đêm thức trắng để hoàn thành thí nghiệm. Hóa học, trong mắt tôi, chỉ là một chuỗi phản ứng mệt mỏi và vô nghĩa. Nhưng rồi tôi gặp em – một người có thể biến những phương trình vô hồn thành những câu chuyện thú vị. Từ đó, tôi bắt đầu tự hỏi: liệu trái tim con người có thể tồn tại một phản ứng hóa học đặc biệt, một phản ứng mang tên 'tình yêu'?",
    chapterMain: "Chương 2: Liệu em có thích anh không",
    chapterSub: "Một phản ứng cần phải cân bằng"
  },

  genres: ["Romance"],
  status: "Đang tiến hành",
  chapters: [
    { id: 3302, title: "Chương 2: Liệu em có thích anh không" }
  ]
}
];