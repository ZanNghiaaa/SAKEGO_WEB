import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Chào bạn! Mình là Trợ lý AI của SAKEGO. Bạn cần tư vấn về công dụng của sa kê hay muốn gợi ý món ngon hôm nay?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onerror = (event) => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        // Tự động gửi sau khi nhận dạng xong
        handleSend(transcript);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue(''); // Xóa text cũ khi bắt đầu nghe
      recognitionRef.current?.start();
    }
  };

  const handleSend = (textToSend = inputValue) => {
    const text = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      let botReply = '';
      const q = userMessage.text.toLowerCase();

      // ─── Helper: keyword matcher ───────────────────────────────
      const has = (...words) => words.some(w => q.includes(w));

      // ══════════════════════════════════════════════════════════
      // 1. CHÀO HỎI / GIỚI THIỆU
      // ══════════════════════════════════════════════════════════
      if (has('xin chào', 'chào bạn', 'hello', 'hi ', 'hey', 'chào shop', 'chào sakego')) {
        botReply = '👋 Xin chào bạn! Mình là trợ lý AI của SAKEGO — thương hiệu chuyên các sản phẩm từ Sa Kê tươi ngon Đồng bằng sông Cửu Long. 🌿 Bạn muốn tìm hiểu về Trà Lá Sa Kê, Bánh Mochi Sa Kê hay Sữa Gạo Sa Kê ạ?';

      } else if (has('bạn là ai', 'mày là ai', 'tên gì', 'ai tạo ra', 'bot không', 'robot không', 'ai vậy')) {
        botReply = '🤖 Mình là Trợ lý ảo chính thức của SAKEGO, được lập trình để tư vấn về 3 sản phẩm chủ lực: Trà Lá Sa Kê 🍵, Bánh Mochi Sa Kê 🍡 và Sữa Gạo Sa Kê 🥛. Mình sẵn sàng hỗ trợ bạn 24/7 — cứ hỏi thoải mái nhé!';

      // ══════════════════════════════════════════════════════════
      // 2. TRÀ LÁ SA KÊ — THÀNH PHẦN & TỔNG QUAN
      // ══════════════════════════════════════════════════════════
      } else if (has('trà lá sa kê', 'trà sa kê', 'lá sa kê', 'trà sakego', 'thành phần trà', 'lá sa kê khô') && !has('pha', 'cách', 'bảo quản', 'bệnh', 'tiểu đường', 'huyết áp', 'mất ngủ', 'giảm cân', 'detox', 'người già', 'ngon', 'vị', 'đắng')) {
        botReply = '🍵 Trà Lá Sa Kê SAKEGO được làm từ 100% lá sa kê tươi thu hoạch tại vùng ĐBSCL, sấy khô tự nhiên — hoàn toàn không phụ gia, không chất bảo quản. Lá sa kê chứa nhiều flavonoid, polyphenol, vitamin C và khoáng chất tự nhiên cực kỳ quý giá cho sức khỏe! 🌿 Bạn muốn biết thêm về cách pha hay công dụng của trà không ạ?';

      // ══════════════════════════════════════════════════════════
      // 3. TRÀ LÁ SA KÊ — CÁCH PHA
      // ══════════════════════════════════════════════════════════
      } else if ((has('trà', 'lá sa kê', 'trà sa kê') && has('pha', 'cách pha', 'pha như thế nào', 'pha ra sao', 'uống sao', 'dùng như thế nào', 'hướng dẫn')) ||
                 has('pha trà', 'cách uống trà', 'hãm trà', 'pha như nào')) {
        botReply = '🍵 Cách pha Trà Lá Sa Kê rất đơn giản: Dùng 5–10g trà khô (hoặc 1–2 túi lọc) hãm với 500ml nước sôi 95–100°C trong 5–10 phút. Có thể uống nóng hoặc để nguội, thêm đá uống mùa hè cực ngon! ✨ Mỗi ngày nên uống 2–3 ly, tốt nhất là sau bữa ăn hoặc trước khi ngủ để phát huy tối đa công dụng bạn nhé.';

      // ══════════════════════════════════════════════════════════
      // 4. TRÀ LÁ SA KÊ — HƯƠNG VỊ
      // ══════════════════════════════════════════════════════════
      } else if ((has('trà', 'lá sa kê') && has('ngon không', 'vị', 'đắng không', 'mùi', 'hương vị', 'uống có ngon', 'vị như thế nào'))) {
        botReply = '😊 Trà Lá Sa Kê có hương vị thanh mát, ngọt hậu nhẹ, hoàn toàn không đắng và không gây khó chịu dạ dày. Nhiều khách hàng của SAKEGO chia sẻ rằng uống rất quen miệng và dễ ghiền — đặc biệt khi pha lạnh uống mùa hè! 🌿 Bạn có thể thêm một chút mật ong hoặc chanh để tăng hương vị theo sở thích nhé.';

      // ══════════════════════════════════════════════════════════
      // 5. TRÀ LÁ SA KÊ — CÔNG DỤNG & SỨC KHỎE
      // ══════════════════════════════════════════════════════════
      } else if ((has('trà', 'lá sa kê', 'trà sa kê') && has('công dụng', 'tác dụng', 'tốt không', 'lợi ích', 'trị gì', 'hỗ trợ gì', 'giúp gì', 'sức khỏe')) ||
                 has('trà trị gì', 'trà có tác dụng', 'trà hỗ trợ')) {
        botReply = '🌿 Trà Lá Sa Kê hỗ trợ rất nhiều lợi ích sức khỏe: ổn định đường huyết (rất tốt cho người tiểu đường), điều hòa huyết áp, thanh nhiệt giải độc, cải thiện giấc ngủ và hỗ trợ giảm cân tự nhiên. 💚 Đây là thức uống lành mạnh được nhiều chuyên gia dinh dưỡng khuyên dùng hằng ngày. Bạn muốn tìm hiểu thêm công dụng nào cụ thể không ạ?';

      } else if (has('tiểu đường', 'đường huyết', 'hạ đường', 'đường trong máu')) {
        botReply = '💊 Trà Lá Sa Kê là lựa chọn cực kỳ phù hợp cho người tiểu đường! Các nghiên cứu cho thấy lá sa kê chứa hoạt chất giúp ổn định và hạ đường huyết hiệu quả, đồng thời an toàn khi dùng lâu dài. 🍵 Uống 2–3 ly/ngày sau bữa ăn sẽ giúp kiểm soát đường huyết tốt hơn bạn nhé!';

      } else if (has('huyết áp', 'cao huyết áp', 'tim mạch', 'hạ áp')) {
        botReply = '❤️ Trà Lá Sa Kê rất tốt cho người huyết áp cao! Các flavonoid trong lá sa kê có tác dụng giãn mạch, hỗ trợ điều hòa huyết áp tự nhiên và bảo vệ tim mạch. 🌿 Dùng đều đặn mỗi ngày kết hợp với chế độ ăn lành mạnh, bạn sẽ thấy sự cải thiện rõ rệt đó ạ!';

      } else if (has('mất ngủ', 'ngủ không được', 'khó ngủ', 'giấc ngủ', 'ngủ ngon')) {
        botReply = '😴 Một trong những công dụng được nhiều khách hàng yêu thích nhất của Trà Lá Sa Kê là giúp cải thiện giấc ngủ! 🍵 Uống 1 ly trà ấm khoảng 30 phút trước khi ngủ sẽ giúp bạn thư giãn, dễ vào giấc và ngủ sâu hơn. Hoàn toàn tự nhiên, không gây buồn ngủ ban ngày như thuốc nhé!';

      } else if (has('thanh nhiệt', 'giải nhiệt', 'mát gan', 'giải độc', 'detox', 'thải độc')) {
        botReply = '🌿 Trà Lá Sa Kê có tính thanh nhiệt, giải độc rất hiệu quả nhờ các chất chống oxy hóa mạnh. Uống thường xuyên giúp làm mát cơ thể, thanh lọc gan thận, giảm mụn và làm đẹp da từ bên trong. ✨ Đây là lựa chọn detox tự nhiên lành mạnh cho mùa hè, bạn nhé!';

      } else if ((has('trà', 'lá sa kê') && has('giảm cân', 'giảm béo', 'giảm mỡ', 'ăn kiêng')) || has('trà giảm cân')) {
        botReply = '🏃 Trà Lá Sa Kê hỗ trợ giảm cân hiệu quả nhờ giúp kiểm soát đường huyết, giảm tích trữ mỡ thừa và tăng cường trao đổi chất. 🍵 Uống trước bữa ăn 15–20 phút sẽ giúp bạn no nhanh hơn và ít ăn hơn tự nhiên. Kết hợp với tập thể dục đều đặn thì hiệu quả rất tốt đó bạn!';

      // ══════════════════════════════════════════════════════════
      // 6. TRÀ LÁ SA KÊ — ĐỐI TƯỢNG SỬ DỤNG
      // ══════════════════════════════════════════════════════════
      } else if ((has('trà', 'lá sa kê') && has('người già', 'người lớn tuổi', 'ông bà', 'ba mẹ')) ||
                 has('người già uống trà', 'người cao tuổi uống trà')) {
        botReply = '👴👵 Trà Lá Sa Kê rất phù hợp cho người lớn tuổi! Đặc biệt tốt cho những ai có vấn đề về huyết áp, đường huyết, khó ngủ hay cần thanh nhiệt giải độc. 🍵 Vị thanh nhẹ, dễ uống — ông bà sẽ rất thích. Đây cũng là món quà sức khỏe ý nghĩa bạn có thể biếu người thân nhé!';

      // ══════════════════════════════════════════════════════════
      // 7. TRÀ LÁ SA KÊ — BẢO QUẢN
      // ══════════════════════════════════════════════════════════
      } else if ((has('trà', 'lá sa kê') && has('bảo quản', 'để được bao lâu', 'hạn sử dụng', 'giữ được không', 'để ở đâu'))) {
        botReply = '📦 Trà Lá Sa Kê SAKEGO bảo quản rất đơn giản: Để ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và độ ẩm cao. Sau khi mở túi nên dùng kẹp hoặc bảo quản trong hộp kín. 🌿 Hạn sử dụng thường là 12–18 tháng kể từ ngày sản xuất, bạn xem thêm trên bao bì nhé!';

      // ══════════════════════════════════════════════════════════
      // 8. BÁNH MOCHI SA KÊ — TỔNG QUAN & THÀNH PHẦN
      // ══════════════════════════════════════════════════════════
      } else if ((has('mochi', 'bánh mochi', 'bánh sa kê', 'bánh dẻo') && !has('nhân', 'ăn như thế nào', 'lạnh', 'nóng', 'calo', 'bảo quản', 'hạn', 'quà', 'khác')) ||
                 has('mochi sakego', 'mochi sa kê là gì', 'thành phần mochi')) {
        botReply = '🍡 Bánh Mochi Sa Kê của SAKEGO được làm từ bột nếp dẻo mịn kết hợp bột sa kê tươi — hoàn toàn tự nhiên, không phẩm màu, không chất bảo quản. Bánh có phần vỏ mềm dẻo đặc trưng, nhân kem béo ngậy thơm ngon. ✨ Đây là sản phẩm ăn vặt được yêu thích nhất của SAKEGO, bạn thử một lần là ghiền ngay!';

      // ══════════════════════════════════════════════════════════
      // 9. BÁNH MOCHI SA KÊ — HƯƠNG VỊ & NHÂN BÁNH
      // ══════════════════════════════════════════════════════════
      } else if (has('nhân mochi', 'nhân bánh', 'vị mochi', 'vị bánh', 'mochi ngon không', 'mochi có vị gì') ||
                 (has('mochi', 'bánh') && has('hương vị', 'ngon', 'vị', 'nhân'))) {
        botReply = '😋 Mochi Sa Kê SAKEGO có nhiều vị hấp dẫn: Lá dứa thơm mát, Bắp ngọt thanh và Nguyên bản bùi béo đặc trưng. 🍡 Vỏ bánh mềm dẻo tan ngay trong miệng, nhân kem béo nhẹ không ngấy — ăn cực kỳ ghiền! Đặc biệt ăn lạnh vào mùa hè thì ngon xuất sắc luôn bạn ơi!';

      // ══════════════════════════════════════════════════════════
      // 10. BÁNH MOCHI SA KÊ — CÁCH ĂN
      // ══════════════════════════════════════════════════════════
      } else if ((has('mochi', 'bánh') && has('ăn như thế nào', 'ăn lạnh', 'ăn nóng', 'cách ăn', 'ăn ra sao', 'dùng như thế nào'))) {
        botReply = '🍡 Mochi Sa Kê ngon nhất khi ăn lạnh hoặc ở nhiệt độ phòng mát! Để bánh trong ngăn mát tủ lạnh 30 phút trước khi ăn sẽ cho cảm giác vỏ hơi cứng bên ngoài, mềm dẻo bên trong — rất độc đáo. 😊 Có thể ăn kèm với trà nóng để cân bằng hương vị, hoặc dùng làm tráng miệng sau bữa ăn đều rất tuyệt!';

      // ══════════════════════════════════════════════════════════
      // 11. BÁNH MOCHI SA KÊ — CALO & ĂN KIÊNG
      // ══════════════════════════════════════════════════════════
      } else if ((has('mochi', 'bánh') && has('calo', 'calories', 'ăn kiêng', 'béo không', 'giảm cân', 'năng lượng'))) {
        botReply = '📊 Mỗi viên Mochi Sa Kê khoảng 60–80 kcal — tương đương một bữa ăn vặt nhẹ, không quá nhiều calo bạn nhé! 🍡 Tuy nhiên vì làm từ nếp và kem, nếu đang ăn kiêng nghiêm ngặt bạn chỉ nên ăn 1–2 viên/ngày. Đây vẫn là lựa chọn ăn vặt lành mạnh hơn bánh kẹo công nghiệp thông thường nhiều đó ạ!';

      // ══════════════════════════════════════════════════════════
      // 12. BÁNH MOCHI SA KÊ — TRẺ EM & PHÙ HỢP AI
      // ══════════════════════════════════════════════════════════
      } else if ((has('mochi', 'bánh') && has('trẻ em', 'em bé', 'bé', 'con nít', 'trẻ nhỏ'))) {
        botReply = '👶 Mochi Sa Kê rất phù hợp cho trẻ em từ 3 tuổi trở lên! Nguyên liệu tự nhiên, không chất bảo quản, không phẩm màu nhân tạo — phụ huynh hoàn toàn yên tâm. 🍡 Vị ngọt nhẹ và mềm dẻo của bánh sẽ được các bé rất yêu thích, đảm bảo con sẽ đòi mua thêm đó ạ! 😄';

      // ══════════════════════════════════════════════════════════
      // 13. BÁNH MOCHI SA KÊ — QUÀ TẶNG
      // ══════════════════════════════════════════════════════════
      } else if ((has('mochi', 'bánh') && has('quà tặng', 'quà biếu', 'tặng quà', 'làm quà', 'biếu', 'quà')) ||
                 has('mua quà', 'tặng bạn bè', 'quà tặng sakego')) {
        botReply = '🎁 Mochi Sa Kê là món quà tặng cực kỳ ý nghĩa và độc đáo! SAKEGO có hộp quà thiết kế đẹp mắt, sang trọng — phù hợp để tặng sếp, người thân, bạn bè hay đối tác kinh doanh. 😊 Bạn có thể order combo hộp quà kết hợp Mochi + Trà Lá Sa Kê để tặng vừa ngon vừa healthy — đảm bảo ai nhận cũng thích!';

      // ══════════════════════════════════════════════════════════
      // 14. BÁNH MOCHI SA KÊ — BẢO QUẢN & HẠN SỬ DỤNG
      // ══════════════════════════════════════════════════════════
      } else if ((has('mochi', 'bánh') && has('bảo quản', 'hạn sử dụng', 'để được bao lâu', 'bảo quản mochi', 'hạn'))) {
        botReply = '📦 Mochi Sa Kê nên bảo quản trong ngăn mát tủ lạnh (2–8°C), tránh để ở nhiệt độ phòng quá lâu vì vỏ bánh dễ bị khô. 🍡 Hạn sử dụng thường là 7–14 ngày kể từ ngày sản xuất khi giữ lạnh. Sau khi mở túi nên dùng trong 2–3 ngày để đảm bảo độ tươi ngon nhất nhé!';

      // ══════════════════════════════════════════════════════════
      // 15. SỮA GẠO SA KÊ — TỔNG QUAN & THÀNH PHẦN
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê', 'sữa gạo sa kê', 'bột sữa', 'bột sa kê') && !has('pha', 'calo', 'tăng cân', 'giảm cân', 'bảo quản', 'hạn', 'gym', 'chay', 'vegan', 'lactose', 'gluten')) ||
                 has('thành phần sữa', 'sữa gạo là gì', 'sữa sakego')) {
        botReply = '🥛 Sữa Gạo Sa Kê SAKEGO được làm từ gạo lứt hữu cơ kết hợp bột sa kê sấy khô — không lactose, không gluten, không chất bảo quản. Giàu carbohydrate phức tạp, vitamin nhóm B, canxi và chất xơ tự nhiên. ✨ Đây là thức uống dinh dưỡng hoàn hảo cho bữa sáng hoặc bổ sung năng lượng bất cứ lúc nào!';

      // ══════════════════════════════════════════════════════════
      // 16. SỮA GẠO SA KÊ — CÁCH PHA
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê', 'bột sa kê', 'bột sữa') && has('pha', 'cách pha', 'hướng dẫn', 'dùng như thế nào', 'pha như nào')) ||
                 has('pha sữa gạo', 'cách làm sữa gạo', 'pha bột sa kê')) {
        botReply = '🥛 Cách pha Sữa Gạo Sa Kê cực đơn giản: Dùng 3–4 muỗng canh bột pha với 200ml nước ấm 60–70°C, khuấy đều đến khi tan hoàn toàn. ✨ Uống nóng vào buổi sáng rất ngon và bổ, hoặc để nguội rồi thêm đá uống mùa hè cũng tuyệt! Có thể thêm chút mật ong, đường phèn hoặc vani tùy khẩu vị bạn nhé.';

      } else if ((has('sữa gạo', 'sữa sa kê') && has('nóng', 'uống nóng', 'pha nóng'))) {
        botReply = '☕ Sữa Gạo Sa Kê uống nóng rất thơm và bổ dưỡng! Pha với nước ấm 60–70°C, khuấy đều rồi thưởng thức ngay. 🥛 Đây là lựa chọn tuyệt vời cho bữa sáng vào những ngày mưa lạnh — ấm bụng, no lâu và cung cấp năng lượng ổn định cho cả buổi sáng đó bạn!';

      } else if ((has('sữa gạo', 'sữa sa kê') && has('lạnh', 'uống lạnh', 'thêm đá', 'pha lạnh'))) {
        botReply = '🧊 Sữa Gạo Sa Kê uống lạnh cực kỳ giải nhiệt! Bạn pha sẵn rồi để ngăn mát, hoặc pha xong cho thêm đá viên vào dùng ngay. 🥛 Vào mùa hè uống lạnh có vị thanh ngọt tự nhiên rất dễ chịu — khách hàng của SAKEGO hay nói "uống không biết ngán"! 😄';

      // ══════════════════════════════════════════════════════════
      // 17. SỮA GẠO SA KÊ — DINH DƯỠNG & CALO
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê') && has('calo', 'calories', 'dinh dưỡng', 'năng lượng', 'bao nhiêu calo'))) {
        botReply = '📊 Mỗi ly Sữa Gạo Sa Kê (200ml) cung cấp khoảng 120–150 kcal, giàu carbohydrate phức tạp giúp no lâu và cung cấp năng lượng bền vững. 🥛 Ngoài ra còn chứa vitamin B1, B3, canxi, sắt và chất xơ tự nhiên — rất tốt để thay thế bữa sáng nhanh hoặc bổ sung sau khi tập thể dục nhé!';

      // ══════════════════════════════════════════════════════════
      // 18. SỮA GẠO SA KÊ — TĂNG / GIẢM CÂN
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê') && has('tăng cân', 'tăng thêm cân', 'béo lên'))) {
        botReply = '💪 Sữa Gạo Sa Kê là lựa chọn tốt để hỗ trợ tăng cân lành mạnh! Giàu tinh bột phức tạp và năng lượng tự nhiên, bạn có thể uống 2 ly/ngày kết hợp chế độ ăn đủ chất và tập luyện. 🥛 Không gây béo phì đột ngột như đồ ngọt công nghiệp, mà tăng cân theo hướng bền vững, có lợi cho cơ thể bạn nhé!';

      } else if ((has('sữa gạo', 'sữa sa kê') && has('giảm cân', 'ăn kiêng', 'giảm mỡ', 'diet'))) {
        botReply = '🏃 Sữa Gạo Sa Kê phù hợp cho người đang ăn kiêng! Không lactose, ít chất béo, tinh bột phức tạp giúp no lâu mà không gây tăng cân nhanh. 🥛 Bạn có thể dùng thay thế sữa bò hoặc sữa đặc để giảm lượng calo nạp vào mỗi ngày. Kết hợp uống buổi sáng và trưa thay vì ăn vặt lung tung — rất hiệu quả đó!';

      // ══════════════════════════════════════════════════════════
      // 19. SỮA GẠO SA KÊ — ĐỐI TƯỢNG PHÙ HỢP
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê') && has('người già', 'ông bà', 'cao tuổi', 'lớn tuổi'))) {
        botReply = '👴👵 Sữa Gạo Sa Kê cực kỳ phù hợp cho người lớn tuổi! Không lactose nên không gây đầy bụng, dễ tiêu hóa, giàu canxi và vitamin nhóm B tốt cho xương khớp. 🥛 Dùng buổi sáng hoặc trước khi ngủ — đây là quà sức khỏe ý nghĩa bạn có thể biếu ông bà, ba mẹ!';

      } else if ((has('sữa gạo', 'sữa sa kê') && has('trẻ em', 'bé', 'con nít', 'em bé'))) {
        botReply = '👶 Sữa Gạo Sa Kê phù hợp cho trẻ em từ 2 tuổi trở lên! Không lactose, không gluten, dễ tiêu hóa và giàu dinh dưỡng tự nhiên. 🥛 Phụ huynh có thể cho bé uống thay thế sữa bò nếu bé bị dị ứng sữa, hoặc dùng bổ sung vào thực đơn ăn dặm đều rất tốt nhé!';

      } else if ((has('sữa gạo', 'sữa sa kê') && has('gym', 'tập gym', 'tập thể dục', 'thể thao', 'protein', 'phục hồi'))) {
        botReply = '💪 Sữa Gạo Sa Kê là thức uống phục hồi tuyệt vời sau khi tập gym! Giàu carbohydrate phức tạp giúp bổ sung glycogen, cung cấp năng lượng bền vững và hỗ trợ phục hồi cơ bắp. 🥛 Uống ngay sau khi tập khoảng 30–45 phút sẽ giúp cơ thể phục hồi nhanh hơn đó bạn! Có thể mix thêm chuối hoặc bơ để tăng dinh dưỡng nhé.';

      } else if ((has('sữa gạo', 'sữa sa kê') && has('chay', 'ăn chay', 'vegan', 'thuần chay', 'không ăn thịt'))) {
        botReply = '🌱 Tuyệt vời! Sữa Gạo Sa Kê 100% từ thực vật, hoàn toàn phù hợp với người ăn chay và vegan. Không có thành phần động vật, không lactose, không gluten. 🥛 Đây là nguồn năng lượng và dinh dưỡng lý tưởng để bổ sung vào thực đơn ăn chay hằng ngày của bạn — thơm ngon, bổ dưỡng và rất "plant-based friendly"!';

      } else if (has('không lactose', 'lactose', 'dị ứng sữa', 'không dung nạp lactose')) {
        botReply = '✅ Sữa Gạo Sa Kê hoàn toàn không chứa lactose — rất phù hợp cho người không dung nạp sữa bò! 🥛 Bạn có thể uống thoải mái mà không lo bị đầy bụng, tiêu chảy hay khó chịu. Đây là giải pháp tuyệt vời thay thế sữa bò cho cả gia đình đó ạ!';

      } else if (has('không gluten', 'gluten', 'celiac', 'dị ứng gluten')) {
        botReply = '✅ Sữa Gạo Sa Kê không chứa gluten, hoàn toàn an toàn cho người bị celiac hoặc nhạy cảm với gluten! 🥛 Gạo lứt và sa kê đều là nguyên liệu naturally gluten-free. Bạn yên tâm sử dụng và bổ sung vào thực đơn ăn kiêng gluten nhé!';

      // ══════════════════════════════════════════════════════════
      // 20. SỮA GẠO SA KÊ — BỮA SÁNG
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê') && has('bữa sáng', 'ăn sáng', 'buổi sáng')) ||
                 has('sữa gạo bữa sáng', 'uống sữa buổi sáng')) {
        botReply = '🌅 Sữa Gạo Sa Kê là lựa chọn bữa sáng hoàn hảo! Pha nhanh trong 2 phút, cung cấp năng lượng ổn định cho cả buổi sáng mà không gây buồn ngủ hay ì người. 🥛 Đặc biệt phù hợp cho người bận rộn, dân văn phòng hay học sinh sinh viên đi học sáng — vừa ngon, vừa nhanh, vừa healthy!';

      // ══════════════════════════════════════════════════════════
      // 21. SỮA GẠO SA KÊ — BẢO QUẢN
      // ══════════════════════════════════════════════════════════
      } else if ((has('sữa gạo', 'sữa sa kê', 'bột sa kê') && has('bảo quản', 'hạn sử dụng', 'để được bao lâu', 'để ở đâu'))) {
        botReply = '📦 Bột Sữa Gạo Sa Kê bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng và độ ẩm. Sau khi mở túi nên dùng kẹp hoặc chuyển vào hộp kín để giữ bột khô ráo. 🥛 Hạn sử dụng thường là 12 tháng kể từ ngày sản xuất. Sữa đã pha nên uống ngay hoặc bảo quản ngăn mát dùng trong vòng 24 giờ nhé!';

      // ══════════════════════════════════════════════════════════
      // 22. SO SÁNH SẢN PHẨM
      // ══════════════════════════════════════════════════════════
      } else if (has('so sánh trà', 'trà sa kê khác trà xanh', 'trà sa kê với trà xanh', 'khác trà xanh', 'tốt hơn trà xanh')) {
        botReply = '🍵 So sánh Trà Lá Sa Kê vs Trà Xanh:\n• Trà Sa Kê: Không caffeine, không gây mất ngủ, vị thanh nhẹ không đắng, đặc biệt tốt cho huyết áp & đường huyết.\n• Trà Xanh: Có caffeine, chống oxy hóa mạnh nhưng dễ gây nóng ruột nếu uống nhiều.\n🌿 Nếu bạn muốn uống trà tốt cho sức khỏe mà không lo caffeine hay đắng miệng — Trà Lá Sa Kê là lựa chọn hoàn hảo hơn đó ạ!';

      } else if (has('sữa gạo so với', 'so sánh sữa gạo', 'sữa gạo sa kê vs', 'sữa hạt', 'sữa bò', 'sữa hạnh nhân', 'sữa đậu nành') && has('khác', 'so', 'tốt hơn', 'hay hơn')) {
        botReply = '🥛 So sánh Sữa Gạo Sa Kê vs Sữa Hạt thông thường:\n• Sữa Gạo Sa Kê: Ngọt tự nhiên từ gạo + sa kê, vị thơm đặc trưng, giàu tinh bột phức tạp, phù hợp người tiểu đường nhẹ.\n• Sữa hạt (hạnh nhân, đậu nành): Giàu protein hơn nhưng thường có mùi đậu.\n✨ Điểm khác biệt của Sữa Gạo Sa Kê: vừa không lactose, vừa không gluten, lại có thêm công dụng từ sa kê — unique & healthy!';

      } else if (has('mochi sa kê khác', 'khác mochi thường', 'khác mochi nhật', 'mochi truyền thống', 'mochi nhật vs')) {
        botReply = '🍡 Điểm khác biệt của Mochi Sa Kê vs Mochi truyền thống:\n• Mochi thường: Chỉ dùng bột nếp, nhân đậu đỏ hoặc mè.\n• Mochi Sa Kê SAKEGO: Vỏ bổ sung bột sa kê tự nhiên tạo hương vị độc đáo, nhân kem béo ngậy đa dạng, nguyên liệu 100% Việt Nam.\n✨ Đây là phiên bản "nâng cấp" của mochi truyền thống — giữ nét quen thuộc nhưng thêm vị mới lạ đặc trưng riêng của SAKEGO!';

      // ══════════════════════════════════════════════════════════
      // 23. COMBO & GỢI Ý THEO NHU CẦU
      // ══════════════════════════════════════════════════════════
      } else if (has('combo', 'mua combo', 'combo 3', 'set', 'bộ sản phẩm', 'mua cùng nhau', 'combo sakego')) {
        botReply = '🎁 SAKEGO có các Combo siêu tiết kiệm: Combo ICH KY (Trà + Mochi), Combo DOUBLE CHILL (2 Sữa Gạo + 2 Mochi), Combo COUPLE CHILL (2 Trà + 2 Mochi) và Combo SAKE PARTY (đủ cả 3 dòng cho cả nhóm). 😊 Mua combo vừa tiết kiệm 6–15% so với mua lẻ, vừa được trải nghiệm đủ hương vị! Bạn ghé trang Sản Phẩm để xem chi tiết nhé!';

      } else if (has('nên mua gì', 'mua gì', 'chọn gì', 'tư vấn mua', 'gợi ý mua', 'nên dùng gì', 'cho mình biết nên mua', 'giúp mình chọn')) {
        botReply = '😊 Bạn đang quan tâm điều gì nhất? Mình sẽ gợi ý phù hợp nhất cho bạn:\n\n1️⃣ Thanh nhiệt - tốt cho sức khỏe → Trà Lá Sa Kê 🍵\n2️⃣ Ăn vặt ngon lạ → Bánh Mochi Sa Kê 🍡\n3️⃣ Bữa sáng dinh dưỡng nhanh gọn → Sữa Gạo Sa Kê 🥛\n4️⃣ Làm quà tặng sang chảnh → Combo hộp quà SAKEGO 🎁\n\nBạn thuộc nhóm nào ạ? Cứ nhắn mình tư vấn thêm nhé!';

      // ══════════════════════════════════════════════════════════
      // 24. GỢI Ý THEO NHÓM KHÁCH HÀNG
      // ══════════════════════════════════════════════════════════
      } else if (has('người lớn tuổi', 'người già', 'ông bà', 'ba mẹ', 'cho người già', 'tặng ông bà', 'sức khỏe người cao tuổi')) {
        botReply = '👴👵 Cho người lớn tuổi, SAKEGO gợi ý:\n🍵 Trà Lá Sa Kê — hỗ trợ huyết áp, đường huyết, giấc ngủ rất tốt.\n🥛 Sữa Gạo Sa Kê — dinh dưỡng dễ tiêu hóa, không lactose, bổ sung canxi.\n✨ Combo 2 sản phẩm này là quà biếu sức khỏe ý nghĩa nhất bạn có thể tặng cho người thân cao tuổi đó ạ!';

      } else if (has('văn phòng', 'dân văn phòng', 'đi làm', 'công sở', 'nhân viên văn phòng')) {
        botReply = '💼 Cho dân văn phòng, SAKEGO gợi ý:\n🥛 Sữa Gạo Sa Kê — bữa sáng nhanh 2 phút, no lâu, tỉnh táo cả buổi.\n🍵 Trà Lá Sa Kê — uống thay cà phê, giải stress, không gây mất ngủ.\n🍡 Mochi Sa Kê — ăn vặt buổi chiều tránh đói mà không lo tăng cân quá nhiều. 😊 Bộ 3 sản phẩm này là "survival kit" hoàn hảo cho ngày dài ở văn phòng!';

      } else if (has('học sinh', 'sinh viên', 'học sinh sinh viên', 'cho sinh viên', 'bạn trẻ', 'giới trẻ')) {
        botReply = '🎓 Cho học sinh sinh viên, SAKEGO gợi ý:\n🥛 Sữa Gạo Sa Kê — bữa sáng tiết kiệm mà đủ dinh dưỡng cho não hoạt động tốt.\n🍡 Mochi Sa Kê — snack "flex" mang đi học, trà bánh cùng bạn bè cực cool.\n🍵 Trà Lá Sa Kê — uống thay nước ngọt, detox sau những ngày thức khuya ôn thi. 😄 Giá cả phải chăng, vừa ngon vừa healthy — các bạn trẻ sẽ mê ngay!';

      } else if (has('quà biếu', 'quà tặng', 'tặng quà', 'biếu quà', 'quà noel', 'quà tết', 'quà 8/3', 'quà 20/10', 'quà sinh nhật', 'quà sức khỏe')) {
        botReply = '🎁 SAKEGO có những lựa chọn quà tặng cực ý nghĩa:\n🎀 Hộp quà Trà + Mochi — thanh lịch, phù hợp biếu sếp, đối tác.\n🎀 Set 3 sản phẩm SAKEGO — đa dạng, phù hợp tặng gia đình.\n🎀 Combo SAKE PARTY — to xịn, phù hợp quà tập thể hay sinh nhật.\n✨ Thiết kế hộp quà đẹp mắt, sang trọng — người nhận chắc chắn ấn tượng ngay từ cái nhìn đầu tiên đó bạn!';

      // ══════════════════════════════════════════════════════════
      // 25. GIÁ CẢ & MUA HÀNG
      // ══════════════════════════════════════════════════════════
      } else if (has('giá', 'bao nhiêu tiền', 'bao nhiêu đồng', 'giá bán', 'giá sản phẩm', 'giá trà', 'giá mochi', 'giá sữa')) {
        botReply = '💰 Giá sản phẩm SAKEGO rất hợp lý:\n🍵 Trà Lá Sa Kê: từ 45.000đ – 85.000đ/túi\n🍡 Bánh Mochi Sa Kê: từ 25.000đ/hộp\n🥛 Sữa Gạo Sa Kê: từ 55.000đ – 95.000đ/túi\n🎁 Combo: từ 28.000đ – 97.000đ tùy bộ.\nBạn ghé trang Sản Phẩm để xem giá chi tiết và order ngay nhé! 😊';

      // ══════════════════════════════════════════════════════════
      // 26. GIAO HÀNG & THANH TOÁN
      // ══════════════════════════════════════════════════════════
      } else if (has('ship', 'giao hàng', 'vận chuyển', 'phí ship', 'freeship', 'free ship', 'bao lâu nhận được')) {
        botReply = '🚚 SAKEGO giao hàng toàn quốc, thường 1–3 ngày nội thành, 2–5 ngày tỉnh xa. Freeship cho đơn từ 300.000đ trong nội thành. Đơn có thể track trực tiếp qua link giao hàng gửi kèm email xác nhận. 😊 Hàng được đóng gói cẩn thận, đảm bảo nguyên vẹn đến tay bạn!';

      } else if (has('thanh toán', 'momo', 'zalopay', 'chuyển khoản', 'cod', 'tiền mặt', 'trả sau')) {
        botReply = '💳 SAKEGO hỗ trợ nhiều hình thức thanh toán:\n• COD — Thanh toán tiền mặt khi nhận hàng\n• Chuyển khoản ngân hàng\n• Ví điện tử MoMo / ZaloPay\nBạn chọn cách nào tiện nhất là được nhé, SAKEGO linh hoạt hết! 😊';

      } else if (has('khuyến mãi', 'giảm giá', 'voucher', 'sale', 'ưu đãi', 'mã giảm giá', 'coupon')) {
        botReply = '🎉 SAKEGO thường xuyên có ưu đãi:\n• Voucher 50K cho khách hàng mới đăng ký tài khoản\n• Mua 3 tặng 1 cho các combo chọn lọc\n• Flash sale cuối tuần trên website\n😊 Bạn đăng ký thành viên ngay để không bỏ lỡ ưu đãi nào nhé! Thành viên còn được tích điểm đổi quà nữa đó!';

      // ══════════════════════════════════════════════════════════
      // 27. THÔNG TIN THƯƠNG HIỆU & LIÊN HỆ
      // ══════════════════════════════════════════════════════════
      } else if (has('nguồn gốc', 'xuất xứ', 'trồng ở đâu', 'miền tây', 'đbscl', 'đồng bằng', 'sông cửu long', 'vùng nguyên liệu')) {
        botReply = '🌾 Nguyên liệu SAKEGO được thu hoạch 100% từ nông trại sinh thái đạt chuẩn tại vùng ĐBSCL — Bến Tre và Tiền Giang. Không dư lượng thuốc trừ sâu, canh tác bền vững, hỗ trợ nông dân địa phương. 🌿 SAKEGO tự hào mang giá trị nông sản Việt Nam đến tận tay người tiêu dùng theo cách sáng tạo và hiện đại nhất!';

      } else if (has('liên hệ', 'hotline', 'số điện thoại', 'sđt', 'gọi cho', 'nhắn tin', 'contact', 'fanpage', 'facebook', 'instagram', 'zalo')) {
        botReply = '📞 Liên hệ SAKEGO:\n• Hotline: 039 2020 136 (8h–22h mỗi ngày)\n• Facebook: SAKEGO Official\n• Zalo OA: SAKEGO\n• Email: contact@sakego.vn\n😊 Đội ngũ CSKH của tụi mình phản hồi rất nhanh, bạn cứ liên hệ thoải mái nhé!';

      } else if (has('địa chỉ', 'cửa hàng', 'chi nhánh', 'showroom', 'ở đâu', 'trụ sở')) {
        botReply = '📍 SAKEGO hiện phân phối chính qua kênh Online (website này). Trụ sở tại TP. Cần Thơ. Bạn cũng có thể tìm sản phẩm tại một số điểm bán lẻ đối tác — liên hệ Hotline 039 2020 136 để hỏi điểm bán gần nhất bạn nhé! 🌿';

      } else if (has('đại lý', 'hợp tác', 'sỉ', 'bán buôn', 'nhượng quyền', 'phân phối', 'reseller')) {
        botReply = '🤝 SAKEGO rất mong được hợp tác! Chính sách đại lý cạnh tranh, hỗ trợ marketing và đào tạo đội ngũ bán hàng. Bạn vui lòng gọi Hotline 039 2020 136 hoặc để lại SĐT — chuyên viên kinh doanh sẽ liên hệ tư vấn chi tiết trong 24h nhé! 😊';

      // ══════════════════════════════════════════════════════════
      // 28. TỔNG QUAN SỨC KHỎE SA KÊ
      // ══════════════════════════════════════════════════════════
      } else if (has('sa kê là gì', 'trái sa kê', 'cây sa kê', 'sa ke') && !has('trà', 'mochi', 'sữa')) {
        botReply = '🌳 Sa kê (Artocarpus altilis) là loại cây nhiệt đới quý, phổ biến ở miền Tây Nam Bộ. Trái sa kê giàu tinh bột kháng, vitamin C, B, kali, magiê và chất xơ — vượt trội nhiều loại lương thực thông thường. 🌿 SAKEGO đang khai thác trọn vẹn tiềm năng dinh dưỡng của sa kê qua 3 dòng sản phẩm: Trà 🍵, Mochi 🍡 và Sữa Gạo 🥛 — bạn muốn tìm hiểu dòng nào ạ?';

      } else if (has('công dụng', 'sức khỏe', 'lợi ích', 'tốt không', 'bổ không', 'dinh dưỡng') && !has('trà', 'mochi', 'sữa')) {
        botReply = '💚 Sa kê mang lại rất nhiều lợi ích sức khỏe: Ổn định đường huyết, hỗ trợ huyết áp, tăng cường miễn dịch, cải thiện tiêu hóa, thanh nhiệt và giải độc. 🌿 Các sản phẩm SAKEGO giúp bạn hấp thụ những tinh túy này một cách ngon miệng và tiện lợi nhất! Bạn quan tâm công dụng nào cụ thể để mình tư vấn thêm nhé?';

      } else if (has('bà bầu', 'mang thai', 'thai kỳ', 'thai phụ')) {
        botReply = '🤰 Phụ nữ mang thai dùng sản phẩm SAKEGO rất an toàn! Sa kê giàu acid folic tốt cho thai nhi, vitamin và khoáng chất hỗ trợ mẹ bầu khỏe mạnh. 🍵 Tuy nhiên nên tham khảo ý kiến bác sĩ về liều lượng phù hợp và ưu tiên Sữa Gạo Sa Kê hoặc Trà Lá Sa Kê (lượng nhỏ). Tránh dùng quá nhiều sản phẩm ngọt nhé bạn!';

      } else if (has('ăn chay', 'thuần chay', 'vegan', 'chay trường', 'không động vật')) {
        botReply = '🌱 Tất cả sản phẩm SAKEGO đều 100% từ thực vật — hoàn toàn phù hợp với người ăn chay và vegan! Không thành phần động vật, không lactose. 😊 Đây là lựa chọn lý tưởng để bổ sung dinh dưỡng cho thực đơn ăn chay của bạn một cách ngon miệng và đa dạng nhé!';

      // ══════════════════════════════════════════════════════════
      // 29. CẢM XÚC & KẾT THÚC HỘI THOẠI
      // ══════════════════════════════════════════════════════════
      } else if (has('cảm ơn', 'cám ơn', 'thanks', 'thank you', 'tks', 'ty', 'ok rồi', 'hiểu rồi', 'được rồi')) {
        botReply = '😊 Không có chi bạn ơi! Rất vui khi được hỗ trợ bạn. Nếu còn câu hỏi gì về sản phẩm SAKEGO cứ nhắn mình bất cứ lúc nào nhé! 🌿 Chúc bạn có trải nghiệm mua sắm tuyệt vời và nhiều sức khỏe!';

      } else if (has('tạm biệt', 'bye', 'goodbye', 'chào nhé', 'hẹn gặp lại', 'thôi mình đi')) {
        botReply = '👋 Tạm biệt bạn! Hẹn gặp lại lần sau nhé! Đừng quên ghé thăm SAKEGO thường xuyên để cập nhật sản phẩm mới và ưu đãi hấp dẫn. 🌿 Chúc bạn ngày vui và nhiều sức khỏe!';

      // ══════════════════════════════════════════════════════════
      // 30. MẶC ĐỊNH
      // ══════════════════════════════════════════════════════════
      } else {
        botReply = '🤔 Câu hỏi thú vị! Mình chưa có sẵn thông tin về nội dung này, nhưng bạn có thể:\n• Gọi Hotline 039 2020 136 để được tư vấn trực tiếp\n• Ghé trang "Câu Chuyện SAKEGO" để tìm hiểu thêm\n• Hỏi mình về: Trà Lá Sa Kê 🍵, Bánh Mochi 🍡, Sữa Gạo Sa Kê 🥛, Combo, Giá cả hoặc Đặt hàng!\n😊 Mình có thể giúp gì khác không ạ?';
      }

      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="ai-chatbot-wrapper">
      {/* Floating Button and Suggestion */}
      <div className={`ai-chat-launcher ${isOpen ? 'hidden' : ''}`}>
        <div className="ai-chat-suggestion">
          Xin chào! 👋 Mình có thể giúp gì cho bạn?
        </div>
        <button
          className="ai-chat-btn"
          onClick={() => setIsOpen(true)}
        >
          <img src="/assets/images/linhvat01.png" alt="SAKEGO Mascot" className="ai-mascot-float" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <span className="ai-badge">1</span>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? 'active' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-header-info">
            <div className="ai-avatar">
              <img src="/assets/images/linhvat01.png" alt="SAKEGO AI" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span className="ai-status"></span>
            </div>
            <div>
              <h3>SAKEGO AI</h3>
              <span>Trợ lý trực tuyến 24/7</span>
            </div>
          </div>
          <div className="ai-chat-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <a href="tel:0392020136" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '600' }}>
              <i className="fas fa-phone-alt"></i> 039.2020.136
            </a>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="ai-chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message-row ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="ai-message-avatar">
                  <img src="/assets/images/linhvat01.png" alt="AI" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </div>
              )}
              <div className="ai-message-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-message-row bot">
              <div className="ai-message-avatar">
                <img src="/assets/images/linhvat01.png" alt="AI" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              </div>
              <div className="ai-message-bubble typing-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-footer">
          <div className="ai-input-wrapper">
            <button 
              className={`ai-mic-btn ${isListening ? 'listening' : ''}`} 
              onClick={toggleListening}
              title="Nhấn để nói"
            >
              <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </button>
            <input
              type="text"
              placeholder={isListening ? "Đang nghe..." : "Hỏi AI về Sa kê..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="ai-send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
