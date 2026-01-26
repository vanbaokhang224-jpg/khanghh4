// Câu 1: Khai báo constructor function Product để tạo đối tượng sản phẩm.
function Product(id, name, price, quantity, category, isAvailable) {
  this.id = id;                 // mã sản phẩm
  this.name = name;             // tên sản phẩm
  this.price = price;           // giá sản phẩm
  this.quantity = quantity;     // số lượng tồn kho
  this.category = category;     // danh mục sản phẩm
  this.isAvailable = isAvailable; // trạng thái bán (true/false)
}

// Câu 2: Khởi tạo mảng products gồm ít nhất 6 sản phẩm, tối thiểu 2 danh mục khác nhau.
const products = [
  new Product("P001", "MacBook Pro M3", 45900000, 5, "Laptop", true),
  new Product("P002", "iPhone 15 Pro Max", 34900000, 0, "Phone", true),
  new Product("P003", "iPad Pro 12.9", 29900000, 12, "Tablet", false),
  new Product("P004", "AirPods Pro 2", 5990000, 20, "Accessories", true),
  new Product("P005", "Magic Mouse", 2490000, 2, "Accessories", true),
  new Product("P006", "Apple Watch Ultra 2", 22900000, 7, "Watch", true),
];

// In mảng gốc
console.log("=== MẢNG PRODUCTS BAN ĐẦU ===");
console.table(products);

// Câu 3: Tạo mảng mới chỉ chứa: name, price của mỗi sản phẩm.
const namePriceList = products.map((p) => ({
  name: p.name,
  price: p.price,
}));
console.log("\n=== CÂU 3: MẢNG CHỈ CHỨA name, price ===");
console.table(namePriceList);

// Câu 4: Lọc ra các sản phẩm còn hàng trong kho (quantity > 0).
const inStockProducts = products.filter((p) => p.quantity > 0);
console.log("\n=== CÂU 4: SẢN PHẨM CÒN HÀNG (quantity > 0) ===");
console.table(inStockProducts);

// Câu 5: Kiểm tra xem có ít nhất một sản phẩm có giá trên 30.000.000 hay không.
const hasOver30M = products.some((p) => p.price > 30000000);
console.log("\n=== CÂU 5: CÓ SP GIÁ > 30.000.000 KHÔNG? ===");
console.log(hasOver30M); // true/false

// Câu 6: Kiểm tra xem tất cả sản phẩm thuộc danh mục "Accessories" có đang được bán (isAvailable = true) hay không.
const accessories = products.filter((p) => p.category === "Accessories");
const allAccessoriesAvailable = accessories.length > 0 && accessories.every((p) => p.isAvailable === true);

console.log('\n=== CÂU 6: TẤT CẢ "Accessories" CÓ isAvailable = true KHÔNG? ===');
console.log(allAccessoriesAvailable); // true/false

// Câu 7: Tính tổng giá trị kho hàng. Giá trị kho = price × quantity
const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
console.log("\n=== CÂU 7: TỔNG GIÁ TRỊ KHO (price * quantity) ===");
console.log(totalInventoryValue.toLocaleString("vi-VN") + " VND");

// Câu 8: Dùng for...of duyệt mảng products và in ra: Tên sản phẩm - Danh mục - Trạng thái
console.log("\n=== CÂU 8: for...of IN (Tên - Danh mục - Trạng thái) ===");
for (const p of products) {
  const statusText = p.isAvailable ? "Đang bán" : "Ngừng bán";
  console.log(`${p.name} - ${p.category} - ${statusText}`);
}

// Câu 9: Dùng for...in để:
// - In ra tên thuộc tính
// - In ra giá trị tương ứng
console.log("\n=== CÂU 9: for...in IN TÊN THUỘC TÍNH & GIÁ TRỊ (SẢN PHẨM ĐẦU TIÊN) ===");
const firstProduct = products[0];
for (const key in firstProduct) {
  console.log(`${key}: ${firstProduct[key]}`);
}

// Câu 10: Lấy danh sách tên các sản phẩm đang bán và còn hàng
// (đang bán: isAvailable = true) AND (còn hàng: quantity > 0)
const sellingAndInStockNames = products
  .filter((p) => p.isAvailable === true && p.quantity > 0)
  .map((p) => p.name);

console.log("\n=== CÂU 10: TÊN SP ĐANG BÁN & CÒN HÀNG ===");
console.log(sellingAndInStockNames);