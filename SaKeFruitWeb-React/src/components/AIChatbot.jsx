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
      const lowerInput = userMessage.text.toLowerCase();

      if (lowerInput.includes('giá') || lowerInput.includes('bao nhiêu') || lowerInput.includes('tiền')) {
        botReply = 'Hiện tại SAKEGO đang có các combo cực kỳ ưu đãi. Giá các sản phẩm chế biến sẵn từ sa kê dao động từ 45.000đ - 120.000đ tùy loại. Bạn ghé trang Cửa Hàng (Products) để xem chi tiết nhé!';
      } else if (lowerInput.includes('công dụng') || lowerInput.includes('sức khỏe') || lowerInput.includes('tốt không') || lowerInput.includes('lợi ích')) {
        botReply = 'Trái sa kê cực kỳ tốt cho sức khỏe! Nó chứa nhiều vitamin C, chất chống oxy hóa giúp hỗ trợ tim mạch, hệ tiêu hóa. Hơn nữa, sa kê giàu tinh bột kháng, cực kỳ phù hợp cho người ăn kiêng hoặc bị tiểu đường đó bạn.';
      } else if (lowerInput.includes('món') || lowerInput.includes('nấu') || lowerInput.includes('ăn') || lowerInput.includes('làm gì')) {
        botReply = 'Với sa kê, bạn có thể biến tấu hàng tá món ngon: Sa kê chiên giòn (ngon như khoai tây), nấu canh sườn non, chè sa kê nếp cẩm, gỏi sa kê tôm thịt hoặc làm bim bim sa kê. Bạn thích ăn đồ mặn hay đồ ngọt để mình gợi ý thêm?';
      } else if (lowerInput.includes('hello') || lowerInput.includes('chào') || lowerInput.includes('hi ')) {
        botReply = 'Chào bạn! Chúc bạn một ngày tốt lành. Mình là Trợ lý AI của SAKEGO, luôn sẵn sàng hỗ trợ bạn 24/7. Bạn cần tìm hiểu gì về sa kê ạ?';
      } else if (lowerInput.includes('trà lá') || lowerInput.includes('pha trà') || lowerInput.includes('uống trà')) {
        botReply = 'Để pha trà lá sa kê, bạn lấy 1-2 túi lọc (hoặc 5-10g trà khô) hãm với 500ml nước sôi trong 5-10 phút. Trà có vị thanh mát, ngọt hậu nhẹ. Uống hàng ngày rất tốt cho việc ổn định huyết áp, hạ đường huyết và cải thiện giấc ngủ nhé!';
      } else if (lowerInput.includes('sữa gạo') || lowerInput.includes('pha sữa') || lowerInput.includes('uống sữa') || lowerInput.includes('cách làm sữa')) {
        botReply = 'Sữa gạo sa kê SAKEGO cực kỳ tiện lợi! Bạn dùng 3-4 muỗng bột pha với 200ml nước ấm (60-70 độ C), khuấy đều cho tan. Có thể thêm chút sữa đặc hoặc đường phèn tùy khẩu vị. Uống nóng vào buổi sáng hoặc thêm đá vào mùa hè đều ngon tuyệt và giàu năng lượng!';
      } else if (lowerInput.includes('bạn là ai') || lowerInput.includes('tên gì') || lowerInput.includes('ai tạo ra')) {
        botReply = 'Mình là Linh vật và là Trợ lý ảo AI chính thức của SAKEGO! Mình được tạo ra để giúp bạn khám phá thế giới tuyệt vời của trái sa kê Việt Nam.';
      } else if (lowerInput.includes('ship') || lowerInput.includes('giao hàng') || lowerInput.includes('vận chuyển') || lowerInput.includes('phí ship')) {
        botReply = 'SAKEGO hỗ trợ giao hàng toàn quốc nhé! Đặc biệt, freeship cho đơn hàng từ 300.000đ trong nội thành. Ở ngoại tỉnh, thời gian giao hàng thường từ 2-4 ngày ạ.';
      } else if (lowerInput.includes('thanh toán') || lowerInput.includes('mua hàng') || lowerInput.includes('đặt hàng')) {
        botReply = 'Bạn có thể đặt hàng trực tiếp trên website này bằng cách thêm sản phẩm vào Giỏ Hàng. SAKEGO hỗ trợ thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng hoặc ví điện tử MoMo/ZaloPay nhé.';
      } else if (lowerInput.includes('khuyến mãi') || lowerInput.includes('giảm giá') || lowerInput.includes('voucher') || lowerInput.includes('sale')) {
        botReply = 'SAKEGO đang có chương trình "Mua 3 tặng 1" áp dụng cho dòng Bim Bim Sa kê, và tặng ngay voucher 50K cho khách hàng mới đăng ký tài khoản. Bạn tranh thủ nhé!';
      } else if (lowerInput.includes('nguồn gốc') || lowerInput.includes('xuất xứ') || lowerInput.includes('trồng ở đâu') || lowerInput.includes('miền tây')) {
        botReply = 'Nguyên liệu của SAKEGO được thu hoạch 100% từ các nông trại canh tác sinh thái đạt chuẩn tại vùng Đồng bằng sông Cửu Long (đặc biệt là Bến Tre và Tiền Giang), đảm bảo không dư lượng thuốc trừ sâu.';
      } else if (lowerInput.includes('địa chỉ') || lowerInput.includes('cửa hàng') || lowerInput.includes('ở đâu') || lowerInput.includes('chi nhánh')) {
        botReply = 'Hiện tại SAKEGO phân phối chủ yếu qua kênh Online (website này). Bạn cũng có thể tìm thấy sản phẩm của tụi mình tại các chuỗi siêu thị đối tác như Co.opmart hoặc chuỗi cửa hàng tiện lợi. Trụ sở chính của SAKEGO nằm tại TP.HCM.';
      } else if (lowerInput.includes('liên hệ') || lowerInput.includes('số điện thoại') || lowerInput.includes('sđt') || lowerInput.includes('hotline')) {
        botReply = 'Bạn có thể gọi trực tiếp đến Hotline: 039 2020 136 hoặc nhắn tin qua trang Liên Hệ. Đội ngũ chăm sóc khách hàng của tụi mình luôn sẵn sàng bắt máy!';
      } else if (lowerInput.includes('ngon không') || lowerInput.includes('vị như thế nào') || lowerInput.includes('mùi vị')) {
        botReply = 'Sa kê có vị bùi bùi, dẻo thơm gần giống khoai tây hay khoai môn nhưng lại ngọt thanh và thơm nhẹ hơn rất nhiều. Đặc biệt khi chiên lên thì vỏ giòn rụm, bên trong mềm béo, ăn cực kỳ ghiền luôn ạ!';
      } else if (lowerInput.includes('bảo quản') || lowerInput.includes('để được bao lâu') || lowerInput.includes('hạn sử dụng')) {
        botReply = 'Với sa kê tươi, bạn nên bảo quản ngăn mát tủ lạnh (để được 3-5 ngày). Còn với các sản phẩm chế biến sẵn của SAKEGO như Bim bim hay Trà sa kê thì hạn sử dụng lên đến 6-12 tháng tùy loại, thông tin chi tiết có in trên bao bì nhé!';
      } else if (lowerInput.includes('chay') || lowerInput.includes('ăn chay')) {
        botReply = 'Chắc chắn rồi! 100% các sản phẩm của SAKEGO đều thuần chay (vegan) và cực kỳ tốt cho sức khỏe. Trái sa kê là nguồn cung cấp tinh bột và dinh dưỡng tuyệt vời cho thực đơn ăn chay hằng ngày của bạn.';
      } else if (lowerInput.includes('trẻ em') || lowerInput.includes('em bé')) {
        botReply = 'Rất tốt luôn ạ! Sa kê lành tính, dễ tiêu hóa và không chứa gluten, là thực phẩm ăn dặm hoặc ăn vặt rất an toàn, bổ dưỡng cho bé nhà mình.';
      } else if (lowerInput.includes('bà bầu') || lowerInput.includes('phụ nữ mang thai') || lowerInput.includes('thai kỳ')) {
        botReply = 'Phụ nữ mang thai ăn sa kê rất tốt nhé. Sa kê giàu vitamin, khoáng chất và acid folic giúp hỗ trợ sự phát triển của thai nhi, đồng thời lượng chất xơ dồi dào cũng giúp mẹ bầu tiêu hóa tốt hơn.';
      } else if (lowerInput.includes('đại lý') || lowerInput.includes('hợp tác') || lowerInput.includes('sỉ') || lowerInput.includes('bán buôn')) {
        botReply = 'SAKEGO rất mong được hợp tác cùng bạn! Để trao đổi về chính sách đại lý và giá sỉ, bạn vui lòng để lại số điện thoại hoặc liên hệ trực tiếp Hotline 039 2020 136 để chuyên viên kinh doanh hỗ trợ bạn nhanh nhất nhé.';
      } else if (lowerInput.includes('cảm ơn') || lowerInput.includes('thank') || lowerInput.includes('ok') || lowerInput.includes('tốt')) {
        botReply = 'Không có chi ạ! Phục vụ bạn là niềm vui của SAKEGO. Chúc bạn có trải nghiệm mua sắm tuyệt vời và có thật nhiều sức khỏe nhé!';
      } else {
        botReply = 'Câu hỏi của bạn rất hay! Do mình đang trong quá trình học hỏi, bạn có thể tham khảo thêm thông tin ở trang "Câu Chuyện SAKEGO" hoặc gọi Hotline 039 2020 136 để được tư vấn chi tiết hơn nhé. Mình có thể giúp gì khác không?';
      }

      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 1500);
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
