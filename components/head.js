/**
 * Shared Head Component
 */
const headContent = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
    <!-- Main Styles -->
    <link rel="stylesheet" href="styles.css?v=5">
`;

document.head.insertAdjacentHTML('beforeend', headContent);
