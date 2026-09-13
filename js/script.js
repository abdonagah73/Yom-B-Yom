document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.querySelector('.theme-btn');
    const body = document.body;

    // التحقق من الاختيار المحفوظ مسبقاً في الـ localStorage لتثبيته في كل الصفحات
    const savedTheme = localStorage.getItem('yom_theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    // تفعيل التبديل عند الضغط على الزر
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('yom_theme', 'dark');
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                localStorage.setItem('yom_theme', 'light');
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }
});
