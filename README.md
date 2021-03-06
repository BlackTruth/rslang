# Rs Lang
RS Lang – приложение для изучения иностранных слов с методикой интервального повторения, отслеживанием индивидуального прогресса и мини-играми.

## Использованные фреймворки, библиотеки, технологии
1) React
2) SASS
3) Webpack
4) Babel
5) Eslint
6) Stylelint
7) Canvas JS
8) Semantic UI
9) Husky
10) Git
11) GitHub Projects
12) AWS Lambda
13) Discord и GitHub WebHooks

Очень удобно было использовать React вместо Vanilla JS, потому что он более структурированный и организованный. Однако иногда возникали проблемы с рекурсивным использованием useState -> useeffect. Необходимо было разбираться и понять, почему оно не всегда работает корректно. Webpack, bablel - упростили разработку. SASS более структурирован чем CSS, поэтому его легче править. CanvasJS мы использовали, чтобы рисовать графики. Semantic UI помог в отрисовке некоторых компонентов, но там не очень хорошо прописаны стили, используется декларация !important, поэтому возникали проблемы со своими стилями. Git - хорошая система контроля версий. GitHub - иногда невозможно было залить код, или в PR находились "лишние" коммиты, хотя в локальном репозитории все было по другому, иногда сбивался деплой на Netlify. Были для удобства настроены веб хуки из Netlify в Discord и из GitHub в Dicrord. Из Netlify в Discrod напрямую отправлять хуки не получилось, поэтому настроили через AWS Lambda, что упростило отслеживание PR и деплоев. Так же был настроен автодеплой для ветки, поэтому появилась возможность просматривать решения, до мержа в главную ветку. 
