import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Book> listBook = new ArrayList<>();
        Scanner x = new Scanner(System.in);

        String msg = """
                CHƯƠNG TRÌNH QUẢN LÝ SÁCH
                1. Thêm 1 cuốn sách
                2. Xóa 1 cuốn sách
                3. Thay đổi thông tin sách
                4. Xuất thông tin tất cả sách
                5. Tìm sách có tiêu đề chứa "Lập trình"
                6. Lấy tối đa K sách có giá <= P
                7. Tìm sách theo danh sách tác giả
                0. Thoát
                Chọn chức năng:
                """;

        int chon = 0;

        do {
            System.out.print(msg);
            chon = x.nextInt();

            switch (chon) {

                case 1 -> {
                    Book newBook = new Book();
                    newBook.input();
                    listBook.add(newBook);
                }

                case 2 -> {
                    System.out.print("Nhập mã sách cần xóa: ");
                    int id = x.nextInt();

                    Book find = listBook.stream()
                            .filter(p -> p.getId() == id)
                            .findFirst()
                            .orElseThrow();

                    listBook.remove(find);
                    System.out.println("Đã xóa sách thành công");
                }

                case 3 -> {
                    System.out.print("Nhập mã sách cần sửa: ");
                    int id = x.nextInt();

                    Book find = listBook.stream()
                            .filter(p -> p.getId() == id)
                            .findFirst()
                            .orElseThrow();

                    find.input();
                    System.out.println("Đã sửa sách thành công");
                }

                case 4 -> {
                    System.out.println("\nXuất thông tin danh sách:");
                    listBook.forEach(Book::output);
                }

                case 5 -> {
                    listBook.stream()
                            .filter(b -> b.getTitle()
                                    .toLowerCase()
                                    .contains("lập trình"))
                            .forEach(Book::output);
                }

                case 6 -> {
                    System.out.print("Nhập K: ");
                    int k = x.nextInt();
                    System.out.print("Nhập giá P: ");
                    double p = x.nextDouble();

                    listBook.stream()
                            .filter(b -> b.getPrice() <= p)
                            .limit(k)
                            .forEach(Book::output);
                }

                case 7 -> {
                    x.nextLine();
                    System.out.print("Nhập danh sách tác giả (cách nhau bởi dấu phẩy): ");
                    String input = x.nextLine();

                    Set<String> authors = Arrays.stream(input.split(","))
                            .map(String::trim)
                            .collect(Collectors.toSet());

                    listBook.stream()
                            .filter(b -> authors.contains(b.getAuthor()))
                            .forEach(Book::output);
                }

                case 0 -> System.out.println("Thoát chương trình.");

                default -> System.out.println("Chức năng không hợp lệ.");
            }

        } while (chon != 0);
    }
}
