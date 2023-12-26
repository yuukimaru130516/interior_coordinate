tinymce.init({
    selector: '#myTextArea',
    plugins: 'textcolor image link lists table',
    toolbar: 'forecolor backcolor image link | numlist bullist | table',
    content_css: 'custom-styles.css', // カスタムスタイルシートの適用
    style_formats: [
      { title: '特別なスタイル', block: 'div', classes: 'special-style' },
      // 他にもカスタムスタイルの定義が可能
    ],
  });
  