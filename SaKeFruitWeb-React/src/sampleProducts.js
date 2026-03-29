// Danh sách sản phẩm và combo mẫu cho frontend (hardcode)
// Đảm bảo tên và ảnh khớp với backend

const sampleProducts = [
  {
    id: 'tra-sake',
    name: 'Trà SAKE',
    price: 10000,
    image: '/assets/images/tra_SAKE.jpg',
    description: 'Trà SAKEGO 100% tự nhiên, giàu chất chống oxi hóa. Pha liền tiện lợi, thơm ngon. Trọng lượng: 50g',
    category: 'tea',
  },
  {
    id: 'sua-gao-sa-ke',
    name: 'Sữa Gạo Sa Kê ',
    price: 15000,
    image: '/assets/images/suagao.jpg',
    description: 'Sữa gạo Sa Kê 100% tự nhiên, giàu dinh dưỡng, mềm mịn, béo ngậy. Trọng lượng: 200ml',
    category: 'rice-milk',
  },
  {
    id: 'mochi-combo-4-vi',
    name: 'Bánh Mochi Combo 4 Vị',
    price: 72000,
    image: '/assets/images/mochi.jpg',
    description: 'Combo 4 vị mochi SAKEGO đa dạng: Phô mai, việt quất, Truyền thống, Sôcôla. Sản phẩm ăn liền tiện lợi.',
    category: 'mochi',
  },
  {
    id: 'mochi-sakego',
    name: 'Bánh Mochi SAKEGO',
    price: 20000,
    image: '/assets/images/Sake_mochi.jpg',
    description: 'Bánh mochi SAKEGO mềm mịn, thơm ngon. Sản phẩm ăn liền tiện lợi.',
    category: 'mochi',
  },
  {
    id: 'chill-mot-minh',
    name: 'CHILL MỘT MÌNH',
    price: 32000,
    image: '/assets/images/combo_1chilll.png',
    description: 'Combo hoàn hảo cho những phút giây thư giãn một mình. Gồm 1 Sữa gạo Sa Kê mềm mịn, béo ngậy và 1 Mochi thơm ngon. Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
  },
  {
    id: 'ich-ky',
    name: 'ÍCH KỶ',
    price: 28000,
    image: '/assets/images/combo_ichki.jpg',
    description: 'Combo nhẹ nhàng cho những ai yêu thích sự tinh tế. Gồm 1 Trà lá Sa Kê thanh mát và 1 Mochi mềm dai. Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
  },
  {
    id: 'double-chill',
    name: 'DOUBLE CHILL',
    price: 63000,
    image: '/assets/images/combo_2chill.jpg',
    description: '🔥 BEST SELLER! Combo gấp đôi niềm vui cho cặp đôi hoặc bạn bè. Gồm 2 Sữa gạo Sa Kê thơm ngon và 2 Mochi mềm mịn. Tiết kiệm 7.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
  },
  {
    id: 'couple-chill',
    name: 'COUPLE CHILL',
    price: 54000,
    image: '/assets/images/Combo_2chill.png',
    description: 'Combo lý tưởng cho các cặp đôi yêu thích trà. Gồm 2 Trà lá Sa Kê thanh mát và 2 Mochi thơm ngon. Tiết kiệm 6.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
  },
  {
    id: 'sake-party',
    name: 'SAKE PARTY',
    price: 85000,
    image: '/assets/images/combo_PT.jpg',
    description: 'Combo đại tiệc cho nhóm bạn! Gồm 1 Sữa gạo Sa Kê, 1 Trà lá Sa Kê và 4 Mochi đa dạng hương vị. Tiết kiệm 12.000đ! Tùy chọn vị: Lá dứa, Bắp, Nguyên bản.',
    category: 'combo',
  },
];

export default sampleProducts;
