import re
import unicodedata

def slugify(text: str) -> str:
    """
    Chuyển đổi văn bản tiếng Việt thành slug URL an toàn, chuẩn SEO.
    Ví dụ: 'Lập trình Web & Di động' -> 'lap-trinh-web-di-dong'
    """
    if not text:
        return ""
    
    # Chuẩn hóa tiếng Việt tổ hợp về dựng sẵn
    text = unicodedata.normalize("NFD", text)
    # Loại bỏ các dấu thanh tiếng Việt
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    
    # Thay thế chữ Đ/đ
    text = text.replace("đ", "d").replace("Đ", "d")
    
    # Chuyển về chữ thường
    text = text.lower()
    
    # Thay thế các ký tự không phải chữ số thành dấu gạch ngang
    text = re.sub(r"[^a-z0-9]+", "-", text)
    
    # Loại bỏ gạch ngang ở đầu và cuối
    text = text.strip("-")
    
    return text

