import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    UserUpdate,
    PasswordChange
)
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token
)
from app.middleware.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/auth", tags=["Tài khoản & Xác thực"])

UPLOAD_AVATARS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "avatars"
)
os.makedirs(UPLOAD_AVATARS_DIR, exist_ok=True)

ALLOWED_AVATAR_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_AVATAR_SIZE = 5 * 1024 * 1024  # Tối đa 5MB

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Đăng ký tài khoản mới")
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được sử dụng. Vui lòng chọn email khác."
        )

    hashed_pwd = get_password_hash(user_in.password)

    new_user = User(
        email=user_in.email,
        password_hash=hashed_pwd,
        full_name=user_in.full_name,
        role="USER",
        status="ACTIVE"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse, summary="Đăng nhập tài khoản")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác"
        )

    if user.status == "BANNED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản này đã bị khóa bởi Quản trị viên"
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "full_name": user.full_name
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse, summary="Lấy thông tin tài khoản hiện tại")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse, summary="Cập nhật hồ sơ cá nhân")
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/upload-avatar", summary="Tải lên tệp ảnh đại diện")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in ALLOWED_AVATAR_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng không hợp lệ. Vui lòng chọn ảnh định dạng JPG, JPEG, PNG, WEBP hoặc GIF."
        )

    content = await file.read()
    if len(content) > MAX_AVATAR_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dung lượng tệp quá lớn. Vui lòng tải ảnh nhỏ hơn 5MB."
        )

    # Đặt tên tệp duy nhất
    unique_filename = f"avatar_{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    target_path = os.path.join(UPLOAD_AVATARS_DIR, unique_filename)

    with open(target_path, "wb") as f:
        f.write(content)

    # Xóa avatar cũ nếu là file cục bộ để tiết kiệm ổ đĩa
    if current_user.avatar_url and current_user.avatar_url.startswith("/uploads/avatars/"):
        old_filename = os.path.basename(current_user.avatar_url)
        old_file_path = os.path.join(UPLOAD_AVATARS_DIR, old_filename)
        if os.path.exists(old_file_path) and old_filename != unique_filename:
            try:
                os.remove(old_file_path)
            except Exception:
                pass

    avatar_path = f"/uploads/avatars/{unique_filename}"
    current_user.avatar_url = avatar_path
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Cập nhật ảnh đại diện thành công!",
        "avatar_url": avatar_path,
        "user": current_user
    }

@router.put("/change-password", summary="Đổi mật khẩu")
def change_password(
    pwd_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(pwd_data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu hiện tại không chính xác"
        )
    
    current_user.password_hash = get_password_hash(pwd_data.new_password)
    db.commit()
    return {"message": "Đổi mật khẩu thành công!"}

@router.get("/admin-check", summary="Kiểm tra đặc quyền Quản trị viên")
def admin_only_check(admin_user: User = Depends(require_admin)):
    return {
        "message": f"Chào mừng Quản trị viên: {admin_user.full_name}",
        "role": admin_user.role,
        "privilege": "ADMIN_ACCESS_GRANTED"
    }
