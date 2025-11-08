# Linuxbase
### EN:
This is for those who want to install or update Linux offline
Linuxbase_PKG — Offline Base Package for Arch Linux

This package contains all cached packages from
/var/cache/pacman/pkg
after a complete and fully updated installation of Arch Linux.
The goal of this project is to create a self-contained offline base for reinstalling or restoring Arch Linux quickly, without needing an internet connection.

📦 Contents

Includes all essential system packages (base, base-devel, and dependencies), compressed using gzip.
You can use it to rebuild or restore a minimal Arch Linux environment offline.

⚙️ Usage

Download the archive file.

Extract it into your package cache directory:

sudo tar -xvzf Linuxbase_PKG.tar.gz -C /var/cache/pacman/pkg/

Install all packages from the cache:
sudo pacman -U /var/cache/pacman/pkg/*.pkg.tar.gz

🧩 Notes

Built on a fresh and fully updated Arch Linux system (date: [ 2025/11/03 ]).

Ideal for offline base installations or system recovery.

To create a single compressed .tar.xz archive instead, you can use:

tar -cvJf Linuxbase_PKG.tar.xz /var/cache/pacman/pkg

🧠 Development

Future versions will include optional setup scripts for initial Arch configuration (locale, timezone, users, etc.) and may support automatic offline installation.

> ### Documentation and setup guide prepared with help from an AI assistant[ Chat GPT ].

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### به فارسی:

این برای کسانی است که می‌خواهند لینوکس را به صورت آفلاین نصب یا بروزرسانی کنند.
Linuxbase_PKG — بسته‌ی پایه‌ی آفلاین برای Arch Linux

این پکیج شامل تمام بسته‌های کش‌شده‌ی مسیر
/var/cache/pacman/pkg
بعد از نصب کامل و به‌روز آرچ لینوکس است.
هدف این پروژه ساخت یک پایه‌ی آفلاین و خودکفا برای نصب مجدد آرچ یا بازیابی سریع سیستم بدون نیاز به اینترنت است.

📦 محتوا

تمام بسته‌های اصلی سیستم (base, base-devel و وابستگی‌ها) به‌صورت فشرده (gzip) ذخیره شده‌اند.
می‌توانید از آن برای بازگردانی سریع محیط پایه استفاده کنید.

⚙️ روش استفاده

۱. فایل آرشیو را دانلود کنید.
۲. آن را در مسیر /var/cache/pacman/pkg/ استخراج کنید:

sudo tar -xvzf Linuxbase_PKG.tar.gz -C /var/cache/pacman/pkg/

۳. سپس با دستور زیر تمام بسته‌ها را نصب کنید:

sudo pacman -U /var/cache/pacman/pkg/*.pkg.tar.gz

🧩 نکات

این بسته با نسخه‌ی به‌روز Arch Linux در تاریخ [2025/11/03] ساخته شده.

مناسب برای نصب آفلاین و راه‌اندازی مجدد محیط پایه.

در صورت نیاز به نسخه‌ی xz یا tarball یکپارچه، می‌توانید از دستور زیر استفاده کنید:

tar -cvJf Linuxbase_PKG.tar.xz /var/cache/pacman/pkg

🧠 توسعه

پروژه در حال گسترش است تا شامل اسکریپت‌های خودکار نصب و تنظیمات اولیه‌ی آرچ (مانند تنظیم زبان، timezone و کاربر) شود.

نویسنده راهنما: چت جی پی تی
